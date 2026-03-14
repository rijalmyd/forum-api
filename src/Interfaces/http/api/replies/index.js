import RepliesHandler from './handler.js';
import routes from './routes.js';

export default (container) => {
  const repliesHandler = new RepliesHandler(container);
  return routes(repliesHandler, container);
};