import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '../wallet/schemas/wallet.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, AuthService, UserService, HashService],
})
export class TransactionModule {}
