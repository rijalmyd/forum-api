import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(commentId, userId) {
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

  async unlikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    };

    await this._pool.query(query);
  }
}

export default LikeRepositoryPostgres;