import { expect, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import DetailComment from '../../../Domains/comments/entities/DetailComment.js';
import GetThreadUseCase from '../GetThreadUseCase.js';

describe('GetThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2026-03-14T16:10:20.555Z',
        username: 'dicoding',
      }));
    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-1',
          username: 'dicoding',
          date: '2026-03-14T16:39:20.555Z',
          content: 'komentar 1',
          isDelete: true,
        }),
        new DetailComment({
          id: 'comment-2',
          username: 'alex',
          date: '2026-03-14T16:40:20.555Z',
          content: 'komentar 2',
          isDelete: false,
        }),
      ]));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);

    expect(thread.date).toEqual(thread.date);
    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[0].content).toEqual('**komentar telah dihapus**');
    expect(thread.comments[1].content).toEqual('komentar 2');
  });

  // it('should show deleted reply placeholder content', async () => {
  //   const mockThreadRepository = new ThreadRepository();
  //   mockThreadRepository.verifyThreadExists = vi.fn()
  //     .mockImplementation(() => Promise.resolve());
  //   mockThreadRepository.getThreadById = vi.fn()
  //     .mockImplementation(() => Promise.resolve({
  //       id: 'thread-123',
  //       title: 'sebuah thread',
  //       body: 'body',
  //       date: '2021-08-08T07:19:09.775Z',
  //       username: 'dicoding',
  //     }));

  //   const mockCommentRepository = new CommentRepository();
  //   mockCommentRepository.getCommentsByThreadId = vi.fn()
  //     .mockImplementation(() => Promise.resolve(new DetailComment({
  //       id: 'comment-1',
  //       username: 'johndoe',
  //       date: '2021-08-08T07:22:33.555Z',
  //       content: 'komentar 1',
  //       isDelete: false,
  //     })));

  //   const getThreadUseCase = new GetThreadUseCase({
  //     commentRepository: mockCommentRepository,
  //     threadRepository: mockThreadRepository,
  //   });

  //   const thread = await getThreadUseCase.execute('thread-123');

  //   expect(thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  // });
});