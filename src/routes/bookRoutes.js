import express from 'express'
import { createBook, getBookByQuery,getBookById,updateBookById,deleteBookById } from '../controllers/bookControllers.js'
import {isLoggesIn,isAuthorized } from '../middlewares/auth.js'


const router = express.Router();

router.post('/books',isLoggesIn,isAuthorized, createBook)
router.get('/books',isLoggesIn,getBookByQuery)
router.get('/books/:bookId',isLoggesIn, getBookById)
router.put('/books/:bookId',isLoggesIn,isAuthorized, updateBookById)
router.delete('/books/:bookId',isLoggesIn,isAuthorized, deleteBookById)



export default router;
