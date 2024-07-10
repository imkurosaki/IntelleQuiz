<h1 align="center">ZippyX</h1>

<p align="center">
    Speed up your quiz journey with IntelleQuiz - knowledge in a flash.
</p>
</p>

## <a name="features">🔋&nbsp; Features</a>

- Organized File and Folder Structure

- Well-organized & intuitive UI

- Server Side State Management & using React.

- Client Side States Management with Recoil

- Custom Hooks

- Schema Validation using zod.

- Robus Authentication

- Google SSO (Single Sign-On)

- Security Measures like rate limiting and referesh tokens.

- Dark and Light Mode

<br>

## <a name="tech-stack">⚙️&nbsp; Tech Stack</a>

- [Postgresql](https://www.postgresql.org/) – database

- [Express](https://expressjs.com/) – framework

- [React](https://react.dev/) – frontend

- [Node.js](https://nodejs.org/) – JavaScript runtime

- [Tailwind CSS](https://tailwindcss.com/) – CSS

- [Recoil](https://recoiljs.org/) – state management

- [Prisma](https://www.prisma.io/) – ORM 

- [Git](https://git-scm.com/) – versioning

- [Docker](https://www.docker.com/) – containerziation

- [Vite](https://vitejs.dev/) – building

- [Vercel](https://vercel.com/) – frontend deployment

- [AWS](https://aws.amazon.com) - backend dockerize websocket deployment 

- [DOCKERHUB](https://hub.docker.com/) - deploying images

<br>

## <a name="docker-setup"> 🐳&nbsp;&nbsp; Quick Start with Docker</a>

0. **Prerequisites**

   Make sure you have the [Docker](https://www.docker.com/) installed on your machine.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/imkurosaki/IntelleQuiz.git   
   ```

2. **Navigate to the project directory:**

   ```bash
   cd intellequiz 
   ```

3. **Add Environment Variables:**

   Create `.env` files in the server and client folder and copy paste the content of `.env.sample`

   ```bash
   # server side
   cd server
   cp .env.sample .env # then update `.env` with your creadentials.
   cd ..

   # client side
   cd client
   cp .env.sample .env # then update `.env` if required.
   cd ..
   ```

4. **Start all services using Docker Compose:**

   ```bash
   docker-compose up --watch

   # --watch to Enable Watch (For Live Update aka Hot Reloading)
   ```

<br>

## <a name="manual-setup"> 🖥️&nbsp;&nbsp; Manual Setup</a>

0.  **Prerequisites** <br>
    Make sure you have the following installed on your machine:

    - [Git](https://git-scm.com/)
    - [Node.js](https://nodejs.org/en)
    - [npm](https://www.npmjs.com/) (Node Package Manager)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/imkurosaki/IntelleQuiz.git   
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd intellequiz 
    ```

3.  **Setup Backend:**

    - **Navigate to the Backend Codebase:**

      ```bash
      cd backend/
      ```

    - **Install dependencies:**

      ```bash
      npm install
      ```

    - **Add Environment Variables:**

      Create `.env` file in the root folder and copy paste the content of `.env.sample`

      ```bash
      cp .env.sample .env
      ```

      Update credentials in `.env` with your creadentials.

    - **Start the Server:**

      ```bash
      npm run dev 
      ```

4.  **Setup Frontend:**

    - **Navigate to the Frontent Codebase:**

      ```bash
      cd frontend/
      ```

    - **Install dependencies:**

      ```bash
      npm install
      ```

    - **Add Environment Variables:**

      Create `.env` file in the root folder and copy paste the content of `.env.sample`

      ```bash
      cp .env.sample .env
      ```

      If required, update necessary credentials.

    - **Start the frontend app:**

      ```bash
      npm run dev
      ```

    - **Start the backend server:**

      ```bash
      cd ../backend
      npm run dev 
      ```

    - **Open app in browser:**

      Visit [https://localhost:5174](https://localhost:5174) to access frontent.

<br>

<br>

## 🤝&nbsp;&nbsp;Contributing

Contributions are always welcome!
