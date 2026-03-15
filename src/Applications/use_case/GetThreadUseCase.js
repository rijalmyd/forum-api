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
        isDelete: reply.isDelete,
      });
      return acc;
    }, {});

    const mappedComments = comments.map((comment) => ({
      ...comment,
      content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
      replies: (repliesByCommentId[comment.id] || []).map((reply) => ({
        ...reply,
        content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
      })),
    }));

    return {
      ...thread,
      comments: mappedComments
    };
  }
}

export default GetThreadUseCase;