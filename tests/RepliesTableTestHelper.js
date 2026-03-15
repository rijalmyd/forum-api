/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    date = new Date().toISOString(),
    isDelete = false,
    commentId = 'comment-123',
    owner = 'user-123'
  }) {
    const query = {
      text: `
        INSERT INTO replies (id, content, date, comment_id, owner, is_delete) 
        VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING id, content, owner
      `,
      values: [id, content, date, commentId, owner, isDelete]
    };

    await pool.query(query);
  },

  async findRepliessById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    };

    const result =  await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies CASCADE');
  }
};

export default RepliesTableTestHelper;