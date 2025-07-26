// routes/webhook.js
import express from 'express'
import Stripe from 'stripe'
import userModel from '../models/userModel.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Stripe requires raw body for webhooks
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('🔔 Webhook received event:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      // ✅ Use metadata from Stripe session to get user info
      const userId = session.metadata.userId
      const creditsToAdd = parseInt(session.metadata.credits)

      if (!userId || isNaN(creditsToAdd)) {
         console.error('❌ Missing metadata:', session.metadata)
        return res.status(400).send('Missing metadata: userId or credits')
      }

      console.log('🔍 Looking for user with clerkId:', userId)
      // ✅ Find user by Clerk ID (stored in metadata)
      const user = await userModel.findOne({ clerkId: userId })
      if (!user) return res.status(404).send('User not found')

      // ✅ Add credits to user's creditBalance
      user.creditBalance += creditsToAdd
      await user.save()

          console.log(`✅ Added ${creditsToAdd} credits to user: ${userId}`)

      return res.status(200).json({ message: 'Credits added successfully' })
    } catch (err) {
      console.error('Error updating credits:', err)
      return res.status(500).send('Internal server error')
    }
  }

  res.status(200).json({ received: true })
})

export default router
