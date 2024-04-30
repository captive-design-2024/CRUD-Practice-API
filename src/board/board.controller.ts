import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListBoardQuery } from './dto';
import { BoardService } from './board.service';
import { GetUser } from '@app/common';
import { BoardControllerDocs, ListBoardDocs, ReadBoardDocs } from './docs';

@Controller('board')
@BoardControllerDocs
export class BoardController {
  constructor(private readonly service: BoardService) {}
  @Get()
  @ListBoardDocs
  listBoard(@Query() query: ListBoardQuery, @GetUser('id') userId: string) {
    return this.service.listBoard(userId, query);
  }

  @Get(':boardId')
  @ReadBoardDocs
  readBoard(@GetUser('id') userId: string, @Param('boardId') boardId: string) {
    return this.service.readBoard(userId, boardId);
  }
}
