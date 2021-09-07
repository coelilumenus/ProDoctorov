"use strict";
import AbstractElement from './abstract/abstractElement.js';
import { createUsers } from './components/Users.js';
import { createFavoritePhotos } from './components/Photos.js';

window.addEventListener('DOMContentLoaded', () => {
    
    showUserPage();
    listenHeaderActivity();
    
    function showUserPage() {
        const userWrapper = new AbstractElement();
            userWrapper._setClasses('catalog__items');
            userWrapper._setAttribute('data-userPage', '1');
            userWrapper._render('#root');
        
        createUsers();
    }
    
    function showFavoritePage() {
        const favoriteWrapper = new AbstractElement();
            favoriteWrapper._setClasses('favorite__items');
            favoriteWrapper._setAttribute('data-favoritePage', '1');
            favoriteWrapper._render('#root');

            createFavoritePhotos();
            listenFavoriteActivity();
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
                
                showUserPage();
            } else if ((e.target === important || e.target === importantInner) && !important.classList.contains('header-menu__item-active')) {
                document.querySelector('.catalog__items').remove();
    
                important.classList.add('header-menu__item-active');
                catalog.classList.remove('header-menu__item-active');
                
                showFavoritePage();
            }
        });
    }
    
    // отвечает за обновление страницы избранного, после нажатия на звёздочку
    function listenFavoriteActivity() {
        document.querySelector('.favorite__items').addEventListener('click', (e) => {
            if (e.target.classList.contains('album-item__importance')) {
                document.querySelector('.favorite__items').remove();                      
                showFavoritePage();
            }
        });
    }
});