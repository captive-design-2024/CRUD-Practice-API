import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateBoardResponse } from '../response/createBoard.response';

export const CreateBoardDocs = applyDecorators(
  ApiOperation({
    summary: 'Create new board',
  }),
  ApiOkResponse({
    type: CreateBoardResponse,
  }),
);
