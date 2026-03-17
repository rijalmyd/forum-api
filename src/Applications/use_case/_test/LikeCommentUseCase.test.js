import { describe, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import LikeCommentUseCase from '../LikeCommentUseCase.js';

describe('LikeCommentUseCase', () => {
  it('should orchestrating like comment action properly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    };
    const userId = 'user-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsOnThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLikedComment = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.unlikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(useCasePayload, userId);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsOnThread).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepository.isLikedComment).toHaveBeenCalledWith(useCasePayload.commentId, userId);
    expect(mockLikeRepository.likeComment).toHaveBeenCalledExactlyOnceWith(useCasePayload.commentId, userId);
    expect(mockLikeRepository.unlikeComment).not.toHaveBeenCalled();
  });

  it('should orchestrating unlike comment action properly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    };
    const userId = 'user-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsOnThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isLikedComment = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.unlikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.likeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(useCasePayload, userId);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsOnThread).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepository.isLikedComment).toHaveBeenCalledWith(useCasePayload.commentId, userId);
    expect(mockLikeRepository.unlikeComment).toHaveBeenCalledExactlyOnceWith(useCasePayload.commentId, userId);
    expect(mockLikeRepository.likeComment).not.toHaveBeenCalled();
  });
});