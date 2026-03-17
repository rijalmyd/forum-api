import LikesHandler from './handler.js';
import routes from './routes.js';

export default (container) => {
  const likesHandler = new LikesHandler(container);
  return routes(likesHandler, container);
};