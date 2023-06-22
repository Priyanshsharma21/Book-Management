import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Book from '../models/book.js'
import * as dotenv from 'dotenv'
dotenv.config()
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
  import mongoose from 'mongoose'

  const {isValidObjectId} = mongoose

const { JWT_SECRET } = process.env


export const isLoggesIn = async(req,res,next)=>{
    try {
        const token = req.headers['x-api-key'] || req.headers.authorization.split(" ")[1] || req.headers['auth-token']

        if(!token) return res.status(400).json({status: false, message : "Token Not Found."})

        jwt.verify( token, JWT_SECRET, function ( err , decodedToken ) {
            if (err) {

                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({ status: false, message: "invalid token" });
                }

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ status: false, message: "you are logged out, login again" });
                } else {
                    return res.send({ msg: err.message });
                }
            } else {
                req.token = decodedToken
                next()
            }
        });

    } catch (error) {
        res.status(500).json({status : false, message : error.message, middleware : "Middleware Message"})
    }
}







export const isAuthorized = async ( req , res , next ) => {
    try {
        const loggedUserId = req.token.userId

        if (req.originalUrl === "/books") {
            let userId = req.body.userId
            
            if (!isValid(userId)) {
                return res.status(400).send({ status: false, message: "userId must be in string." });
            }

            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid user id" });
            }

            const userData = await User.findById(userId);

            if (!userData) {
                return res.status(404).send({ status: false, message: "The user id does not exist" });
            }

            if (loggedUserId != userId) {
                return res.status(403).send({ status: false, message: "Not authorized,please provide your own user id for book creation" });
            }

            req.body.userId = userId
        } else {
            let bookId = req.params.bookId

            if (!bookId) {
                return res.status(400).send({ status: false, message: "book id is mandatory" });
            }

            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: "Invalid Book ID" });
            }

            let checkBookId = await Book.findById(bookId);

            if (!checkBookId) {
                return res.status(404).send({ status: false, message: "Data Not found with this book id, Please enter a valid book id" });
            }

            let userId = checkBookId.userId
            
            if (userId != loggedUserId) {
                return res.status(403).send({ status: false, message: "Not authorized,please provide your own book id" });
            }
        }
        next()
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
