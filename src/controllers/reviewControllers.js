import Review from '../models/review.js'
import Book from '../models/book.js'
import mongoose from 'mongoose'
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
const ObjectId = mongoose.Types.ObjectId;



export const addReviewToBook = async (req, res) => {
    try {
        let data = req.body;
        const bookId = req.params.bookId;
        let {
            review,
            rating,
            reviewedBy
        } = data
        data.bookId = bookId;

        if (!bookId) {
            return res.status(400).send({
                status: false,
                message: "please provide book id."
            });
        }

        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid book id."
            });
        }

        const checkBook = await Book.findOne({
            _id: bookId,
            isDeleted: false
        });

        if (!checkBook) {
            return res.status(404).send({
                status: false,
                message: "Book id does not exist in database."
            });
        }

        if (!rating || (!(rating <= 5 && rating >= 1))) {
            return res.status(400).send({
                status: false,
                message: "please provide rating or rating is invalid. It must be 1 to 5."
            });
        }

        if (!isValid(review)) {
            return res.status(400).send({
                status: false,
                message: "review can't be empty."
            });
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({
                status: false,
                message: "reviewer name is invalid."
            });
        }

        const reviewData = await Review.create(data);

        let result = {
            _id: reviewData._id,
            bookId: reviewData.bookId,
            reviewedBy: reviewData.reviewedBy,
            reviewedAt: reviewData.reviewedAt,
            rating: reviewData.rating,
            review: reviewData.review
        }

        await Book.findOneAndUpdate({
            _id: bookId
        }, {
            $inc: {
                reviews: 1
            }
        });
        return res.status(201).send({
            status: true,
            message: "Success",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}





export const updateReviewOfBook = async (req, res) => {
    try {
        let data = req.params;
        let {
            bookId,
            reviewId
        } = data;

        let body = req.body;
        let {
            reviewedBy,
            review,
            rating
        } = body;

        if (!isValidReqBody(data)) {
            return res.status(400).send({
                status: false,
                message: "Please give Field for Update"
            });
        }

        if (!ObjectId.isValid(bookId) || !ObjectId.isValid(reviewId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid Book ID OR Invalid Review ID"
            });
        }

        let checkExits = await Book.findOne({
            _id: bookId,
            isDeleted: false
        })

        if (!checkExits) {
            return res.status(404).send({
                status: false,
                message: "This book ID is not exist or might be deleted."
            });
        }

        let checkReview = await Review.findOne({
            _id: reviewId,
            isDeleted: false
        })

        if (!checkReview) {
            return res.status(404).send({
                status: false,
                message: "This Review ID is not exist or might be deleted."
            });
        }

        checkBookId = checkReview.bookId

        if (checkBookId != bookId) {
            return res.status(400).send({
                status: false,
                message: "Book ID not relevant to Review Id."
            });
        }

        if (!reviewedBy && !review && !rating) {
            return res.status(400).send({
                status: false,
                message: "At least one field is required."
            });
        }

        let updateData = {};

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({
                    status: false,
                    message: "reviewedBy is not valid."
                });
            }

            updateData.reviewedBy = reviewedBy;
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({
                    status: false,
                    message: "review is not valid"
                });
            }
            updateData.review = review;
        }

        if (rating) {

            if (!rating || (!(rating <= 5 && rating >= 1))) {
                return res.status(400).send({
                    status: false,
                    message: "rating is invalid. It must be 1 to 5."
                });
            }

            updateData.rating = rating
        }

        updateData.reviewedAt = Date.now();

        let updateReview = await Review.findOneAndUpdate({
                _id: reviewId,
                isDeleted: false
            },
            updateData, {
                new: true
            }
        ).select({
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            isDeleted: 0
        });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: updateReview
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}







export const deleteReviewOfBook = async (req, res) => {
    try {
        let data = req.params;
        let {
            bookId,
            reviewId
        } = data;

        if (!ObjectId.isValid(bookId) || !ObjectId.isValid(reviewId)) {
            return res.status(400).send({
                status: false,
                message: "Invalid Book ID or Invalid Review ID"
            });
        }

        let checkBookId = await Book.findOne({
            _id: bookId,
            isDeleted: false
        });

        if (!checkBookId) {
            return res.status(404).send({
                status: false,
                message: "This book ID is not exist or might be deleted."
            });
        }

        let checkReview = await Review.findOne({
            _id: reviewId,
            isDeleted: false
        });

        if (!checkReview) {
            return res.status(404).send({
                status: false,
                message: "This Review ID is not exist or might be deleted."
            });
        }

        checkCompare = checkReview.bookId;

        if (checkCompare != bookId) {
            return res.status(400).send({
                status: false,
                message: "Book ID not relevant to Review Id."
            });
        }

        await Review.findOneAndUpdate({
            _id: reviewId,
            isDeleted: false
        }, {
            isDeleted: true
        });

        await Book.findOneAndUpdate({
            _id: bookId
        }, {
            $inc: {
                reviews: -1
            }
        }, );

        return res.status(200).send({
            status: true,
            message: "Successfully Deleted."
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}