import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Book from '../models/book.js'
import * as dotenv from 'dotenv'
dotenv.config()
import {
    isValid,
} from '../utils/index.js'
import mongoose from 'mongoose'

const {
    isValidObjectId
} = mongoose

const {
    JWT_SECRET
} = process.env


export const isLoggesIn = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key'] || req.headers.authorization.split(" ")[1] || req.headers['auth-token']

        if (!token) return res.status(400).json({
            status: false,
            message: "Token Not Found."
        })

        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    msg: err.message
                })
            } else {
                req.decodedToken = decodedToken;
                next()
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            middleware: "Middleware Message"
        })
    }
}




export const authorization = async function (req, res, next) {
    try {
        console.log(req.decodedToken);
        const tokenUser = req.decodedToken.id
        const bookId = req.params.bookId
        if (!isValid(bookId)) return res.status(400).json({
            status: false,
            message: "Invalid bookId"
        })
        // isDeleted added and checking fo the key is deleted or not------------------------------------
        const book = await Book.findById(bookId).where('isDeleted').equals(false);
        if (!book) {
            return res.status(404).json({
                status: false,
                message: "No books found with this bookId"
            })
        }
        const userId = book["userId"].toString()
        if (userId != tokenUser) {
            return res.status(403).json({
                message: "You are not authorized"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })

    }
}