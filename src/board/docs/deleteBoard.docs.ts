import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { DeleteBoardResponse } from '../response';

export const DeleteBoardDocs = applyDecorators(
  ApiOperation({
    summary: 'Delete board',
  }),
  ApiOkResponse({
    type: DeleteBoardResponse,
  }),
  ApiNotFoundResponse({
    description: 'Invalid board delete request',
  }),
);
