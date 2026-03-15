import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: `
        INSERT INTO replies (id, content, comment_id, owner)
        VALUES ($1, $2, $3, $4)
        RETURNING id, content, owner
      `,
      values: [id, content, commentId, owner]
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId]
    };

    await this._pool.query(query);
  }

  async verifyReplyExistsOnComment(replyId, commentId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError('balasan telah dihapus');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    const reply = result.rows[0];
    if (reply.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds.length) {
      return [];
    }

    const query = {
      text: `
        SELECT r.id, r.content, r.date, r.comment_id AS "commentId",
          r.is_delete AS "isDelete", u.username
        FROM replies r
        LEFT JOIN users u ON u.id = r.owner
        WHERE r.comment_id = ANY($1::text[])
        ORDER BY r.date ASC
      `,
      values: [commentIds]
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new DetailReply({
      id: row.id,
      commentId: row.commentId,
      username: row.username,
      date: new Date(row.date).toISOString(),
      content: row.content,
      isDelete: row.isDelete,
    }));
  }
}

export default ReplyRepositoryPostgres;