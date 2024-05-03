import Hapi from '@hapi/hapi';
import { routes } from './routes/index.js';

const initialization = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 9000,
  });

  server.route(routes);

  await server.start();
  console.log('Server running on port ', server.info.port);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

initialization();
