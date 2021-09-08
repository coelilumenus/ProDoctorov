import {fetchData} from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import StorageWorker from '../services/storageWorker.js';

const storageWorker = new StorageWorker('importantPhotos');
const service = new ServiceComponents();

function renderPhotosToAlbum(albumId, parentUserId) {
    const parentAlbumSelector = `[data-albumId="${albumId}"]`,
        parentAlbum = document.querySelector(parentAlbumSelector);
        
    if (parentAlbum.classList.contains('body__item-active')) {
        
        service.createSmallSpinner('photos')
            ._render(parentAlbumSelector, 'after');
        
        fetchData.photos(albumId)
            .then(data => {
                data.forEach(({ id, title, thumbnailUrl, url }) => {
                    const renderSelector = `[data-photoId="${id}"]`,
                        parentAlbumSelector = `[data-parentAlbum="${albumId}"]`,
                        photoTemplate = templates.photo(thumbnailUrl, title),
                        exceptionClass = 'album-item__importance';
                    
                    createPhoto(id, photoTemplate, parentAlbumSelector);
                    addTooltipFunctional(renderSelector, title, exceptionClass);
                    addModalFunctional(renderSelector, url, title, exceptionClass);
                    addFavoriteElements(renderSelector);
                    listenUpdatingFavorites(renderSelector, id, title, thumbnailUrl, url, albumId);
                });
            })
            .then(() => {
                addActiveClassToFavorites();
            })
            .catch(() => {
                destroyParentAlbumWrapper(albumId);
                const error = service.createSmallError('photos');
                error._setAttribute('data-parentAlbum', albumId);
                error._setAttribute('data-parentUser', parentUserId);
                error._render(parentAlbumSelector, 'after');
            })
            .finally(() => {
                service.destroySpinner('photos');
            }); 
    }
}  

function renderPhotosToFavorite() {
    const wrapperSelector = '[data-favoritePage="1"]',
        wrapper = document.querySelector(wrapperSelector);
    
    if (storageWorker.getKeys() !== undefined) {
        
        storageWorker.getKeys().forEach(itemId => {
            const [id, title, thumbnailUrl, url, albumId] =  localStorage.getItem(itemId).split(','),
                photoTemplate = templates.favoritePhoto(thumbnailUrl, title),
                renderSelector = `[data-photoId="${id}"]`,
                exceptionClass = 'album-item__importance';
            
            createPhoto(id, photoTemplate, wrapperSelector);
            addModalFunctional(renderSelector, url, title, exceptionClass);
            addFavoriteElements(renderSelector);
            listenUpdatingFavorites(renderSelector, id, title, thumbnailUrl, url, albumId);
        });

        wrapper.classList.add('album-wrapper__favorite');
        addActiveClassToFavorites();
        
    } else {
        const errorId = 'favoritePage',
            photoUrl = './images/empty.png',
            alt = 'empty',
            title = 'Список избранного пуст',
            description = 'Добавляйте изображения, нажимая на звёздочки';
        
        service.createError(errorId, photoUrl, alt, title, description)
            ._render(wrapperSelector);
    }
}

function createPhoto(id, template, renderSelector) {
    const photo = new AbstractElement();
    photo._setClasses('album-item');
    photo._setAttribute('data-photoId', id);
    photo._template(template);
    
    photo._render(renderSelector);
}

function addFavoriteElements(renderSelector) {
    const importance = new AbstractElement();
    importance._setClasses('album-item__importance');
    
    importance._setActivityListener('album-item__importance-active');
    
    importance._render(renderSelector);
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

function addModalFunctional(renderSelector, url, title, exceptionClass) {
    const modal = new AbstractElement();
    modal._setClasses('modal', 'hide');
    modal._setAttribute('data-modal', 'modal');
    modal._template(templates.sizedPhoto(url, title));
    
    modal._render(renderSelector);
    
    const parent = document.querySelector(renderSelector),
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

function addTooltipFunctional(renderSelector, title, exceptionClass) {
    const tooltip = new AbstractElement();
    tooltip._setClasses('tooltip', 'hide');
    tooltip._template(templates.tooltip(title));
    
    tooltip._render(renderSelector);
    
    const parent = document.querySelector(renderSelector),
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
        service.destroyElementsByDataId('data-parentAlbum', albumId);
    }
}

function destroyParentAlbumWrapper(albumId) {
    const parentElementSelector = `[data-parentAlbum="${albumId}"]`,
        parentElement = document.querySelector(parentElementSelector);
    
    parentElement.remove();
}

export {destroyPhotosAlbum, renderPhotosToAlbum, renderPhotosToFavorite};
    
