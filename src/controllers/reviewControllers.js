import Review from '../models/review.js'
import Book from '../models/book.js'
import {
    isValid 
} from '../utils/index.js'
import validator from "validator";
import moment from "moment";





export const addReviewToBook = async (req, res) => {
    try {
        const {bookId} = req.params

        if (!bookId)
            return res
                .status(400)
                .json({
                    status: false,
                    message: "bookId is required"
            })

        if (!isValid(bookId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid bookID, please enter a valid ID",
            });
        }


        let findbook = await Book.findById(bookId)

        if (!findbook) {
            return res.status(400).json({
                status: false,
                message: "Book not found"
            });
        }
        if (findbook.isDeleted) {
            return res.status(400).json({
                status: false,
                message: "Book not found"
            });
        }

        const {
            reviewedBy,
            reviewedAt,
            rating,
            value
        } = req.body;
        let data = req.body;
        data.isDeleted = false

        if (!rating || rating <= 0 || rating >= 6) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "invalid rating "
                });
        }
        if (reviewedBy) {
            if (reviewedBy.trim() === "") {
                delete data.reviewedBy;
            }

        }
        data.bookId = bookId;

        //updating reviews key count in book-----------------------------------------------------------------------

        let updateReview = await Book.findByIdAndUpdate(
            bookId, {
                $inc: {
                    reviews: 1
                }
            }, {
                new: true
            }
        );
        // new true was not working because it was set inside $inc block now its working

        data.reviewedAt = moment().format("YYYY-MM-DD  HH:mm:ss");
        const reviewss = await Review.create(data);
        let finalData = {
            book: updateReview,
            reviewsData: reviewss
        }

        res.status(201).json({
            status: true,
            message: "success",
            data: finalData
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}





export const updateReviewOfBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        //validating bookid and review id-----------------------------------------------------------------------
        if (!isValid(bookId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "book id is invalid"
                });
        }
        if (!isValid(reviewId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "review id is invalid"
                });
        }

        //checking existence of bookId and review Id----------------------------------------------
        let bookdata = await Book.findById(bookId)
            .where("isDeleted")
            .equals(false)


        if (!bookdata)
            return res
                .status(404)
                .json({
                    staus: false,
                    message: "This book does not exists"
                });
        // console.log(reviewId);
        let reviewsData = await Review.findById(reviewId).where('isDeleted').equals(false);


        if (!reviewsData) {
            return res
                .status(404)
                .json({
                    staus: false,
                    message: "This reviewId does not found"
                });
        }

        //checking whether this book has reviewId or not-----------------------------------------------------
        if (bookdata._id.toString() !== reviewsData.bookId.toString())
            return res
                .status(404)
                .json({
                    staus: false,
                    message: "no reviewId found for this bookId"
                });
        //if this review Id is present in this book------------------------------------------------------
        let data = req.body;
        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .json({
                    staus: false,
                    message: "put json some data to update"
                });

        let object = {};
        //checking rating key and rating should be 1-5----------------------------------------------------------------------
        if (data.rating) {
            if (typeof data.rating !== "number")
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "rating should be Number"
                    });
            if (!(data.rating >= 0 && data.rating < 6)) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "rating should be from 1 to 5"
                    });
            }
            object.rating = data.rating;
        }
        //checking reviewBy key and also checking that it should have alphabets only--------------------
        if (data.reviewedBy) {
            if (!validator.isAlpha(data.reviewedBy, "en-US", {
                    ignore: " "
                }))
                return res.status(400).json({
                    status: false,
                    message: "It accepts only alphabets and there should not be any special characters numbers and spaces",
                });
            data.reviewedBy = data.reviewedBy.trim();
            object.reviewedBy = data.reviewedBy;
        }
        //checking review--------------------------------------
        if (data.review) {
            if (data.review) {
                if (!data.review.trim() == "") {
                    object.review = data.review;
                }
            }
        }
        if (Object.keys(object).length == 0)
            return res
                .status(500)
                .json({
                    status: false,
                    message: "please provide something to update"
                });

        let update = await Review.findByIdAndUpdate(reviewId, object, {
            new: true,
        });
        bookdata.reviewsData = update

        return res
            .status(200)
            .json({
                status: true,
                message: "success",
                data: bookdata
            });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}






export const deleteReviewOfBook = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        //validating bookId and review Id----------------------------------------------------
        if (!isValid(bookId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "book id is invalid"
                });
        }
        if (!isValid(reviewId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "review id is invalid"
                });
        }

        //checking the existence of bookId and review Id-----------------------------------
        const book = await Book.findById(bookId)
            .where("isDeleted")
            .equals(false);
        if (!book) {
            return res
                .status(404)
                .json({
                    status: false,
                    message: "book id not found"
                });
        }
        const review = await Review.findById(reviewId)
            .where("isDeleted")
            .equals(false);
        if (!review) {
            return res
                .status(404)
                .json({
                    status: false,
                    message: "review id not found"
                });
        }

        //finally deleting the review  ------------------------------------------------------

        const deleteReview = await Review.findByIdAndUpdate(
            reviewId, {
                isDeleted: true
            }, {
                new: true
            }
        );
        let update = await Book.findByIdAndUpdate(
            bookId, {
                $inc: {
                    reviews: -1
                }
            }, {
                new: true
            }
        );

        return res.status(200).json({
            status: true,
            message: "deleted successfully"
        });

        //updating the review count --------------------------------------

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}