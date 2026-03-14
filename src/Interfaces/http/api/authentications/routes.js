import express from 'express';

const createAuthenticationsRouter = (handler) => {
  const router = express.Router();

  router.post('/authentications', handler.postAuthenticationHandler);
  router.put('/authentications', handler.putAuthenticationHandler);
  router.delete('/authentications', handler.deleteAuthenticationHandler);

  return router;
};

export default createAuthenticationsRouter;
