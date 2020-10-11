const urlParams = new URLSearchParams(window.location.search)
userName = urlParams.get('user')

if (userName == null) {
  window.location = '/?user=blekmus';
}


var url = 'https://graphql.anilist.co'

var variables = {
  userName: userName
}

var mediaList = `
query ($userName: String) { 
  MediaListCollection (userName: $userName, type: ANIME) { 
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
    query: mediaList,
    variables: variables
  })
}


var userList = `
query ($userName: String) { 
	User (name: $userName) {
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
    query: userList,
    variables: variables
  })
}


var infoList = `
query ($userName: String) {
  User(name: $userName) {
    updatedAt
		statistics {
      anime {
        episodesWatched
        meanScore
        minutesWatched
      }
    }
  }
  MediaListCollection(userName: $userName, type: ANIME) {
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
    query: infoList,
    variables: variables
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
function arrowListner(data) {
  let infoClick = document.getElementById('info')

  document.getElementById('info-click').addEventListener('click', function () {  
    if (infoClick.classList.contains('active')) {
      infoClick.classList.remove('active')
    } else {
      infoClick.classList.add('active')
      arrowOpenAnimation(data)
    }
  })
}
function arrowOpenAnimation(data) {
  let infoDiv = document.querySelector('.info-items')

  let completed = data.data.MediaListCollection.lists.filter(status => status.name == 'Completed')
  let planning = data.data.MediaListCollection.lists.filter(status => status.name == 'Planning')
  let watching = data.data.MediaListCollection.lists.filter(status => status.name == 'Watching')

  if (infoDiv.classList.contains('start-animation')) {
    if (completed.length != 0) {
      let completedNum = completed[0].entries.length
      let completedAnim = new CountUp("completed-info", 0, completedNum, 0, 2, {useGrouping: false, useEasing: true})
      completedAnim.start()
    } else {
      infoDiv.children[0].children[0].innerText = 0
    }

    if (planning.length != 0) {
      let planningNum = planning[0].entries.length
      let planningAnim = new CountUp("planning-info", 0, planningNum, 0, 2, {useGrouping: false, useEasing: true})
      planningAnim.start();
    } else {
      infoDiv.children[1].children[0].innerText = 0
    }

    if (watching.length != 0) {
      let watchingNum = watching[0].entries.length
      let watchingAnim = new CountUp("watching-info", 0, watchingNum, 0, 2, {useGrouping: false, useEasing: true})
      watchingAnim.start()
    } else {
      infoDiv.children[2].children[0].innerText = 0
    }
    
    let hoursAnim = new CountUp('hour-info', 0, Math.floor(data.data.User.statistics.anime.minutesWatched/60), 0, 2, {useGrouping: false, useEasing: true});
    let episodesAnim = new CountUp('episode-info', 0, data.data.User.statistics.anime.episodesWatched, 0, 2, {useGrouping: false, useEasing: true});
    let scoreAnim = new CountUp('score-info', 0, data.data.User.statistics.anime.meanScore, 1, 2, {useGrouping: false, useEasing: true});

    if (!hoursAnim.error) {
      hoursAnim.start();
    } else {
     console.error(hoursAnim.error);
    }
  
    if (!episodesAnim.error) {
      episodesAnim.start();
    } else {
     console.error(episodesAnim.error);
    }
  
    if (!scoreAnim.error) {
      scoreAnim.start();
    } else {
     console.error(scoreAnim.error);
    }

    infoDiv.classList.remove('start-animation')
  } 
  else {
    if (completed.length != 0) {
      let completedNum = completed[0].entries.length
      document.querySelector('#completed-info').innerText = completedNum
    } else {
      document.querySelector('#completed-info').innerText = 0
    }

    if (planning.length != 0) {
      let planningNum = planning[0].entries.length
      document.querySelector('#planning-info') = planningNum
    } else {
      document.querySelector('#planning-info') = 0
    }

    if (watching.length != 0) {
      let watchingNum = watching[0].entries.length
      document.querySelector('#watching-info').innerText = watchingNum
    } else {
      document.querySelector('#watching-info').innerText = 0
    }
    
    document.querySelector('#hour-info').innerText(data.data.User.statistics.anime.minutesWatched/60)
    document.querySelector('#episode-info').innerText(data.data.User.statistics.anime.episodesWatched)
    document.querySelector('#score-info').innerText(data.data.User.statistics.anime.meanScore)
  }
}
function removePreloader() {
  let preloaderEl = document.querySelector('.preloader-container')

  preloaderEl.classList.add('active')
  setTimeout(() => document.body.style.overflow = 'inherit', 500)
  setTimeout(() => preloaderEl.style.display = 'none', 1000)

}
function gettingTheHostNameFromURL(websiteURL) {
  var getTheHostName;
  if (websiteURL.indexOf("//") > -1) {
     getTheHostName = websiteURL.split('/')[2];
  } else {
     getTheHostName = websiteURL.split('/')[0];
  }
  getTheHostName = getTheHostName.split(':')[0];
  getTheHostName = getTheHostName.split('?')[0];
  return getTheHostName;
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
  arrowListner(data)
}




document.querySelector('.name').innerText = userName

// avatar and banner
fetch(url, userOptions).then(handleResponse).then(handleUser).catch(handleError);

// content list
fetch(url, mediaOptions).then(handleResponse).then(handleList).catch(handleError);

// info section
fetch(url, infoOptions).then(handleResponse).then(handleInfo).catch(handleError);


setTimeout(() => removePreloader(), 5000)

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}