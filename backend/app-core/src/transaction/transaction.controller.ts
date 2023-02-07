import {
  Controller,
  Get,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { QueryDto } from './dto/query.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  transactions(@Request() req, @Query() queryDto: QueryDto) {
    return this.transactionService.getTransactions(
		req.user.email,
		queryDto
	);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('info')
  transaction(@Query() queryDto: QueryDto) {
    return this.transactionService.getTransaction(queryDto);
  }
}
