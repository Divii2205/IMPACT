document.addEventListener('DOMContentLoaded', function() {
    const startAnalysisButton = document.getElementById('startAnalysis');
    const summaryDiv = document.getElementById('summary');
    const realCount = document.getElementById('realCount');
    const fakeCount = document.getElementById('fakeCount');
    const suspiciousCount = document.getElementById('suspiciousCount');

    startAnalysisButton.addEventListener('click', function() {
        console.log('Start Analysis button clicked');
        startAnalysisButton.disabled = true;
        startAnalysisButton.textContent = 'Analyzing...';

        // Send message to content script to highlight reviews
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log('Sending message to tab:', tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {action: "highlightReviews"}, function(response) {
                console.log('Message sent, response:', response);
                if (response && response.counts) {
                    // Update the summary with counts
                    realCount.textContent = " " + response.counts.REAL;
                    fakeCount.textContent = " " + response.counts.FAKE;
                    suspiciousCount.textContent = " " + response.counts.SUSPICIOUS;

                    // Show the summary
                    summaryDiv.classList.remove('hidden');
                }
                startAnalysisButton.disabled = false;
                startAnalysisButton.textContent = 'Start Analysis';
            });
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateCounts") {
            realCount.textContent = " " + request.counts.REAL;
            fakeCount.textContent = " " + request.counts.FAKE;
            suspiciousCount.textContent = " " + request.counts.SUSPICIOUS;
            summaryDiv.classList.remove('hidden');
        }
    });
});

