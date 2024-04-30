import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateBoardResponse } from '../response';

export const UpdateBoardDocs = applyDecorators(
  ApiOperation({
    summary: 'Update board title or content',
  }),
  ApiOkResponse({
    type: UpdateBoardResponse,
  }),
  ApiNotFoundResponse({
    description: 'Invalid board update request',
  }),
);
