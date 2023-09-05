# Quizly

A MERN stack quiz application built with node.js, express.js, mongodb, react.js, redux & bootstrap


## Features

### User:
1. Get list of available quizzes
2. Attempt a quiz and get to see rules
3. Start the quiz and answer questions
4. Submit quiz and get the results like questions answered and points gained
5. Checkout Leaderboard page to see how others are performing

### Admin:
1. Can create a new quiz
2. Can update exisiting quiz by id
3. Can delete the quiz

## Installation

```
git clone https://github.com/Kshankeshi/IS-5600-Lab-08
cd quizly
npm install

cd client
npm install
```

Add `.env` file at the root folder
```
DATABASE_CONNECTION_STRING=mongodb connection string
DATABASE_NAME=database name
TOKEN_SECRET=jwt scret
```

```
// RUN express and react servers
npm run server // Start the express server
npm run client // Start react dev server
```

## Models
1. User
2. Quiz
3. Leaderboard


## APIs

1. Auth
    1. POST /api/v1/auth/register
    2. POST /api/v1/auth/login
2. User
    1. GET /api/v1/user/:id
    2. POST /api/v1/user/quiz/:id
3. Quiz
    1. GET /api/v1/quiz
    2. GET /api/v1/quiz/:id
    3. POST /api/v1/quiz
    4. PUT /api/v1/quiz/:id
    5. DELETE /api/v1/quiz/:id
4. Leaderboard
    1. GET /api/v1/leaderboard
    2. POST /api/v1/leaderboard
