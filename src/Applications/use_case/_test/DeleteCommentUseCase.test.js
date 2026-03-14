import { expect, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyCommentOwner = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentId = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute('user-123', useCaseParams);

    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.verifyCommentId)
      .toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith('comment-123');
  });
});