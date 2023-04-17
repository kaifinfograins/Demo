const User = require("../model/demoModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../common/token");
const joi = require("joi");
const Joi = require("joi");
const { use } = require("../routes/demoRouter");

async function hash(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const insertUser = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    
    const hashedPassword = await hash(password, confirm_password);

    const addUser = new User({
      name,
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      image :req.file.filename
    });

    const result = await addUser.save();

    if (!result) {
      return res.status(500).json({
        statusCode: 500,
        message: "Data not added",
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Data added successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const checkUser = await User.findOne({ email });
//     if (!checkUser) {
//       return res.status(500).json({ message: "No user found" });
//     }

//     const matchPassword = await validatePassword(password,checkUser.password)

//     if (!matchPassword) {
//         return res.status(500).json({ message: "Email or Password not correct" });
//       }
//    console.log("matchPassword--->", matchPassword)

//     if (email != checkUser.email ) {
//       return res.status(500).json({ message: "Email or Password not correct" });
//     }

//     const result = await checkUser.save();
//     return res.status(200).json({
//       statusCode: 200,
//       message: "User login successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ValidationSchemas = Joi.object({
      email: Joi.string()
        .min(6)
        .required()
        .email()
        .message("Must be a valid email address"),
      password: Joi.string().required().min(6).message("Password is required!"),
    });

    const validation = ValidationSchemas.validate({
      email: email,
      password: password,
    });
    console.log("validation===>", validation);

    if (validation.error) {
      return res.status(422).send({
        status: 422,
        message: validation.error.details,
      });
    }

    const userDetail = await User.findOne({ email });
    console.log("userDetails==>", userDetail);

    if (!userDetail) {
      return res.status(409).json({
        status: 409,
        message: "Email or password incorrect",
      });
    }
    const isPasswordCheck = await validatePassword(
      password,
      userDetail.password
    );
    if (!isPasswordCheck) {
      return res.status(422).json({
        status: 422,
        message: "Password not match",
      });
    }

    const token = await generateToken({
      id: userDetail,
    });

    res.cookie("userSession", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return res.status(200).json({
      status: 200,
      message: "User login successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
      res.clearCookie("adminSession");
      return res.status(200).json({
          status: 200,
          message: "User logout successfullly",
      });
  } catch {
      console.log(error);
      return res.status(500).json({
          message: "Ooopsss!"
      });
  }
}




const changePassword = async (req, res) => {
  try {
    var _id = req.body._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirm_password = req.body.confirm_password;

    const data = await User.findOne({ _id });

    if (!data) {
      return res.status(500).json({ message: "no data found" });
    }

    const validOldPassword = await validatePassword(oldPassword, data.password);

    if (!validOldPassword)
      return res.status(409).json({
        status: 409,
        message: "Old passsword doesn't matched",
      });

    const hashedPassword = await hash(newPassword);

    const response = await User.findOneAndUpdate(
      { _id },
      { $set: { password: hashedPassword, confirm_password: newPassword } }
    );

    if (!response) {
      return res.json({
        status: 400,
        message: "Bad request",
      });
    } else {
      return res.json({
        statusCode: 200,
        message: "password change successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};





const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, email, password, confirm_password } = req.body;

    const hashedPassword = await hash(password, confirm_password);

    const checkUser = await User.findOne({ _id });

    if (!checkUser) {
      return res.status(500).json({ message: "User not found" });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id },
      {
        $set: {
          name,
          email,
          password: hashedPassword,
          confirm_password: hashedPassword,
        },
      }
    );

    if (!updateUser) {
      return res.status(500).json({
        statusCode: 500,
        message: "User updation failed",
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "User updated!",
        data: updateUser,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const findUser = await User.find().sort({ createdAt: -1 });

    if (!findUser) {
      return res.status(500).json({ message: "Data not fetched" });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched successfully",
        data: findUser,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const deleteUser = await User.findByIdAndDelete({ _id });
    if (!deleteUser) {
      return res.status(500).json({ message: "User deletion failed" });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "User deleted successfully",
        data: deleteUser,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  insertUser,
  updateUser,
  getUser,
  deleteUser,
  loginUser,
  changePassword,
  userLogout
};
