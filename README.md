# 📫 HyperMail – The AI-Powered Email Client

[![Visit Live App](https://img.shields.io/badge/Live%20Demo-Visit%20Now-blue?style=for-the-badge&logo=vercel)](https://hypermail-inky.vercel.app/)
[![GitHub issues](https://img.shields.io/github/issues/your-username/hypermail?style=for-the-badge)](https://github.com/evenrise01/hypermail-new/issues)
[![GitHub forks](https://img.shields.io/github/forks/your-username/hypermail?style=for-the-badge)](https://github.com/evenrise01/hypermail-new/network)
[![GitHub stars](https://img.shields.io/github/stars/your-username/hypermail?style=for-the-badge)](https://github.com/evenrise01/hypermail-new/stargazers)

**HyperMail is the ultimate AI email client and assistant designed to revolutionize your inbox. It automates organization, intelligently prioritizes important messages, and drafts smart replies. Powered by cutting-edge AI, HyperMail helps you declutter your inbox, streamline communication, and supercharge your productivity. Features seamless payments powered by Stripe and secure authentication with Clerk.**

---

## ✨ Key Features

HyperMail brings a suite of intelligent features to manage your emails efficiently:

* 🧠 **AI-Powered Assistance:**
    * **Smart Compose:** Automatically drafts context-aware replies for incoming emails.
    * **Message Prioritization:** Intelligently identifies and highlights your most important emails.
    * **Automated Organization:** Suggests and applies labels, folders, or filters to keep your inbox tidy.
* 🔍 **Advanced Email Search:**
    * **Vector Search with Orama & Gemini:** Experience lightning-fast and highly accurate email search using natural language queries. Understands intent, not just keywords.
* ⚙️ **Streamlined Workflow:**
    * **Command Bar:** A sleek, accessible command palette (often `Ctrl/Cmd + K`) to navigate effortlessly through the app and perform actions quickly.
    * 🔐 **Secure Authentication & User Management:** Integrated with **Clerk** for robust and easy-to-implement sign-in, sign-up, and user profile management.
    * 💳 **Seamless Payments:** Utilizes **Stripe** for smooth, secure subscription or premium feature payment processing (if applicable).
* 💎 **Modern & Responsive UI:**
    * Crafted with **Tailwind CSS** for a utility-first approach to a minimal, clean design.
    * Enhanced with **Framer Motion** for fluid animations and engaging user interactions.

---

## 🛠️ Tech Stack

HyperMail is built with a selection of modern and powerful technologies:

| Category         | Technology                                                              | Description                                            |
|------------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| **Frontend** | ![Next.js](https://cdn.simpleicons.org/nextdotjs/000000) Next.js         | React framework for SSR, SSG, API routes, and routing  |
|                  | ![React](https://cdn.simpleicons.org/react/61DAFB) React                 | Core UI library for building interactive components    |
|                  | ![TypeScript](https://cdn.simpleicons.org/typescript/3178C6) TypeScript | Typed JavaScript for enhanced code quality and scalability |
|                  | ![Tailwind CSS](https://cdn.simpleicons.org/tailwindcss/06B6D4) Tailwind CSS | Utility-first CSS framework for rapid UI development   |
|                  | ![Framer Motion](https://cdn.simpleicons.org/framer/0055FF) Framer Motion | Animation library for delightful user experiences      |
| **Backend & DB** | ![Prisma](https://cdn.simpleicons.org/prisma/2D3748) Prisma ORM         | Type-safe database client and ORM for PostgreSQL       |
|                  | ![PostgreSQL](https://cdn.simpleicons.org/postgresql/4169E1) PostgreSQL | Robust open-source relational database                 |
| **AI & Search** | ![Google Gemini](https://cdn.simpleicons.org/googlegemini/4285F4) Gemini AI | Powers AI-driven features like drafting and insights   |
|                  | **Orama** | High-speed, typo-tolerant vector search engine         |
| **Authentication**| ![Clerk](https://cdn.simpleicons.org/clerk/6C47FF) Clerk               | Authentication, user management, and session handling  |
| **Payments** | ![Stripe](https://cdn.simpleicons.org/stripe/626CD9) Stripe             | Payment processing and subscription management       |
| **Utilities** | ![Axios](https://cdn.simpleicons.org/axios/5A29E4) Axios               | Promise-based HTTP client for API requests           |

*(Note: Icon colors are illustrative. Orama icon not available on SimpleIcons at time of writing.)*

---

## 🚀 Getting Started

Follow these instructions to get a local copy of HyperMail up and running for development or testing.

### Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18.x or later recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* A running PostgreSQL instance.
* API keys for Clerk, Stripe, and Google Gemini (as needed for full functionality).

### Installation & Setup

1.  **Clone the Repository:**
    Replace `your-username` with the actual GitHub username or organization if different.
    ```bash
    git clone [https://github.com/your-username/hypermail.git](https://github.com/your-username/hypermail.git)
    cd hypermail
    ```

2.  **Install Dependencies:**
    Using your preferred package manager:
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Set Up Environment Variables:**
    Create a `.env` file in the root directory of the project. 
    ```env
    # Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    #AURINKO
    AURINKO_CLIENT_ID = "YOUR_AURINKO_CLIENT_ID"
    AURINKO_SECRET = "YOUR_AURINKO_SECRET_ID"
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_YOUR_CLERK_PUBLISHABLE_KEY"
    CLERK_SECRET_KEY="sk_YOUR_CLERK_SECRET_KEY"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

    # Stripe Payments
    STRIPE_SECRET_KEY="sk_YOUR_STRIPE_SECRET_KEY"
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_YOUR_STRIPE_PUBLISHABLE_KEY"
    STRIPE_WEBHOOK_SECRET="whsec_YOUR_STRIPE_WEBHOOK_SECRET" # For local testing of webhooks

    # Google Gemini AI
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # Application URL
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```
    **Important:**
    * Ensure your PostgreSQL database is running and accessible.
    * Run Prisma migrations to set up your database schema:
        ```bash
        npx prisma migrate dev
        ```
    * (Optional) If you have a seeding script for initial data:
        ```bash
        npx prisma db seed
        ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # OR
    yarn run dev
    ```
    The application will typically be available at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Live Demo

Check out HyperMail in action:
👉 **[Visit the Live Application](https://hypermail-inky.vercel.app/)**

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion to improve HyperMail, please fork the repository and create a pull request. You can also open an issue with the tag "enhancement" or "bug".
Don't forget to give the project a star! ⭐

### How to Contribute

1.  **Fork the Project** (Click the 'Fork' button at the top right of the GitHub page).
2.  **Create your Feature Branch:**
    ```bash
    git checkout -b feature/YourAmazingFeature
    ```
3.  **Commit your Changes** (Write clear, concise commit messages):
    ```bash
    git commit -m 'Add: YourAmazingFeature'
    ```
4.  **Push to the Branch:**
    ```bash
    git push origin feature/YourAmazingFeature
    ```
5.  **Open a Pull Request** against the `main` (or `develop`) branch of the original repository.

Please ensure your pull request describes the problem and solution. Include screenshots or GIFs for any UI/UX changes.

---

## 📜 License

Distributed under the MIT License. See `LICENSE.md` for more information.

---

## 📧 Contact

Your Name / Project Lead - [@YourTwitterHandle](https://twitter.com/YourTwitterHandle) - your.email@example.com

Project Link: [https://github.com/your-username/hypermail](https://github.com/your-username/hypermail)

---
