import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { wsHandlers } from './wsHandlers';
import './config'; 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(routes);

wsHandlers(io);

app.get('/', (req, res) => {
  res.send('<h2 style="color:blue">Welcome to To-Do List App!</h2>');
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
