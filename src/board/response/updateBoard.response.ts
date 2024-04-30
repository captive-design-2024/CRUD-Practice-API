import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(data: UpdateBoardResponse) {
    Object.assign(this, data);
  }
}
