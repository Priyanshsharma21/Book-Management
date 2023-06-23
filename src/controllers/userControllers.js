import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  isValidEmail,
  isValidPassword,
} from '../utils/index.js'
import validator from "validator"

export const register = async (req, res) => {
  try {
    let {
      title,
      name,
      phone,
      email,
      password,
      address
    } = req.body

    let reqData = req.body




    if (!name || !phone || !email || !password || !title) return res.status(400).json({
      status: false,
      message: 'Please enter all the mendatory fields'
    });


    if (!validator.isEmail(email) || !isValidEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email"
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: false,
        message: "Invalid password"
      });
    }

    if (password.trim().length < 8 || password.trim().length > 15) { 
      return res.status(400).json({ status: false, message: "Invalid password ." });
    }

    req.body.phone = phone + ""
    phone = phone + ""
    if (!validator.isMobilePhone(phone, 'any')) {
    return  res.status(400).json({ status: false, message: "Invalid mobile number" });
    }
    

    const alreadyUser = await User.findOne({
      $or: [{
        phone: phone
      }, {
        email: email
      }]
    });

    if (alreadyUser) {
      return res.status(400).json({
        status: false,
        message: "Email Or Phone Number already exits"
      });
    }


    const hashPassword = await bcrypt.hash(password, 10);


    const userDetails = {
      ...req.body,
      password: hashPassword
    };


    const data = await User.create(userDetails);

    res.status(201).json({
      status: true,
      data: data
    })

  } catch (error) {

    res.status(500).json({
      status: false,
      error: error.message
    });
  }
}





export const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Please enter email and password.',
      });
    }

    if (!validator.isEmail(email) || !isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    //password validator--------------------------------------------------------------------------------
    if (!isValidPassword(password)) {
      return res.status(400).json({ status: false, message: "Invalid password" });
    }


    // Searching the user in the DB
    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Invalid email or user not found.',
      });
    }

    bcrypt.compare(password, user.password, function (err,passwordMatched){
      if (err || !passwordMatched) {
        return res.status(400).json({ status: false, message: 'Passwords do not match' });
      }

      const token = jwt.sign({
        id: user._id
      }, process.env.JWT_SECRET, {
        expiresIn: '3d',
      });
  
      res.setHeader("x-api-key", token);
  
      res.status(200).json({
        status: true,
        data: {
          "token": token
        }
      });
    });


  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred.',
      error: error.message,
    });
  }
};