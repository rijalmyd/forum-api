import AddedComment from '../AddedComment.js';

describe('an AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123'
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 'komentar',
      owner: 123
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload id not contain comment word', () => {
    const payload = {
      id: '123',
      content: 'Komentar',
      owner: 'user-123'
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.ID_NOT_CONTAIN_COMMENT_WORD');
  });

  it('should create AddedComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'Komentar',
      owner: 'user-123'
    };

    const { id, content, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});