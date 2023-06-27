import app from './app.js'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const { MONGODB_URL,PORT } = process.env


const startServer = async()=>{
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to DB')
        app.listen(PORT, ()=>{
            console.log(`Running Up The Hill At ${PORT}km/hr`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()