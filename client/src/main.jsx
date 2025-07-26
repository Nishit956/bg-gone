import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import AppContextProvider from './context/AppContext.jsx'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY || !STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk or Stripe Publishable Key');
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Elements stripe={stripePromise}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Elements>
    </ClerkProvider>
  </BrowserRouter>,
)
