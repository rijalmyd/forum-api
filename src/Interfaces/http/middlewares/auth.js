import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

const authenticate = (container) => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    if (token && token.indexOf('Bearer ') !== 1) {
      try {
        const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);
        const user = await authenticationTokenManager.decodePayload(token.split('Bearer ')[1]);
        req.user = user;
        return next();
      } catch (error) {
        return res.status(401).json({
          status: 'fail',
          message: error.message,
        });
      }
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Missing authentication',
    });
  };
};

export default authenticate;