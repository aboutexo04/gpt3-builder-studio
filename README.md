# GPT-3 Builder Studio

An interactive clone-coding environment to learn how to build, instruction-tune, and classification-tune a GPT-3 style model using PyTorch concepts.

## How to Run Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup API Key:**
    *   Create a file named `.env` in the root directory.
    *   Add your Google Gemini API key (Must be prefixed with VITE_):
        ```
        VITE_API_KEY=AIzaSy...
        ```
    *   You can get a key from [Google AI Studio](https://aistudio.google.com/).

3.  **Run the App:**
    ```bash
    npm run dev
    ```

4.  **Open Browser:**
    Visit `http://localhost:5173`

## Deployment (Vercel)

1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the `VITE_API_KEY` in the Vercel Project Settings > Environment Variables.
4.  Deploy!