document.addEventListener('DOMContentLoaded', () => {
    const newsItems = document.querySelectorAll('.news-item');
    let clickSound = null;

    try {
        clickSound = new Audio('audio/buzzer.m4a');
        clickSound.load();
        if (clickSound) {
            clickSound.volume = 0.1;
        }
    } catch (error) {
        console.error("Could not create or load the audio file:", error);
    }

    if (newsItems.length > 0) {
        newsItems.forEach(item => {
            const link = item.querySelector('.news-item-link');
            if (!link) return;

            link.addEventListener('click', (event) => {
                if (item.classList.contains('item-crossed-out')) {
                    event.preventDefault();
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                item.classList.add('item-crossed-out');

                if (clickSound) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(error => {
                        console.error("Error playing audio:", error);
                    });
                }
            });
        });
    }
});