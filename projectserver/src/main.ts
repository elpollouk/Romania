import * as http from 'http';
import App from './app';

const port = 8088;
App.set('port', port);

const server = http.createServer(App);
server.listen(port, 'localhost');
server.on('listening', onListening);

function onListening() {
    console.log(`Listening on port ${port}`);
}