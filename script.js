var url = 'https://graphql.anilist.co'

var mediaList = `
query { 
  MediaListCollection (userId: 695637 type: ANIME) { 
    lists {
      name
      entries {
        media {
          coverImage {
            large
          }
          title {
            romaji
            english
          }
          siteUrl
        }
      }
    }
  }
}`
var mediaOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query: mediaList
  })
}


var userList = `
query { 
	User (name: "blekmus") {
  	id
    avatar {
      large
      medium
    }
    bannerImage
  }
}`
var userOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query: userList
  })
}


var infoList = `
{
  User(name: "blekmus") {
    updatedAt
		statistics {
      anime {
        episodesWatched
        meanScore
        minutesWatched
      }
    }
  }
  MediaListCollection(userName: "blekmus", type: ANIME) {
    lists {
      name
      entries {
        id
      }
    }
  }
}

`
var infoOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query: infoList
  })
}


function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json)
  })
}
function handleError(error) {
  console.error(error)
}


function showElementCreate(show) {
  let showCoverImg = document.createElement('a')
  showCoverImg.setAttribute('class', 'image')
  showCoverImg.setAttribute('href', show.media.siteUrl)
  showCoverImg.setAttribute('target', '_blank')
  showCoverImg.appendChild(document.createElement('img'))
  showCoverImg.children[0].setAttribute('src', show.media.coverImage.large)

  let showTitle = document.createElement('a')
  showTitle.setAttribute('class', 'title')
  showTitle.setAttribute('href', show.media.siteUrl)
  showTitle.setAttribute('target', '_blank')

  if (show.media.title.english == null) {
    showTitle.innerText = show.media.title.romaji
  } else {
    showTitle.innerText = show.media.title.english
  }

  let showElement = document.createElement('div')
  showElement.appendChild(showCoverImg)
  showElement.appendChild(showTitle)

  return showElement
}
function btnListner() {
  let btns = document.querySelectorAll('.btn')
  let content = document.querySelector('.content')
  let infoClick = document.getElementById('info')
  
  btns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (!e.target.classList.contains('active')) {
        // retract info section
        if (infoClick.classList.contains('active')) {
          infoClick.classList.remove('active')
        }

        // change active color
        btns.forEach(btn => {
          if (btn.classList.contains('active')) {
            btn.classList.remove('active')
          }
        })

        // change active content section
        for (var i = 0; i < content.children.length; i++) {
          if (content.children[i].classList.contains('active')) {
            content.children[i].classList.remove('active')
          }   
          
          if (e.target.id == content.children[i].id) {
            content.children[i].classList.add('active')
          }  
        }

        e.target.classList.add('active')
      }
    })
  })
}
function arrowListner() {
  let infoClick = document.getElementById('info')

  document.getElementById('info-click').addEventListener('click', function () {  
    if (infoClick.classList.contains('active')) {
      infoClick.classList.remove('active')
    } else {
      infoClick.classList.add('active')
    }
  })
}


function handleUser(data) {
  let header = document.querySelector('.header')

  let avatarImage = `background-image: url('${data.data.User.bannerImage}');`
  header.children[1].setAttribute('style', avatarImage)

  let bannerElement = document.createElement('img')
  bannerElement.setAttribute('src', data.data.User.avatar.large)
  header.children[0].appendChild(bannerElement)
  // console.log(data.data.User.bannerImage)
}
function handleList(data) {
  let content = document.querySelector('.content')
  let watchingParent = content.querySelector('#watching')
  let completedParent = content.querySelector('#completed')
  let planningParent = content.querySelector('#planning')

  let completed = data.data.MediaListCollection.lists.filter(status => status.name == 'Completed')
  let planning = data.data.MediaListCollection.lists.filter(status => status.name == 'Planning')
  let watching = data.data.MediaListCollection.lists.filter(status => status.name == 'Watching')

  if (completed.length != 0) {
    completed[0].entries.forEach(show => {
      showElement = showElementCreate(show)
      completedParent.appendChild(showElement)
    })
  } else {
    completedParent.classList.add('empty-message')
    completedParent.classList.remove('show-list')
  }

  if (planning.length != 0) {
    planning[0].entries.forEach(show => {
      showElement = showElementCreate(show)
      planningParent.appendChild(showElement)
    }) 
  } else {
    planningParent.classList.add('empty-message')
    planningParent.classList.remove('show-list')
  }

  if (watching.length != 0) {
    watching[0].entries.forEach(show => {
      showElement = showElementCreate(show)
      watchingParent.appendChild(showElement)
    })
  } else {
    watchingParent.classList.add('empty-message')
    watchingParent.classList.remove('show-list')
  }


  btnListner()  
}
function handleInfo(data) {
  arrowListner()

  let infoDiv = document.querySelector('.info-items')

  let completed = data.data.MediaListCollection.lists.filter(status => status.name == 'Completed')
  let planning = data.data.MediaListCollection.lists.filter(status => status.name == 'Planning')
  let watching = data.data.MediaListCollection.lists.filter(status => status.name == 'Watching')

  if (completed.length != 0) {
    let completedNum = completed[0].entries.length
    infoDiv.children[0].children[0].innerText = completedNum
  } else {
    infoDiv.children[0].children[0].innerText = 0
  }
  if (planning.length != 0) {
    let planningNum = planning[0].entries.length
    infoDiv.children[1].children[0].innerText = planningNum
  } else {
    infoDiv.children[1].children[0].innerText = 0
  }
  if (watching.length != 0) {
    let watchingNum = watching[0].entries.length
    infoDiv.children[2].children[0].innerText = watchingNum
  } else {
    infoDiv.children[2].children[0].innerText = 0
  }

  infoDiv.children[3].children[0].innerText = `${Math.floor(data.data.User.statistics.anime.minutesWatched/60)}h`
  infoDiv.children[4].children[0].innerText = data.data.User.statistics.anime.episodesWatched
  infoDiv.children[5].children[0].innerText = data.data.User.statistics.anime.meanScore
}






// avatar and banner
fetch(url, userOptions).then(handleResponse).then(handleUser).catch(handleError);

// content list
fetch(url, mediaOptions).then(handleResponse).then(handleList).catch(handleError);

// info section
fetch(url, infoOptions).then(handleResponse).then(handleInfo).catch(handleError);

