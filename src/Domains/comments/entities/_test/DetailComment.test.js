import DetailComment from '../DetailComment.js';

describe('a DetailComment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const wrongPayloads = [
      {
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: false,
      },
      {
        id: 'comment-123',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: false,
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        content: 'sebuah comment',
        isDelete: false,
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        isDelete: false,
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
      },
    ];

    wrongPayloads.forEach((payload) => {
      expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });

  it('should throw error when payload not meet data type specification', () => {
    const wrongPayloads = [
      {
        id: 123,
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: false,
        replies: [],
      },
      {
        id: 'comment-123',
        username: false,
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: false,
        replies: [],
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: false,
        content: 'sebuah comment',
        isDelete: false,
        replies: [],
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 1,
        isDelete: false,
        replies: [],
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: {},
        replies: [],
      },
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2026-03-13T20:33:44.555Z',
        content: 'sebuah comment',
        isDelete: true,
        replies: {},
      },
    ];

    wrongPayloads.forEach((payload) => {
      expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create DetailComment object correctly when not deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-03-13T20:33:44.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    };

    const { id, username, date, content, replies } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(replies).toEqual(payload.replies);
  });

  it('should create DetailComment object correctly when deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2026-03-13T20:33:44.555Z',
      content: 'sebuah comment',
      isDelete: true,
      replies: [],
    };

    const { id, username, date, content, replies } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(replies).toEqual(payload.replies);
  });
});