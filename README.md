

# AI Study Guide

An interactive AI-powered study assistant built with React, Node.js, Express, and Google Gemini.

The application allows users to enter a study topic or study material and generate either:

- Flashcards
- Multiple-choice quizzes

The generated content is returned as structured JSON from the backend and rendered interactively in the React frontend.

---

## Features

- Generate AI-powered flashcards
- Generate multiple-choice quizzes
- Interactive flashcard navigation
- Interactive quiz with answer selection
- Score card after completing a quiz
- Retry only the questions answered incorrectly
- Light/Dark theme toggle
- Loading state while generating content
- Error handling for failed API requests
- Backend proxy to keep the Gemini API key private
- Structured JSON response validation

---

## Tech Stack

### Frontend

- React
- JavaScript
- CSS
- Vite
- React Icons
- React Loader Spinner

### Backend

- Node.js
- Express.js
- Google Gemini API
- CORS
- dotenv

---

## Project Structure

```text
flam-frontend-assignment/
│
├── src/
│   ├── components/
│   │   ├── flashcards.jsx
│   │   ├── ErrorContainer.jsx
│   │   └── quiz.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── server/
│   └── index.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
