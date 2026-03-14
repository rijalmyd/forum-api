import DetailReply from '../DetailReply.js';

describe('a DetailReply entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const wrongPayloads = [
      {
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah balasan',
        isDelete: false,
        commentId: 'comment-123',
      },
      {
        id: 'reply-123',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah balasan',
        isDelete: false,
        commentId: 'comment-123',
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        content: 'sebuah balasan',
        isDelete: false,
        commentId: 'comment-123',
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        isDelete: false,
        commentId: 'comment-123',
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah balasan',
        commentId: 'comment-123',
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah balasan',
        isDelete: false,
      },
    ];

    wrongPayloads.forEach((payload) => {
      expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });

  it('should throw error when payload not meet data type specification', () => {
    const wrongPayloads = [
      {
        id: 123,
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah reply',
        commentId: 'comment-123',
        isDelete: false,
      },
      {
        id: 'reply-123',
        username: false,
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah reply',
        commentId: 'comment-123',
        isDelete: false,
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: false,
        content: 'sebuah reply',
        commentId: 'comment-123',
        isDelete: false,
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        commentId: 'comment-123',
        content: 1,
        isDelete: false,
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah reply',
        commentId: 'comment-123',
        isDelete: {},
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah reply',
        isDelete: true,
        commentId: 123,
      },
    ];

    wrongPayloads.forEach((payload) => {
      expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create DetailReply object correctly when not deleted', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2026-03-13T20:33:44.555Z',
      content: 'sebuah reply',
      commentId: 'comment-123',
      isDelete: false,
    };

    const { id, username, date, content, commentId } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
  });

  it('should create DetailReply object correctly when deleted', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2026-03-13T20:33:44.555Z',
      content: 'sebuah reply',
      commentId: 'comment-123',
      isDelete: true,
    };

    const { id, username, date, content, commentId } = new DetailReply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(commentId).toEqual(payload.commentId);
  });
});