/* istanbul ignore file */
import config from '../src/Commons/config.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';
import jwt from 'jsonwebtoken';

const ServerTestHelper = {
  async getAccessToken({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const userPayload = {
      id, username, password, fullname,
    };
    await UsersTableTestHelper.addUser(userPayload);
    const accessToken = jwt.sign(userPayload, config.auth.accessTokenKey);
    const refreshToken = jwt.sign(userPayload, config.auth.refreshTokenKey);
    await AuthenticationsTableTestHelper.addToken(refreshToken);

    return accessToken;
  },

  async cleanTable() {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  },
};

export default ServerTestHelper;