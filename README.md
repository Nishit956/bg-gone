# BG-Gone – Remove Backgrounds in 1 Click

BG-Gone is a background removal web application that allows users to upload an image and instantly remove its background using AI. It features authentication, credit-based usage, and a smooth user experience.


##  Live Demo

🌐 [Try BG-Gone Live](https://bg-gone.onrender.com)


---

##  Features

- User Authentication with Clerk
- AI-powered Background Removal (via ClipDrop API)
- Credit System (users can purchase more credits via Stripe)
- Stripe Payment Integration (Test Mode)
- Image Upload & Preview
- Fast frontend with Vite + React
- Deployed on Render (Frontend + Backend)

---

##  Tech Stack

| Layer        | Tech Used                        |
|--------------|----------------------------------|
| **Frontend** | React (Vite), Tailwind CSS       |
| **Auth**     | Clerk.dev                        |
| **Backend**  | Node.js, Express.js              |
| **AI API**   | ClipDrop Background Removal API  |
| **Database** | MongoDB Atlas                    |
| **Payments** | Stripe (test mode)               |
| **Hosting**  | Render.com                       |


---

##  Auth & Payments

- Uses **Clerk** for login/signup.
- New users get **free credits**.
- **Stripe** lets users buy more credits via test cards.

---

##  Test Stripe Payments

Use this test card to simulate purchases:

- Card: 4242 4242 4242 4242
- Exp: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits