import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const { threadId, commentId } = req.params;
      const { id: owner } = req.user;
      const { content } = req.body;

      const addedReply = await addReplyUseCase.execute({ content, threadId, commentId, owner });

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
}

export default RepliesHandler;