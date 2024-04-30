import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ListBoardResponse } from '../response/listBoard.response';

export const ListBoardDocs = applyDecorators(
  ApiOperation({
    summary: "List user's board",
  }),
  ApiOkResponse({
    type: ListBoardResponse,
  }),
);
