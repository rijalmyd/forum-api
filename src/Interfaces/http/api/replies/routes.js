import { Router } from 'express';
import authenticate from '../../middlewares/auth.js';

const routes = (handler, container) => {
  const router = Router();

  router.post(
    '/threads/:threadId/comments/:commentId/replies',
    authenticate(container),
    handler.postReplyHandler,
  );
  router.delete(
    '/threads/:threadId/comments/:commentId/replies/:replyId',
    authenticate(container),
    handler.deleteReplyHandler,
  );

  return router;
};

export default routes;