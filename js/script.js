"use strict";
import AbstractElement from './abstract/abstractElement.js';
import { renderUsers } from './components/Users.js';
import { renderPhotosToFavorite } from './components/Photos.js';

window.addEventListener('DOMContentLoaded', () => {
    
    renderUserPage();

    function renderUserPage() {
        createUserWrapper();
        renderUsers();
        listenHeaderActivity();
    }
    
    function renderFavoritePage() {
        createFavoriteWrapper();
        renderPhotosToFavorite();
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
            importantInner = document.querySelector('.header-menu__important'),
            activeClass = 'header-menu__item-active';
        
        document.addEventListener('click', (e) => {
            if (e.target === catalog && !catalog.classList.contains(activeClass)) {
                document.querySelector('.favorite__items').remove();
    
                catalog.classList.add(activeClass);
                important.classList.remove(activeClass);
                
                renderUserPage();
            } else if ((e.target === important || e.target === importantInner) && !important.classList.contains(activeClass)) {
                document.querySelector('.catalog__items').remove();
    
                important.classList.add(activeClass);
                catalog.classList.remove(activeClass);
                
                renderFavoritePage();
            }
        });
    }
});