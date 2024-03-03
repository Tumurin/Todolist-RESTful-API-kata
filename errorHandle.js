const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
  "Content-Type": "application/json",
};
exports.errorHandle = function (e, res) {
  let errorMessage = "";
  if (typeof e == "string") {
    errorMessage = e;
  } else {
    errorMessage = e.message;
  }
  res.writeHead(422, headers);
  res.write(
    JSON.stringify({
      status: "error",
      message: "錯誤：" + errorMessage,
    })
  );
  res.end();
};
