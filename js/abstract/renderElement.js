export default function renderElement(element, selector, direction) {
    switch(direction) {
        case 'after': 
            document.querySelector(selector).after(element);
            break;
        case 'before':
            document.querySelector(selector).before(element);
            break;
        default:
            document.querySelector(selector).append(element);
            break;
    }
};
