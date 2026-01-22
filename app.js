/**
 * VAJRADRISHTI - Main Application JavaScript
 * AI-Powered Deepfake Detection Platform
 * 
 * This file handles:
 * - Page navigation
 * - File upload simulation
 * - Analysis progress animation
 * - Results display
 * - UI interactions
 */

// ==================== GLOBAL STATE ====================
const AppState = {
    currentPage: 'home',
    uploadedFile: null,
    analysisResult: null
};

// ==================== PAGE NAVIGATION ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });
    
    // Handle scroll effect on navbar
    window.addEventListener('scroll', handleNavScroll);
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageName;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function handleNavScroll() {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// ==================== FILE UPLOAD FUNCTIONALITY ====================
function initFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const previewVideo = document.getElementById('previewVideo');
    const previewImage = document.getElementById('previewImage');
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    AppState.uploadedFile = file;
    
    const filePreview = document.getElementById('filePreview');
    const previewVideo = document.getElementById('previewVideo');
    const previewImage = document.getElementById('previewImage');
    const uploadZone = document.getElementById('uploadZone');
    
    // Show preview based on file type
    const fileType = file.type.split('/')[0];
    
    if (fileType === 'video') {
        const videoURL = URL.createObjectURL(file);
        previewVideo.src = videoURL;
        previewVideo.style.display = 'block';
        previewImage.style.display = 'none';
        filePreview.classList.add('active');
    } else if (fileType === 'image') {
        const imageURL = URL.createObjectURL(file);
        previewImage.src = imageURL;
        previewImage.style.display = 'block';
        previewVideo.style.display = 'none';
        filePreview.classList.add('active');
    }
    
    // Start analysis after 1 second
    setTimeout(() => {
        startAnalysis();
    }, 1000);
}

// ==================== ANALYSIS SIMULATION ====================
function startAnalysis() {
    const uploadZone = document.getElementById('uploadZone');
    const analysisProgress = document.getElementById('analysisProgress');
    
    uploadZone.classList.add('processing');
    analysisProgress.classList.add('active');
    
    // Simulate 4-step analysis process
    const steps = [
        { id: 1, duration: 2000, progress: 100 },
        { id: 2, duration: 2500, progress: 100 },
        { id: 3, duration: 2000, progress: 100 },
        { id: 4, duration: 1500, progress: 100 }
    ];
    
    let delay = 0;
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            animateStep(step.id, step.progress, step.duration);
            
            // After last step, show results
            if (index === steps.length - 1) {
                setTimeout(() => {
                    showResults();
                }, step.duration + 500);
            }
        }, delay);
        
        delay += step.duration;
    });
}

function animateStep(stepId, targetProgress, duration) {
    const stepElement = document.getElementById(`step${stepId}`);
    const progressBar = document.getElementById(`progress${stepId}`);
    
    // Mark step as active
    stepElement.classList.add('active');
    
    // Animate progress bar
    setTimeout(() => {
        progressBar.style.width = `${targetProgress}%`;
    }, 100);
    
    // Mark step as complete after duration
    setTimeout(() => {
        stepElement.classList.remove('active');
        stepElement.classList.add('complete');
    }, duration);
}

function showResults() {
    // Generate random result (80% fake, 20% real for demo purposes)
    const isFake = Math.random() < 0.8;
    const confidence = isFake 
        ? Math.floor(Math.random() * 15 + 85) // 85-99% for fake
        : Math.floor(Math.random() * 15 + 80); // 80-94% for real
    
    AppState.analysisResult = {
        verdict: isFake ? 'FAKE' : 'REAL',
        confidence: confidence
    };
    
    // Navigate to results page and display
    navigateToPage('results');
    displayResults();
}

function displayResults() {
    const verdictCard = document.getElementById('verdictCard');
    const verdictLabel = document.getElementById('verdictLabel');
    const confidenceScore = document.getElementById('confidenceScore');
    const ringProgress = document.getElementById('ringProgress');
    
    const { verdict, confidence } = AppState.analysisResult;
    
    // Update verdict
    if (verdict === 'FAKE') {
        verdictCard.className = 'verdict-card fake';
        verdictLabel.textContent = 'DEEPFAKE DETECTED';
        verdictLabel.style.color = 'var(--danger)';
    } else {
        verdictCard.className = 'verdict-card real';
        verdictLabel.textContent = 'AUTHENTIC MEDIA';
        verdictLabel.style.color = 'var(--success)';
    }
    
    // Update confidence score
    confidenceScore.textContent = `${confidence}%`;
    
    // Animate confidence ring
    const circumference = 2 * Math.PI * 95; // radius = 95
    const offset = circumference - (confidence / 100) * circumference;
    
    setTimeout(() => {
        ringProgress.style.strokeDashoffset = offset;
    }, 300);
    
    // Update ring color based on verdict
    if (verdict === 'FAKE') {
        ringProgress.style.stroke = 'var(--danger)';
    } else {
        ringProgress.style.stroke = 'var(--success)';
    }
}

// ==================== DOWNLOAD REPORT ====================
function downloadReport() {
    // Simulate report download
    const { verdict, confidence } = AppState.analysisResult;
    const filename = `vajradrishti_report_${Date.now()}.pdf`;
    
    // Create a simple text report (in production, this would be a PDF)
    const reportContent = `
VAJRADRISHTI FORENSIC ANALYSIS REPORT
=====================================

Analysis ID: ${generateAnalysisId()}
Timestamp: ${new Date().toLocaleString()}
Officer ID: LE-2847

VERDICT: ${verdict}
CONFIDENCE: ${confidence}%

DETAILED ANALYSIS:
- Facial Inconsistencies: ${verdict === 'FAKE' ? '27 Detected' : 'None Detected'}
- Audio Analysis: ${verdict === 'FAKE' ? 'Suspicious' : 'Authentic'}
- Metadata Status: ${verdict === 'FAKE' ? 'Modified' : 'Original'}
- Processing Time: 8.4 seconds
- Frames Analyzed: 1,247

This report is generated by VAJRADRISHTI AI-Powered Deepfake Detection Platform.
For official use by authorized law enforcement personnel only.

Chain of Custody: Verified
Digital Signature: ${generateSignature()}
    `;
    
    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show success message
    alert(`Forensic report downloaded successfully!\nFilename: ${