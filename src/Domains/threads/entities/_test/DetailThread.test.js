import DetailThread from '../DetailThread.js';

describe('a DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload1 = {
      id: 3,
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2026-03-13T20:33:44.555Z',
      username: 'dicoding',
    };
    const payload2 = {
      id: 'thread-123',
      title: 1,
      body: 'sebuah body',
      date: '2026-03-13T20:33:44.555Z',
      username: 'dicoding',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: {},
      date: '2026-03-13T20:33:44.555Z',
      username: 'dicoding',
    };
    const payload4 = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: {},
      username: 'dicoding',
    };
    const payload5 = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2026-03-13T20:33:44.555Z',
      username: 1,
    };

    expect(() => new DetailThread(payload1)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload2)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload3)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload4)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailThread(payload5)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2026-03-13T20:33:44.555Z',
      username: 'dicoding',
    };

    const { id, title, body, date, username } = new DetailThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});