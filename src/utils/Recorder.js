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

        // Audio Context State
        this.audioCtx = null;
        this.audioSource = null;
        this.audioDest = null;
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

        // Add Audio Track via Web Audio API
        if (this.audioRef.current) {
            try {
                // Initialize AudioContext if needed
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (this.audioCtx.state === 'suspended') {
                    await this.audioCtx.resume();
                }

                // Create source only once per element to avoid errors
                // We attach it to the element itself to persist across recorder instances if needed
                // or just check if we already created it in this instance
                if (!this.audioSource) {
                    // Check if a source is already attached to the DOM element (hacky but safe for React refs)
                    if (this.audioRef.current._audioSource) {
                        this.audioSource = this.audioRef.current._audioSource;
                    } else {
                        this.audioSource = this.audioCtx.createMediaElementSource(this.audioRef.current);
                        this.audioRef.current._audioSource = this.audioSource;
                    }
                }

                this.audioDest = this.audioCtx.createMediaStreamDestination();

                // Connect Source -> Destination (for recording)
                this.audioSource.connect(this.audioDest);

                // Connect Source -> Speakers (so user can hear it)
                this.audioSource.connect(this.audioCtx.destination);

                // Add track to stream
                if (this.audioDest.stream.getAudioTracks().length > 0) {
                    stream.addTrack(this.audioDest.stream.getAudioTracks()[0]);
                }

            } catch (e) {
                console.error("Audio setup failed:", e);
            }
        }

        // Use a mimeType that definitely supports audio
        const mimeTypes = [
            'video/webm; codecs=vp9,opus',
            'video/webm; codecs=vp8,opus',
            'video/webm'
        ];

        let selectedMimeType = 'video/webm';
        for (const type of mimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                selectedMimeType = type;
                break;
            }
        }

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });

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

            // Cleanup Audio Connections to prevent memory leaks or double-audio
            // We don't close the context because we might reuse it, but we can disconnect
            // Actually, if we disconnect, the user might stop hearing audio.
            // Let's leave it connected for now, or handle cleanup carefully.
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
