import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.put('/threads/:threadId/comments/:commentId/likes', authenticate(container), handler.putCommentLikeHandler);

  return router;
};

export default routes;