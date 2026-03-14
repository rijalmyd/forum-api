import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah komentar',
    };
    const owner = 'user-123';
    const threadId = 'thread-123';
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    });
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const actualResult = await addCommentUseCase.execute(useCasePayload, threadId, owner);

    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledTimes(1);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new NewComment({
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-123'
    }));
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(actualResult).toEqual(new AddedComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123'
    }));
  });
});