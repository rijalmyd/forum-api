import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const userId = 'user-123';
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.verifyReplyOwner = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyExistsOnComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsOnThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload, userId);

    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.verifyReplyExistsOnComment)
      .toHaveBeenCalledWith('reply-123', 'comment-123');
    expect(mockCommentRepository.verifyCommentExistsOnThread)
      .toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith('reply-123');
  });
});