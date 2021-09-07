import getResource from '../services/fetchAPI.js';
import {serviceComponents} from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import StorageWorker from '../services/storageWorker.js';

const storageWorker = new StorageWorker('importantPhotos');

/* Используется для рендера фото на странице пользователей */
function createPhotosAlbum(albumId, parentUserId) {
    const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    
    if (parentAlbum.classList.contains('body__item-active')) {
        const spinner = serviceComponents.createSmallSpinner('photos');
        parentAlbum.after(spinner);  
        
        getResource(`https://json.medrating.org/photos?albumId=${albumId}`)
            .then(data => {
                data.forEach(({ id, title, thumbnailUrl, url }) => {
                    createPhoto(id, templates.photo(thumbnailUrl, title), `[data-parentAlbum="${albumId}"]`);
                    addTooltipFunctional(`[data-photoId="${id}"]`, templates.tooltip(title), 'album-item__importance');
                    addModalFunctional(`[data-photoId="${id}"]`, templates.sizedPhoto(url, title), 'album-item__importance');
                    addFavoriteElements(`[data-photoId="${id}"]`);
                    listenUpdatingFavorites(`[data-photoId="${id}"]`, id, title, thumbnailUrl, url, albumId);
                });
            })
            .then(() => {
                addActiveClassToFavorites();
            })
            .catch(() => {
                const error = serviceComponents.createSmallError('photos');
                error.setAttribute('data-parentAlbum', albumId);
                error.setAttribute('data-parentUser', parentUserId);
                parentAlbum.after(error); 
            })
            .finally(() => {
                serviceComponents.destroySpinner('photos');
            }); 
    }
}  

/* Используется для  рендера фото на странице избранного */
function createPhotosFavorite() {
    if (storageWorker.getKeys() !== undefined) {
    
        storageWorker.getKeys().forEach(itemId => {
            const [id, title, thumbnailUrl, url, albumId] =  localStorage.getItem(itemId).split(',');
            createPhoto(id, templates.favoritePhoto(thumbnailUrl, title), '[data-favoritePage="1"]');
            addModalFunctional(`[data-photoId="${id}"]`, templates.sizedPhoto(url, title), 'album-item__importance');
            addFavoriteElements(`[data-photoId="${id}"]`);
            listenUpdatingFavorites(`[data-photoId="${id}"]`, id, title, thumbnailUrl, url, albumId);
        });
        
        document.querySelector('[data-favoritePage="1"]').classList.add('album-wrapper__favorite');
        addActiveClassToFavorites();
        
    } else {
        const error = serviceComponents.createError('favoritePage', './images/empty.png', 'empty', 'Список избранного пуст', 'Добавляйте изображения, нажимая на звёздочки');
        document.querySelector('[data-favoritePage="1"]').append(error); 
    }
}

function createPhoto(id, template, renderSelector) {
    const photo = new AbstractElement();
    photo._setClasses('album-item');
    photo._setAttribute('data-photoId', id);
    photo._template(template);
    
    photo._render(renderSelector);
}

function addFavoriteElements(selector) {
    const importance = new AbstractElement();
    importance._setClasses('album-item__importance');
    
    importance._setActivityListener('album-item__importance-active');
    
    importance._render(selector);
}

function listenUpdatingFavorites(selector, id, title, thumbnailUrl, url, albumId) {
    const parent = document.querySelector(selector),
        parentImportance = parent.querySelector('.album-item__importance');

    parentImportance.addEventListener('click', () => {
        if (!localStorage.getItem(`${id}`)) {
            storageWorker.addItem(`${id}`, [id, title, thumbnailUrl, url, albumId]);
        } else {
            storageWorker.deleteItem(`${id}`);
        }
    });
}

function addActiveClassToFavorites() {
    const photos = document.querySelectorAll('.album-item');
    photos.forEach(item => {
        if (localStorage.getItem(item.getAttribute('data-photoId'))) {
            const importanceItem = item.querySelector('.album-item__importance');
            importanceItem.classList.add('album-item__importance-active');
        }
    });
}

function addModalFunctional(selector, template, exceptionClass) {
    const modal = new AbstractElement();
    modal._setClasses('modal', 'hide');
    modal._setAttribute('data-modal', 'modal');
    modal._template(template);
    
    modal._render(selector);
    
    const parent = document.querySelector(selector),
        parentModal = parent.querySelector('.modal');

    parent.addEventListener('click', (e) => {
        if (!e.target.classList.contains(exceptionClass)) {
            parentModal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            
            parentModal.addEventListener('click', (e) => {
                if (!e.target.classList.contains('modal-content')) {
                    e.stopPropagation();
                    parentModal.classList.add('hide');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

function addTooltipFunctional(selector, template, exceptionClass) {
    const tooltip = new AbstractElement();
    tooltip._setClasses('tooltip', 'hide');
    tooltip._template(template);
    
    tooltip._render(selector);
    
    const parent = document.querySelector(selector),
          parentTooltip = parent.querySelector('.tooltip');
    
    parent.addEventListener('mouseover', (e) => {
        if (!e.target.classList.contains(exceptionClass)) {
            parentTooltip.classList.remove('hide');
        }
    });
    parent.addEventListener('mouseout', (e) => {
        if (!e.target.classList.contains(exceptionClass)) {
            parentTooltip.classList.add('hide');
        }
    });
    parent.addEventListener('mousemove', (e) => {
        /* В templates также расставлены аттрибуты 'data-modal' */
        if (!e.target.classList.contains(exceptionClass) && !e.target.getAttribute('data-modal')) {
            parentTooltip.style.cssText = `top: ${e.clientY + 30}px; left: ${e.clientX - 70}px`;
        }
    });
}

function destroyPhotosAlbum(albumId) {
    const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    
    if (!parentAlbum.classList.contains('body__item-active')) {
        serviceComponents.destroyElementsByDataId('data-parentAlbum', albumId);
    }
}

export {createPhotosAlbum, destroyPhotosAlbum, createPhotosFavorite};
    
