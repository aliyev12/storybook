import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
import passport from "passport";
import session from "express-session";
import methodOverride from "method-override";
import { connectDB } from "./db";
import * as routes from "./routes";
import { passportConfig } from "./config/passport";
import {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} from "./helpers/hbs";

const MongoStore = require("connect-mongo")(session);

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
passportConfig(passport);

connectDB();

const app: Application = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencode POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Session
app.use(
  session({
    secret: "something",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes.base);
app.use("/auth", routes.auth);
app.use("/stories", routes.stories);

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
