import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, owner) {
    const { threadId, commentId } = useCasePayload;
    const newReply = new NewReply({ ...useCasePayload, owner });

    await this._commentRepository.verifyCommentExistsOnThread(commentId, threadId);

    return this._replyRepository.addReply(newReply);
  }
}

export default AddReplyUseCase;