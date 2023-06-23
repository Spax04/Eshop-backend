import express from 'express'
import User from '../models/userModel.js'
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils.js'
import { isAuth } from '../utils.js'

const userRouter = express.Router()

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    // Finding user by Email
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      // Comparing passwords in DB and in request
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          // returning user info
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user)
        })
        return
      }
    }

    res.status(401).send({ message: 'Invalid password/user' })
  })
)

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password)
    })
    const user = await newUser.save()

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user)
    })
  })
)

userRouter.put(
  '/update',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

      if (req.body.currentPassword !== '' && req.body.newPassword !== '') {
        if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
          user.password = bcrypt.hashSync(req.body.newPassword)
        } else {
          res.status(404).send({ message: 'Password not correct' })
        }
      }

      const updatedUser = await user.save()

      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser)
      })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  })
)

export default userRouter
