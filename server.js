const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { errorHandle } = require("./errorHandle");
const { successHandle } = require("./successHandle");

let todos = [
  {
    title: "今天要刷牙",
    uuid: uuidv4(),
  },
];

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    console.log("chunk", chunk);
    body += chunk;
  });

  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  if (req.url == "/todos" && req.method == "GET") {
    successHandle(todos, res);
    return;
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        console.log("end", body);

        let data = JSON.parse(body);
        console.log("data", data);

        const title = data?.title;
        console.log("title", title);

        if (!title) {
          errorHandle("缺少代辦事項標題", res);
          return;
        }

        const todo = { title, uuid: uuidv4() };
        todos.push(todo);
        successHandle(todos, res);
        return;
      } catch (e) {
        console.log(e);
        errorHandle(e, res);
        return e;
      }
    });
  } else if (req.url.startsWith("/todos") && req.method == "DELETE") {
    const deleteUUID = req.url.split("/")[2];
    if (deleteUUID) {
      console.log(deleteUUID);

      let isDeleted = false;
      todos = todos.filter((i) => {
        if (i.uuid == deleteUUID) isDeleted = true;
        return i.uuid != deleteUUID;
      });

      if (!isDeleted) {
        errorHandle("查無此代辦事項 id", res);
        return;
      }

      console.log(todos);
      successHandle(todos, res);
      return;
    }

    if (todos.length == 0) {
      errorHandle("沒有代辦事項", res);
      return;
    }

    todos.length = 0;
    successHandle(todos, res);
    return;
  } else if (req.url.startsWith("/todos") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        console.log("end", body);

        let data = JSON.parse(body);
        console.log("data", data);

        const title = data?.title;
        console.log("title", title);

        if (!title) {
          errorHandle("缺少代辦事項標題", res);
          return;
        }

        const updateUUID = req.url.split("/")[2];
        console.log("updateUUID", updateUUID);

        if (!updateUUID) {
          errorHandle("沒有代辦事項 id", res);
          return;
        }

        let isUpdated = false;
        todos = todos.filter((i) => {
          if (i.uuid == updateUUID) {
            isUpdated = true;
            i.title = title;
          }
          return true;
        });

        if (!isUpdated) {
          errorHandle("查無此代辦事項 id", res);
          return;
        }

        console.log(todos);
        successHandle(todos, res);
        return;
      } catch (e) {
        console.log(e);
        errorHandle(e, res);
        return;
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
    return;
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
    return;
  }
};

const server = http.createServer(requestListener);
server.listen(3000);
