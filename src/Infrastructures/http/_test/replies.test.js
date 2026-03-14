import { expect } from 'vitest';
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

    it('should response 404 when comment not found', async () => {
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
});