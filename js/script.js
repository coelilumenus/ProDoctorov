"use strict";
import ServiceComponents from './services/serviceComponents.js';
import templates from './markup/templates.js';
import AbstractElement from './abstract/abstractElement.js';
import StorageWorker from './services/storageWorker.js';
import { createUsers } from './components/Users.js';
import { createFavoritePhotos } from './components/Photos.js';


const serviceComponents = new ServiceComponents();
const storageWorker = new StorageWorker('importantPhotos');



window.addEventListener('DOMContentLoaded', () => {
    const catalog = document.querySelector('#catalog'),
        important = document.querySelector('#important'),
        importantInner = document.querySelector('.header-menu__important'),
        userWrapper = new AbstractElement();
        
    userWrapper._setClasses('catalog__items');
    userWrapper._setAttribute('data-userPage', '1');
    userWrapper._render('#root');
    createUsers();

    document.addEventListener('click', (e) => {
        if (e.target === catalog && !catalog.classList.contains('header-menu__item-active')) {
            document.querySelector('.favorite__items').remove();

            catalog.classList.add('header-menu__item-active');
            important.classList.remove('header-menu__item-active');
            
            const userWrapper = new AbstractElement();
            userWrapper._setClasses('catalog__items');
            userWrapper._setAttribute('data-userPage', '1');
            userWrapper._render('#root');
            
            createUsers();
        } else if ((e.target === important || e.target === importantInner) && !important.classList.contains('header-menu__item-active')) {
            document.querySelector('.catalog__items').remove();

            important.classList.add('header-menu__item-active');
            catalog.classList.remove('header-menu__item-active');
            
            const favoriteWrapper = new AbstractElement();
            favoriteWrapper._setClasses('favorite__items');
            favoriteWrapper._setAttribute('data-favoritePage', '1');
            favoriteWrapper._render('#root');

            createFavoritePhotos();
        }
    });
    

    
    // function updateFavorites() { 
    //     try { 
    //         if (document.querySelector('.favorite__items')) {
    //             document.querySelector('.favorite__items').remove();
    //             showFavorites();
    //         }
    //     } catch (error) {
    //         return;
    //     }
    // }
    

});