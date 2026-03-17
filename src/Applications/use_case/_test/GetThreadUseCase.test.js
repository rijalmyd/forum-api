import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import DetailComment from '../../../Domains/comments/entities/DetailComment.js';
import GetThreadUseCase from '../GetThreadUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DetailReply from '../../../Domains/replies/entities/DetailReply.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';

describe('GetThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2026-03-14T16:10:20.555Z',
        username: 'dicoding',
      }));
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
    mockReplyRepository.getRepliesByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailReply({
          id: 'reply-1',
          commentId: 'comment-2',
          content: 'balasan 1',
          date: '2026-03-14T07:59:48.555Z',
          username: 'alex',
          isDelete: true,
        }),
      ]));
    mockLikeRepository.getLikeCountsByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve({}));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute(useCasePayload);

    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-1', 'comment-2']);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockLikeRepository.getLikeCountsByCommentIds).toHaveBeenCalledWith(['comment-1', 'comment-2']);

    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[0].content).toEqual('**komentar telah dihapus**');
    expect(thread.comments[1].content).toEqual('komentar 2');
  });

  it('should show original reply content when not deleted', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-1',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar 1',
          isDelete: false,
        })
      ]));
    mockReplyRepository.getRepliesByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailReply({
          id: 'reply-1',
          commentId: 'comment-1',
          username: 'dicoding',
          date: '2026-03-14T07:20:42.555Z',
          content: 'balasan',
          isDelete: false,
        }),
      ]));
    mockLikeRepository.getLikeCountsByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve({}));

    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute('thread-123');

    expect(thread.comments[0].replies[0].content).toEqual('balasan');
  });

  it('should show deleted reply placeholder content', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-1',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar 1',
          isDelete: false,
        })
      ]));
    mockReplyRepository.getRepliesByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailReply({
          id: 'reply-1',
          commentId: 'comment-1',
          username: 'dicoding',
          date: '2026-03-14T07:20:42.555Z',
          content: 'balasan',
          isDelete: true,
        }),
      ]));
    mockLikeRepository.getLikeCountsByCommentIds = vi.fn()
      .mockImplementation(() => Promise.resolve({}));

    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute('thread-123');

    expect(thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should handle thread with no comments correctly', async () => {
    const useCasePayload = { threadId: 'thread-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'Thread Kosong',
      body: 'Body',
      date: '2026-03-14T16:10:20.555Z',
      username: 'dicoding',
    });
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([]);
    mockReplyRepository.getRepliesByCommentIds = vi.fn();
    mockLikeRepository.getLikeCountsByCommentIds = vi.fn();

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute(useCasePayload);

    expect(thread.comments).toHaveLength(0);
    expect(mockReplyRepository.getRepliesByCommentIds).not.toHaveBeenCalled();
  });
});