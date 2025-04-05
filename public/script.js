document.addEventListener('DOMContentLoaded', () => {
    const searchHistory = document.getElementById('search-history')
    const searchInput = document.getElementById('search-input')
    const searchButton = document.getElementById('search-button')
    const resetButton = document.getElementById('reset-button')
    const loader = document.getElementById('loader')
    const responseContainer = document.getElementById('response')

    function resetHistory() {
        searchHistory.innerText = ''
        const option = document.createElement('option')
        option.value = ''
        option.textContent = 'Select a Previous Search'
        searchHistory.appendChild(option)
    }

    function loadSearchHistory() {
        const savedSearches = JSON.parse(localStorage.getItem('searchHistory')) || []
        resetHistory()
        savedSearches.forEach( savedSearch => {
            const option = document.createElement('option')
            option.value = savedSearch
            option.textContent = savedSearch
            searchHistory.append(option)
        })
    }

    function saveSearchHistory(searchTerm) {
        let savedSearches = JSON.parse(localStorage.getItem('searchHistory')) || []
        if(!savedSearches.includes(searchTerm)) {
            savedSearches.push(searchTerm)
            localStorage.setItem('searchHistory', JSON.stringify(savedSearches))
        }
    }

    searchHistory.addEventListener('change', () => {
        const selectedSearch = searchHistory.value
        if(selectedSearch) {
            searchInput.value = selectedSearch
            searchPodcast()
        }
    })

    searchButton.addEventListener('click', searchPodcast)
    searchInput.addEventListener('keypress', event => {
        if(event.key === 'Enter') {
            searchPodcast()
        }
    })
    searchInput.addEventListener('focus', () => {
        searchInput.value = ''
    })

    resetButton.addEventListener('click', () => {
        localStorage.removeItem('searchHistory')
        resetHistory()
        searchInput.value = ''
    })

    loadSearchHistory()

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000)
        return date.toLocaleDateString()
    }

    function showLoader() {
        loader.style.display = 'flex'
        responseContainer.style.display = 'none'
    }

    function hideLoader() {
        loader.style.display = 'none'
        responseContainer.style.display = 'flex'
    }

    async function searchPodcast() {
        const searchTerm = searchInput.value.trim()
        if(searchTerm) {
            saveSearchHistory(searchTerm)
            loadSearchHistory()
        } else {
            responseContainer.innerText = 'Please enter a podcast title.'
            return
        }

        showLoader()

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
            const data = await response.json()
            responseContainer.textContent = ''
            if(data.feeds && data.feeds.length > 0) {
                data.feeds.forEach( podcast => {
                    const card = createCard(podcast)
                    responseContainer.appendChild(card)
                })
            } else {
                responseContainer.innerText = 'No Results Found'
            }
        } catch (error) {
            responseContainer.innerText = `Error: ${error.message}`
        }
        hideLoader()
    }

    function createCard(podcast) {
        const card = document.createElement('div')
        card.className = 'card'
        const img = document.createElement('img')
        img.src = podcast.image || './default-podcast.png'
        img.alt = podcast.title
        const content = document.createElement('div')
        content.className = 'card-content'
        const title = document.createElement('h3')
        title.innerText = podcast.title
        const description = document.createElement('p')
        description.innerText = podcast.description
        const episodeCount = document.createElement('p')
        episodeCount.className = 'episode-count'
        episodeCount.innerText = `Episodes: ${podcast.episodeCount}`
        const pubDate = document.createElement('date')
        pubDate.className = 'pub-date'
        pubDate.innerText = `Newest Episode ${podcast.newestItemPubdate ? formatDate(podcast.newestItemPubdate) : 'Not Available'}`

        content.appendChild(title)
        content.appendChild(description)
        content.appendChild(episodeCount)
        content.appendChild(pubDate)
        card.appendChild(img)
        card.appendChild(content)

        return card
    }




    const searchLink = document.getElementById('search-link')
    const listenLink = document.getElementById('listen-link')
    const searchContainer = document.querySelector('.search-container')
    const mainContainer = document.querySelector('.main-container')
    const playerContainer = document.querySelector('.player-container')
    const queueContainer = document.querySelector('.queue')

    searchLink.addEventListener('click', navigateToSearch)
    listenLink.addEventListener('click', navigateToPlayer)

    function navigateToSearch() {
        searchContainer.style.display = 'flex'
        mainContainer.style.display = 'flex'
        playerContainer.style.display = 'none'
        queueContainer.style.display = 'none'
        searchLink.classList.add('selected')
        listenLink.classList.remove('selected')
    }

    function navigateToPlayer() {
        searchContainer.style.display = 'none'
        mainContainer.style.display = 'none'
        playerContainer.style.display = 'flex'
        queueContainer.style.display = 'flex'
        searchLink.classList.remove('selected')
        listenLink.classList.add('selected')
    }
})





















