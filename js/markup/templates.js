const templates = {
    
    spinner: () => "<img src='./images/spinner.gif' alt='spinner' width='48px' height='48px'>",
    
    error: (photoUrl, alt, title, description) => {
        return (`  <img src="${photoUrl}" alt="${alt}" width="264px" height="198px">
                <div class="error-wrapper">
                    <h2 class="items__error-title">${title}</h2>
                    <p class="items__error-description">${description}</p>
                </div>`);
        },
        
    bodyTitle: (text) => `<p class="body__item-text">${text}</p>`,
    
    photo: (thumbnailUrl, photoTitle) => {
        return (`<div class="album-item__importance"></div>
                <img src="${thumbnailUrl}" alt="${photoTitle}" width="150px" height="150px"></img>`);
        },
    
    

    
    
    
};

export default templates;