import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export const BoardControllerDocs = applyDecorators(
  ApiTags('Board API'),
  ApiBearerAuth(),
);
