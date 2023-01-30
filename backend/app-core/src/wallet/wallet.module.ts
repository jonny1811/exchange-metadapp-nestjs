import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { WalletController } from './wallet.controller';

import { WalletService } from './wallet.service';
import { UserService } from '../user/user.service';
import { HashService } from './../user/hash.service';
import { AuthService } from '../auth/auth.service';

import { User, UserSchema } from './../user/schemas/user.schema';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import {
  WalletContract,
  WalletContractSchema,
} from './schemas/wallet-contract.schema';
import { BullModule } from '@nestjs/bullmq';
import { default as QueueType } from './queue/types.queue';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
      { name: WalletContract.name, schema: WalletContractSchema },
    ]),
	BullModule.registerQueue({
		name: QueueType.WITHDRAW_REQUEST
	})
  ],
  controllers: [WalletController],
  providers: [WalletService, UserService, HashService, AuthService],
})
export class WalletModule {}
