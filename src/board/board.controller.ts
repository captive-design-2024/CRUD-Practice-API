import { Controller, Get, Query } from '@nestjs/common';
import { ListBoardQuery } from './dto';
import { BoardService } from './board.service';
import { GetUser } from '@app/common';
import { BoardControllerDocs, ListBoardDocs } from './docs';

@Controller('board')
@BoardControllerDocs
export class BoardController {
  constructor(private readonly service: BoardService) {}
  @Get()
  @ListBoardDocs
  listBoard(@Query() query: ListBoardQuery, @GetUser('id') userId: string) {
    return this.service.listBoard(userId, query);
  }
}
