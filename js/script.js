"use strict";
import AbstractElement from './abstract/abstractElement.js';
import { createUsers } from './components/Users.js';
import { createPhotosFavorite } from './components/Photos.js';

window.addEventListener('DOMContentLoaded', () => {
    
    renderUserPage();

    function renderUserPage() {
        createUserWrapper();
        createUsers();
        listenHeaderActivity();
    }
    
    function renderFavoritePage() {
        createFavoriteWrapper();
        createPhotosFavorite();
        listenFavoriteActivity();
    }
    
    function createUserWrapper() {
        const userWrapper = new AbstractElement();
        userWrapper._setClasses('catalog__items');
        userWrapper._setAttribute('data-userPage', '1');
        userWrapper._render('#root');
    }
    
    function createFavoriteWrapper() {
        const favoriteWrapper = new AbstractElement();
        favoriteWrapper._setClasses('favorite__items');
        favoriteWrapper._setAttribute('data-favoritePage', '1');
        favoriteWrapper._render('#root');
    }
    
    /* Отвечает за обновление страницы избранного после клика на звёздочку */
    function listenFavoriteActivity() {
        document.querySelector('.favorite__items').addEventListener('click', (e) => {
            if (e.target.classList.contains('album-item__importance')) {
                document.querySelector('.favorite__items').remove();                      
                renderFavoritePage();
            }
        });
    }
    
    function listenHeaderActivity() {
        const catalog = document.querySelector('#catalog'),
            important = document.querySelector('#important'),
            importantInner = document.querySelector('.header-menu__important');
        
        document.addEventListener('click', (e) => {
            if (e.target === catalog && !catalog.classList.contains('header-menu__item-active')) {
                document.querySelector('.favorite__items').remove();
    
                catalog.classList.add('header-menu__item-active');
                important.classList.remove('header-menu__item-active');
                
                renderUserPage();
            } else if ((e.target === important || e.target === importantInner) && !important.classList.contains('header-menu__item-active')) {
                document.querySelector('.catalog__items').remove();
    
                important.classList.add('header-menu__item-active');
                catalog.classList.remove('header-menu__item-active');
                
                renderFavoritePage();
            }
        });
    }
});