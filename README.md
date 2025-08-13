# Ghost Message

**Ghost Message** is a secure, anonymous messaging platform that allows users to send and receive any type of messages without revealing their identity. It offers a clean, modern UI, AI-powered message suggestions, and a smooth authentication flow — all built using a **full-stack Next.js** approach.

---

## 🚀 Live Demo

[Visit Ghost Message](https://ghost-message-eta.vercel.app)

---

## 📌 Features

- **🔐 Secure User Authentication** (Sign Up, Login) with secure password hashing.
- **📩 Send & Receive Anonymous Messages** without revealing identity.
- **🟢 Status Control** to control privacy.
- **🤖 AI-Suggested Messages** using Google Gemini AI API.
- **🗑️ Message Management** – Delete unwanted messages instantly.
- **📧 Email Verification with OTP** to ensure account security.
- **📱 Responsive UI** for seamless use on any device.

---

## 📚 What I Learned

I built this project to **explore how Next.js works in a full-stack environment**.  
Previously, I had only used Next.js for frontend purposes, but with Ghost Message, I was able to:

- Implement **full MERN stack** concepts directly inside Next.js.
- Use **MongoDB** for the first time to store and retrieve user data securely.
- Learn and apply **Zod** for robust form validation.
- Work with **Shadcn UI** for building clean, reusable components.
- Integrate **AI-powered message suggestions** with the Gemini AI API.
- Configure secure authentication with **NextAuth.js**.

---

## ⚙️ How It Works (Simplified)

1. **User Authentication**

   - Users can sign up or log in via secure authentication.
   - Email verification is implemented to ensure valid accounts.

2. **Profile & Status**

   - Each user has a unique public link (e.g., `/ask/username`) to receive anonymous messages.
   - Users can toggle "Accepting Messages" status.

3. **Anonymous Messaging**

   - Anyone with the profile link can send a message.
   - Sender’s identity is not stored.

4. **Message Management**
   - Messages are stored in a secure database.
   - Users can view and delete them anytime.

---

## 🛠 Tech Stack

**Frontend:**

- Next.js (App Router)
- React
- Tailwind CSS
- Shadcn UI
- TypeScript

**Backend:**

- Node.js (via Next.js API Routes)
- MongoDB with Mongoose
- NextAuth.js for authentication

- **AI Integration:**
- Google Gemini AI API for AI-powered message suggestions

**Other Tools & Libraries**

- Zod (validation)
- bcrypt.js (password hashing)
- nodemailer (email verification)
- React Hook Form (form handling)

**Deployment:**

- Vercel (frontend + backend) with MongoDB Atlas

---

## 📂 Folder Structure

```
ghost-message/
├── app/
│   ├── (app)/
│   │   ├── ask/
│   │   └── dashboard/
│   ├── (auth)/
│   │   ├── signin/
│   │   └── signup/
│   ├── api/
│   │   ├── messages/
│   │   ├── accept-messages/
│   │   ├── send-messages/
│   │   ├── get-messages/
│   │   ├── delete-messages/
│   │   ├── auth/
│   │   ├── ai-suggestions/
│   │   └── signup/
│   ├── components/
│   └── layout.tsx
```

---

## 📸 Screenshots

Here are some screenshots of the application:

### Home Page

![Home Page](/public/ghost_message_home.png)

### Home Page (Enter username of reciever)

![Home Page (Enter username of reciever)](/public/ghost_message_enter_username.png)

### Ask (to another user)

![Ask (to another user)](/public/ghost_message_ask.png)

### Dashboard

![Dashboard](/public/ghost_message_dashboard.png)

### Sign Up

![Sign Up](/public/ghost_message_signup.png)

### Sign In

![Sign In](/public/ghost_message_signin.png)

---

## 🌟 Extended Features & Highlights

- **Real-Time Messaging Flow** – Instant message delivery using serverless Next.js API routes.
- **Full-Stack in One Framework** – Combines Node.js backend capabilities and React frontend in Next.js for a seamless development experience.
- **User-Friendly Interface** – Minimal learning curve for end users.
- **Performance Optimized** – Leveraging Vercel's edge network for faster response times.
- **Scalable Architecture** – Built with clean separation of concerns for future scalability.
- **AI-Assisted Writing** – Gemini AI API enhances creativity by suggesting message ideas.
- **Data Privacy First** – Implements server-side logic to ensure no sensitive information is exposed.

---

## 📦 Installation & Setup (Local Development)

1. Clone the repository:

```bash
git clone https://github.com/thebeliever1812/ghost-message.git
```

2. Navigate to the project folder

```bash
cd ghost-message
```

3. Install dependencies

```bash
npm install
```

3. Create a .env file with necessary environment variable

```bash
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_16_digit_email_passcode
NEXTAUTH_SECRET=your_secret_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

4. Run the development server

```bash
npm run dev
```

---

## 📈 Future Improvements

- Implement **real-time notifications** when new messages arrive.
- Add **theme customization** (dark/light modes).
- Improve AI suggestions with **context awareness**.
- Search user with their **name**

---

## 👤 Author

**Basir Ahmad**

Feel free to reach out:

- **Email**: basirahmadmalik@gmail.com
- **LinkedIn**: [Click to open Linkedin](https://www.linkedin.com/in/basir-ahmad-1a5851210)
- **GitHub**: [Click to open Github](https://github.com/thebeliever1812)
