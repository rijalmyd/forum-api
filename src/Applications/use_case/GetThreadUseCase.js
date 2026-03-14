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

    const replies = await this._getReplies(comments);
    const repliesByCommentId = this._groupRepliesByCommentId(replies);

    const mappedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: repliesByCommentId[comment.id] || [],
    }));

    return {
      ...thread,
      comments: mappedComments,
    };
  }

  async _getReplies(comments) {
    const commentIds = comments.map((comment) => comment.id);
    if (!commentIds.length) return [];
    return this._replyRepository.getRepliesByCommentIds(commentIds);
  }

  _groupRepliesByCommentId(replies) {
    return replies.reduce((acc, reply) => {
      if (!acc[reply.commentId]) acc[reply.commentId] = [];

      acc[reply.commentId].push({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      });

      return acc;
    }, {});
  }
}

export default GetThreadUseCase;