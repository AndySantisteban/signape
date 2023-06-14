const http = require('http');
const express = require('express');
const cors = require('cors');
const config = require('../config');
const socket = require('./lib/socket');

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use('/', express.static(`${__dirname}/../client/dist`));
app.use('/public', express.static(`${__dirname}/../public`));

server.listen(config.PORT, () => {
  socket(server);
  console.log('Server is listening at :', config.PORT);
});
