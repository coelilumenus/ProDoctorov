window.addEventListener('DOMContentLoaded', () => {

    /* fetchAPI module */
    async function getResource(url) {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    /* services */
    const storageWorker = {
        // update list of important items
        getKeys: () => {
            if (localStorage.getItem('importantKeys')) {
                return localStorage.getItem('importantKeys').split(',');
            }
        },

        addItem: (itemId, arguments) => {
            if (!localStorage.getItem('importantKeys')) {
                localStorage.setItem('importantKeys', itemId);
                localStorage.setItem(itemId, arguments);
            } else {
                const oldKeys = localStorage.getItem('importantKeys').split(',');
                const newKeys = oldKeys.concat(itemId);
                localStorage.setItem('importantKeys', newKeys);
                localStorage.setItem(itemId, arguments);
            }
        },

        deleteItem: (itemId) => {
            const oldKeys = localStorage.getItem('importantKeys').split(',');
            if (oldKeys.indexOf(itemId) !== -1) {
                const newKeys = oldKeys.filter(item => item !== itemId);
                localStorage.setItem('importantKeys', newKeys);
                localStorage.removeItem(itemId);
            }
        }

    };

    function createSpinner(spinnerClass = 'spinner') {
        const spinner = createNewDiv(spinnerClass);
        spinner.innerHTML = `<img src="./images/spinner.gif" alt="spinner" width="48px" height="48px">`;
        return spinner;
    }

    function createError(
        errorClass = 'items__error',
        url = './images/error.png',
        title = 'Сервер не отвечает',
        description = 'Уже работаем над этим'
        ) {
            const error = createNewDiv(errorClass);
            error.innerHTML = ` <img src="${url}" alt="Eror" width="264px" height="198px">
                                        <div class="error-wrapper">
                                            <h2 class="items__error-title">${title}</h2>
                                            <p class="items__error-description">${description}</p>
                                        </div>`;
            return error;
    }

    function createNewDiv(...classes) {
        const div = document.createElement('div');
        classes.forEach(item => div.classList.add(item));
        return div;
    }

    function hideElements(dataAttribute, itemId) {
        const items = document.querySelectorAll(`[${dataAttribute}="${itemId}"]`);
        items.forEach(item => {
            item.remove();
        });
    }

    /* user */
    class User {
        constructor(id, name) {
            this.userId = id;
            this.userName = name;
        }

        createItem() {
            if (this.userName) {
                const item = createNewDiv('body__item');
                item.setAttribute('data-userId', this.userId);
                item.innerHTML = `<p class="body__item-text">${this.userName}</p>`;

                item.addEventListener('click', () => {
                    if (!item.classList.contains('body__item-active')) {
                        item.classList.add('body__item-active');
                        showAlbums(this.userId);
                    } else {
                        item.classList.remove('body__item-active');
                        hideElements('data-parentUser', this.userId);
                    }
                });

                document.querySelector('.catalog__items').append(item);
            }
        }
    }

    /* album */
    class Album {
        constructor(id, title, parent) {
            this.albumId = id;
            this.albumTitle = title;
            this.parentUser = parent;
        }

        createItem() {
            const item = createNewDiv('body__item', 'body__item-small');
            item.setAttribute('data-albumId', this.albumId);
            item.setAttribute('data-parentUser', this.parentUser);
            item.innerHTML = `<p class="body__item-text">${this.albumTitle}</p>`;

            item.addEventListener('click', () => {
                if (!item.classList.contains('body__item-active')) {
                    item.classList.add('body__item-active');
                    showPhotos(this.albumId, this.parentUser);
                } else {
                    item.classList.remove('body__item-active');
                    hideElements('data-parentAlbum', this.albumId);
                }
            });

            document.querySelector(`[data-userId="${this.parentUser}"]`).after(item);
        }
    }

    function showAlbums(parentUser) {
        const spiner = createSpinner('spinner-small');
        spiner.setAttribute('data-parentUser', parentUser);
        document.querySelector(`[data-userId="${parentUser}"]`).after(spiner);

        getResource(`https://json.medrating.org/albums?userId=${parentUser}`)
            .then(data => {
                data.forEach(({
                    id,
                    title
                }) => {
                    new Album(id, title, parentUser).createItem();
                });
            })
            .catch(() => {
                const error = createError('items__error-small');
                error.setAttribute('data-parentUser', parentUser);
                document.querySelector(`[data-userId="${parentUser}"]`).after(error);
            })
            .finally(() => document.querySelector('.spinner-small').remove());
    }

    /* photos */
    class Photo {
        constructor(id, title, thumbnailUrl, url, parent) {
            this.photoId = id;
            this.photoTitle = title;
            this.thumbnailUrl = thumbnailUrl;
            this.url = url;
            this.parentAlbum = parent;
        }

        createItem(isFavorite = false) {
            /* creating photos */
            const photo = createNewDiv('album-item');
            photo.setAttribute('data-photoId', this.photoId);
            photo.innerHTML += `<img src="${this.thumbnailUrl}" alt="${this.photoTitle}" width="150px" height="150px">`;

            if (isFavorite) {
                photo.innerHTML += `<p class="album-item__favorite-title">${this.photoTitle}</p>`;
            }

            /* size photo functional */
            photo.addEventListener('click', (e) => {
                const target = e.target;
                if (!target.classList.contains('album-item__importance')) {
                    sizePhoto(this.url, this.photoTitle);
                }
            });

            /* tooltip functional */
            if (!isFavorite) {
                const tooltip = createNewDiv('tooltip', 'hide');
                tooltip.innerText = `${this.photoTitle}`;
                photo.append(tooltip);

                showTooltip(photo, tooltip);
            }

            /* creating importance-element */
            const photoImportance = createNewDiv('album-item__importance');

            photoImportance.addEventListener('click', () => {
                if (!localStorage.getItem(`${this.photoId}`)) {
                    storageWorker.addItem(`${this.photoId}`, [this.photoId, this.photoTitle, this.thumbnailUrl, this.url, this.parentAlbum]);
                } else {
                    storageWorker.deleteItem(`${this.photoId}`);
                    photo.classList.remove('album__item-active');
                    updateFavorites(); // optionally. If we want to update favorites immediately - use this function here
                }
                showImportance();
            });

            photo.append(photoImportance);
            showImportance();

            /* add photos to wrapper */
            if (!isFavorite) {
                document.querySelector(`[data-parentAlbum="${this.parentAlbum}"]`).append(photo);
            } else {
                document.querySelector('.album-wrapper__favorite').append(photo);
            }
        }
    }

    function showTooltip(parent, item) {
        parent.addEventListener('mouseover', (e) => {
            if (!e.target.classList.contains('album-item__importance')) {
                item.classList.remove('hide');
            }
        });

        parent.addEventListener('mouseout', (e) => {
            if (!e.target.classList.contains('album-item__importance')) {
                item.classList.add('hide');
            }
        });

        parent.addEventListener('mousemove', (e) => {
            if (!e.target.classList.contains('album-item__importance')) {
                item.style.cssText = `top: ${e.clientY + 30}px; left: ${e.clientX - 70}px`;
            }
        });
    }

    function sizePhoto(url, title) {
        const modal = createNewDiv('modal');
        modal.innerHTML = ` <div class="modal-close"></div>  
                            <div class="modal-content">   
                                <img src="${url}" alt="${title}"> 
                            </div>`;
        document.querySelector('#root').append(modal);
        document.body.style.overflow = 'hidden';

        document.querySelector('.modal').addEventListener('click', (e) => {
            if (!e.target.classList.contains('modal-content')) {
                document.body.style.overflow = '';
                document.querySelector('.modal').remove();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && document.querySelector('.modal')) {
                document.body.style.overflow = '';
                document.querySelector('.modal').remove();
            }
        });
    }

    function showImportance() {
        const photos = document.querySelectorAll('.album-item');
        photos.forEach(item => {
            if (localStorage.getItem(item.getAttribute('data-photoId'))) {
                item.classList.add('album__item-active');
            }
        });
    }

    /* creating wrapper before showing photos */
    function createAlbumWrapper(parentAlbum, parentUser) {
        const wrapper = createNewDiv('album-wrapper');
        wrapper.setAttribute('data-parentAlbum', parentAlbum);
        wrapper.setAttribute('data-parentUser', parentUser);

        document.querySelector(`[data-albumId="${parentAlbum}"]`).after(wrapper);
    }

    function showPhotos(parentAlbum, parentUser) {
        const spiner = createSpinner('spinner-small');
        spiner.setAttribute('data-parentAlbum', parentAlbum);
        spiner.setAttribute('data-parentUser', parentUser);
        document.querySelector(`[data-albumId="${parentAlbum}"]`).after(spiner);

        getResource(`https://json.medrating.org/photos?albumId=${parentAlbum}`)
            .then(data => {
                createAlbumWrapper(parentAlbum, parentUser);
                data.forEach(({
                    id,
                    title,
                    thumbnailUrl,
                    url
                }) => {
                    new Photo(id, title, thumbnailUrl, url, parentAlbum).createItem(false);
                });
            })
            .then(() => {
                showImportance();
            })
            .catch(() => {
                const error = createError('items__error-small');
                error.setAttribute('data-parentAlbum', parentAlbum);
                error.setAttribute('data-parentUser', parentUser);
                document.querySelector(`[data-albumId="${parentAlbum}"]`).after(error);
            })
            .finally(() => document.querySelector('.spinner-small').remove());
    }

    /* main page */
    const catalog = document.querySelector('#catalog'),
        important = document.querySelector('#important'),
        importantInner = document.querySelector('.header-menu__important');

    document.addEventListener('click', (e) => {
        if (e.target === catalog && !catalog.classList.contains('header-menu__item-active')) {
            document.querySelector('.favorite__items').remove();

            catalog.classList.add('header-menu__item-active');
            important.classList.remove('header-menu__item-active');
            
            showUsers();
        } else if ((e.target === important || e.target === importantInner) && !important.classList.contains('header-menu__item-active')) {
            document.querySelector('.catalog__items').remove();

            important.classList.add('header-menu__item-active');
            catalog.classList.remove('header-menu__item-active');

            showFavorites();
        }
    });
    
    function updateFavorites() { 
        try { // if catch any bugs document will be working anyway
            if (document.querySelector('.favorite__items')) {
                document.querySelector('.favorite__items').remove();
                showFavorites();
            }
        } catch (error) {
            return;
        }
    }

    function showFavorites() {
        const wrapper = createNewDiv('favorite__items');
        document.querySelector('#root').append(wrapper);

        if (storageWorker.getKeys() !== undefined) {
            wrapper.classList.add('album-wrapper__favorite');
            storageWorker.getKeys().forEach(itemId => {
                const item = localStorage.getItem(itemId).split(',');
                new Photo(item[0], item[1], item[2], item[3], item[4]).createItem(true);
                showImportance();
            });
        } else {
            const error = createError(
                'items__error', 
                './images/empty.png', 
                'Список избранного пуст', 
                'Добавляйте изображения, нажимая на звёздочки'
            );
            document.querySelector('.favorite__items').append(error);
        }
    }

    function showUsers() {
        const wrapper = createNewDiv('catalog__items'),
            spinner = createSpinner();
        document.querySelector('#root').append(wrapper);
        document.querySelector('#root').append(spinner);

        getResource('https://json.medrating.org/users/')
            .then(data => {
                data.forEach(({
                    id,
                    name
                }) => {
                    new User(id, name).createItem();
                });
            })
            .catch(() => {
                const error = createError();
                document.querySelector('.catalog__items').append(error);
            })
            .finally(() => document.querySelector('.spinner').remove());
    }

    showUsers();
});