import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imagRoutes.js'
import stripeRoutes from './routes/stripeRoutes.js'
import webhookRoute from './routes/webhook.js'

// App Config
const PORT = process.env.PORT || 4000 
const app = express()
await connectDB()

app.use('/api/webhook', webhookRoute)

//Intialize Middlewares
app.use(express.json())
app.use(cors())

// API routes
app.get('/',(req,res)=> res.send("API Working"))

app.get('/ping', (req, res) => {
    res.status(200).send("OK");
});

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.use('/api',stripeRoutes)

app.listen(PORT, ()=> console.log("Server running on port "+PORT))