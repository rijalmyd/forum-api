import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const addedComment = await commentRepository.addComment(newComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist deletedComment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'commentator',
        fullname: 'Commentator'
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-234',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById('comment-123');

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('verifyCommentId function', async () => {
    it('should throw NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentId('comment-123', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is deleted', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commentator'
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-000',
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentId('comment-123', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commentator'
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-000'
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentId('comment-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should response NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not owner', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-000'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is owner', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commentator'
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-000'
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-000'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});