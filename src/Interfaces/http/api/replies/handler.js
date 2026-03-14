import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;
      const useCasePayload = {
        ...req.body,
        threadId,
        commentId,
      };

      const addedReply = await addReplyUseCase.execute(useCasePayload, owner);

      res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
      const { threadId, commentId, replyId } = req.params;
      const { id: userId } = req.user;
      const useCasePayload = {
        commentId,
        threadId,
        replyId,
      };

      await deleteReplyUseCase.execute(useCasePayload, userId);
      res.status(200).json({
        status: 'success',
        message: 'Berhasil menghapus balasan'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RepliesHandler;