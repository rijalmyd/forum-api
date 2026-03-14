import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post('/:threadId/comments', authenticate(container), handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authenticate(container), handler.deleteCommentHandler);

  return router;
};

export default routes;