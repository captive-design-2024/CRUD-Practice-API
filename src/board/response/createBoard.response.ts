import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;

  constructor(data: CreateBoardResponse) {
    Object.assign(this, data);
  }
}
