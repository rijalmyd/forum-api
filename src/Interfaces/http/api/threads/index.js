import ThreadsHandler from './handler.js';
import routes from './routes.js';

export default (container) => {
  const threadsHandler = new ThreadsHandler(container);
  return routes(threadsHandler, container);
};