// import {songs} from "./data.js"

// const image = document.querySelector('img')
// const title = document.getElementById('title')
// const artist = document.getElementById('artist')
// const music = document.querySelector('audio')
// const progressContainer = document.getElementById('progress-container')
// const progress = document.getElementById('progress')
// const currentTimeEl = document.getElementById('current-time')
// const durationEl = document.getElementById('duration')
// const prevBtn = document.getElementById('prev')
// const playBtn = document.getElementById('play')
// const nextBtn = document.getElementById('next')

// let isPlaying = false
// let songIndex = 0

// playBtn.addEventListener('click', () => {
//     (isPlaying ? pauseSong() : playSong())
// })
// prevBtn.addEventListener('click', prevSong)
// nextBtn.addEventListener('click', nextSong)
// music.addEventListener('ended', nextSong)
// music.addEventListener('timeupdate', updateProgressBar)
// progressContainer.addEventListener('click', setProgressBar)

// function playSong() {
//     isPlaying = true
//     playBtn.classList.replace('fa-play', 'fa-pause')
//     playBtn.setAttribute('title', 'Pause')
//     music.play()
// }

// function pauseSong() {
//     isPlaying = false
//     playBtn.classList.replace('fa-pause', 'fa-play')
//     playBtn.setAttribute('title', 'Play')
//     music.pause()
// }

// function loadSong(song) {
//     title.textContent = `${song.displayName}`
//     artist.textContent = song.artist
//     music.src = `music/${song.name}.mp3`
//     image.src = `img/${song.album}.jpg`
//     durationEl.textContent = song.duration
//     currentTimeEl.textContent = '0:00'
// }

// function prevSong() {
//     songIndex--
//     if(songIndex < 0) {
//         songIndex = songs.length - 1
//     }
//     loadSong(songs[songIndex])
//     playSong()
// }

// function nextSong() {
//     songIndex++
//     if(songIndex > songs.length - 1) {
//         songIndex = 0
//     }
//     loadSong(songs[songIndex])
//     playSong()
// }

// function updateProgressBar(e) {
//     if(isPlaying) {
//         const {duration, currentTime} = e.srcElement
//         const progressPercent = (currentTime / duration) * 100
//         progress.style.width = `${progressPercent}%`
//         const durationMinutes = Math.floor(duration / 60)
//         let durationSeconds = Math.floor(duration % 60)
//         if(durationSeconds < 10) {
//             durationSeconds = `0${durationSeconds}`
//         }
//         if(durationSeconds) {
//             durationEl.textContent = `${durationMinutes}:${durationSeconds}`
//         }
//         const currentMinutes = Math.floor(currentTime / 60)
//         let currentSeconds = Math.floor(currentTime % 60)
//         if(currentSeconds < 10) {
//             currentSeconds = `0${currentSeconds}`
//         }
//         currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`
//     }
// }

// function setProgressBar(e) {
//     const width = this.clientWidth
//     const clickX = e.offsetX
//     const { duration } = music
//     music.currentTime = (clickX / width) * duration
// }

// loadSong(songs[songIndex])