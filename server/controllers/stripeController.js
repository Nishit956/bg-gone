import Stripe from 'stripe'
import userModel from '../models/userModel.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req, res) => {
  const { id, price, credits } = req.body
  const userId = req.clerkId  // ✅ Retrieved from auth middleware

  console.log("✅ Clerk ID in controller:", userId)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${id} Plan`,
              description: `${credits} credits`,
            },
            unit_amount: price * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/?payment=cancelled`,
      metadata: {
        userId,                      // Clerk ID for tracking
        credits: credits.toString() // Store credits as string
      },
    })

    res.json({ id: session.id })
  } catch (err) {
    console.error('❌ Stripe session creation failed:', err.message)
    res.status(500).json({ success: false, message: 'Stripe session creation failed' })
  }
}
