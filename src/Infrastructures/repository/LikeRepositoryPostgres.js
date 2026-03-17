import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment(commentId, userId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: `
        INSERT INTO comment_likes (id, comment_id, user_id)
        VALUES($1, $2, $3)
      `,
      values: [id, commentId, userId]
    };

    await this._pool.query(query);
  }

  async deleteLikedComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    };

    await this._pool.query(query);
  }

  async isLikedComment(commentId, userId) {
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1 FROM comment_likes 
          WHERE comment_id = $1 AND user_id = $2
        )
      `,
      values: [commentId, userId]
    };

    const result = await this._pool.query(query);
    return result.rows[0].exists;
  }

  async getLikeCountsByCommentIds(commentIds) {
    if (!commentIds.length) return {};

    const query = {
      text: `
        SELECT comment_id, COUNT(*)::int
        FROM comment_likes
        WHERE comment_id = ANY($1)
        GROUP BY comment_id
      `,
      values: [commentIds]
    };

    const result = await this._pool.query(query);
    return Object.fromEntries(result.rows.map((row) => [row.comment_id, row.count]));
  }
}

export default LikeRepositoryPostgres;