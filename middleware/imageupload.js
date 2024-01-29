const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype == "video/mp4" ||
    file.mimetype == "video/webm"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported files", false));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  uploads: upload,
};
