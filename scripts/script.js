// Sistema de rolagem 

let searchInput = document.querySelector('#searchInput')
    searchButton = document.querySelector('#search span')
    musics = document.querySelector('.musics')

    slider = document.querySelector('.slider')
    previousCard = document.querySelector('#previous')
    nextCard = document.querySelector('#next')

    scrollValue = 0

previousCard.addEventListener('click', () => {
    maxScroll = parseInt(window.getComputedStyle(slider).width.replace('px', ''))
    if (scrollValue > 0) {
        scrollValue *= -maxScroll
        slider.scrollBy(scrollValue, 0)
        scrollValue = 0
    }
})

nextCard.addEventListener('click', () => {
    maxScroll = parseInt(window.getComputedStyle(slider).width.replace('px', ''))
    if (scrollValue < maxScroll) {
        scrollValue += 340
        slider.scrollBy(scrollValue, 0)
    }
})

// Utilizando a API do Deezer


// Acessa a API e procura o que foi pesquisado
async function getInfoCards(search) {
    let response
    await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${search}`).then(results => {
        if (results) {
            return response = results.data['data']
        }
    }).catch(err => {
        alert('Não foi possível realizar a pesquisa!!')
        return console.error(err)
    })
    if (response) {
        return response
    }
}


// Renderiza o cartão no slide
function renderCard(infoCard) {
    if (infoCard) {
        // Cria o card
        musics.innerHTML += `
            <div class="card">
                <img src="${infoCard.album.cover_medium}" alt="Música de ${infoCard.artist.name}" loading="lazy">
                <p class="singer">${infoCard.artist.name}</p>
                <p class="name_music">${infoCard.title_short}</p>
                <audio src="${infoCard.preview}" controls type="audio/*"></audio>
                <a href="${infoCard.link}" target="_blank" rel="noopener noreferrer">Ouça Agora <i class="fa fa-play"></i></a>
            <span class="explicit hidden">Explícito</span>
            </div>
            `

        // Caso a música tenha a letra explícita, ficará com a borda vermelha e um aviso.
        if (infoCard.explicit_lyrics) {
            let cards = document.querySelectorAll('.card')
            cards[cards.length - 1].style.border = '3px solid #f00'
            cards[cards.length - 1].innerHTML += '<span class="explicit">Letra Explícita</span>'
        }

    } else {
        alert('Erro ao realizar a pesquisa!!')
    }
}

async function getResults() {
    const randomArtist = [
        'Marshmello',
        'Anne Marie',
        'Lil Pump',
        'Alan Walker',
        'SIA',
        'Diplo',
        'Anitta',
        'Ludmilla',
        'Gusttavo Lima',
        'Simone e Simaria'
    ]
    const randomNumber = Math.round(Math.random() * (randomArtist.length - 1))
    let search = searchInput.value || randomArtist[randomNumber]

    search = search.replace(' ', '-').toLowerCase()
    let infoCard = await getInfoCards(search)
    let limit = 15

    slider.style.display = 'block'
    musics.innerHTML = ''
    for (info of infoCard) {
        if (limit == 0) {
            break
        }
        renderCard(info)
        limit--
    }

}

searchButton.addEventListener('click', getResults)
searchInput.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
        getResults()
    }
})
