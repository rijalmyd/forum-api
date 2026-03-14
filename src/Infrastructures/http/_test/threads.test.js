import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 400 when payload not contain needed property', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'sebuah thread'
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 1,
          body: 2
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 401 when not using accessToken', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads')
        .send({
          title: 'thread',
          body: 'body thread'
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 201 and persisted added thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const app = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken({});

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/:threadId', () => {
    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .get('/threads/thread-123');

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 200 and show deleted comment with placeholder content', async () => {
      const app = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', isDelete: true });

      const response = await request(app)
        .get('/threads/thread-123');

      expect(response.status).toEqual(200);
      expect(response.body.data.thread.id).toEqual('thread-123');
      expect(response.body.data.thread.username).toEqual('dicoding');
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0].id).toEqual('comment-123');
      expect(response.body.data.thread.comments[0].username).toEqual('dicoding');
      expect(response.body.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should response 200, comments sorted ascending and show deleted comment with placeholder content', async () => {
      const app = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-000', username: 'commentator' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-234', threadId: 'thread-123', owner: 'user-000', isDelete: true });

      const response = await request(app)
        .get('/threads/thread-123');

      expect(response.status).toEqual(200);
      expect(response.body.data.thread.id).toEqual('thread-123');
      expect(response.body.data.thread.username).toEqual('dicoding');
      expect(response.body.data.thread.comments).toHaveLength(2);
      expect(response.body.data.thread.comments[0].id).toEqual('comment-123');
      expect(response.body.data.thread.comments[0].username).toEqual('dicoding');
      expect(response.body.data.thread.comments[0].content).toEqual('sebuah komentar');
      expect(response.body.data.thread.comments[1].id).toEqual('comment-234');
      expect(response.body.data.thread.comments[1].username).toEqual('commentator');
      expect(response.body.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});