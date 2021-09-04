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
    function createElement(attribute, id, text) {
        const element = document.createElement('div');
        element.classList.add('body__item');
        element.setAttribute(attribute, id);
        element.innerHTML = `<p class="body__item-text">${text}</p>`;
        return element;
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
                const item = createElement('data-userId', this.userId, this.userName);

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
            const item = createElement('data-albumId', this.albumId, this.albumTitle);
            item.classList.add('body__item-small');
            item.setAttribute('data-parentUser', this.parentUser);

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
        const albumWrapper = document.createElement('div');
        albumWrapper.classList.add('body__album-wrapper');
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
            const photo = document.createElement('div');
            photo.classList.add('body__album-item');
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
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.classList.add('hide');
            tooltip.innerText = `${this.photoTitle}`;
            photo.append(tooltip);
            
            photo.addEventListener('mouseover', (e) => {
                if (!e.target.classList.contains('album-item__importance')) {
                    tooltip.classList.remove('hide');
                }
            });
            
            photo.addEventListener('mouseout', (e) => {
                if (!e.target.classList.contains('album-item__importance')) {
                    tooltip.classList.add('hide');
                }
            });
            
            photo.addEventListener('mousemove', (e) => {
                if (!e.target.classList.contains('album-item__importance')) {
                    tooltip.style.cssText = `top: ${e.clientY + 30}px; left: ${e.clientX - 70}px`; 
                }
            });
            
            
            
            /* creating importance-element */
            const photoImportance = document.createElement('div');
            photoImportance.classList.add('album-item__importance');

            photoImportance.addEventListener('click', () => {
                if (!localStorage.getItem(`${this.photoId}`)) {
                    localStorage.setItem(`${this.photoId}`, [this.parentAlbum, this.url, this.thumbnailUrl, this.photoTitle, this.photoId]);
                } else {
                    localStorage.removeItem(`${this.photoId}`);
                    photo.classList.remove('album__item-active');
                }

                showImportance();
            });
            
            /* add photos to wrapper */
            photo.append(photoImportance);
            document.querySelector(`[data-parentAlbum="${this.parentAlbum}"]`).append(photo);

        }
    }
    
    function showTooltip(item, text) {
        item.addEventListener('mousemove', (e) => {
            const target = e.target;
            
            if (!target.classList.contains('album-item__importance')) {
                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.innerText = `${text}`;
                item.append(tooltip);
                
                // target.addEventListener('mousemove', (e) => {
                   tooltip.style.cssText = `top: ${e.clientY}px; left: ${e.clientX}px`; 
                // });
            }
            
        });
        item.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (!target.classList.contains('album-item__importance')) {
                setTimeout(() => {
                    document.querySelector('.tooltip').remove();
                }, 200);
            }
        });
    }

    function sizePhoto(url, title) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = ` <div class="modal-close"></div>  
                            <div class="modal-content">   
                                <img src="${url}" alt="${title}">    
                            </div>`;

        document.querySelector('#root').append(modal);
        document.body.style.overflow = 'hidden';

        document.querySelector('.modal').addEventListener('click', (e) => {
            const target = e.target;
            if (!target.classList.contains('modal-content')) {
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
    const catalog = document.querySelector('#catalog');
    if (catalog.classList.contains('header-menu__item-active')) {
        showUsers();
    }
});