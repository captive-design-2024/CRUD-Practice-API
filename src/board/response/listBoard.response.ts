import { PaginateMetadata } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class ListBoardItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  constructor(data: ListBoardItem) {
    Object.assign(this, data);
  }
}

export class ListBoardResponse {
  @ApiProperty({
    type: PaginateMetadata,
  })
  metadata: PaginateMetadata;

  @ApiProperty({
    type: ListBoardItem,
    isArray: true,
  })
  boards: ListBoardItem[];

  constructor(data: ListBoardResponse) {
    Object.assign(this, data);
  }
}
