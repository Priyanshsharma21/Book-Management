import express from 'express'
import { createBook, getBookByQuery,getBookById,updateBookById,deleteBookById } from '../controllers/bookControllers.js'
import {isLoggesIn,authorization } from '../middlewares/auth.js'
import AWS from 'aws-sdk'


const router = express.Router();

AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})


router.post('/books',isLoggesIn, createBook)
router.get('/books',isLoggesIn,getBookByQuery)
router.get('/books/:bookId',isLoggesIn, getBookById)
router.put('/books/:bookId',isLoggesIn,authorization, updateBookById)
router.delete('/books/:bookId',isLoggesIn,authorization, deleteBookById)



export default router;
