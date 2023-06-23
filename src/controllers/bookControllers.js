import Book from '../models/book.js'
import Review from '../models/review.js'
import {
    checkISBN,
    isValid
} from '../utils/index.js'
import moment from 'moment'
import validator from "validator"
import {
    isValidObjectId
} from "mongoose"


export const createBook = async (req, res) => {
    try {
        const {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            
            releasedAt
        } = req.body;

        if (!title || !excerpt || !userId || !category || !subcategory || !ISBN) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "fill all the required fields"
                });
        }
        if (!isValid(userId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "user Id invalid"
                });
        }
        if (!isValidObjectId(userId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    messsage: "please provide valid user Id"
                });
        }
        if (!validator.isDate(releasedAt, {
                format: 'YYYY-MM-DD'
            })) {
            return res.status(400).json({
                status: false,
                message: "wrong date format"
            });
        }

        const bookData = req.body;
        bookData.isDeleted = false;
        // when book is created then it will be released-----------------------------------------
        if (!releasedAt) {
            bookData.releasedAt = moment().format("YYYY-MM-DD");
        }

        const checkbook = await Book.findOne({
            $or: [{
                title: title
            }, {
                ISBN: ISBN
            }],
        });
        if (checkbook) {
            return res
                .status(400)
                .json({
                    status: false,
                    messsage: "book already exists"
                });
        }
        const data = await Book.create(bookData);
        res.status(201).json({
            status: true,
            data: data
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}



export const getBookByQuery = async (req, res) => {
    try {
        const {
            userId,
            category,
            subcategory
        } = req.query;

        let qry = {
            isDeleted: false
        };
        if (userId) {
            if (!isValid(userId)) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "user Id invalid"
                    });
            }
            if (!isValidObjectId(userId)) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        messsage: "please provide valid user Id"
                    });
            }
            qry.userId = userId;
        }
        if (category) {
            qry.category = category;
        }
        if (subcategory) {
            qry.subcategory = subcategory;
        }

        const data = await Book.find(qry)
            .select({
                _id: 1,
                title: 1,
                excerpt: 1,
                userId: 1,
                category: 1,
                releasedAt: 1,
                reviews: 1,
            })
            .sort({
                title: 1
            });


        if (data.length === 0) {
            return res.status(404).json({
                status: false,
                message: "no such books"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Books list",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}




export const getBookById = async (req, res) => {
    try {

        let {bookId} = req.params

        if (!isValid(bookId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid bookID, please enter a valid ID",
            });
        }

        let book = await Book.findOne({
            _id: bookId,
            isDeleted: false
        });
        if (!book) {
            return res
                .status(404)
                .json({
                    status: false,
                    message: "Book does not exist with this ID"
                });
        }

        let review = await Review.find({
            bookId: bookId,
            isDeleted: false
        })


        let finalData = {
            _id: book._id,
            title: book.title,
            excerpt: book.excerpt,
            userId: book.userId,
            ISBN: book.ISBN,
            category: book.category,
            subcategory: book.subcategory,
            reviews: book.reviews,
            isDeleted: book.isDeleted,
            releasedAt: book.releasedAt,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
            reviewsData: review,
        }


        return res.status(200).json({
            status: true,
            message: 'Books list',
            data: finalData
        })


    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
}



export const updateBookById = async (req, res) => {
    try {
        let {bookId} = req.params

        if (!isValid(bookId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid bookID, please enter a valid ID",
            });
        }
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: "provide data in body to update"
                });
        }

        let obj = {}

        //checking types of  all the feilds------------------------------------------------------------
        if (data.title) {
            if (typeof data.title != "string") {
                return res
                    .status(400)
                    .json({
                        message: "please Enter title in a string format"
                    });
            }

            data.title = data.title.trim()

            if (validator.isNumeric(data.title))
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "Book title cannot be numbers only"
                    });
        }

        if (data.excerpt) {
            if (typeof data.excerpt !== "string") {
                return res
                    .status(400)
                    .json({
                        message: "please Enter data.excerpt in a string format"
                    });
            }
            data.excerpt = data.excerpt.trim();
            if (data.excerpt != "") obj.excerpt = data.excerpt
        }

        if (data.ISBN) {
            data.ISBN = data.ISBN.trim();
            if (typeof data.ISBN != "string") {
                return res
                    .status(400)
                    .json({
                        message: "please Enter ISBN in a string format"
                    });
            }

            console.log(data.ISBN)
            if (!checkISBN(data.ISBN)) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: `ISBN is Not valid.`
                    });
            }
        }
        // relleasedAt key-------------------------------------------------------------------
        if (data.releasedAt) {
            if (moment(data.releasedAt).format("YYYY-MM-DD") != data.releasedAt)
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "Enter date in YYYY-MM-DD"
                    });
            obj.releasedAt = data.releasedAt;
        }

        // title and ISBN is alreday present or not--------------------------------------------
        if (data.title) {
            let booksData = await Book.findOne({
                title: data.title
            });
            if (booksData) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "Book with this title already exists"
                    });
            }

            obj.title = data.title;
        }

        if (data.ISBN) {
            let ISBNdata = await Book.findOne({
                ISBN: data.ISBN
            });
            if (ISBNdata) {
                return res
                    .status(400)
                    .json({
                        status: false,
                        message: "Book with this ISBN already exists"
                    });
            }
            obj.ISBN = data.ISBN;
        }
        // to check in the end user has passed something or not  after ignoring spaces------------
        if (Object.keys(obj).length == 0)
            return res
                .status(400)
                .json({
                    status: false,
                    message: "please provide something to update"
                });

        let update = await Book.findOneAndUpdate({
                _id: bookId,
                isDeleted: false
            },
            obj, {
                new: true
            }
        );

        return res.status(200).json({
            status: true,
            message: 'Success',
            data: update
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}






export const deleteBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).json({
                status: false,
                error: 'bookId is required'
            });
        };
        if (!isValid(bookId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid bookID, please enter a valid ID",
            });
        }

        let deletedbybookid = await Book.findOneAndUpdate({
            _id: bookId,
            isDeleted: false
        }, {
            isDeleted: true,
            DeletedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        if (!deletedbybookid)
            return res
                .status(404)
                .json({
                    status: false,
                    message: "no book document found"
                });

        return res
            .status(200)
            .json({
                status: true,
                message: "Deleted successfully"
            });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}