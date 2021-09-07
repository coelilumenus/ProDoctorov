import getResource from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import {createPhotosAlbum, createPhotosWrapper, destroyPhotosAlbum} from './Photos.js';

const serviceComponents = new ServiceComponents();

function createUserAlbums(userId) {
    const parentUser = document.querySelector(`[data-userId="${userId}"]`);
    
    if (parentUser.classList.contains('body__item-active')) {
        getResource(`https://json.medrating.org/albums?userId=${userId}`)
        .then(data => {
            data.forEach(({ id, title }) => {
                const album = new AbstractElement();
                album._setClasses('body__item', 'body__item-small');
                album._setAttribute('data-albumId', id);
                album._setAttribute('data-parentUser', userId);
                album._template(templates.bodyTitle(title));
                album._setActivityListener('body__item-active');
                album._setListener('click', createPhotosWrapper, id, userId);
                album._setListener('click', createPhotosAlbum, id);
                album._setListener('click', destroyPhotosAlbum, id);
                album._render(`[data-userid="${userId}"]`, 'after');
            });
        });
    }
}

function destroyUserAlbums(userId) {
    const parentUser = document.querySelector(`[data-userId="${userId}"]`);
    if (!parentUser.classList.contains('body__item-active')) {
        serviceComponents.destroyElementsByDataId('data-parentUser', userId);
    }
}

export {createUserAlbums, destroyUserAlbums};