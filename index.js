const fs = require("fs");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Load initial data from "db.json"
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

// Define the path to the backup file
const backupFilePath = "backup.json";

server.use(middlewares);
server.use(router);

// Periodically back up data
setInterval(() => {
  const data = router.db.getState();
  fs.writeFileSync(backupFilePath, JSON.stringify(data));
  console.log("Data backed up.");
}, 60000); // Back up every minute

// Restore data on server start if the backup file exists
if (fs.existsSync(backupFilePath)) {
  const backupData = JSON.parse(fs.readFileSync(backupFilePath, "utf-8"));
  router.db.setState(backupData);
  console.log("Data restored from backup.");
}

server.listen(port);
