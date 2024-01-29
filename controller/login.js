const user = require("../models/user");

exports.logIn = async (req, res) => {
  try {
    const name = req.body.name;
    const user_check = await user.findOne({ name: name });

    if (user_check) {
      await res.status(200).json({
        isError: false,
        message: "login successfull",
        response: user_check,
      });
    }

    if (!user_check)
      await res.status(400).json({
        isError: true,
        message: "Not an Existing user . Please sign up",
      });
  } catch (err) {
    await res.status(400).json({ isError: true, message: err.message });
  }
};

exports.Register = async (req, res) => {
  try {
    const name = req.body.name;
    const user_count = await user.countDocuments({});

    const userCheck = await user.findOne({ name: name });
    if (userCheck == null) {
      await user
        .create({
          name: name,
          role: 2,
          created_id: user_count + 1,
        })
        .then(async (data) => {
          await res.status(200).json({
            isError: false,
            message: "user created successfully . Please Login using your name",
            response: data,
          });
        });
    }
    if (userCheck != null) {
      await res.status(400).json({
        isError: true,
        message: "user already exists with this name",
      });
    }
  } catch (err) {
    await res.status(400).json({ isError: true, message: err.message });
  }
};
