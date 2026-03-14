class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = comments.map((comment) => comment.id);

    const replies = commentIds.length ? await this._replyRepository.getRepliesByCommentIds(commentIds) : [];
    const repliesByCommentId = replies.reduce((acc, reply) => {
      acc[reply.commentId] = acc[reply.commentId] || [];
      acc[reply.commentId].push({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      });
      return acc;
    }, {});

    const mappedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: repliesByCommentId[comment.id] || [],
    }));

    return {
      ...thread,
      comments: mappedComments
    };
  }
}

export default GetThreadUseCase;