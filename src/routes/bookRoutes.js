import express from 'express'
import { createBook, getBookByQuery,getBookById,updateBookById,deleteBookById } from '../controllers/bookControllers.js'
import {isLoggesIn,authorization } from '../middlewares/auth.js'


const router = express.Router();

router.post('/books',isLoggesIn, createBook)
router.get('/books',isLoggesIn,getBookByQuery)
router.get('/books/:bookId',isLoggesIn, getBookById)
router.put('/books/:bookId',isLoggesIn,authorization, updateBookById)
router.delete('/books/:bookId',isLoggesIn,authorization, deleteBookById)



export default router;
