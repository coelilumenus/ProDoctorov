import {fetchData} from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import {renderPhotosToAlbum, destroyPhotosAlbum} from './Photos.js';

const service = new ServiceComponents();

function renderUserAlbums(userId) {
    const parentUserSelector = `[data-userId="${userId}"]`,
        parentUser = document.querySelector(parentUserSelector),
        activeClass = 'body__item-active';
    
    if (parentUser.classList.contains(activeClass)) {
        service.createSmallSpinner('albums')
            ._render(parentUserSelector, 'after');
        
        fetchData.albums(userId)
            .then(data => {
                data.forEach(({ id, title }) => {
                    createUserAlbums(id, userId, title);
                });
            })
            .catch(() => {
                const error = service.createSmallError('albums');
                error._setAttribute('data-parentUser', userId);
                error._render(parentUserSelector, 'after');
            })
            .finally(() => {
                service.destroySpinner('albums');
            });   
    }
}

function createUserAlbums(id, userId, title) {
    const album = new AbstractElement();
    album._setClasses('body__item', 'body__item-small');
    album._setAttribute('data-albumId', id);
    album._setAttribute('data-parentUser', userId);
    album._template(templates.bodyTitle(title));
    
    album._setActivityListener('body__item-active');
    album._setListener('click', createPhotosWrapper, id, userId);
    album._setListener('click', renderPhotosToAlbum, id, userId);
    album._setListener('click', destroyPhotosAlbum, id);
    
    album._render(`[data-userid="${userId}"]`, 'after');
}

function destroyUserAlbums(userId) {
        const parentUserSelector = `[data-userId="${userId}"]`,
        parentUser = document.querySelector(parentUserSelector),
        activeClass = 'body__item-active';
    
    if (!parentUser.classList.contains(activeClass)) {
        service.destroyElementsByDataId('data-parentUser', userId);
    }
}

function createPhotosWrapper(parentAlbum, parentUser) {
    const wrapper = new AbstractElement();
    wrapper._setClasses('album-wrapper');
    wrapper._setAttribute('data-parentAlbum', parentAlbum);
    wrapper._setAttribute('data-parentUser', parentUser);
    wrapper._render(`[data-albumId="${parentAlbum}"]`, 'after');
}

export {renderUserAlbums, destroyUserAlbums};