class LikeCommentUseCase {
  constructor({
    likeRepository,
    commentRepository,
    threadRepository,
  }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);

    const isLiked = await this._likeRepository.isLikedComment(commentId, userId);
    if (isLiked) {
      await this._likeRepository.deleteLikedComment(commentId, userId);
    } else {
      await this._likeRepository.addLikeComment(commentId, userId);
    }
  }
}

export default LikeCommentUseCase;