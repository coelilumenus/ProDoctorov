const templates = {
    
    spinner: () => "<img src='./images/spinner.gif' alt='spinner' width='48px' height='48px'>",
    
    error: (photoUrl = './images/error.png', alt = 'Error', title = 'Сервер не отвечает', description = 'Уже работаем над этим') => {
        return (`  <img src="${photoUrl}" alt="${alt}" width="264px" height="198px">
                <div class="error-wrapper">
                    <h2 class="items__error-title">${title}</h2>
                    <p class="items__error-description">${description}</p>
                </div>`);
        },
        
    bodyTitle: (text) => `<p class="body__item-text">${text}</p>`,
    
    photo: (thumbnailUrl, photoTitle) => `<img src="${thumbnailUrl}" alt="${photoTitle}" width="150px" height="150px"></img>`,
    favoritePhoto: (thumbnailUrl, photoTitle) => `<img src="${thumbnailUrl}" alt="${photoTitle}" width="150px" height="150px"></img><p class="album-item__favorite-title">${photoTitle}</p>`,
    
    sizedPhoto: (url, title) => {
        return (` <div data-modal="close" class="modal-close"></div>  
                  <div data-modal="content" class="modal-content">   
                    <img data-modal="img" src="${url}" alt="${title}"> 
                  </div>`);
    },
    
    tooltip: (text) => `${text}`,

    
    
    
};

export default templates;