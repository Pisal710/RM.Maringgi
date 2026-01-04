// Carousel functionality
const slide = document.querySelector('.carousel-slide');
const images = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let counter = 0;
const size = images[0]?.clientWidth || 0;

// Ensure slide moves correctly on window resize
window.addEventListener('resize', () => {
    slide.style.transition = "none";
    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
});

// Next button functionality
nextBtn?.addEventListener('click', () => {
    if (counter >= images.length - 1) return;
    slide.style.transition = "transform 0.5s ease-in-out";
    counter++;
    slide.style.transform = 'translateX(' + (-100 * counter) + '%)';
});

// Previous button functionality
prevBtn?.addEventListener('click', () => {
    if (counter <= 0) return;
    slide.style.transition = "transform 0.5s ease-in-out";
    counter--;
    slide.style.transform = 'translateX(' + (-100 * counter) + '%)';
});

// Auto play carousel every 5 seconds
setInterval(() => {
    if (counter >= images.length - 1) {
        counter = -1;
    }
    slide.style.transition = "transform 0.5s ease-in-out";
    counter++;
    slide.style.transform = 'translateX(' + (-100 * counter) + '%)';
}, 5000);
