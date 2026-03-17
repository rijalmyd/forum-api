import { afterAll, afterEach, beforeEach, describe, expect } from 'vitest';
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

  describe('likeComment function', () => {
    it('should persist comment like', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.likeComment(commentId, userId);

      const commentLikes = await CommentLikesTableTestHelper.findLikesByCommentAndUser(commentId, userId);
      expect(commentLikes).toHaveLength(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete comment like', async () => {
      await CommentLikesTableTestHelper.likeComment({
        commentId: 'comment-123',
        userId: 'user-123'
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.unlikeComment('comment-123', 'user-123');

      const commentLikes = await CommentLikesTableTestHelper.findLikesByCommentAndUser('comment-123', 'user-123');
      expect(commentLikes).toHaveLength(0);
    });
  });
});