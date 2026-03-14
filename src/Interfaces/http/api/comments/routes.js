import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post('/threads/:threadId/comments', authenticate(container), handler.postCommentHandler);
  router.delete('/threads/:threadId/comments/:commentId', authenticate(container), handler.deleteCommentHandler);

  return router;
};

export default routes;