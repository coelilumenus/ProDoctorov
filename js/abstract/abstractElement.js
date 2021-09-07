import renderElement from "./renderElement.js";

export default class AbstractElement {
    constructor() {
        this.element = document.createElement('div');
    }
    
    _setClasses(...classes) {
        classes.forEach(item => this.element.classList.add(item));
    }
    
    _template(template) {
        this.element.innerHTML = template;
    }
    
    _setAttribute(name, id) {
        this.element.setAttribute(name, id);
    }
    
    _setListener(type, callback, ...params) {
        this.element.addEventListener(type, () => callback(...params));
    }
    
    _setActivityListener(activityClass) {
        this.element.addEventListener('click', () => this.element.classList.toggle(activityClass));
    }
    
    _render(selector, direction) {
        renderElement(this.element, selector, direction);
    }
    
}