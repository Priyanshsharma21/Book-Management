import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  isValid,
  validString,
  validateEmail,
  isValidReqBody,
  isValidPhoneNumber,
  isValidPincode,
  isValidPlace,
  isValidISBN,
  isValidPassword
} from '../utils/index.js'


export const register = async (req, res) => {
  try {
    const {
      title,
      name,
      phone,
      email,
      password,
      address
    } = req.body

    const reqData = req.body


    if (!isValidReqBody(reqData)) {
      return res.status(400).json({
        status: false,
        message: "Please enter all the fields"
      })
    }


    if (!name || !phone || !email || !password || !title) return res.status(400).json({
      status: false,
      message: 'Please enter all the mendatory fields'
    });

    console.log(req.body)



    if (!isValid(title) || !isValid(name) || !isValid(email) || !isValid(phone) || !isValid(password)) {
      return res.status(400).json({
        status: false,
        message: "Please Provide All valid Field"
      });
    }

    if (!validString(title) || !validString(name)) {
      return res.status(400).json({
        status: false,
        message: 'Please enter a correct title and name validString error',
      });
    }

    if (!["Mr", "Mrs", "Miss"].includes(title)) {
      return res.status(400).json({
        status: false,
        message: "please use a valid title as Mr,Mrs,Miss"
      });
    }



    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({
        status: false,
        message: 'Please enter a correct Mobile Number isValidPhone Number error',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        status: false,
        message: 'Please enter a correct email validEmail error',
      });
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

    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: false,
        message: 'Password must be 8 char long, combination of upper and lower case and must contain a special symbole.',
      });
    }

    if (address) {

      if (typeof address != "object") {
        return res.status(400).send({
          status: false,
          message: "value of address must be in json format"
        });
      }

      let {
        street,
        city,
        pincode
      } = address

      city = String(city);
      pincode = String(pincode);

      if (!isValid(street) || !isValid(city) || !isValid(pincode)) {
        return res.status(400).json({
          status: false,
          message: "Please Provide All valid street, city, pincode"
        });
      }

      // if (!isValidPlace(street) || !isValidPlace(city) || !isValidPincode(pincode)) {
      //   return res.status(400).send({
      //     status: false,
      //     message: "Please Provide All valid street, city, pincode down"
      //   });
      // }
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

    if (!isValidReqBody(req.body)) {
      return res.status(400).json({
        status: false,
        message: 'Please enter all the fields.',
      });
    }

    if (!isValid(email) || !isValid(password)) {
      return res.status(400).send({
        status: false,
        message: "email must be valid"
      });
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

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return res.status(400).json({
        status: false,
        message: 'Invalid password.',
      });
    }

    const token = jwt.sign({
      userId: user._id.toString()
    }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.setHeader("x-api-key", token);

    res.status(200).json({ status: true, data: { "token": token} });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'An error occurred.',
      error: error.message,
    });
  }
};