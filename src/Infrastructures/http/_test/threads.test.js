import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';

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
});