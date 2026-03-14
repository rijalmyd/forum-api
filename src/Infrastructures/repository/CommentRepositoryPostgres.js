import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import DetailComment from '../../Domains/comments/entities/DetailComment.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: `
        INSERT INTO comments (id, content, thread_id, owner) 
        VALUES($1, $2, $3, $4)
        RETURNING id, content, owner
      `,
      values: [id, content, threadId, owner]
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId]
    };

    await this._pool.query(query);
  }

  async verifyCommentId(commentId, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError('komentar telah dihapus');
    }

    if (result.rows[0].thread_id !== threadId) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, c.content, c.date, c.is_delete AS "isDelete", u.username 
        FROM comments c 
        LEFT JOIN users u ON u.id = c.owner 
        WHERE c.thread_id = $1 
        ORDER BY c.date ASC
      `,
      values: [threadId]
    };

    const results = await this._pool.query(query);
    return results.rows.map((row) => new DetailComment({
      id: row.id,
      username: row.username,
      date: new Date(row.date).toISOString(),
      content: row.content,
      isDelete: row.isDelete,
    }));
  }
}

export default CommentRepositoryPostgres;