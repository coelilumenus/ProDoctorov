import getResource from '../services/fetchAPI.js';
import {serviceComponents} from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import { createUserAlbums, destroyUserAlbums } from './Albums.js';

function createUsers() {
    const spinner = serviceComponents.createSpinner('main');
    document.querySelector('#root').append(spinner);    
    
    getResource('https://json.medrating.org/users/')
    .then(data => {
            data.forEach(({ id, name }) => {
                if (name) {
                    const user = new AbstractElement(); 
                    user._setClasses('body__item');
                    user._setAttribute('data-userId', id);
                    user._template(templates.bodyTitle(name));
                    
                    user._setActivityListener('body__item-active', id);
                    user._setListener('click', createUserAlbums, id);
                    user._setListener('click', destroyUserAlbums, id);
                    
                    user._render('[data-userPage="1"]');
                }
            });
    })
    .catch(() => {
        const error = serviceComponents.createError('main');
        document.querySelector('#root').append(error); 
    })
    .finally(() => {
        serviceComponents.destroySpinner('main');
    });   
}

export {createUsers};