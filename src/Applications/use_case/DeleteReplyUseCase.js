class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, userId) {
    const { threadId, commentId, replyId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);
    await this._replyRepository.verifyReplyExistsOnComment(replyId, commentId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);

    return this._replyRepository.deleteReplyById(replyId);
  }
}

export default DeleteReplyUseCase;