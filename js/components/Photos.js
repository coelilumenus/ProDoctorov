import getResource from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';

const serviceComponents = new ServiceComponents();

function createPhotosAlbum(albumId) {
    const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    
    if (parentAlbum.classList.contains('body__item-active')) {
        getResource(`https://json.medrating.org/photos?albumId=${albumId}`)
            .then(data => {
                data.forEach(({ id, title, thumbnailUrl, url }) => {
                    const photo = new AbstractElement();
                    photo._setClasses('album-item');
                    photo._setAttribute('data-photoId', id);
                    photo._template(templates.photo(thumbnailUrl, title));
                    photo._render(`[data-parentAlbum="${albumId}"]`);
                });
            });
    }
}   
   
function createPhotosWrapper(parentAlbum, parentUser) {
    const wrapper = new AbstractElement();
    wrapper._setClasses('album-wrapper');
    wrapper._setAttribute('data-parentAlbum', parentAlbum);
    wrapper._setAttribute('data-parentUser', parentUser);
    wrapper._render(`[data-albumId="${parentAlbum}"]`, 'after');
}

function destroyPhotosAlbum(albumId) {
    const parentAlbum = document.querySelector(`[data-albumId="${albumId}"]`);
    
    if (!parentAlbum.classList.contains('body__item-active')) {
        serviceComponents.destroyElementsByDataId('data-parentAlbum', albumId);
    }
}

export {createPhotosAlbum, createPhotosWrapper, destroyPhotosAlbum};
    
