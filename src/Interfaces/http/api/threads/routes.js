import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post('/', authenticate(container), handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadHandler);

  return router;
};

export default routes;