class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, commentId, isDelete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.commentId = commentId;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
  }

  _verifyPayload(payload) {
    const { id, username, date, content, commentId, isDelete } = payload;

    if (id === undefined || username === undefined || date === undefined
      || content === undefined || commentId === undefined || isDelete === undefined
    ) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string'
      || typeof content !== 'string' || typeof commentId !== 'string' || typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailReply;