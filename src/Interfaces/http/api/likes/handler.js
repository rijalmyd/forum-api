import LikeCommentUseCase from '../../../../Applications/use_case/LikeCommentUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(req, res, next) {
    try {
      const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
      const { threadId, commentId } = req.params;
      const { id: userId } = req.user;
      const useCasePayload = {
        threadId,
        commentId,
      };

      await likeCommentUseCase.execute(useCasePayload, userId);

      res.status(200).json({
        status: 'success'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;