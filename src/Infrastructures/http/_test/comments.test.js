import { expect } from 'vitest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';

describe('/threads/:threadId/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  describe('when POST /threads/:threadId/comments', () => {
    it('should response 400 when payload not contain needed property', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 123
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 401 when not using accessToken', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .send({
          content: 'komentar'
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .post('/threads/thread-234/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'komentar'
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 201 and persisted addedThread', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'ini komentar'
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
    });

    it('should response 201 and persisted addedThread when other user comments', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const accessTokenCommentator = await ServerTestHelper.getAccessToken({ id: 'user-234', username: 'commentator' });

      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessTokenCommentator}`)
        .send({
          content: 'ini komentar'
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId', () => {
    it('should response 403 when user is not owner', async () => {
      const app = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-234', username: 'user2' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when commentId is not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when threadId is not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const response = await request(app)
        .delete('/threads/thread-234/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when threadId and commentId is not available', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
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

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(200);
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });
});