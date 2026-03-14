class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, commentId, owner, threadId } = payload;

    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
    this.threadId = threadId;
  }

  _verifyPayload(payload) {
    const { content, commentId, owner, threadId } = payload;

    if (!content || !commentId || !owner || !threadId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof commentId !== 'string'
      || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewReply;