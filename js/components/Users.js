import {fetchData} from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import { renderUserAlbums, destroyUserAlbums } from './Albums.js';

const service = new ServiceComponents();

function renderUsers() {
    
    service.createSpinner('main')
        ._render('.catalog__items');
        
    fetchData.users()
        .then(data => { 
            data.forEach(({ id, name }) => {
                if (name) { 
                    createUserElement(id, name); 
                }
            });
        })
        .catch(() => {
            service.createError('main')
                ._render('.catalog__items');
        })
        .finally(() => {
            service.destroySpinner('main');
        });   
}

function createUserElement(id, name) {
    const user = new AbstractElement(); 
    user._setClasses('body__item');
    user._setAttribute('data-userId', id);
    user._template(templates.bodyTitle(name));
    
    user._setActivityListener('body__item-active', id);
    user._setListener('click', renderUserAlbums, id);
    user._setListener('click', destroyUserAlbums, id);
    
    user._render('[data-userPage="1"]');
}

export {renderUsers};