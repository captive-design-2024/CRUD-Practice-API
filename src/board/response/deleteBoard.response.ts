export class DeleteBoardResponse {
  title: string;

  constructor(data: DeleteBoardResponse) {
    Object.assign(this, data);
  }
}
