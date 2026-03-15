import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AddedThread from '../../Domains/threads/entities/AddedThread.js';
import DetailThread from '../../Domains/threads/entities/DetailThread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT EXISTS (SELECT 1 FROM threads WHERE id = $1)',
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].exists) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username 
        FROM threads t 
        LEFT JOIN users u ON u.id = t.owner 
        WHERE t.id = $1
      `,
      values: [threadId]
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const row = result.rows[0];
    return new DetailThread({
      id: row.id,
      title: row.title,
      body: row.body,
      date: new Date(row.date).toISOString(),
      username: row.username,
    });
  }
}

export default ThreadRepositoryPostgres;