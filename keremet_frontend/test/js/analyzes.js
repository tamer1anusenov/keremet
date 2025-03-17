document.addEventListener('DOMContentLoaded', function() {
    // Initialize value status indicators
    initializeValueStatus();

    // Handle upload button click
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUpload);
    }
});

// Function to initialize value status indicators
function initializeValueStatus() {
    const valueElements = document.querySelectorAll('.value');
    
    valueElements.forEach(element => {
        const value = parseFloat(element.textContent);
        if (isNaN(value)) return; // Skip if not a number

        const normalRange = element.closest('.analysis-item')
            .querySelector('.normal-range')
            .textContent
            .match(/[\d.-]+/g);

        if (!normalRange || normalRange.length < 2) return;

        const [min, max] = normalRange.map(Number);
        
        if (value < min) {
            element.classList.add('warning');
        } else if (value > max) {
            element.classList.add('critical');
        } else {
            element.classList.add('normal');
        }
    });
}

// Function to handle file upload
function handleUpload() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.png,.doc,.docx';
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically:
            // 1. Upload the file to a server
            // 2. Process the results
            // 3. Update the UI with new values
            
            // For now, just show an alert
            alert(`File "${file.name}" selected. In a real application, this would be uploaded and processed.`);
        }
    });
    
    // Trigger file selection
    fileInput.click();
}

// Function to format dates
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Function to update analysis values
function updateAnalysisValues(newData) {
    // This function would be called after receiving new data from the server
    // It would update the values and their status indicators
    
    // Example structure of newData:
    /*
    {
        cbc: {
            hemoglobin: { value: 14.2, unit: 'g/dL' },
            wbc: { value: 7.2, unit: '×10⁹/L' },
            // ...
        },
        // ...
    }
    */
    
    // Implementation would go here
}