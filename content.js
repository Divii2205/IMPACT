console.log('Content script loaded');
let reviewCounts = {
  REAL: 0,
  FAKE: 0,
  SUSPICIOUS: 0
};

let isAnalysisActive = false;

// Function to generate a random classification (for demonstration purposes)
function analyzeReview(review) {
  console.log(review.length);
  
  if (review.length < 20) return 'SUSPICIOUS';
  if (review.length < 50) return 'FAKE';
  return 'REAL';
}

// Function to get color based on classification
function getColorForClassification(classification) {
  switch (classification) {
    case 'FAKE':
      return 'rgba(255, 0, 0, 0.35)'; // Red
    case 'SUSPICIOUS':
      return 'rgba(255, 255, 0, 0.37)'; // Yellow
    case 'REAL':
      return 'rgba(0, 255, 0, 0.32)'; // Green
    default:
      return 'transparent';
  }
}

// Function to get reasoning based on classification
function getReasoningForClassification(classification) {
  switch (classification) {
    case 'FAKE':
      return 'This review has been flagged as potentially fake due to suspicious patterns in the text or user behavior.';
    case 'SUSPICIOUS':
      return 'Our system is uncertain about the authenticity of this review. It may require further investigation.';
    case 'REAL':
      return 'This review appears to be genuine based on our analysis.';
    default:
      return 'No classification available for this review.';
  }
}

// Function to update counts in popup
function updatePopupCounts() {
  chrome.runtime.sendMessage({
    action: "updateCounts",
    counts: reviewCounts
  });
}

// Function to process a single review
function processReview(review) {
  // Only process if analysis is active
  if (!isAnalysisActive) return;
  
  // Check if review is already processed
  if (review.classList.contains('processed')) return;

  const reviewText = review.textContent || '';
  const classification = analyzeReview(reviewText);
  console.log('Processing review:', classification, 'Length:', reviewText.length);
  
  // Increment the count for this classification
  reviewCounts[classification]++;
  console.log('Updated counts:', reviewCounts);
  
  // Send updated counts to popup
  updatePopupCounts();

  const reasoning = getReasoningForClassification(classification);
  const color = getColorForClassification(classification);
  
  review.classList.add('processed');
  review.style.backgroundColor = color;
  review.style.transition = 'background-color 0.3s';
  review.style.position = 'relative';

  const hoverElement = document.createElement('div');
  hoverElement.className = 'review-hover-info';
  hoverElement.innerHTML = `
    <p><strong>Classification: ${classification}</strong></p>
    <p>${reasoning}</p>
    <button class="report-button">Report</button>
  `;

  hoverElement.style.cssText = `
    position: absolute;
    color: black;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    display: none;
    z-index: 1000;
    width: 300px;
    top: 100%;
    left: 0;
  `;
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
    console.log('Reported review:', reviewText);
    alert('Review reported!');
  });
}

// Function to highlight reviews
function highlightReviews() {
  console.log('Highlighting reviews');
  const reviews = document.querySelectorAll('.wiI7pd, .OA1nbd, .d5K5Pd');
  console.log('Found reviews:', reviews.length);

  reviews.forEach(review => processReview(review));
}

let intersectionObserver = null;
let mutationObserver = null;

// Improved observer setup with IntersectionObserver for lazy-loaded content
function setupIntersectionObserver() {
  // Clear existing observers if they exist
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
  }

  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && isAnalysisActive) {
        const review = entry.target;
        if (!review.classList.contains('processed')) {
          processReview(review);
        }
      }
    });
  }, options);

  // Function to observe new reviews
  function observeNewReviews() {
    const reviews = document.querySelectorAll('.wiI7pd, .OA1nbd, .d5K5Pd');
    reviews.forEach(review => {
      if (!review.classList.contains('observed')) {
        intersectionObserver.observe(review);
        review.classList.add('observed');
      }
    });
  }

  // Create mutation observer to detect new reviews being added to the DOM
  mutationObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        shouldCheck = true;
      }
    });

    if (shouldCheck && isAnalysisActive) {
      observeNewReviews();
    }
  });

  // Start observing DOM changes
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial observation
  observeNewReviews();
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === "highlightReviews") {
    // Reset counts when starting new analysis
    reviewCounts = {
      REAL: 0,
      FAKE: 0,
      SUSPICIOUS: 0
    };
    
    isAnalysisActive = true;
    setupIntersectionObserver();
    highlightReviews();
    
    // Send initial counts
    sendResponse({status: "Highlighting complete", counts: reviewCounts});
  }
  return true;
});