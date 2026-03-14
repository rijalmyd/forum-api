import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import { describe } from 'vitest';

describe('ReplyRepositoryPostgres', () => {
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
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist reply and return added reply correctly', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const newReply = new NewReply({
        content: 'sebuah balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const addedReply = await replyRepository.addReply(newReply);

      const replies = await RepliesTableTestHelper.findRepliessById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123'
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist deleted reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-000'
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReplyById('reply-123');

      const replies = await RepliesTableTestHelper.findRepliessById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyId function', async () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyId('reply-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply has been deleted', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-000',
        isDelete: true
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyId('reply-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should response NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not owner', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-000'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is owner', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        threadId: 'thread-123',
        owner: 'user-000',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-000'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return empty array when commentIds empty', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepository.getRepliesByCommentIds([]);
      expect(replies).toEqual([]);
    });

    it('should return replies in ascending order by date', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-123', owner: 'user-000', content: 'balasan 1', date: new Date('2026-03-14T07:10:11.222Z') });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', commentId: 'comment-123', owner: 'user-123', content: 'balasan 2', date: new Date('2026-03-14T08:10:01.555Z') });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepository.getRepliesByCommentIds(['comment-123']);

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-1');
      expect(replies[0].username).toEqual('commentator');
      expect(replies[1].id).toEqual('reply-2');
      expect(replies[1].username).toEqual('dicoding');
    });
  });
});