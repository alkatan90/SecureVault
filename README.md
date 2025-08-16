# SecureVault - A Modern, Client-Side Password Manager


SecureVault is a beautiful and fully-featured password manager application built with React, TypeScript, and Tailwind CSS. It operates entirely on the client-side, employing a zero-knowledge architecture to ensure your data remains private and secure. All your sensitive information is encrypted with AES-256 and stored locally in your browser, never leaving your device.

## Features

-   **Zero-Knowledge Security:** Your master password is the key to your vault. It's never stored or transmitted, ensuring only you can access your data.
-   **AES-256 Encryption:** All your passwords and sensitive information are encrypted locally using the Web Crypto API, the same standard used by military and financial institutions.
-   **Complete Password Management:** Add, view, edit, and delete your login credentials with ease.
-   **Advanced Filtering & Search:** Quickly find the credentials you need by searching or filtering by category (Work, Personal, etc.) and favorites.
-   **Secure Password Generator:** Create strong, unique, and customizable passwords with options for length, character types, and exclusion of similar-looking characters.
-   **Security Dashboard:** Get an at-a-glance overview of your password security with an overall security score. Identify weak, reused, or potentially breached passwords.
-   **Biometric Unlock:** A simulated biometric login feature for quick and secure access.
-   **Data Import/Export:** Securely back up your encrypted vault or import data from other services (simulated).
-   **Modern UI:** A sleek, responsive, and intuitive user interface built with Tailwind CSS and Lucide React icons.

## Technology Stack

-   **Frontend:** React, TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Icons:** Lucide React
-   **Cryptography:** Web Crypto API (AES-256-GCM)
-   **State Management:** React Context API
-   **Linting:** ESLint

## Security Architecture

SecureVault is designed with a security-first approach:

1.  **Master Password:** Upon first use, you set a master password. This password is used to generate a secure encryption key via the Web Crypto API's `SHA-256` digest function.
2.  **Encryption Key:** This derived key is used to encrypt and decrypt your entire password vault using the `AES-GCM` algorithm. This key is held only in the browser's session storage and is discarded when you log out or close the session.
3.  **Local Storage:** Your password data, in its encrypted form, is stored in the browser's `localStorage`. Since the master password and the derived key are never stored, the raw data in `localStorage` is unreadable without them.
4.  **Zero-Knowledge:** The application's architecture ensures that the unencrypted master password and your plaintext data never leave your device.

## Getting Started

To run SecureVault on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mudaykirann/securevault.git
    cd securevault
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Bundles the application for production.
-   `npm run lint`: Lints the project files using ESLint.
-   `npm run preview`: Serves the production build locally for previewing.

## Project Structure

The project is organized to separate concerns and maintain a clean codebase.

```
/src
├── components/       # React components organized by feature
│   ├── auth/         # Login and authentication components
│   └── dashboard/    # Components for the main dashboard
├── contexts/         # React Context for global state management
│   ├── AuthContext.tsx    # Manages authentication state and logic
│   └── PasswordContext.tsx # Manages password data and operations
└── utils/            # Utility functions
    └── encryption.ts # Core encryption and decryption logic
