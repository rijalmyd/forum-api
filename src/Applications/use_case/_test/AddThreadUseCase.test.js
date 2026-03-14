import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddThreadUseCase from '../AddThreadUseCase.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const owner = 'user-123';
    const mockedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockedAddedThread));
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    });

    const actualResult = await addThreadUseCase.execute(useCasePayload, owner);

    expect(mockThreadRepository.addThread).toBeCalledTimes(1);
    expect(actualResult).toEqual(new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123'
    }));
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread({
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123'
    }));
  });
});