# Quran Shorts Video Generator

A React application that generates "Shorts" style videos (9:16 aspect ratio) featuring Quranic verses with selectable reciters, translations, and dynamic video backgrounds.

## Features

- **Selectable Reciters**: Choose from a list of available reciters (fetched from Quran.com API).
- **Selectable Translations**: Choose from various English translations.
- **Dynamic Video Backgrounds**: Loops high-quality nature videos from Pexels based on Surah context.
- **Verse-by-Verse Sync**: Audio and text are synchronized, auto-advancing to the next verse.
- **Responsive Design**: Optimized for mobile-style viewing (9:16).

## Tech Stack

- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **API**: Quran.com API (Audio/Text), Pexels API (Video)

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Authority98/quran-shorts.git
    cd quran-shorts
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Pexels API key:
    ```env
    VITE_PEXELS_API_KEY=your_pexels_api_key_here
    ```
    > Note: You can get a free API key from [Pexels](https://www.pexels.com/api/).

4.  **Start the development server**:
    ```bash
    npm run dev
    ```

5.  **Open in Browser**:
    Navigate to `http://localhost:5173`.

## Usage

1.  **Select Options**: Use the sidebar to select your preferred Reciter, Translation, and Surah.
2.  **Play**: Click the Play button in the controls area.
3.  **Watch**: The video will play, displaying verses one by one with synchronized audio and video background.
4.  **Skip**: Use the Skip button to jump to the next verse.

## License

MIT
