import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBoardDto, ListBoardQuery, UpdateBoardDto } from './dto';
import { BoardService } from './board.service';
import { GetUser } from '@app/common';
import {
  BoardControllerDocs,
  CreateBoardDocs,
  ListBoardDocs,
  ReadBoardDocs,
  UpdateBoardDocs,
} from './docs';

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

  @HttpCode(HttpStatus.OK)
  @Post()
  @CreateBoardDocs
  createBoard(@GetUser('id') userId: string, @Body() dto: CreateBoardDto) {
    return this.service.createBoard(userId, dto);
  }

  @Patch(':boardId')
  @UpdateBoardDocs
  updateBoard(
    @GetUser('id') userId: string,
    @Body() dto: UpdateBoardDto,
    @Param('boardId') boardId: string,
  ) {
    return this.service.updateBoard(userId, dto, boardId);
  }
}
