import NewThread from '../NewThread.js';

describe('a NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'abc',
      body: '123',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 234,
      owner: 345
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body',
      owner: 'user'
    };

    const { title, body, owner } = new NewThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});