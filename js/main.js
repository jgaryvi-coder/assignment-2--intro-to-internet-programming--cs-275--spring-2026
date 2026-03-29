let currentIndex = 0;
let totalSlides = 0;

const updateSlide = () => {
    const track = document.querySelector(`.carousel-slides`);
    track.style.transform = `translateX(-${currentIndex * 680}px)`;

    const prevBtn = document.querySelectorAll(`.carousel-navigation a`)[0];
    const nextBtn = document.querySelectorAll(`.carousel-navigation a`)[1];

    if (currentIndex === 0) {
        prevBtn.style.visibility = `hidden`;
    } else {
        prevBtn.style.visibility = `visible`;
    }

    if (currentIndex === totalSlides - 1) {
        nextBtn.style.visibility = `hidden`;
    } else {
        nextBtn.style.visibility = `visible`;
    }
};

const goNext = () => {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateSlide();
    }
};

const goPrev = () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
    }
};

const initCarousel = (count) => {
    totalSlides = count;
    const navLinks = document.querySelectorAll(`.carousel-navigation a`);
    const prevBtn = navLinks[0];
    const nextBtn = navLinks[1];

    prevBtn.addEventListener(`click`, (e) => {
        e.preventDefault();
        goPrev();
    });

    nextBtn.addEventListener(`click`, (e) => {
        e.preventDefault();
        goNext();
    });

    document.addEventListener(`keydown`, (e) => {
        if (e.key === `ArrowRight`) {
            goNext();
        } else if (e.key === `ArrowLeft`) {
            goPrev();
        }
    });
    updateSlide();
};

const jsonpCallback = (data) => {
    const slidesContainer = document.querySelector(`.carousel-slides`);
    let htmlContent = ``;

    data.forEach((album) => {
        htmlContent += `
            <div class="slide">
                <h2>${album.artist}</h2>
                <h3><a href="${album.url}">${album.album}</a></h3>
                <img src="${album.cover_image.path}" alt="${album.cover_image.alt_content}">
                <p class="credit">Credit: <a href="${album.cover_image.url}">${album.cover_image.credit}</a></p>
                <p class="review">${album.review.content}</p>
                <p class="source">&mdash;<a href="${album.review.url}">${album.review.source}</a></p>
            </div>
        `;
    });

    slidesContainer.innerHTML = htmlContent;
    initCarousel(data.length);
};

window.onload = () => {
    const script = document.createElement(`script`);
    script.src = `json/data.json`;
    document.body.appendChild(script);
};
