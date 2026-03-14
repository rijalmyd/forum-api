import CommentsHandler from './handler.js';
import routes from './routes.js';

export default (container) => {
  const commentsHandler = new CommentsHandler(container);
  return routes(commentsHandler, container);
};