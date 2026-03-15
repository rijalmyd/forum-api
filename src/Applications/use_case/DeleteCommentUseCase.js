class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, userId) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);

    return this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;