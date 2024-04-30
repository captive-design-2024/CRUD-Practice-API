import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ListBoardQuery } from './dto';
import { ListBoardResponse } from './response/listBoard.response';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async listBoard(userId: string, query: ListBoardQuery) {
    const responses = await this.prisma.board
      .findMany({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        where: {
          userId: userId,
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
      })
      .then((boards) =>
        boards.map(
          (board) =>
            new ListBoardResponse({
              id: board.id,
              title: board.title,
              content: board.content,
            }),
        ),
      );
    return responses;
  }
}
