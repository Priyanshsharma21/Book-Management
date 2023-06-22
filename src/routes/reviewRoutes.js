import express from 'express'
import { addReviewToBook,updateReviewOfBook,deleteReviewOfBook } from '../controllers/reviewControllers.js'


const router = express.Router();


router.post('/books/:bookId/review', addReviewToBook)
router.put('/books/:bookId/review/:reviewId', updateReviewOfBook)
router.put('/books/:bookId/review/:reviewId', deleteReviewOfBook)


export default router;
