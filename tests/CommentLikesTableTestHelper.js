import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentLikesTableTestHelper = {
  async likeComment({
    id = 'like-123',
    commentId = 'comment-123',
    userId = 'user-123',
    date = new Date().toISOString(),
  }) {
    const query = {
      text: `
        INSERT INTO comment_likes VALUES($1, $2, $3, $4)
      `,
      values: [id, commentId, userId, date]
    };

    await pool.query(query);
  },

  async findLikesByCommentAndUser(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  }
};

export default CommentLikesTableTestHelper;