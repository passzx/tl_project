document.addEventListener('DOMContentLoaded', () => {

    const feedbackForm = document.getElementById('feedback-form');
    const feedbackSubmitContainer = document.querySelector('.form-submit-container');

    if (feedbackForm) {
        const thankYouMessage = document.createElement('p');
        thankYouMessage.textContent = "Thank you for your feedback!";
        thankYouMessage.classList.add('feedback-thank-you');
        feedbackSubmitContainer.appendChild(thankYouMessage);

        feedbackForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('feedback-email');
            const commentInput = document.getElementById('feedback-comment');

            if (!emailInput.checkValidity() || !commentInput.checkValidity()) {
                alert("Please fill in all required fields.");
                return;
            }

            console.log('Simulating feedback submission...');

            setTimeout(() => {
                thankYouMessage.style.display = 'block';
                feedbackForm.reset();
            }, 1000);
        });
    }

});