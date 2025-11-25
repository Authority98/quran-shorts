import html2canvas from 'html2canvas';

export class SurahRecorder {
    constructor(videoElement, textElement, audioRef, onComplete) {
        this.videoElement = videoElement;
        this.textElement = textElement;
        this.audioRef = audioRef;
        this.onComplete = onComplete;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mediaRecorder = null;
        this.chunks = [];
        this.isActive = false;
        this.textImage = null;
        this.animationFrameId = null;
    }

    async start() {
        if (!this.videoElement || !this.textElement) return;

        this.isActive = true;
        this.chunks = [];

        // Setup Canvas
        const { width, height } = this.videoElement.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;

        // Capture Stream (30 FPS)
        const stream = this.canvas.captureStream(30);

        // Add Audio Track if available
        if (this.audioRef.current && this.audioRef.current.captureStream) {
            // For <audio> elements, captureStream might not work directly in all browsers without playing
            // We might need to use Web Audio API to connect the node.
            // For simplicity, let's try to capture the destination if possible, or just record video first.
            // Actually, mixing audio is hard without Web Audio API.
            // Let's try a simpler approach: Record the canvas stream, and we might miss audio in the export 
            // unless we do complex mixing.
            // WAIT: The user wants "everything, from video, verse, translation etc".
            // We MUST include audio.

            // Let's try to get the audio stream from the element
            try {
                const audioStream = this.audioRef.current.mozCaptureStream ? this.audioRef.current.mozCaptureStream() : this.audioRef.current.captureStream();
                audioStream.getAudioTracks().forEach(track => stream.addTrack(track));
            } catch (e) {
                console.warn("Could not capture audio stream directly:", e);
            }
        }

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quran_short_${Date.now()}.webm`;
            a.click();
            this.onComplete();
        };

        this.mediaRecorder.start();
        this.loop();
    }

    async updateTextOverlay() {
        // Snapshot the text element
        if (this.textElement) {
            try {
                // Force standard colors to avoid 'oklch' error
                const originalColor = this.textElement.style.color;
                this.textElement.style.color = '#ffffff'; // Force white hex

                const canvas = await html2canvas(this.textElement, {
                    backgroundColor: null,
                    scale: 1, // Match resolution
                    // Ignore elements that might cause issues if needed, or configure logging
                    logging: false,
                    useCORS: true, // Ensure fonts/images load
                });

                // Restore original color (though it's likely white anyway)
                this.textElement.style.color = originalColor;

                this.textImage = canvas;
            } catch (e) {
                console.error("Text snapshot failed:", e);
            }
        }
    }

    loop() {
        if (!this.isActive) return;

        // Draw Video
        // Query the currently active video element dynamically because React might have replaced it
        const currentVideoElement = document.getElementById('video-element');
        if (currentVideoElement) {
            try {
                this.ctx.drawImage(currentVideoElement, 0, 0, this.canvas.width, this.canvas.height);
            } catch (e) {
                // Ignore draw errors (e.g., if video is not ready)
            }
        }

        // Draw Text Overlay
        if (this.textImage) {
            this.ctx.drawImage(this.textImage, 0, 0);
        }

        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.isActive = false;
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
