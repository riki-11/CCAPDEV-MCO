import livereload from 'livereload';
import chokidar from 'chokidar';

const server = livereload.createServer();
server.watch('public');
server.watch('views');

const watcher = chokidar.watch(['public', 'views']);
watcher.on('change', () => {
  server.refresh('/');
});
