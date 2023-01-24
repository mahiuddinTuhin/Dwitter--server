import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

/*  ALL THE MIDDLEWARE AND DIFFERENT PACKAGE CONFIGURATION */

/* 
/* with this cionfig we can grab the file url and 
specifically when we use module , 
so we can use directory name for the next time */

/* This is only when we use type module */
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

/* whis config is to use dot env file */
dotenv.config();

/* invoke our express application */
const app = express();

/* it is used to parse incoming JSON data in the body of an HTTP request. This middleware function reads the request body, parses it as JSON, and makes it available on the request object(req.body) so that it can be accessed by the route handlers.  */

app.use(express.json());

/* it uses the Express framework to add various HTTP headers for security purposes. The helmet module is a collection of middleware functions that sets HTTP headers to help protect a web application from common security vulnerabilities. */
app.use(helmet());

/* it is used to set the Cross-Origin-Resource-Policy HTTP header in a Node.js application that uses the Express framework. This header controls whether a browser will allow a web application to access resources from different origins. By default, the cross-origin value will be set, which allows resources to be loaded from any origin. */
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

/* is used in a Node.js application that uses the Express framework to log the HTTP requests made to the server. Morgan is a middleware that logs the HTTP request information to the console or to a file.  */
app.use(morgan("common"));

/* is used in a Node.js application that uses the Express framework to parse incoming JSON data in the body of an HTTP request. The body-parser module is a middleware that reads the request body, parses it as JSON, and makes it available on the request object (req.body) so that it can be accessed by the route handlers. */

/* This middleware is useful for handling large JSON payloads and for parsing complex JSON structures. */
app.use(express.json({ limit: "30mb", extended: true }));

/* to parse incoming URL-encoded data in the body of an HTTP request. The body-parser module is a middleware that reads the request body, parses it as URL-encoded data and makes it available on the request object (req.body) */

/* This middleware is particularly useful when handling large URL-encoded payloads and for parsing complex nested data structures. */
app.use(express.urlencoded({ limit: "30mb", extended: true }));

/* to enable Cross-Origin Resource Sharing (CORS). CORS is a security feature implemented by web browsers that blocks web pages from making requests to a different domain than the one that served the web page. */

/* You can also pass options to the cors function to configure it more specifically to your needs, such as allowing specific origins, methods, headers and others. */
app.use(cors());

/* app.use("/assets", express.static(path.join(__dirName,'public/assets'))) is used in a Node.js application that uses the Express framework to serve static files, such as images, CSS, and JavaScript files, from a specific directory.

The app.use() function is used to mount the express.static() middleware function, which serves files from a specified directory. The first argument passed to app.use() is the path that the middleware should respond to. In this case, it's "/assets".

The path.join(__dirname, 'public/assets') is used to construct the path to the directory where the static files are located. __dirname is a global variable that contains the path of the current file, and 'public/assets' is the path of the directory where the static files are located, relative to the current file.

This middleware function will respond to any request that starts with "/assets" by looking in the specified directory for a file with the same name as the requested resource. If the file is found, it will be served to the client, otherwise a 404 error will be returned. This is useful for serving images, stylesheets, and javascript files that are intended for the client. */
app.use("/assets", express.static(path.join(__dirName, "public/assets")));

/************************************  file storage *******************************/
/* This is an example of a storage configuration for the Multer middleware library, which is used for handling multipart/form-data, which is used for file uploads. The destination function specifies that the uploaded files should be stored in the "public/assets" directory, and the filename function specifies that the original file name should be used. The cb function is a callback that is called when the file has been stored. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH POST */

/* when we will hit the route --> "/auth/register", with upload.single middleware will save the picture in destination inside storage constant in the upper function , and register is a controller*/
app.post("/auth/register", upload.single("picture"), register);

/* Mongoose setup */

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
