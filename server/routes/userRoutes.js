import express from 'express'
import { clerkWebhooks, userCredits } from '../controllers/UserController.js'
import authUser from '../middlewares/auth.js'
import { createCheckoutSession } from '../controllers/stripeController.js'

const userRouter = express.Router()

userRouter.post('/webhooks',clerkWebhooks)
userRouter.get('/credits',authUser,userCredits)
userRouter.post('/create-payment-intent', authUser, createCheckoutSession);

export default userRouter