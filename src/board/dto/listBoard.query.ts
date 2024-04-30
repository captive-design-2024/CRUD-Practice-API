import { PaginationQuery } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListBoardQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
    description: 'Search by content',
  })
  @IsString()
  @IsOptional()
  readonly search: string;
}
