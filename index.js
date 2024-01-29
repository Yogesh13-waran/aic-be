const express = require("express");
const port = 7000;
const router = require("./router/router");
const path = require("path");

const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Calendar = require("./models/calendar");
const Content = require("./models/content");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  "/api",
  createProxyMiddleware({
    target: `https://localhost:${port}`,
    changeOrigin: true,
  })
);
app.use((req, res, next) => {
  // logger.info(req.body);
  let oldsend = res.send;
  res.send = function (data) {
    // logger.info(data);
    oldsend.apply(res, arguments);
  };
  next();
});
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
  console.log(req.header);
});

app.use("/", router);

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://yogeshwaran130299:aic123@cluster0.lehvni5.mongodb.net/calendaraic?retryWrites=true&w=majority"
    );
    console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
  }
}
connect();

app.listen(port, () => {
  console.log(`listing on ${port}`);
});
