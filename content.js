console.log('Content script loaded');

// Function to generate a random classification (for demonstration purposes)
function analyzeReview(review) {
  if (review.length < 20) return 'not sure';
  if (review.length < 50) return 'fake';
  return 'real';
}

// Function to get color based on classification
function getColorForClassification(classification) {
  switch (classification) {
    case 'fake':
      return 'rgba(255, 0, 0, 0.2)'; // Red
    case 'not sure':
      return 'rgba(255, 255, 0, 0.2)'; // Yellow
    case 'real':
      return 'rgba(0, 255, 0, 0.2)'; // Green
    default:
      return 'transparent';
  }
}

// Function to get reasoning based on classification
function getReasoningForClassification(classification) {
  switch (classification) {
    case 'fake':
      return 'This review has been flagged as potentially fake due to suspicious patterns in the text or user behavior.';
    case 'not sure':
      return 'Our system is uncertain about the authenticity of this review. It may require further investigation.';
    case 'real':
      return 'This review appears to be genuine based on our analysis.';
    default:
      return 'No classification available for this review.';
  }
}

// Function to highlight reviews
function highlightReviews() {
  console.log('Highlighting reviews');
  const reviews = document.querySelectorAll('.wiI7pd, .OA1nbd');  
  console.log('Found reviews:', reviews.length);
  
  reviews.forEach(review => {
    
    const classification = analyzeReview(review.textContent);
    const color = getColorForClassification(classification);
    const reasoning = getReasoningForClassification(classification);

    console.log('Highlighting review:', review, 'with color:', color);

    review.style.backgroundColor = color;
    review.style.transition = 'background-color 0.3s';

    const hoverElement = document.createElement('div');
    hoverElement.className = 'review-hover-info';
    hoverElement.innerHTML = `
      <p><strong>Classification: ${classification}</strong></p>
      <p>${reasoning}</p>
      <button class="report-button">Report</button>
    `;
    hoverElement.style.cssText = `
      position: absolute;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: none;
      z-index: 1000;
      max-width: 300px;
      top: 100%;
      left: 0;
    `;
    review.style.position = 'relative';
    review.appendChild(hoverElement);

    review.addEventListener('mouseenter', () => {
      hoverElement.style.display = 'block';
    });

    review.addEventListener('mouseleave', () => {
      hoverElement.style.display = 'none';
    });

    const reportButton = hoverElement.querySelector('.report-button');
    reportButton.style.cssText = `
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 5px 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 4px;
    `;
    reportButton.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Reported review:', review.textContent);
      alert('Review reported!');
    });
  });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === "highlightReviews") {
    highlightReviews();
    sendResponse({status: "Highlighting complete"});
  }
  return true;
});

// Observe for dynamically loaded reviews
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const addedNodes = mutation.addedNodes;
      for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('jftiEf') || node.classList.contains('gws-localreviews__google-review'))) {
          console.log('New review detected, highlighting');
          highlightReviews();
          break;
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

