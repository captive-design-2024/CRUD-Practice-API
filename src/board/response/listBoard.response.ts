import { ApiProperty } from '@nestjs/swagger';

export class ListBoardResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  constructor(data: ListBoardResponse) {
    Object.assign(this, data);
  }
}
