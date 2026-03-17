import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';

describe('/threads/:threadId/comments/:commentId/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  describe('when PUT /threads/:threadId/comments/:commentId/likes', () => {
    it('should response 401 when unauthorized', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes');

      expect(response.statusCode).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .put('/threads/thread-234/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when comment not found in thread', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 200 and add like when comment not liked yet', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      const likes = await CommentLikesTableTestHelper.findLikesByCommentAndUser('comment-123', 'user-123');
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(likes).toHaveLength(1);
    });

    it('should response 200 and unlike when comment already liked', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });
      await CommentLikesTableTestHelper.addLikeComment({ commentId: 'comment-123', userId: 'user-123' });

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      const likes = await CommentLikesTableTestHelper.findLikesByCommentAndUser('comment-123', 'user-123');
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(likes).toHaveLength(0);
    });
  });
});