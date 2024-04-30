import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const UpdateBoardDocs = applyDecorators(
  ApiOperation({
    summary: 'Update board title or content',
  }),
);
