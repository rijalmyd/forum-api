import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';

describe('/threads/:threadId/comments/:commentId/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  describe('when POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should response 400 when payload not contain needed property', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 123
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 401 when unauthorized', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .send({
          content: 'balasan'
        });

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
        .post('/threads/thread-234/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'balasan'
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when comment not found in thread', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-234/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'balasan'
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 201 and persisted addedReply', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-000', threadId: 'thread-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'ini balasan'
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should response 401 when unauthorized', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123');

      expect(response.statusCode).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 403 when user is not owner', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-234', username: 'user2' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when reply not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when comment not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const response = await request(app)
        .delete('/threads/thread-234/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread, comment and reply not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 200 and is_delete become true', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123'
      });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(200);
      const replies = await RepliesTableTestHelper.findRepliessById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
});