📝 Blogshelf - Task Manager App
A React-based Task Manager that allows users to register, log in, manage tasks with automatic expiration, and receive email confirmations. It features route protection, glassmorphic + neumorphic UI, and task-specific user tracking.

🚀 Features
✅ User Registration & Login (with validations)

🔐 Protected Routes using React Router

📧 Email notification on successful registration via EmailJS

🔑 Password Generator (customizable with useRef and useCallback)

📆 Task Management with:

Title, Description, Date

User-specific task storage

Automatic task deletion after 7 days

💡 Responsive UI with modern glassmorphism + neumorphism

📦 State Management using React Context API

🌐 Axios for API communication

✅ Form Handling via React Hook Form

🧰 Tech Stack
Tech	Usage
React	UI Development
React Router DOM	Routing & Route Protection
React Hook Form	Form handling & validation
Axios	API Requests
EmailJS	Email Notifications
Context API	Global Auth State
useRef, useCallback	Hooks for password generator
MockAPI	Fake Backend for tasks/users

🔐 Route Protection
Users can only access AllTasks and TaskForm pages after login. Direct URL access is blocked and redirects to login.

📅 Task Expiration Logic
Each task has a date field. A background check runs on login, and:

If the task is older than 7 days, it's automatically deleted from the database.

📧 Email Integration
EmailJS is used to:

Send confirmation email upon successful registration.

🔑 Password Generator
Users can:

Auto-generate secure passwords

Customize length and include numbers/special characters

Built using useRef, useCallback for optimal performance

🖌️ UI Design
Modern and minimal using:

Glassmorphism for buttons and cards

Neumorphism for inputs and task display areas

Fully responsive for mobile and desktop

🛠️ Getting Started
Prerequisites
Node.js & npm

Clone the repo:
git clone git remote add origin https://github.com/Arnav242005/Blogshelf.git
cd blogshelf-task-manager
npm install

Run the app
npm start
🧪 Testing
Forms are tested with invalid and valid inputs

Email confirmation checked via EmailJS dashboard

Task expiration tested using mock date entries

📬 Connect
Feel free to reach out or raise issues!

Demo:- 