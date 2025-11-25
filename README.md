# Quran Shorts Video Generator

A React application that generates "Shorts" style videos (9:16 aspect ratio) featuring Quranic verses with selectable reciters, translations, and dynamic video backgrounds.

## Features

- **Selectable Reciters**: Choose from a list of available reciters (fetched from Quran.com API).
- **Selectable Translations**: Choose from various English translations.
### 3. Smart Video Selection (Drone Mode)
- **Strict Drone Footage**: All background videos are strictly **cinematic drone/aerial shots** for a premium, immersive experience.
- **Context-Aware**: The app analyzes verse keywords (e.g., "mountain", "sea", "city") to find relevant aerial footage.
- **No Living Beings**: Strict filtering ensures no humans are shown, maintaining focus on the natural world and Quranic message.
- **Unique Visuals**: Advanced logic ensures no video is repeated within a single Surah playback.

### 4. Smooth Playback
- **Preloading**: Next videos are preloaded in the background to ensure seamless, black-screen-free transitions between verses.
- **Cross-fading**: Gentle cross-fades between scenes.
- **Widgets**: Real-time Pakistan time and Rahim Yar Khan weather widgets (Desktop only).
- **Dark/Light Mode**: Toggle between themes.
- **Responsive Design**: Optimized for mobile-style viewing (9:16) with a clean, borderless layout.

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

## Troubleshooting
 
 - **Video Playback Issues**: If videos don't play, ensure your Pexels API key is valid and set in `.env`. The app falls back to default nature videos if the API fails.
 - **Console Errors**: You might see 403 errors if using old fallback URLs; these have been updated to reliable sources.
 
 ## License
 
 MIT
