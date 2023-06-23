import mongoose from 'mongoose'
const { Schema, model } = mongoose


const reviewSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  },
  reviewedBy: {
    type: String,
    required: true,
    default: 'Guest',
    value: {
      type : String,
      required: true,
    }
  },
  reviewedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const Review = model('Review', reviewSchema);

export default Review
