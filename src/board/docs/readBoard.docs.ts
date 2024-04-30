import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ListBoardItem } from '../response/listBoard.response';

export const ReadBoardDocs = applyDecorators(
  ApiOperation({
    summary: 'Read specific single board item',
  }),
  ApiOkResponse({
    type: ListBoardItem,
  }),
  ApiNotFoundResponse({
    description: '사용자가 요청한 ID를 조회할 수 없는 경우 반환',
  }),
);
