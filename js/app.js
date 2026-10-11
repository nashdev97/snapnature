// SnapNature - Offline Nature Identifier
// Using open-source AI (HuggingFace Inference API) for plant/animal identification

class SnapNature {
    constructor() {
        this.model = "google/vit-base-patch16-224"; // Open-weight ViT model
        this.apiUrl = `https://api-inference.huggingface.co/models/${this.model}`;
        this.confidenceThreshold = 0.3;

        // DOM elements
        this.captureBtn = document.getElementById('capture-btn');
        this.previewVideo = document.getElementById('preview-video');
        this.captureCanvas = document.getElementById('capture-canvas');
        this.resultsSection = document.getElementById('results-section');
        this.journalSection = document.getElementById('journal-section');
        this.resultImage = document.getElementById('result-image');
        this.speciesName = document.getElementById('species-name');
        this.confidenceEl = document.getElementById('confidence');
        this.factsText = document.getElementById('facts-text');
        this.saveBtn = document.getElementById('save-btn');
        this.journalEntries = document.getElementById('journal-entries');
        this.clearJournalBtn = document.getElementById('clear-journal');

        // State
        this.stream = null;
        this.currentPrediction = null;

        this.init();
    }

    async init() {
        // Check for camera permissions
        try {
            await this.setupCamera();
        } catch (err) {
            console.error("Camera access denied:", err);
            this.captureBtn.textContent = "📷 Upload Photo";
            this.captureBtn.onclick = () => this.uploadPhoto();
        }

        // Event listeners
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.saveBtn.addEventListener('click', () => this.saveToJournal());
        this.clearJournalBtn.addEventListener('click', () => this.clearJournal());

        // Load existing journal
        this.loadJournal();
    }

