const http = require("http");
const express = require("express");
const cors = require("cors");
const config = require("../config");
const socket = require("./lib/socket");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const compression = require("compression");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(compression());

app.use("/", express.static(`${__dirname}/../client/dist`));
// app.use('/model', express.static(`${__dirname}/../../client/public/best3_web_model/model.json`));

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  server.listen(config.PORT, () => {
    socket(server);
    console.log("Server is listening at :", config.PORT);
    console.log(`Server in localhost http://localhost:${config.PORT}`);
  });
}
