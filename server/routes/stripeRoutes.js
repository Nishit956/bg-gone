import express from 'express'
import Stripe from 'stripe'
import authUser from '../middlewares/auth.js'
import bodyParser from 'body-parser'
import userModel from '../models/userModel.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ✅ Create Stripe Checkout Session (Protected by Clerk Auth)
router.post('/create-checkout-session', authUser, async (req, res) => {
  const { id, price, credits } = req.body
  const userId = req.clerkId  // 👈 Set by the authUser middleware

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${id} Plan`,
              description: `${credits} credits`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/?payment=cancelled`,
      metadata: {
        userId, // Clerk ID stored here
        credits: credits.toString(),
      },
    })

    res.json({ id: session.id })
  } catch (err) {
    console.error('❌ Stripe session error:', err)
    res.status(500).json({ error: 'Stripe session creation failed' })
  }
})

// ✅ Stripe Webhook for Post-payment Actions
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId
    const creditsToAdd = parseInt(session.metadata.credits, 10)

    try {
      const user = await userModel.findOneAndUpdate(
        { clerkId: userId },
        { $inc: { creditBalance: creditsToAdd } },
        { new: true }
      )

      if (!user) {
        console.warn(`❌ No user found with clerkId: ${userId}`)
        return res.status(404).send('User not found')
      }
      
      res.status(200).json({ received: true })
    } catch (err) {
      console.error('❌ Error updating user credits:', err)
      res.status(500).send('Internal server error')
    }
  } else {
    // Acknowledge all other events
    res.status(200).json({ received: true })
  }
})

export default router
