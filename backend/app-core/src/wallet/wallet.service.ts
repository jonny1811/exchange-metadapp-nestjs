import {
  WalletContract,
  WalletContractDocument,
} from './schemas/wallet-contract.schema';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { User, UserDocument } from './../user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { QueryDto } from './dto/query.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(WalletContract.name)
    private walletContractModel: Model<WalletContractDocument>,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    let data = await this.userModel
      .aggregate([
        { $match: { email: createWalletDto.email } },
        { $unwind: '$wallets' },
        { $project: { _id: 0 } },
        {
          $lookup: {
            from: 'wallets',
            localField: 'wallets',
            foreignField: '_id',
            as: 'walletsData',
            pipeline: [
              {
                $match: {
                  coin: createWalletDto.coin,
                  chainId: createWalletDto.chainId,
                },
              },
            ],
          },
        },
      ])
      .exec();

    let exists = true;
    if (!data || data.length === 0) exists = false;

    let wallet = exists
      ? data.find((w) => w.walletsData.length > 0)
      : undefined;

    if (wallet) {
      wallet = wallet.walletsData[0];
      return {
        address: wallet.address,
        chainId: wallet.chainId,
        coin: wallet.coin,
        walletId: wallet._id,
      };
    } else {
      const data = await this.walletContractModel.findOneAndUpdate(
        { chainId: createWalletDto.chainId, reserved: false },
        { reserved: true },
      );

      if (data) {
        const wallet = new this.walletModel({
          address: data.address,
          chainId: createWalletDto.chainId,
          coin: createWalletDto.coin,
        });

        const saved = await wallet.save();
        if (saved) {
          const result = await this.userModel.updateOne(
            {
              email: createWalletDto.email,
            },
            {
              $push: { wallets: wallet },
            },
          );

          if (result) {
            return {
              address: wallet.address,
              chainId: wallet.chainId,
              coin: wallet.coin,
              walletId: wallet._id,
            };
          }
        }
      }
    }
  }

  async getWallet(email: string, queryDto: QueryDto) {
    const data = await this.userModel
      .aggregate([
        { $match: { email } },
        { $unwind: '$wallets' },
        { $project: { _id: 0 } },
        {
          $lookup: {
            from: 'wallets',
            localField: 'wallets',
            foreignField: '_id',
            as: 'walletsData',
            pipeline: [
              {
                $match: { coin: queryDto.coin },
              },
            ],
          },
        },
      ])
      .exec();

    if (data && data.length > 0) {
      let wallet = data.find((w) => w.walletsData.length > 0);
      if (wallet) {
        wallet = wallet.walletsData[0];
        const data = await this.walletModel
          .findOne(
            { _id: new Types.ObjectId(wallet._id) },
            { _id: 0, transactions: 0, __v: 0 },
          )
          .exec();

        if (data) {
          return data;
        }
      }
    }
  }

  async getWallets(email: string) {
	const data = await this.userModel
      .aggregate([
        { $match: { email } },
        { $unwind: '$wallets' },
        { $project: { _id: 0, wallets: 1 } },
        {
          $lookup: {
            from: 'wallets',
            localField: 'wallets',
            foreignField: '_id',
            as: 'walletsData',
            pipeline: [
              {
                $project: { transactions: 0 },
              },
            ],
          },
        },
      ])
      .exec();

	  if (data && data.length > 0) {
		return data.map(wallet => {
			return {
				balance: wallet.walletsData[0].balance,
				address: wallet.walletsData[0].address,
				coin: wallet.walletsData[0].coin,
				chainId: wallet.walletsData[0].chainId,
				walletId: wallet.walletsData[0]._id
			}
		});
	  }
  }
}
