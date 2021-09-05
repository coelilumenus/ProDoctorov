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

                document.querySelector('#root').append(item);
            }
        }
    }

    function showUsers() {
        getResource('https://json.medrating.org/users/')
            .then(data => {
                data.forEach(({
                    id,
                    name
                }) => {
                    new User(id, name).createItem();
                });
            });
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
                    createAlbumWrapper(this.albumId, this.parentUser);
                    showPhotos(this.albumId);
                } else {
                    item.classList.remove('body__item-active');
                    hideElements('data-parentAlbum', this.albumId);
                }
            });

            document.querySelector(`[data-userId="${this.parentUser}"]`).after(item);
        }
    }
    
    /* creating wrapper before showing photos */
    function createAlbumWrapper(parentAlbum, parentUser) {
        const albumWrapper = createNewDiv('body__album-wrapper');
        albumWrapper.setAttribute('data-parentAlbum', parentAlbum);
        albumWrapper.setAttribute('data-parentUser', parentUser);
        
        document.querySelector(`[data-albumId="${parentAlbum}"]`).after(albumWrapper);
    }

    function showAlbums(parentUser) {
        getResource(`https://json.medrating.org/albums?userId=${parentUser}`)
            .then(data => {
                data.forEach(({
                    id,
                    title
                }) => {
                    new Album(id, title, parentUser).createItem();
                });
            });
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

        createItem() {
            /* creating photos */
            const photo = createNewDiv('body__album-item');
            photo.setAttribute('data-photoId', this.photoId);
            photo.innerHTML += `<img src="${this.thumbnailUrl}" alt="${this.photoTitle}" width="150px" height="150px">`;
            
            /* size photo functional */
            photo.addEventListener('click', (e) => {
                const target = e.target;
                if (!target.classList.contains('album-item__importance')) {
                    sizePhoto(this.url, this.photoTitle);
                }
            });
            
            /* tooltip functional */
            const tooltip = createNewDiv('tooltip', 'hide');
            tooltip.innerText = `${this.photoTitle}`;
            photo.append(tooltip);
            
            showTooltip(photo, tooltip);
            
            /* creating importance-element */
            const photoImportance = createNewDiv('album-item__importance');

            photoImportance.addEventListener('click', () => {
                if (!localStorage.getItem(`${this.photoId}`)) {
                    localStorage.setItem(`${this.photoId}`, [this.parentAlbum, this.url, this.thumbnailUrl, this.photoTitle, this.photoId]);
                } else {
                    localStorage.removeItem(`${this.photoId}`);
                    photo.classList.remove('album__item-active');
                }

                showImportance();
            });
            
            photo.append(photoImportance);
            
            /* add photos to wrapper */
            document.querySelector(`[data-parentAlbum="${this.parentAlbum}"]`).append(photo);
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
        const photos = document.querySelectorAll('.body__album-item');
        photos.forEach(item => {
            if (localStorage.getItem(item.getAttribute('data-photoId'))) {
                item.classList.add('album__item-active');
            }
        });
    }

    function showPhotos(parentAlbum) {
        getResource(`https://json.medrating.org/photos?albumId=${parentAlbum}`)
            .then(data => {
                data.forEach(({
                    id,
                    title,
                    thumbnailUrl,
                    url
                }) => {
                    new Photo(id, title, thumbnailUrl, url, parentAlbum).createItem();
                });
            })
            .then(() => {
                showImportance();
            });
    }

    /* main page */
    const catalog = document.querySelector('#catalog'),
          important = document.querySelector('#important');
    
    document.addEventListener('click', (e) => {
        if (e.target === catalog) {
            catalog.classList.add('header-menu__item-active');
            important.classList.remove('header-menu__item-active');
            
            showUsers();
        } else if (e.target === important || e.target.classList.contains('header-menu__important')) {
            document.querySelectorAll('.body__item').forEach(item => item.remove());
            
            important.classList.add('header-menu__item-active');
            catalog.classList.remove('header-menu__item-active');
            
            showFavorite();
        }
    });
    
    showUsers();
    
    if (catalog.classList.contains('header-menu__item-active')) {

    }
});