import AbstractElement from '../abstract/abstractElement.js';
import templates from '../markup/templates.js';

export default class ServiceComponents extends AbstractElement {

    createSpinner(spinnerId) {
        const spinner = new AbstractElement();
        spinner._setClasses('spinner');
        spinner._template(templates.spinner());
        spinner._setAttribute('data-spinner', spinnerId);
        return spinner;
    }

    createSmallSpinner(spinnerId) {
        const spinner = new AbstractElement();
        spinner._setClasses('spinner-small');
        spinner._template(templates.spinner());
        spinner._setAttribute('data-spinner', spinnerId);
        return spinner;
    }

    destroySpinner(spinnerId) {
        document.querySelector(`[data-spinner="${spinnerId}"]`).remove();
    }

    createError(errorId, photoUrl, alt, title, description) {
        const error = new AbstractElement();
        error._setClasses('items__error');
        error._template(templates.error(photoUrl, alt, title, description));
        error._setAttribute('data-error', errorId);
        return error;
    }

    createSmallError(errorId, photoUrl, alt, title, description) {
        const error = new AbstractElement();
        error._setClasses('items__error-small');
        error._template(templates.error(photoUrl, alt, title, description));
        error._setAttribute('data-error', errorId);
        return error;
    }

    destroyError(errorId) {
        document.querySelector(`[data-error="${errorId}"]`).remove();
    }
    
    destroyElementsByDataId(dataAttribute, itemId) {
        const items = document.querySelectorAll(`[${dataAttribute}="${itemId}"]`);
        items.forEach(item => {
            item.remove();
        });
    }
    
}