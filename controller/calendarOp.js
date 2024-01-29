const calendar = require("../models/calendar");
const content = require("../models/content");
const user = require("../models/user");
const path = require("path");

exports.calendarOperations = async (req, res) => {
  try {
    const role = req.body.role;
    const slotUpdaterId = req.body.slotUpdaterId;
    const date = req.body.date;
    const time = req.body.time;
    const userId = req.body.userId;
    const slotAvailability = req.body.slotAvailability;
    const year = req.body.year;
    const month = req.body.month;
    const slotCheck = await calendar.findOne({ date: date, timeSlot: time });
    if (role == 1 && slotCheck == null) {
      await calendar
        .create({
          user_id: userId,
          date: date,
          timeSlot: time,
          slotAvailability: slotAvailability,
          mediaUrl: "null",
          slotUpdaterId: slotUpdaterId,
          contentUpdaterId: null,
          month: month,
          year: year,
        })
        .then(async () => {
          await res.status(200).json({
            isError: false,
            message: "Slot opened successfully",
          });
        });
      return;
    }
    if (role == 1 && slotCheck != null && slotCheck.mediaUrl == "null") {
      const filter = {
        date: date,
        timeSlot: time,
      };
      const update = {
        slotAvailability: slotAvailability,
        slotUpdaterId: slotUpdaterId,
      };
      await calendar
        .findOneAndUpdate(filter, update, {
          returnOriginal: false,
        })
        .then(async () => {
          await res.status(200).json({
            isError: false,
            message: "Slot updated successfully",
          });
        });
      return;
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.checkCalendar = async (req, res) => {
  try {
    const date = req.query.date;
    const time = req.query.time;
    const userId = req.query.userId;
    const day = new Date();
    const today = day.toISOString().slice(0, 10);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(date).getTime() - new Date(today).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);

    const currentTime = day.getHours();
    // const currentTimeSplitted = currentTime[1].split(":");
    const timeSplitted = time.split(":");
    let userDetail;
    const getMediaData = await content.findOne({
      contentDate: date,
      contentTimeSlot: time,
    });

    if (getMediaData != null) {
      userDetail = await user.findOne({
        created_id: getMediaData.contentUploaderId,
      });
    } else {
      userDetail = null;
    }
    const slotStatus = await calendar.findOne({
      date: date,
      timeSlot: time,
      slotAvailability: true,
    });

    if (diffInDays > 0) {
      const data = {
        showToggle: true,
        showUpload: false,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    }
    if (diffInDays == 0 && Number(timeSplitted[0]) > Number(currentTime)) {
      const data = {
        showToggle: true,
        showUpload: false,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    }
    if (
      diffInDays == 0 &&
      Number(currentTime) == Number(timeSplitted[0]) &&
      getMediaData == null &&
      slotStatus != null
    ) {
      const data = {
        showToggle: false,
        showUpload: true,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    }
    if (
      diffInDays == 0 &&
      Number(currentTime) == Number(timeSplitted[0]) &&
      getMediaData != null &&
      slotStatus != null &&
      getMediaData.contentUploaderId == userId
    ) {
      const data = {
        showToggle: false,
        showUpload: true,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    } else {
      const data = {
        showToggle: false,
        showUpload: false,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(400).json({
        isError: true,
        message: "Time zone is freezed",
        response: data,
      });
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};


exports.imagePath = async (req, res) => {
  try {
    if (req.file) {
      const filePath = req.file.path;
      const fileName = path.basename(filePath);
      const imageUrl = `http://localhost:7000/uploads/${fileName}`;


      return res.json({
        message: "Image saved to local",
        mediaUrl: imageUrl,
      });
    } else {
      throw new Error("No file uploaded");
    }
  } catch (err) {
    return res.json({
      isError: true,
      message: err.message,
    });
  }
};

exports.contentUpload = async (req, res) => {
  try {
    const role = req.body.role;
    const date = req.body.date;
    const time = req.body.time;
    const uploaderId = req.body.uploaderId;
    const mediaUrl = req.body.mediaUrl;
    const contentCheck = await content.findOne({
      contentDate: date,
      contentTimeSlot: time,
    });

    let mediaCheck = mediaUrl.split(".");
    let mediaType;
    if (mediaCheck[1] == "mp4" || mediaCheck[1] == "webm") {
      mediaType = "video";
    } else {
      mediaType = "image";
    }
    if ((role == 2 || role == 1) && contentCheck == null) {
      await content
        .create({
          contentDate: date,
          contentTimeSlot: time,
          contentUploaderId: uploaderId,
          contentmediaUrl: mediaUrl,
          desc: mediaType,
        })
        .then(async () => {
          await res.status(200).json({
            isError: false,
            message: "File is uploaded successfully",
          });
        });
      return;
    }
    if (
      (role == 2 || role == 1) &&
      contentCheck != null &&
      contentCheck.contentUploaderId == uploaderId
    ) {
      const filter = {
        contentDate: date,
        contentTimeSlot: time,
        contentUploaderId: uploaderId,
      };

      const update = {
        contentmediaUrl: mediaUrl,
        desc: mediaType,
      };

      await content.updateOne(filter, { $set: update }).then(async (data) => {
        await res.status(200).json({
          isError: false,
          message: "File is updated successfully",
          data: data,
        });
      });
      return;
    } else {
      await res.status(400).json({
        isError: true,
        message: "Some file is already uploaded by another user",
      });
      return;
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.getSlots = async (req, res) => {
  try {
    const date = new Date();
    const month = "0" + (date.getMonth() + 1);
    const year = date.getFullYear().toString();
    await calendar
      .find({ year: year, slotAvailability: 1 })
      .then(async (data) => {
        await res.status(200).json({
          isError: false,
          data: data,
        });
      });
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.getSlotContent = async (req, res) => {
  try {
    const date = req.query.date;
    const time = req.query.time;
    const contentCheck = await content.findOne({
      contentDate: date,
      contentTimeSlot: time,
    });
    if (contentCheck) {
      await res.status(200).json({
        isError: false,
        data: contentCheck,
      });
    }
    if (!contentCheck) {
      await res.status(400).json({
        isError: true,
        message: "No contents uploaded to show",
      });
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.openedSlots = async (req, res) => {
  try {
    const date = req.query.date;
    const slotCheck = await calendar.find({
      date: date,
      slotAvailability: true,
    });
    if (slotCheck.length != 0)
      await res.status(200).json({
        isError: false,
        data: slotCheck,
      });
    if (slotCheck.length == 0) {
      await res.status(400).json({
        isError: true,
        message: "No slots opened for this day",
      });
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.slotStatus = async (req, res) => {
  try {
    const date = req.query.date;
    const time = req.query.time;
    const day = new Date();
    const getMediaData = await content.findOne({ date: date, timeSlot: time });
    const slotStatus = await calendar.findOne({
      date: date,
      timeSlot: time,
      slotAvailability: true,
    });
    const response = {
      mediaData: getMediaData,
      slotData: slotStatus,
    };

    await res.status(200).json({
      isError: false,
      data: response,
    });
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.checkCalendarForUser = async (req, res) => {
  try {
    const date = req.query.date;
    const time = req.query.time;
    const userId = req.query.userId;
    const day = new Date();
    const today = day.toISOString().slice(0, 10);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(date).getTime() - new Date(today).getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const currentTime = day.getHours();
    let userDetail;
    const timeSplitted = time.split(":");
    const getMediaData = await content.findOne({
      contentDate: date,
      contentTimeSlot: time,
    });
    const slotStatus = await calendar.findOne({
      date: date,
      timeSlot: time,
      slotAvailability: true,
    });
    if (getMediaData != null) {
      userDetail = await user.findOne({
        created_id: getMediaData.contentUploaderId,
      });
    } else {
      userDetail = null;
    }

    if (
      diffInDays == 0 &&
      Number(currentTime) == Number(timeSplitted[0]) &&
      getMediaData == null &&
      slotStatus != null
    ) {
      const data = {
        showToggle: false,
        showUpload: true,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    }
    if (
      diffInDays == 0 &&
      Number(currentTime) == Number(timeSplitted[0]) &&
      getMediaData != null &&
      slotStatus != null &&
      getMediaData.contentUploaderId == userId
    ) {
      const data = {
        showToggle: false,
        showUpload: true,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(200).json({
        isError: false,
        message: "Time zone is available",
        response: data,
      });
      return;
    } else {
      const data = {
        showToggle: false,
        showUpload: false,
        mediaData: getMediaData,
        slotData: slotStatus,
        userData: userDetail,
      };
      await res.status(400).json({
        isError: true,
        message: "Time zone is freezed",
        response: data,
      });
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.showAllPosts = async (req, res) => {
  try {
    const userId = req.query.userId;
    const contents = await content.find({ contentUploaderId: userId });
    if (contents.length == 0) {
      await res.status(400).json({
        isError: true,
        message: "No uploads yet",
      });
    }
    if (contents.length > 0) {
      await res.status(200).json({
        isError: false,
        message: "data retrieved successfully",
        response: contents,
      });
    }
  } catch (err) {
    await res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    if (req.file) {
      var files = req.file;
    
      const absolutePath = path.resolve(files.path);
      const id = req.params.id;
      const updateImage = await db.patients.findOne({
        where: { patient_id: patient_id },
      });
      

      await db.patients.update(
        {
          patient_profile_url: absolutePath,
        },
        { where: { patient_id: patient_id } }
      );
      await res.status(201).json({
        message: "Image updated successfully",
      });
    } else {
      var message = "something went wrong";
      res.status(400).json({
        message: message,
      });
      logger.log.log(
        "error",
        `${res.statusCode} response sent for ${req.method} request at ${req.url} message:${message}`
      );
    }
  } catch (error) {
    res.status(500).json({
      status: "Issues while uploading",
      message: error.message,
    });
    logger.log.log(
      "error",
      `${res.statusCode} response sent for ${req.method} request at ${req.url} message:${message}`
    );
  }
};
