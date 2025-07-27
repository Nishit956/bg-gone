// middleware/auth.js
import { verifyToken } from '@clerk/clerk-sdk-node'
import dotenv from 'dotenv'
dotenv.config()

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // ✅ Verify the token using your Clerk secret key
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    // Attach user ID to request for downstream usage
    req.clerkId = payload.sub
    next()
  } catch (error) {
    console.error(' Auth error:', error.message)
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' })
  }
}

export default authUser
