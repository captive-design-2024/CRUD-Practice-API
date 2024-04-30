import { PaginateMetadata } from '@app/common';
import { PrismaService } from '@app/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateBoardDto, ListBoardQuery, UpdateBoardDto } from './dto';
import {
  ListBoardItem,
  ListBoardResponse,
} from './response/listBoard.response';
import { CreateBoardResponse } from './response/createBoard.response';
import { DeleteBoardResponse, UpdateBoardResponse } from './response';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
        orderBy: {
          createdAt: query.order,
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

  async createBoard(userId: string, dto: CreateBoardDto) {
    const createdBoard = await this.prisma.board.create({
      data: {
        ...dto,
        userId: userId,
      },
    });
    return new CreateBoardResponse({
      id: createdBoard.id,
      title: createdBoard.title,
      content: createdBoard.content,
      created_at: createdBoard.createdAt,
    });
  }

  async updateBoard(userId: string, dto: UpdateBoardDto, boardId: string) {
    try {
      const updatedBoard = await this.prisma.board.update({
        where: {
          id: boardId,
          userId: userId,
        },
        data: {
          ...dto,
        },
      });
      return new UpdateBoardResponse({
        id: updatedBoard.id,
        title: updatedBoard.title,
        content: updatedBoard.content,
        created_at: updatedBoard.createdAt,
        updated_at: updatedBoard.updatedAt,
      });
    } catch (err) {
      // Forbidden update request exception
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Board not found');
      }
      throw err;
    }
  }

  async deleteBoard(userId: string, boardId: string) {
    try {
      const deletedBoard = await this.prisma.board.delete({
        where: {
          id: boardId,
          userId: userId,
        },
        select: {
          title: true,
        },
      });
      return new DeleteBoardResponse({
        title: deletedBoard.title,
      });
    } catch (err) {
      // Forbidden update request exception
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Board not found');
      }
      throw err;
    }
  }
}
