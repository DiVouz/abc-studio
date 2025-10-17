(() => {
    const galleryCategories = document.querySelectorAll('.gallery-category');
    galleryCategories.forEach((categoryElement) => {
        categoryElement.addEventListener('click', () => {
            galleryCategories.forEach((el) => el.dataset.selected = 'false');
            categoryElement.dataset.selected = 'true';

            const onTransitionEnd = (e) => {
                if (e.propertyName === 'height') {
                    categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    categoryElement.removeEventListener('transitionend', onTransitionEnd);
                }
            };

            categoryElement.addEventListener('transitionend', onTransitionEnd);
        });

        const categoryImageItems = categoryElement.querySelectorAll('.gallery-category-image-item');
        
        let currentIndex = Array.from(categoryImageItems).findIndex((item) => item.dataset.visible === 'true');
        if (currentIndex === -1) currentIndex = 0;

        const categoryNavigationLeft = categoryElement.querySelectorAll('.gallery-category-navigation')[0];
        categoryNavigationLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + categoryImageItems.length) % categoryImageItems.length;
            changeImageOnCategory(categoryImageItems, categoryElement, currentIndex);
        });
        
        const categoryNavigationRight = categoryElement.querySelectorAll('.gallery-category-navigation')[1];
        categoryNavigationRight.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % categoryImageItems.length;
            changeImageOnCategory(categoryImageItems, categoryElement, currentIndex);
        });
    });

    function changeImageOnCategory(categoryImageItems, categoryElement, index) {
        categoryImageItems.forEach((item, i) => {
            item.dataset.visible = (i === index).toString();
            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        });
    }
})();
