"use strict";
import getResource from './services/fetchAPI.js';
import ServiceComponents from './services/serviceComponents.js';
import templates from './markup/templates.js';
import AbstractElement from './abstract/abstractElement.js';
import { createUsers } from './components/Users.js';
import { createUserAlbums, destroyUserAlbums } from './components/Albums.js';
import { createPhotosAlbum, createPhotosWrapper, destroyPhotosAlbum } from './components/Photos.js';



window.addEventListener('DOMContentLoaded', () => {
    
    createUsers();
    
    // function destroyUserAlbums(userId) {
    //     const parentUser = document.querySelector(`[data-userId="${userId}"]`);
    //     if (!parentUser.classList.contains('body__item-active')) {
    //         serviceComponents.destroyElementsByDataId('data-parentUser', userId);
    //     }
    // }
    
    // getResource('https://json.medrating.org/users/')
    // .then(data => {
    //         data.forEach(({ id, name }) => {
    //             if (name) {
    //                 const user = new AbstractElement(); 
    //                 user._setClasses('body__item');
    //                 user._setAttribute('data-userId', id);
    //                 user._template(templates.bodyTitle(name));
    //                 user._setActivityListener('body__item-active', id);
    //                 user._setListener('click', createUserAlbums, id);
    //                 user._setListener('click', destroyUserAlbums, id);
    //                 user._render('#root');
    //             }
    //         });
    // });   
    
    // function createUserAlbums(userId) {
    //     const parentUser = document.querySelector(`[data-userId="${userId}"]`);
    //     if (parentUser.classList.contains('body__item-active')) {
    //         getResource(`https://json.medrating.org/albums?userId=${userId}`)
    //         .then(data => {
    //                 data.forEach(({ id, title }) => {
    //                     const album = new AbstractElement();
    //                     album._setClasses('body__item', 'body__item-small');
    //                     album._setAttribute('data-albumId', id);
    //                     album._setAttribute('data-parentUser', userId);
    //                     album._template(templates.bodyTitle(title));
    //                     album._setActivityListener('body__item-active');
    //                     album._setListener('click', createPhotosWrapper, id, userId);
    //                     album._setListener('click', createPhotosAlbum, id);
    //                     album._setListener('click', destroyPhotosAlbum, id);
    //                     album._render(`[data-userid="${userId}"]`, 'after');
    //                 });
    //         });
    //     }
    // }
    
    // function createPhotosWrapper(parentAlbum, parentUser) {
    //     const wrapper = new AbstractElement();
    //     wrapper._setClasses('album-wrapper');
    //     wrapper._setAttribute('data-parentAlbum', parentAlbum);
    //     wrapper._setAttribute('data-parentUser', parentUser);
    //     wrapper._render(`[data-albumId="${parentAlbum}"]`, 'after');
    // }
    
    // function destroyPhotosAlbum(albumId) {
    //     const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    //     if (!parentAlbum.classList.contains('body__item-active')) {
    //         serviceComponents.destroyElementsByDataId('data-parentAlbum', albumId);
    //     }
    // }
    
    // function createPhotosAlbum(albumId) {
    //     const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    //     if (parentAlbum.classList.contains('body__item-active')) {
    //         getResource(`https://json.medrating.org/photos?albumId=${albumId}`)
    //         .then(data => {
    //             data.forEach(({ id, title, thumbnailUrl, url }) => {
    //                 const photo = new AbstractElement();
    //                 photo._setClasses('album-item');
    //                 photo._setAttribute('data-photoId', id);
    //                 photo._template(templates.photo(thumbnailUrl, title));
    //                 photo._render(`[data-parentAlbum="${albumId}"]`);
    //             });
    //         });
    //     }
    // }
    // function showPhotos(parentAlbum, parentUser) {
    //     const spiner = components.createSpinner(2);
    //     document.querySelector(`[data-albumId="${parentAlbum}"]`).after(spiner);

    //     getResource(`https://json.medrating.org/photos?albumId=${parentAlbum}`)
    //         .then(data => {
    //             createAlbumWrapper(parentAlbum, parentUser);
    //             data.forEach(({
    //                 id,
    //                 title,
    //                 thumbnailUrl,
    //                 url
    //             }) => {
    //                 new Photo(id, title, thumbnailUrl, url, parentAlbum).createItem();
    //             });
    //         })
    //         .then(() => {
    //             showImportance();
    //         })
    //         .catch(() => {
    //             const error = components.createError(2);
    //             document.querySelector(`[data-albumId="${parentAlbum}"]`).after(error);
    //         })
    //         .finally(() => components.destroySpinner(2));
    // }

    // /* photos */
    // class Photo {
    //     constructor(id, title, thumbnailUrl, url, parent) {
    //         this.photoId = id;
    //         this.photoTitle = title;
    //         this.thumbnailUrl = thumbnailUrl;
    //         this.url = url;
    //         this.parentAlbum = parent;
    //     }

    //     createItem(isFavorite = false) { // isFavorite - for use this method to create photos at favorit-catalog
    //         /* creating photos */
    //         const photo = createNewDiv('album-item');
    //         photo.setAttribute('data-photoId', this.photoId);
    //         photo.innerHTML += `<img src="${this.thumbnailUrl}" alt="${this.photoTitle}" width="150px" height="150px">`;

    //         if (isFavorite) {
    //             photo.innerHTML += `<p class="album-item__favorite-title">${this.photoTitle}</p>`;
    //         }

    //         /* size photo functional */
    //         photo.addEventListener('click', (e) => {
    //             const target = e.target;
    //             if (!target.classList.contains('album-item__importance')) {
    //                 sizePhoto(this.url, this.photoTitle);
    //             }
    //         });

    //         /* tooltip functional */
    //         if (!isFavorite) {
    //             const tooltip = createNewDiv('tooltip', 'hide');
    //             tooltip.innerText = `${this.photoTitle}`;
    //             photo.append(tooltip);

    //             showTooltip(photo, tooltip);
    //         }

    //         /* creating importance-element */
    //         const photoImportance = createNewDiv('album-item__importance');

    //         photoImportance.addEventListener('click', () => {
    //             if (!localStorage.getItem(`${this.photoId}`)) {
    //                 storageWorker.addItem(`${this.photoId}`, [this.photoId, this.photoTitle, this.thumbnailUrl, this.url, this.parentAlbum]); // order of arguments is important
    //             } else {
    //                 storageWorker.deleteItem(`${this.photoId}`);
    //                 photo.classList.remove('album__item-active');
    //                 updateFavorites(); // optionally. If we want to update favorites immediately - use this function here
    //             }
    //             showImportance();
    //         });

    //         photo.append(photoImportance);
    //         showImportance();

    //         /* add photos to wrapper */
    //         if (!isFavorite) {
    //             document.querySelector(`[data-parentAlbum="${this.parentAlbum}"]`).append(photo);
    //         } else {
    //             document.querySelector('.album-wrapper__favorite').append(photo);
    //         }
    //     }
    // }
        
    // /* album */
    // class Album {
    //     constructor(id, title, parent) {
    //         this.albumId = id;
    //         this.albumTitle = title;
    //         this.parentUser = parent;
    //     }

    //     createItem() {
    //         const item = createNewDiv('body__item', 'body__item-small');
    //         item.setAttribute('data-albumId', this.albumId);
    //         item.setAttribute('data-parentUser', this.parentUser);
    //         item.innerHTML = `<p class="body__item-text">${this.albumTitle}</p>`;

    //         item.addEventListener('click', () => {
    //             if (!item.classList.contains('body__item-active')) {
    //                 item.classList.add('body__item-active');
    //                 showPhotos(this.albumId, this.parentUser);
    //             } else {
    //                 item.classList.remove('body__item-active');
    //                 hideElements('data-parentAlbum', this.albumId);
    //             }
    //         });

    //         document.querySelector(`[data-userId="${this.parentUser}"]`).after(item);
    //     }
    // }   
     
    //     getResource(`https://json.medrating.org/abums?userId=${parentUser}`)
    //         .then(data => {
    //             data.forEach(({
    //                 id,
    //                 title
    //             }) => {
    //                 new Album(id, title, parentUser).createItem();
    //             });
    //         })
    //         .catch(() => {
    //             const error = components.createSmallError(1, './images/error.png', 'Error', 'Сервер не отвечает', 'Уже работаем над этим');
    //             document.querySelector(`[data-userId="${parentUser}"]`).after(error);
    //         })
    //         .finally(() => components.destroySpinner(1));
    // }
        
    // createItem() {
    //     if (this.userName) {
    //         const item = createNewDiv('body__item');
    //         item.setAttribute('data-userId', this.userId);
    //         item.innerHTML = `<p class="body__item-text">${this.userName}</p>`;

    //         item.addEventListener('click', () => {
    //             if (!item.classList.contains('body__item-active')) {
    //                 item.classList.add('body__item-active');
    //                 showAlbums(this.userId);
    //             } else {
    //                 item.classList.remove('body__item-active');
    //                 hideElements('data-parentUser', this.userId);
    //             }
    //         });

    //         document.querySelector('.catalog__items').append(item);
    //     }
    // }
    
    // function showUsers() {
    //     const wrapper = createNewDiv('catalog__items'),
    //         spinner = components.createSpinner(3);
    //     document.querySelector('#root').append(wrapper);
    //     document.querySelector('#root').append(spinner);

    //     getResource('https://json.medrating.org/users/')
    //         .then(data => {
    //             data.forEach(({
    //                 id,
    //                 name
    //             }) => {
    //                 new User(id, name).createItem();
    //             });
    //         })
    //         .catch(() => {
    //             const error = components.createError(4);
    //             document.querySelector('.catalog__items').append(error);
    //         })
    //         .finally(() => components.destroySpinner(3));
    // }
    
    // function showAlbums(parentUser) {
    //     document.querySelector(`[data-userId="${parentUser}"]`).after(components.createSpinner(1));




    
    // /* creating wrapper before showing photos */
    // function createAlbumWrapper(parentAlbum, parentUser) {
    //     const wrapper = createNewDiv('album-wrapper');
    //     wrapper.setAttribute('data-parentAlbum', parentAlbum);
    //     wrapper.setAttribute('data-parentUser', parentUser);
        
    //     document.querySelector(`[data-albumId="${parentAlbum}"]`).after(wrapper);
    // }
    
    // function showPhotos(parentAlbum, parentUser) {
    //     const spiner = components.createSpinner(2);
    //     document.querySelector(`[data-albumId="${parentAlbum}"]`).after(spiner);

    //     getResource(`https://json.medrating.org/photos?albumId=${parentAlbum}`)
    //         .then(data => {
    //             createAlbumWrapper(parentAlbum, parentUser);
    //             data.forEach(({
    //                 id,
    //                 title,
    //                 thumbnailUrl,
    //                 url
    //             }) => {
    //                 new Photo(id, title, thumbnailUrl, url, parentAlbum).createItem();
    //             });
    //         })
    //         .then(() => {
    //             showImportance();
    //         })
    //         .catch(() => {
    //             const error = components.createError(2);
    //             document.querySelector(`[data-albumId="${parentAlbum}"]`).after(error);
    //         })
    //         .finally(() => components.destroySpinner(2));
    // }

    // /* photos */
    // class Photo {
    //     constructor(id, title, thumbnailUrl, url, parent) {
    //         this.photoId = id;
    //         this.photoTitle = title;
    //         this.thumbnailUrl = thumbnailUrl;
    //         this.url = url;
    //         this.parentAlbum = parent;
    //     }

    //     createItem(isFavorite = false) { // isFavorite - for use this method to create photos at favorit-catalog
    //         /* creating photos */
    //         const photo = createNewDiv('album-item');
    //         photo.setAttribute('data-photoId', this.photoId);
    //         photo.innerHTML += `<img src="${this.thumbnailUrl}" alt="${this.photoTitle}" width="150px" height="150px">`;

    //         if (isFavorite) {
    //             photo.innerHTML += `<p class="album-item__favorite-title">${this.photoTitle}</p>`;
    //         }

    //         /* size photo functional */
    //         photo.addEventListener('click', (e) => {
    //             const target = e.target;
    //             if (!target.classList.contains('album-item__importance')) {
    //                 sizePhoto(this.url, this.photoTitle);
    //             }
    //         });

    //         /* tooltip functional */
    //         if (!isFavorite) {
    //             const tooltip = createNewDiv('tooltip', 'hide');
    //             tooltip.innerText = `${this.photoTitle}`;
    //             photo.append(tooltip);

    //             showTooltip(photo, tooltip);
    //         }

    //         /* creating importance-element */
    //         const photoImportance = createNewDiv('album-item__importance');

    //         photoImportance.addEventListener('click', () => {
    //             if (!localStorage.getItem(`${this.photoId}`)) {
    //                 storageWorker.addItem(`${this.photoId}`, [this.photoId, this.photoTitle, this.thumbnailUrl, this.url, this.parentAlbum]); // order of arguments is important
    //             } else {
    //                 storageWorker.deleteItem(`${this.photoId}`);
    //                 photo.classList.remove('album__item-active');
    //                 updateFavorites(); // optionally. If we want to update favorites immediately - use this function here
    //             }
    //             showImportance();
    //         });

    //         photo.append(photoImportance);
    //         showImportance();

    //         /* add photos to wrapper */
    //         if (!isFavorite) {
    //             document.querySelector(`[data-parentAlbum="${this.parentAlbum}"]`).append(photo);
    //         } else {
    //             document.querySelector('.album-wrapper__favorite').append(photo);
    //         }
    //     }
    // }

    // function showTooltip(parent, item) {
    //     parent.addEventListener('mouseover', (e) => {
    //         if (!e.target.classList.contains('album-item__importance')) {
    //             item.classList.remove('hide');
    //         }
    //     });

    //     parent.addEventListener('mouseout', (e) => {
    //         if (!e.target.classList.contains('album-item__importance')) {
    //             item.classList.add('hide');
    //         }
    //     });

    //     parent.addEventListener('mousemove', (e) => {
    //         if (!e.target.classList.contains('album-item__importance')) {
    //             item.style.cssText = `top: ${e.clientY + 30}px; left: ${e.clientX - 70}px`;
    //         }
    //     });
    // }

    // function sizePhoto(url, title) {
    //     const modal = createNewDiv('modal');
    //     modal.innerHTML = ` <div class="modal-close"></div>  
    //                         <div class="modal-content">   
    //                             <img src="${url}" alt="${title}"> 
    //                         </div>`;
    //     document.querySelector('#root').append(modal);
    //     document.body.style.overflow = 'hidden';

    //     document.querySelector('.modal').addEventListener('click', (e) => {
    //         if (!e.target.classList.contains('modal-content')) {
    //             document.body.style.overflow = '';
    //             document.querySelector('.modal').remove();
    //         }
    //     });

    //     document.addEventListener('keydown', (e) => {
    //         if (e.code === 'Escape' && document.querySelector('.modal')) {
    //             document.body.style.overflow = '';
    //             document.querySelector('.modal').remove();
    //         }
    //     });
    // }

    // function showImportance() {
    //     const photos = document.querySelectorAll('.album-item');
    //     photos.forEach(item => {
    //         if (localStorage.getItem(item.getAttribute('data-photoId'))) {
    //             item.classList.add('album__item-active');
    //         }
    //     });
    // }




    // /* main page */
    // const catalog = document.querySelector('#catalog'),
    //     important = document.querySelector('#important'),
    //     importantInner = document.querySelector('.header-menu__important');

    // document.addEventListener('click', (e) => {
    //     if (e.target === catalog && !catalog.classList.contains('header-menu__item-active')) {
    //         document.querySelector('.favorite__items').remove();

    //         catalog.classList.add('header-menu__item-active');
    //         important.classList.remove('header-menu__item-active');
            
    //         showUsers();
    //     } else if ((e.target === important || e.target === importantInner) && !important.classList.contains('header-menu__item-active')) {
    //         document.querySelector('.catalog__items').remove();

    //         important.classList.add('header-menu__item-active');
    //         catalog.classList.remove('header-menu__item-active');

    //         showFavorites();
    //     }
    // });
    
    // function updateFavorites() { 
    //     try { // if catch any bugs document will be working anyway
    //         if (document.querySelector('.favorite__items')) {
    //             document.querySelector('.favorite__items').remove();
    //             showFavorites();
    //         }
    //     } catch (error) {
    //         return;
    //     }
    // }

    // function showFavorites() {
    //     const wrapper = createNewDiv('favorite__items');
    //     document.querySelector('#root').append(wrapper);

    //     if (storageWorker.getKeys() !== undefined) {
    //         wrapper.classList.add('album-wrapper__favorite');
    //         storageWorker.getKeys().forEach(itemId => {
    //             const item = localStorage.getItem(itemId).split(',');
    //             new Photo(item[0], item[1], item[2], item[3], item[4]).createItem(true);
    //             showImportance();
    //         });
    //     } else {
    //         const error = components.createError(3, 'items__error', './images/empty.png', 'Список избранного пуст', 'Добавляйте изображения, нажимая на звёздочки');
    //         document.querySelector('.favorite__items').append(error);
    //     }
    // }

    // function showUsers() {
    //     const wrapper = createNewDiv('catalog__items'),
    //         spinner = components.createSpinner(3);
    //     document.querySelector('#root').append(wrapper);
    //     document.querySelector('#root').append(spinner);

    //     getResource('https://json.medrating.org/users/')
    //         .then(data => {
    //             data.forEach(({
    //                 id,
    //                 name
    //             }) => {
    //                 new User(id, name).createItem();
    //             });
    //         })
    //         .catch(() => {
    //             const error = components.createError(4);
    //             document.querySelector('.catalog__items').append(error);
    //         })
    //         .finally(() => components.destroySpinner(3));
    // }
});