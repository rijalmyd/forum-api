class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, isDelete, replies = [] } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    const { id, username, date, content, isDelete, replies = [] } = payload;

    if (id === undefined || username === undefined || date === undefined
      || content === undefined || isDelete === undefined
    ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string'
      || typeof content !== 'string' || typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replies !== undefined && !Array.isArray(replies)) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailComment;