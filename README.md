# ResumeSeeker

ResumeSeeker is an intelligent resume analysis and career opportunity matching system designed to help professionals advance their careers. The platform leverages artificial intelligence and natural language processing to analyze resumes, identify key skills and qualifications, and match users with suitable job opportunities.

## 🚀 Key Features

*   **AI-Powered Resume Analysis**: Extracts and structures resume content (personal details, experience, education, skills) using advanced NLP.
*   **Resume Dashboard**: Centralized interface to upload, manage, and analyze multiple resume versions.
*   **File Support**: Supports PDF and DOCX formats with robust text extraction.
*   **Skill Identification**: Automatically identifies and categorizes skills from resume text.
*   **Secure & Private**: Focus on data privacy with secure file handling.

## 🛠️ Technology Stack

*   **Frontend**: [Next.js 15](https://nextjs.org/), [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
*   **Backend**: Next.js API Routes, Node.js
*   **Database**: [MySQL](https://www.mysql.com/), [Prisma ORM](https://www.prisma.io/)
*   **AI & ML**: [OpenAI API](https://openai.com/api/), [Genkit](https://firebase.google.com/docs/genkit)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   MySQL installed and running
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ResumeSeeker.git
    cd ResumeSeeker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory. You can use `.env.example` as a reference.
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database credentials, API keys (OpenAI), and NextAuth secret.

4.  **Database Setup:**
    Generate the Prisma client and run migrations.
    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    ```
    (Optional) Seed the database:
    ```bash
    npm run prisma:seed
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9006`.

## 📜 Scripts

*   `npm run dev`: Starts the development server on port 9006.
*   `npm run build`: Builds the application for production.
*   `npm start`: Starts the production server.
*   `npm run lint`: Runs the linter.
*   `npm run prisma:studio`: Opens Prisma Studio to view/edit database records.

## 👩‍💻 Developers

**Shehnaz Rangrez** 
**&**
**Shreya ojha**
