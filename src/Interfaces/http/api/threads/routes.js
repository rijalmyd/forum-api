import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post('/threads/', authenticate(container), handler.postThreadHandler);
  router.get('/threads/:threadId', handler.getThreadHandler);

  return router;
};

export default routes;