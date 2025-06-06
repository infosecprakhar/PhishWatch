
# PhishWatch

PhishWatch is a web application designed to help users identify potentially malicious URLs and protect themselves from phishing attacks. It provides a real-time URL reputation analysis tool.

## ✨ Features

*   **URL Reputation Analysis:** Enter any URL to get an instant analysis of its potential threat level, including a reputation score and an explanation.
*   **Modern UI:** Built with Next.js, React, and ShadCN UI components for a clean and responsive user experience.
*   **AI-Powered:** Leverages Genkit and Google AI models to perform intelligent analysis.

## 🚀 Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (React Framework)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/) (Component Library)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd PhishWatch
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project (copy from `.env` if it exists or create a new one).
    You may need to add API keys or other configuration variables here, for example, your Google AI API key for Genkit if not using a globally configured one.
    ```env
    # Example (add your actual keys if needed)
    # GOOGLE_API_KEY=your_google_api_key_here
    ```
    Currently, the `genkit.ts` file configures GoogleAI without an explicit API key, assuming it's available in the environment or through gcloud authentication.

### Running the Development Servers

You need to run two development servers: one for the Next.js frontend and one for Genkit flows.

1.  **Run the Next.js development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the application on `http://localhost:9002`.

2.  **Run the Genkit development server:**
    Open a new terminal window/tab and run:
    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    ```
    This will start the Genkit development UI, usually on `http://localhost:4000`, where you can inspect and test your Genkit flows.

## 🛠️ Building for Production

To create a production build of the application:

```bash
npm run build
# or
yarn build
```
This will generate an optimized build in the `.next` folder.

To run the production build locally:
```bash
npm run start
# or
yarn start
```

## 📂 Project Structure

A brief overview of the key directories:

```
PhishWatch/
├── .next/                # Next.js build output
├── .vscode/              # VS Code settings
├── node_modules/         # Project dependencies
├── public/               # Static assets (though Next.js 13+ prefers /app for many assets)
├── src/
│   ├── ai/               # Genkit AI flows and configuration
│   │   ├── flows/        # Specific AI flow implementations
│   │   ├── dev.ts        # Genkit development server entry point
│   │   └── genkit.ts     # Genkit global initialization
│   ├── app/              # Next.js App Router (pages, layouts, API routes)
│   │   ├── (favicon.ico) # Example of a route file
│   │   ├── globals.css   # Global styles and Tailwind CSS theme
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main page component for '/'
│   ├── components/       # React components
│   │   ├── phishwatch/   # Application-specific components
│   │   └── ui/           # ShadCN UI components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions
├── .env                  # Base environment variables (DO NOT commit sensitive keys here)
├── .env.local            # Local environment variables (ignored by Git)
├── .gitignore            # Files and folders to be ignored by Git
├── apphosting.yaml       # Firebase App Hosting configuration
├── components.json       # ShadCN UI configuration
├── next-env.d.ts         # Next.js TypeScript environment declarations
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── README.md             # This file
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code follows the project's coding style and includes tests where appropriate.

## 📜 License

This project is currently unlicensed. Consider adding an open-source license like MIT if you intend for others to use, modify, or distribute your code.
```
