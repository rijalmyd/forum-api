class ReplyRepository {
  async addReply(newReply) { // eslint-disable-line no-unused-vars
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyId(replyId, commentId) { // eslint-disable-line no-unused-vars
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(replyId, userId) { // eslint-disable-line no-unused-vars
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(replyId) { // eslint-disable-line no-unused-vars
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentIds(commentIds) { // eslint-disable-line no-unused-vars
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ReplyRepository;