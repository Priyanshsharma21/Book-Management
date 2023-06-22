import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from '../src/routes/userRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

const app = express()

// global middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({extended : true}))

// cors middleware
app.use(cors())

// logging middleware
app.use(morgan("tiny"))


// testing route
app.get('/',(req,res)=>{
    res.status(200).json({status : true, message : "ZLIB IS RUNNING LIKE BOLT"})
})


// routing middlewares
app.use('/', userRoutes)
app.use('/', bookRoutes)
app.use('/', reviewRoutes)



export default app