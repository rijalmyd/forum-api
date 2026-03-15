import express from 'express';

const createUsersRouter = (handler) => {
  const router = express.Router();

  router.post('/users', handler.postUserHandler);

  return router;
};

export default createUsersRouter;
