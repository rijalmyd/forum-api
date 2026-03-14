import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post(
    '/:threadId/comments/:commentId/replies',
    authenticate(container),
    handler.postReplyHandler,
  );

  return router;
};

export default routes;