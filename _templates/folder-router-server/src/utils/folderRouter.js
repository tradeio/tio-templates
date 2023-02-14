import chalk from "chalk";
import fs from "fs";
import path from "path";

const catchAsyncError = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

const calcRoutePath = (_path, file, prefix, _originalPath) => {
  let _fileName =
    file === "index.ts" || file === "index.js"
      ? ""
      : file.substring(0, file.length - 3);
  return path
    .join("/", prefix, _path.replace(_originalPath, ""), _fileName)
    .replace(/\\/g, "/")
    .replace(/\[/g, ":")
    .replace(/\]/g, "");
};

async function _folderRouter(server, _path, _originalPath, _prefix) {
  const files = fs.readdirSync(path.resolve(_path), { withFileTypes: true });
  for (const file of files.sort((a, b) => (a.name[0] === "[" ? -1 : 1))) {
    if (file.isDirectory()) {
      await _folderRouter(
        server,
        path.join(_path, file.name),
        _originalPath,
        _prefix
      );
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      const endpoints = await import(path.resolve(_path, file.name));
      const routePath = calcRoutePath(_path, file.name, _prefix, _originalPath);
      console.log(
        `[${chalk.green("PATH")}] '${chalk.bold(routePath)}' (${
          endpoints.default?.middleware?.all?.length || 0
        } middleware):`
      );
      if (endpoints.default?.middleware?.all) {
        server.all(
          routePath,
          ...endpoints.default?.middleware.all.map(catchAsyncError)
        );
      }

      if (endpoints.GET && typeof endpoints.GET === "function") {
        let getMiddleware = endpoints.default?.middleware?.get || [];
        server.get(
          routePath,
          ...getMiddleware.map(catchAsyncError),
          catchAsyncError(endpoints.GET)
        );
        console.log(
          `${chalk.blue("---")} ${chalk.green.underline("GET")} (${
            getMiddleware.length
          } middleware)`
        );
      }
      if (endpoints.POST && typeof endpoints.POST === "function") {
        let postMiddleware = endpoints.default?.middleware?.post || [];
        server.post(
          routePath,
          ...postMiddleware.map(catchAsyncError),
          catchAsyncError(endpoints.POST)
        );
        console.log(
          `${chalk.blue("---")} ${chalk.green.underline("POST")} (${
            postMiddleware.length
          } middleware)`
        );
      }
      if (endpoints.PUT && typeof endpoints.PUT === "function") {
        let putMiddleware = endpoints.default?.middleware?.put || [];
        server.put(
          routePath,
          ...putMiddleware.map(catchAsyncError),
          catchAsyncError(endpoints.PUT)
        );
        console.log(
          `${chalk.blue("---")} ${chalk.green.underline("PUT")} (${
            putMiddleware.length
          } middleware)`
        );
      }
      if (endpoints.DELETE && typeof endpoints.DELETE === "function") {
        let delMiddleware = endpoints.default?.middleware?.delete || [];
        server.delete(
          routePath,
          ...delMiddleware.map(catchAsyncError),
          catchAsyncError(endpoints.DELETE)
        );
        console.log(
          `${chalk.blue("---")} ${chalk.green.underline("DELETE")} (${
            delMiddleware.length
          } middleware)`
        );
      }
    }
  }
}

export default async function folderRouter(server, _path, _prefix = "") {
  return _folderRouter(
    server,
    path.join(_path, ""),
    path.join(_path, ""),
    _prefix
  );
}