    async setupCamera() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        this.previewVideo.srcObject = this.stream;
        await this.previewVideo.play();
    }

    async capturePhoto() {
        if (!this.previewVideo.srcObject) {
            await this.uploadPhoto();
            return;
        }

        // Draw video frame to canvas
        const ctx = this.captureCanvas.getContext('2d');
        this.captureCanvas.width = this.previewVideo.videoWidth;
        this.captureCanvas.height = this.previewVideo.videoHeight;
        ctx.drawImage(this.previewVideo, 0, 0, this.captureCanvas.width, this.captureCanvas.height);

        // Get image data
        const imageDataUrl = this.captureCanvas.toDataURL('image/jpeg');
        await this.processImage(imageDataUrl);
    }

    async uploadPhoto() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                await this.processImage(event.target.result);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    async processImage(imageDataUrl) {
        // Show image
        this.resultImage.innerHTML = `<img src="${imageDataUrl}" alt="Captured image" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;

        // Show loading
        this.speciesName.textContent = "Analyzing...";
        this.confidenceEl.textContent = "Confidence: --";
        this.factsText.textContent = "Getting fun facts...";

        // Switch to results section
        this.hideAllSections();
        this.resultsSection.classList.remove('hidden');

        try {
            // Get prediction from HuggingFace
            const prediction = await this.getPrediction(imageDataUrl);
            this.currentPrediction = prediction;

            // Display results
            this.displayResults(prediction);

        } catch (error) {
            console.error("Error processing image:", error);
            this.speciesName.textContent = "Error identifying";
            this.confidenceEl.textContent = "";
            this.factsText.textContent = "Could not process image. Try again.";
        }
    }

    async getPrediction(imageDataUrl) {
        // Convert base64 to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        // Query HuggingFace Inference API
        const apiResponse = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: await blob.arrayBuffer()
            })
        });

        if (!apiResponse.ok) {
            throw new Error(`API error: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        return this.processPredictions(result);
    }

    processPredictions(rawPredictions) {
        // HuggingFace returns array of predictions sorted by confidence
        if (!Array.isArray(rawPredictions) || rawPredictions.length === 0) {
            throw new Error('No predictions returned');
        }

        // Filter by confidence threshold and get top prediction
        const filtered = rawPredictions
            .filter(p => p.score >= this.confidenceThreshold)
            .slice(0, 5); // Top 5

        if (filtered.length === 0) {
            // Return highest confidence even if below threshold
            return rawPredictions[0];
        }

        return filtered[0];
    }

    displayResults(prediction) {
        // Format species name (clean up labels)
        let label = prediction.label;
        if (label.includes(',') || label.includes('(')) {
            // Take first part if it's a complex label
            label = label.split(/[,()]/)[0].trim();
        }

        // Capitalize properly
        label = label.toLowerCase().split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        this.speciesName.textContent = label || "Unknown species";
        this.confidenceEl.textContent = `Confidence: ${(prediction.score * 100).toFixed(1)}%`;

        // Generate fun facts
        this.generateFunFacts(label, prediction.score);
    }

    generateFunFacts(speciesName, confidence) {
        const facts = [
            `🔍 You spotted a ${speciesName}!`,
            `📊 Identification confidence: ${(confidence * 100).toFixed(1)}%`,
            `🌱 This observation helps build biodiversity data!`,
            `📸 Keep exploring - nature's best discoveries happen off the beaten path!`,
            `💡 Tip: Try different angles or lighting for better identification`
        ];

        // Add species-specific fun fact
        const speciesLower = speciesName.toLowerCase();
        if (speciesLower.includes('bird') || speciesLower.includes('sparrow') || speciesLower.includes('eagle')) {
            facts.push(`🐦 Birds have hollow bones to help them fly!`);
        } else if (speciesLower.includes('tree') || speciesLower.includes('oak') || speciesLower.includes('maple')) {
            facts.push(`🌳 Trees can communicate through fungal networks in the soil!`);
        } else if (speciesLower.includes('flower') || speciesLower.includes('rose') || speciesLower.includes('daisy')) {
            facts.push(`🌼 Flowers follow the sun - this is called heliotropism!`);
        } else if (speciesLower.includes('butterfly') || speciesLower.includes('bee')) {
            facts.push(`🐝 Pollinators like bees and butterflies help 75% of flowering plants reproduce!`);
        } else {
            facts.push(`🌍 Every species plays a unique role in its ecosystem!`);
        }

        this.factsText.textContent = facts.join('\n\n');
    }

    saveToJournal() {
        if (!this.currentPrediction) return;

        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            speciesName: this.speciesName.textContent,
            confidence: this.currentPrediction.score,
            imageUrl: this.resultImage.querySelector('img')?.src || '',
            facts: this.factsText.textContent
        };

        // Get existing journal
        let journal = JSON.parse(localStorage.getItem('snapnatureJournal') || '[]');
        journal.push(entry);
        localStorage.setItem('snapnatureJournal', JSON.stringify(journal));

        // Show success feedback
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = "💾 Saved!";
        this.saveBtn.disabled = true;
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.disabled = false;
        }, 1500);

        // Switch to journal view
        this.hideAllSections();
        this.journalSection.classList.remove('hidden');
        this.loadJournal();
    }

    loadJournal() {
        const journal = JSON.parse(localStorage.getItem('snapnatureJournal') || '[]');
        if (journal.length === 0) {
            this.journalEntries.innerHTML = '<p><em>No entries yet. Go identify some nature!</em></p>';
            return;
        }

        this.journalEntries.innerHTML = journal
            .map(entry => `
                <div class="journal-entry">
                    <h4>${entry.speciesName}</h4>
                    <p>${entry.facts.split('\n\n')[0]}</p>
                    <small>${new Date(entry.timestamp).toLocaleString()}</small>
                </div>
            `)
            .join('');
    }

    clearJournal() {
        if (confirm('Clear all journal entries? This cannot be undone.')) {
            localStorage.removeItem('snapnatureJournal');
            this.journalEntries.innerHTML = '<p><em>Journal cleared. Start fresh!</em></p>';
        }
    }

    hideAllSections() {
        this.resultsSection.classList.add('hidden');
        this.journalSection.classList.add('hidden');
    }

    // Cleanup on unload
    disconnect() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.snapNature = new SnapNature();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.snapNature) {
        window.snapNature.disconnect();
    }
});