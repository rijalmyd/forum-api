import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';

describe('LikeRepositoryPostgres', () => {
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

    await UsersTableTestHelper.addUser({
      id: 'user-000',
      username: 'commentator',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-000',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addLikeComment function', () => {
    it('should persist like on comment', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLikeComment(commentId, userId);

      const commentLikes = await CommentLikesTableTestHelper.findLikesByCommentAndUser(commentId, userId);
      expect(commentLikes).toHaveLength(1);
    });

    it('should throw error if already liked', async () => {
      await CommentLikesTableTestHelper.addLikeComment({
        commentId: 'comment-123',
        userId: 'user-123'
      });
      const commentId = 'comment-123';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await expect(likeRepositoryPostgres.addLikeComment(commentId, userId))
        .rejects.toThrowError();
    });
  });

  describe('unlikeComment function', () => {
    it('should delete like from comment', async () => {
      await CommentLikesTableTestHelper.addLikeComment({
        commentId: 'comment-123',
        userId: 'user-123'
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.deleteLikedComment('comment-123', 'user-123');

      const commentLikes = await CommentLikesTableTestHelper.findLikesByCommentAndUser('comment-123', 'user-123');
      expect(commentLikes).toHaveLength(0);
    });
  });

  describe('isLikedComment function', () => {
    it('should return true if user already like comment', async () => {
      await CommentLikesTableTestHelper.addLikeComment({
        commentId: 'comment-123',
        userId: 'user-123'
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLikedComment('comment-123', 'user-123');

      expect(isLiked).toEqual(true);
    });

    it('should return false if user not like comment', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLikedComment('comment-123', 'user-123');

      expect(isLiked).toEqual(false);
    });
  });

  describe('getLikeCountByCommentIds function', () => {
    it('should return empty object when commentIds empty', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likeCounts = await likeRepositoryPostgres.getLikeCountsByCommentIds([]);

      expect(likeCounts).toEqual({});
    });

    it('should return correct like counts for multiple commentIds', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await CommentLikesTableTestHelper.addLikeComment({ id: 'like-1', commentId: 'comment-123', userId: 'user-123' });
      await CommentLikesTableTestHelper.addLikeComment({ id: 'like-2', commentId: 'comment-123', userId: 'user-000' });
      await CommentLikesTableTestHelper.addLikeComment({ id: 'like-3', commentId: 'comment-234', userId: 'user-000' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const likeCounts = await likeRepositoryPostgres.getLikeCountsByCommentIds(['comment-123', 'comment-234']);

      expect(likeCounts).toEqual({
        'comment-123': 2,
        'comment-234': 1
      });
    });
  });
});