import mongoose from 'mongoose'
import validator from 'validator'
const { Schema, model } = mongoose


const userSchema = new Schema({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
      },
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
              validator: validator.isEmail,
              message: 'Please enter a valid email address'
            }
        ]
      },
      password: {
        type: String,
        required: true,
        // minlength: 8,
        // maxlength: 15
      },
      address: {
        street: {
          type: String
        },
        city: {
          type: String
        },
        pincode: {
          type: String
        }
    },
}, { timestamps: true })


const User = model('User', userSchema)

export default User