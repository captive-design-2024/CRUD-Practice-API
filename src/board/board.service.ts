import { PrismaService } from '@app/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListBoardQuery } from './dto';
import {
  ListBoardItem,
  ListBoardResponse,
} from './response/listBoard.response';
import { Prisma } from '@prisma/client';
import { PaginateMetadata } from '@app/common';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async listBoard(userId: string, query: ListBoardQuery) {
    const queryCondition: Prisma.BoardWhereInput = {
      userId: userId,
      title: {
        contains: query.search,
        mode: 'insensitive',
      },
    };
    const totalCount = await this.prisma.board.count({
      where: queryCondition,
    });
    const boards = await this.prisma.board
      .findMany({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        where: queryCondition,
        select: {
          id: true,
          title: true,
          content: true,
        },
      })
      .then((boards) =>
        boards.map(
          (board) =>
            new ListBoardItem({
              id: board.id,
              title: board.title,
              content: board.content,
            }),
        ),
      );
    return new ListBoardResponse({
      metadata: new PaginateMetadata(query.page, query.limit, totalCount),
      boards: boards,
    });
  }

  async readBoard(userId: string, boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return new ListBoardItem({
      id: board.id,
      title: board.title,
      content: board.content,
    });
  }
}
