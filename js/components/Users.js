import getResource from '../services/fetchAPI.js';
import ServiceComponents from '../services/serviceComponents.js';
import templates from '../markup/templates.js';
import AbstractElement from '../abstract/abstractElement.js';
import { createUserAlbums, destroyUserAlbums } from './Albums.js';

const serviceComponents = new ServiceComponents();

function createUsers() {
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
                    user._render('#root');
                }
            });
    });   
}

export {createUsers};