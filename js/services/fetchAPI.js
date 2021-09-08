async function getResource(url) {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
}

const fetchData = {
    users: () => getResource('https://json.medrating.org/users/'),
    albums: (userId) => getResource(`https://json.medrating.org/albums?userId=${userId}`),
    photos: (albumId) => getResource(`https://json.medrating.org/photos?albumId=${albumId}`)
};

 

export {fetchData};