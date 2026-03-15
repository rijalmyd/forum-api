import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };
    const owner = 'user-123';
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123'
    });
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123'
    });
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyCommentExistsOnThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, owner);

    expect(mockCommentRepository.verifyCommentExistsOnThread).toBeCalledTimes(1);
    expect(mockCommentRepository.verifyCommentExistsOnThread).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.addReply).toBeCalledTimes(1);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new NewReply({
      content: 'sebuah balasan',
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123'
    }));
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});