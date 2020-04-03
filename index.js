const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const { notFound, sendErrors } = require("./config/errorHandler");
const app = express();

require("dotenv").config();
require("./config/dbconnection");

app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 1000000
	})
);
app.use(
	bodyParser.json({
		limit: "50mb",
		extended: true,
		parameterLimit: 1000000
	})
);
app.use(morgan("dev"));

//load Schemas
const User = require("./models/User");

//Routes
app.use("/api/v1/", require("./routes/api/v1/index"));

app.use("*", notFound);

//Error Handlers
app.use(sendErrors);

const { ENV, PORT } = require("./config/index");
//Setting up server
(startServer = async () => {
	try {
		await app.listen(PORT);
		console.log(
			`ENV: ${
				ENV == "dev" ? "Development" : "Production"
			}\nServer is up and running on Port ${PORT}`
		);
	} catch (err) {
		console.error("Error in running server.", err);
	}
})();
