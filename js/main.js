(() => {
    const DOT_TEMPLATE = `
        <div class="gallery-category-dot"></div>
    `;

    const galleryCategories = document.querySelectorAll('.gallery-category');
    galleryCategories.forEach((categoryElement) => {
        const categoryImageItems = categoryElement.querySelectorAll('.gallery-category-image-item');

        const dotElenets = [];

        let currentIndex = Array.from(categoryImageItems).findIndex((item) => item.dataset.visible === 'true');
        if (currentIndex === -1) currentIndex = 0;

        const changeImageOnCategory = (newIndex) => {
            currentIndex = newIndex;

            categoryImageItems.forEach((item, i) => {
                item.dataset.visible = (i === currentIndex).toString();
                dotElenets[i].dataset.active = (i === currentIndex).toString();
            });

            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }

        // Create dots
        const dotsContainer = categoryElement.querySelector('.gallery-category-dots-container');
        categoryImageItems.forEach(() => {
            dotsContainer.insertAdjacentHTML('beforeend', DOT_TEMPLATE);

            const dotElement = dotsContainer.lastElementChild;

            dotElenets.push(dotElement);

            dotElement.addEventListener('click', (event) => {
                event.stopPropagation();

                const dotIndex = dotElenets.indexOf(dotElement);
                changeImageOnCategory(dotIndex);
            });
        });

        // Handle click
        categoryElement.addEventListener('click', (event) => {
            event.stopPropagation();

            if (categoryElement.dataset.selected !== 'true') {
                galleryCategories.forEach((el) => el.dataset.selected = 'false');
                categoryElement.dataset.selected = 'true';
    
                const onTransitionEnd = (e) => {
                    if (e.propertyName === 'height') {
                        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                        categoryElement.removeEventListener('transitionend', onTransitionEnd);
                    }
                };
    
                categoryElement.addEventListener('transitionend', onTransitionEnd);
            } else {
                const rect = categoryElement.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                
                if (clickX < rect.width / 2) {
                    // clicked on left side
                    changeImageOnCategory((currentIndex - 1 + categoryImageItems.length) % categoryImageItems.length);
                } else {
                    // clicked on right side
                    changeImageOnCategory((currentIndex + 1) % categoryImageItems.length);
                }
            }
        });

        changeImageOnCategory(currentIndex);
    });
})();
