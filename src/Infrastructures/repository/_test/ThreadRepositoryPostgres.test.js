import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('ThreadRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({});

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      const addedThread = await threadRepository.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists(''))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'threads-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('threads-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});