import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.verifyCommentId(newReply.commentId, newReply.threadId);

    return this._replyRepository.addReply(newReply);
  }
}

export default AddReplyUseCase;