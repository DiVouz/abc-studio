(() => {
    // GALLERY

    const DOT_TEMPLATE = `
        <div class="gallery-category-dot"></div>
    `;

    const galleryCategories = document.querySelectorAll('.gallery-category');
    galleryCategories.forEach((categoryElement) => {
        const categoryImageItems = categoryElement.querySelectorAll('.gallery-category-image-item');

        const dotElenets = [];

        let currentIndex = Array.from(categoryImageItems).findIndex((item) => item.dataset.visible === 'true');
        if (currentIndex === -1) currentIndex = 0;

        let isDragging = false;
        let isLastClickDrag = false;
        let dragStartX = 0;

        const changeImageOnCategory = (newIndex, shouldScroll = true) => {
            currentIndex = newIndex;

            categoryImageItems.forEach((item, i) => {
                item.dataset.visible = (i === currentIndex).toString();
                dotElenets[i].dataset.active = (i === currentIndex).toString();
            });

            if (shouldScroll === true) {
                categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }

        const onMouseDown = (event) => {
            if (isDragging) return;

            event.stopImmediatePropagation();
            event.preventDefault();

            isDragging = true;
            dragStartX = event.clientX || event.touches[0].clientX;
        };

        const onMouseUp = (event) => {
            if (!isDragging) return;

            event.stopPropagation();
            event.preventDefault();

            isDragging = false;
            const dragEndX = event.clientX || event.changedTouches[0].clientX;
            const dragDistance = dragEndX - dragStartX;
            const dragThreshold = 50; // pixels

            if (Math.abs(dragDistance) >= dragThreshold) {
                isLastClickDrag = true;

                if (dragDistance > 0) {
                    // dragged right
                    changeImageOnCategory((currentIndex - 1 + categoryImageItems.length) % categoryImageItems.length);
                } else {
                    // dragged left
                    changeImageOnCategory((currentIndex + 1) % categoryImageItems.length);
                }
            }
        };

        // Create dots
        const dotsContainer = categoryElement.querySelector('.gallery-category-dots-container');
        categoryImageItems.forEach(() => {
            dotsContainer.insertAdjacentHTML('beforeend', DOT_TEMPLATE);

            const dotElement = dotsContainer.lastElementChild;

            dotElenets.push(dotElement);

            dotElement.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                event.preventDefault();

                const dotIndex = dotElenets.indexOf(dotElement);
                changeImageOnCategory(dotIndex);
            });
        });

        // Handle click
        categoryElement.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();

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
                if (isLastClickDrag === true) {
                    isLastClickDrag = false;
                    return;
                }

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

        categoryElement.addEventListener('mousedown', onMouseDown);
        categoryElement.addEventListener('touchstart', onMouseDown);

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchend', onMouseUp);

        changeImageOnCategory(currentIndex, false);
    });

    // LANGUAGE

    const LANGUAGE = Object.freeze({
        EN: 'en',
        EL: 'el',
    });

    document.querySelector('#button-language-el').addEventListener('click', (event) => setLanguage(LANGUAGE.EN));
    document.querySelector('#button-language-en').addEventListener('click', (event) => setLanguage(LANGUAGE.EL));

    function isValidLanguage(lang) {
        for (const key in LANGUAGE) {
            if (LANGUAGE[key] === lang) return true;
        }
        return false;
    }

    function setLanguage(lang) {
        if (!isValidLanguage(lang)) {
            return setLanguage(LANGUAGE.EL);
        }

        if (document.documentElement.lang === lang) return;

        document.documentElement.lang = lang;

        let url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url.href);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    setLanguage(langParam);

    // THEME

    const THEME = Object.freeze({
        DARK: 'dark',
        LIGHT: 'light',
    });

    document.querySelector('#button-theme-light').addEventListener('click', (event) => setTheme(THEME.DARK));
    document.querySelector('#button-theme-dark').addEventListener('click', (event) => setTheme(THEME.LIGHT));

    function isValidTheme(theme) {
        for (const key in THEME) {
            if (THEME[key] === theme) return true;
        }
        return false;
    }

    function setTheme(newTheme) {
        if (!isValidTheme(newTheme)) {
            return setTheme(THEME.LIGHT);
        }

        if (document.body.dataset.theme === newTheme) return;

        document.body.dataset.theme = newTheme;

        localStorage.setItem('theme', newTheme);
    }

    setTheme(localStorage.getItem('theme'));
})();
