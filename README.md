# Rhythora Dance Academy – Dance School Management System

React (Material UI) frontend · Node/Express backend · MongoDB database

```
rhythora-dance-school/
├── backend/            Express API + MongoDB (Mongoose)
│   ├── server.js       starts the server, serves the built frontend in production
│   ├── models/         User, Department, ClassBatch, Appointment, Contact
│   ├── routes/         auth, catalog (departments/classes), appointments, contacts
│   ├── middleware/     JWT login protection + role checks
│   ├── seedData.js     departments, classes, admin + demo instructor (auto-loaded on first start)
│   └── .env.example    copy to .env
├── frontend/           React + Vite + Material UI (your Rhythora design)
└── package.json        helper scripts (install-all, build, start)
```

## What is connected to the database

| Page / feature | What it does | API |
|---|---|---|
| Departments, Classes & Timetable | loaded live from MongoDB | `GET /api/departments`, `GET /api/classes` |
| Sign Up | creates a Student (password stored hashed) | `POST /api/auth/register` |
| Login (Student / Instructor / Admin) | returns a login token (JWT) | `POST /api/auth/login`, `GET /api/auth/me` |
| Book Appointment | saves the request | `POST /api/appointments` |
| Contact Us | saves the enquiry | `POST /api/contacts` |
| Dashboard (after login) | Student: own appointments · Instructor: own classes · Admin: all appointments (change status) + enquiries | `/api/appointments`, `/api/contacts` |

**Demo logins** (created automatically on first start):

| Role | Email | Password |
|---|---|---|
| Admin | admin@rhythora.dance | Admin@123 |
| Instructor | priya@rhythora.dance | Instructor@123 |
| Student | create one on the Sign Up page | – |

Change the admin password with `ADMIN_PASSWORD` in `backend/.env` **before the first start**.

---

## Part 1 – Run it on your computer

You need: **Node.js 18+ (LTS)** from nodejs.org, and **VS Code**.

### 1. Get a MongoDB database (choose one)

**Option A – MongoDB Atlas (free cloud, recommended – you need this for deployment anyway)**
1. Sign up at https://www.mongodb.com/cloud/atlas and create a free **M0** cluster.
2. *Database Access* → Add Database User → username + password (remember them).
3. *Network Access* → Add IP Address → **Allow access from anywhere (0.0.0.0/0)**.
4. *Database* → Connect → Drivers → copy the connection string, e.g.
   `mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/rhythora?retryWrites=true&w=majority`
   (put `/rhythora` before the `?` so the database is named rhythora; if your password has symbols like `@` or `#`, URL-encode them.)

**Option B – MongoDB installed locally**: install MongoDB Community Server and use `mongodb://127.0.0.1:27017/rhythora`.

### 2. Configure the backend
```bash
cd backend
cp .env.example .env        # Windows: copy .env.example .env
```
Open `backend/.env` and set `MONGODB_URI` (from step 1) and `JWT_SECRET` (any long random text).

### 3. Install everything
From the project root:
```bash
npm run install-all
```

### 4. Start (two terminals in VS Code)
Terminal 1 – backend:
```bash
npm run dev:backend
```
You should see `MongoDB connected…` and `Rhythora server running on http://localhost:5000`.

Terminal 2 – frontend:
```bash
npm run dev:frontend
```
Open **http://localhost:5173**. (Vite forwards `/api` calls to the backend automatically.)

> "Live Server" in VS Code only serves plain HTML files, so it will not work for a React app. `npm run dev:frontend` is the live-reloading dev server for React.

### 5. Try it
Sign up → log in → Book Appointment → log in as admin and see it in the Dashboard. You can also see the data in Atlas under *Browse Collections*.

### Test the production build locally (single server)
```bash
npm run build
npm start
```
Open **http://localhost:5000** – the backend now serves the React app too, exactly like the deployed version.

---

## Part 2 – Get a public URL to submit (deploy free)

The backend serves the built frontend, so **one deployed service = one URL** for the whole project.

1. **Push the project to GitHub** (create a repo, then in the project root):
   ```bash
   git init
   git add .
   git commit -m "Rhythora dance school"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
   (`.env` is git-ignored, so your secrets are not uploaded.)

2. **Create the service on Render** (https://render.com, free account) → *New* → *Web Service* → connect the GitHub repo, then:

   | Setting | Value |
   |---|---|
   | Root Directory | *(leave empty)* |
   | Runtime | Node |
   | Build Command | `npm run install-all && npm run build` |
   | Start Command | `npm start` |
   | Instance type | Free |

3. **Environment variables** (Render → Environment):
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = long random text
   - `ADMIN_PASSWORD` = a password of your choice
   - `NODE_VERSION` = `20`

4. Click **Deploy**. When it says *Live*, your URL is shown at the top, like
   **`https://rhythora-dance-school.onrender.com`** → this is the URL to submit.

5. Check it: open `<your-url>/api/health` (should show `{"status":"ok"}`), then open the home page and test sign up / appointment.

Notes
- Free Render services sleep after ~15 minutes idle; the first visit afterwards takes ~30–60 s. Open the URL once before presenting.
- Departments, classes, admin and instructor are inserted automatically the first time the server connects to an empty database – no shell access needed.
- To reload the catalogue manually: `npm run seed`.

### Alternative: frontend and backend on separate hosts
Deploy `backend` on Render (Root Directory `backend`, build `npm install`, start `npm start`, add `CLIENT_URL=https://<your-frontend-url>`), and deploy `frontend` on Vercel/Netlify with env var `VITE_API_URL=https://<backend>.onrender.com/api`. For Netlify add a redirect so all paths serve `index.html`.

## Troubleshooting
| Problem | Fix |
|---|---|
| `MONGODB_URI is not set` | `.env` must be inside `backend/` and named exactly `.env` |
| `MongooseServerSelectionError` | Atlas: allow IP 0.0.0.0/0, check username/password, URL-encode special characters |
| Frontend says "Cannot reach the server" | backend not running, or wrong port (must be 5000 in dev) |
| Blank page on refresh at a deep link (deployed) | make sure you deployed via the backend (it handles the fallback) |
| Admin login fails | use the email/password from `.env` as they were at the **first** start (the admin is created once) |

## Security notes (for your report)
Passwords are hashed with bcrypt; sessions use signed JWTs (7 days); admin routes check the user's role on the server; students can only register as *Student* – Admin/Instructor accounts exist only through seeding.
