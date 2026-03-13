import AddedThread from '../AddedThread.js';

describe('an AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread',
      owner: 123
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload id not contain thread word', () => {
    const payload = {
      id: '123',
      title: 'thread',
      owner: 'user-123'
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.ID_NOT_CONTAIN_THREAD_WORD');
  });

  it('should create AddedThread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread',
      owner: 'user-123'
    };

    const { id, title, owner } = new AddedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});