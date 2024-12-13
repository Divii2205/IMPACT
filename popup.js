document.addEventListener('DOMContentLoaded', function() {
    const startAnalysisButton = document.getElementById('startAnalysis');
    const summaryDiv = document.getElementById('summary');
    const realPercentage = document.getElementById('realPercentage');
    const fakePercentage = document.getElementById('fakePercentage');
    const notSurePercentage = document.getElementById('notSurePercentage');

    startAnalysisButton.addEventListener('click', function() {
        console.log('Start Analysis button clicked');
        startAnalysisButton.disabled = true;
        startAnalysisButton.textContent = 'Analyzing...';

        // Simulate sending a request to the /analyse endpoint
        setTimeout(() => {
            // Simulated response
            const response = {
                real: 70,
                fake: 20,
                notSure: 10
            };

            // Update the summary
            realPercentage.textContent = response.real + '%';
            fakePercentage.textContent = response.fake + '%';
            notSurePercentage.textContent = response.notSure + '%';

            // Show the summary
            summaryDiv.classList.remove('hidden');

            // Send message to content script to highlight reviews
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                console.log('Sending message to tab:', tabs[0].id);
                chrome.tabs.sendMessage(tabs[0].id, {action: "highlightReviews"}, function(response) {
                    console.log('Message sent, response:', response);
                    startAnalysisButton.disabled = false;
                    startAnalysisButton.textContent = 'Start Analysis';
                });
            });
        }, 1000); // Simulating a 1-second delay for the analysis
    });
});

