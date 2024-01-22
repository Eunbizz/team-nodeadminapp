var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const cors = require("cors");

var sequelize = require("./models/index.js").sequelize;

var indexRouter = require("./routes/index");
var articlesRouter = require("./routes/articles");
var channelRouter = require("./routes/channel");
var membersRouter = require("./routes/members");
var messageRouter = require("./routes/message");
var adminRouter = require("./routes/admin");
var session = require("express-session");

var app = express();

sequelize.sync();

app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: "testsecret",
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 20,
		},
	})
);

// 모든 RESTFUL 호출에 대한 응답 허락하기 - CORS ALL 허락..
app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set("layout", "layout");
// app.set('layout', 'loginLayout');

app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true);
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/views/src/assets"));

app.use("/", indexRouter);
app.use("/articles", articlesRouter);
app.use("/channel", channelRouter);
app.use("/members", membersRouter);
app.use("/message", messageRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
