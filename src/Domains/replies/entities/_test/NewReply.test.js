import NewReply from '../NewReply.js';

describe('a NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'ini reply',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: 1,
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123'
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123'
    };

    const { content, commentId, owner } = new NewReply(payload);

    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});