## 🛠️ How to Set Up the Project

### Set Up the Backend

```bash
npm install
```

Create a `.env` file in the directory with the following contents:

```env
PORT=3001

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password

# JWT secret for signing tokens
JWT_SECRET=your_super_secret_jwt_key
```

SQL table backups are in tables folder.

```bash
npm run start
```

## 🎯 Task: **Voting System API**

You are to build a simple RESTful API for a voting system where users can vote on different topics.

### 🗳️ Entities

**1. Topics**

+ `id` (string, UUID)
+ `title` (string, required, min 3 characters)
+ `description` (string, optional, max 500 characters)
+ `options` (array of strings, at least 2, max 5)
+ `votes` (object `{ optionName: number }` initialized to 0 per option)

// misunderstood votes section,
// essentially I dont save 0 per option in DB, only votes that been cast. 

---

## 📦 Endpoints

+ ### `GET /topics`

+ Return all topics.
+ Optional filters:

  + `?search=term` — search by title or description
  + `?limit=10&offset=0` — pagination

---

+ ### `GET /topics/:id`

+ Return a topic by ID with its vote counts.
+ Return 404 if not found.

---

### `POST /topics`

+ Create a new topic.
+ Validate:

  + `title`: required, min 3 characters
  + `description`: optional, max 500
  + `options`: array, min 2, max 5 unique strings

---

// In my case need to make an entry in votes table, who made, and what amount and what option.

+ ### `POST /topics/:id/vote`

+ Cast a vote for an option in a topic.
+ Body: `{ option: "Option A" }` 

// with how my DB is set up 
`{ "option_label": "Option A", "vote_amount": 5}`

+ Validate that the option exists.
* Increment vote count. // A bit different see all votes in getAllVotes 
* Return updated vote result.

---

+ ### `DELETE /topics/:id`

+ Delete a topic.
+ Return success message or 404.

---

## ✅ Requirements

### Validation (`express-validator`)

+ All fields must be validated and sanitized.
* Vote must be cast only for valid options.

+ ### Data Storage 
+ Store data in a PostgreSQL database.
---

+ ### Error Handling

* 400 for validation errors
* 404 for not found
* 500 for unexpected errors

---

+ ## 🧪 Example Request

```bash
# Create a topic
curl -X POST http://localhost:3000/topics \
-H "Content-Type: application/json" \
-d '{
  "title": "Best Programming Language?",
  "description": "Vote for your favorite language!",
  "options": ["JavaScript", "Python", "Rust"]
}'
```

---

+ ## 💡 Extensions

+ Add an endpoint to reset vote counts.
+ Track total votes cast. (Added in getAllTopics endpoint)
+ Add a basic authentication middleware.


---
