import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const { threadId } = req.params;
      const { id: owner } = req.user;
      const useCasePayload = {
        ...req.body,
        threadId,
      };

      const addedComment = await addCommentUseCase.execute(useCasePayload, owner);

      res.status(201).json({
        status: 'success',
        data: {
          addedComment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
      const { threadId, commentId } = req.params;
      const { id: userId } = req.user;
      const useCasePayload = {
        commentId,
        threadId,
      };

      await deleteCommentUseCase.execute(useCasePayload, userId);
      res.status(200).json({
        status: 'success',
        message: 'Berhasil menghapus komentar'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;