import express from 'express'
import data from './data.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json()) // pars request to JSON
app.use(express.urlencoded({ extended: true })) // pars encoded request to JSON

// endpoints
app.use('/api/v1/users', userRouter)
app.use('/api/v1/seed', seedRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders',orderRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})


// Connection to mongoDb and running server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Faild to connect to MongoDB ' + error.message)
  })
