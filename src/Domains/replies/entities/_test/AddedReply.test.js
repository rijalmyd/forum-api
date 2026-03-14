import { describe } from 'vitest';
import AddedReply from '../AddedReply.js';

describe('an AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-123'
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload1 = {
      id: 123,
      content: 'reply',
      owner: 'user-123'
    };
    const payload2 = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123'
    };
    const payload3 = {
      id: 'reply-123',
      content: 'reply',
      owner: {}
    };

    expect(() => new AddedReply(payload1)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply(payload2)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply(payload3)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload id not contain reply word', () => {
    const payload = {
      id: '123',
      content: 'Balasan',
      owner: 'user-123'
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.ID_NOT_CONTAIN_REPLY_WORD');
  });

  it('should create AddedReply entities correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'Reply',
      owner: 'user-123'
    };

    const { id, content, owner } = new AddedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});