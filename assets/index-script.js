let urlParams = new URLSearchParams(window.location.search)
var userName = urlParams.get('user')
var urlSortOrder = urlParams.get('order')
var urlSortOption = urlParams.get('sort')
var urlView = urlParams.get('view')
var urlSelect = urlParams.get('select')


// if no user is given, go to search bar
if (userName == null) {
  window.location = '/search.html';
}



var url = 'https://graphql.anilist.co'
var variableDefault = {
  userName: userName
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
    variables: variableDefault
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
    variables: variableDefault
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
  // main div
  let showElement = document.createElement('div')
  showElement.setAttribute('class', 'show-list-item')

  // main image anchor
  let showCoverImg = document.createElement('a')
  showCoverImg.setAttribute('class', 'image')
  showCoverImg.setAttribute('href', show.media.siteUrl)
  showCoverImg.setAttribute('target', '_blank')
  showCoverImg.appendChild(document.createElement('img'))
  showCoverImg.children[0].setAttribute('src', show.media.coverImage.large)

  // main info grid 
  let showInfoGrid = document.createElement('div')
  showInfoGrid.setAttribute('class', 'info-grid')

  // info grid title
  let showInfoGridTitle = document.createElement('a')
  showInfoGridTitle.setAttribute('class', 'title')
  showInfoGridTitle.setAttribute('href', show.media.siteUrl)
  showInfoGridTitle.setAttribute('target', '_blank')

  if (show.media.title.english == null) {
    showInfoGridTitle.innerText = show.media.title.romaji
  } else {
    showInfoGridTitle.innerText = show.media.title.english
  }

  showInfoGrid.appendChild(showInfoGridTitle)

  // main info list
  let showInfoList = document.createElement('div')
  showInfoList.setAttribute('class', 'info-list')


  // info list header 
  let showInfoListHeader = document.createElement('div')
  showInfoListHeader.setAttribute('class', 'info-header')

  let showInfoListHeaderTitle = document.createElement('h1')
  showInfoListHeaderTitle.setAttribute('class', 'title')

  if (show.media.title.english == null) {
    showInfoListHeaderTitle.innerText = show.media.title.romaji
  } else {
    showInfoListHeaderTitle.innerText = show.media.title.english
  }

  let showInfoListHeaderStudio = document.createElement('a')
  showInfoListHeaderStudio.setAttribute('class', 'studio')
  showInfoListHeaderStudio.setAttribute('target', '_blank')

  show.media.studios.edges.forEach(studio => {
    if (studio.isMain == true) {
      showInfoListHeaderStudio.innerText = studio.node.name
      showInfoListHeaderStudio.setAttribute('href', studio.node.siteUrl)
    }
  })

  showInfoListHeader.appendChild(showInfoListHeaderTitle)
  showInfoListHeader.appendChild(showInfoListHeaderStudio)
  showInfoList.appendChild(showInfoListHeader)


  // info list footer
  let showInfoListFooter = document.createElement('div')
  showInfoListFooter.setAttribute('class', 'info-footer')

  let showInfoListFooterRating = document.createElement('div')
  showInfoListFooterRating.setAttribute('class', 'rating')
  showInfoListFooterRating.innerHTML = "<svg viewBox='0 0 34 33' xmlns='http://www.w3.org/2000/svg'><path d='M16.9049 2.2927C16.9348 2.20057 17.0652 2.20057 17.0951 2.29271L20.5698 12.9866C20.5832 13.0278 20.6216 13.0557 20.6649 13.0557H31.9091C32.006 13.0557 32.0463 13.1797 31.9679 13.2366L22.8711 19.8458C22.8361 19.8713 22.8214 19.9164 22.8348 19.9576L26.3095 30.6516C26.3394 30.7437 26.2339 30.8203 26.1556 30.7634L17.0588 24.1542C17.0237 24.1287 16.9763 24.1287 16.9412 24.1542L7.84443 30.7634C7.76605 30.8203 7.66061 30.7437 7.69054 30.6516L11.1652 19.9576C11.1786 19.9164 11.1639 19.8713 11.1289 19.8458L2.03209 13.2366C1.95371 13.1797 1.99399 13.0557 2.09086 13.0557H13.3351C13.3784 13.0557 13.4168 13.0278 13.4302 12.9866L16.9049 2.2927Z'/></svg>"
  
  let footerRatingScore = document.createElement('h2')
  footerRatingScore.innerText = show.score
  showInfoListFooterRating.appendChild(footerRatingScore)

  let showInfoListFooterSeperator = document.createElement('div')
  showInfoListFooterSeperator.setAttribute('class', 'seperator')

  let showInfoListFooterMore = document.createElement('div')
  showInfoListFooterMore.setAttribute('class', 'more-info')

  let footerMoreStatus = document.createElement('h2')
  footerMoreStatus.setAttribute('class', 'status')
  footerMoreStatus.innerText = show.media.status.toLowerCase()

  let footerMoreFormat = document.createElement('h2')
  footerMoreFormat.setAttribute('class', 'format')

  if (show.media.format.length > 3) {
    let mediaFormat = show.media.format.split('_').join(' ')

    if (mediaFormat.toLowerCase().startsWith('tv short')) {
      footerMoreFormat.innerText = 'TV Short'
    } else {
      footerMoreFormat.innerText = mediaFormat.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
    }
  } else {
    footerMoreFormat.innerText = show.media.format
  }

  let footerMoreYear = document.createElement('h2')
  footerMoreYear.setAttribute('class', 'year')
  if (show.media.seasonYear == null) {
    footerMoreYear.innerText = '-'
  } else {
    footerMoreYear.innerText = show.media.seasonYear
  }

  showInfoListFooterMore.appendChild(footerMoreFormat)
  showInfoListFooterMore.appendChild(footerMoreStatus)
  showInfoListFooterMore.appendChild(footerMoreYear)

  showInfoListFooter.appendChild(showInfoListFooterRating)
  showInfoListFooter.appendChild(showInfoListFooterSeperator)
  showInfoListFooter.appendChild(showInfoListFooterMore)

  showInfoList.appendChild(showInfoListFooter)

  showElement.appendChild(showCoverImg)
  showElement.appendChild(showInfoGrid)
  showElement.appendChild(showInfoList)

  return showElement
}
function btnListner() {
  let btns = document.querySelectorAll('.btn')
  let content = document.querySelector('.content')
  let infoClick = document.getElementById('info')

  btns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      let url = new URL(window.location)

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

        url.searchParams.set('select', e.target.id)
        history.pushState({}, null, url)

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
  setTimeout(() => preloaderEl.style.display = 'none', 1000)

}
function fetchSortedLists(type) {
  if (type == 'sort-recent') {
    var variables = {
      userName: userName,
      sortWatching: "PROGRESS",
      sortCompleted: "UPDATED_TIME",
      sortPlanning: "ADDED_TIME"
    }
  } else if (type == 'sort-alphabet') {
    var variables = {
      userName: userName,
      sortWatching: "MEDIA_TITLE_ENGLISH",
      sortCompleted: "MEDIA_TITLE_ENGLISH",
      sortPlanning: "MEDIA_TITLE_ENGLISH" 
    }
  } else if (type == 'sort-rating') {
    var variables = {
      userName: userName,
      sortWatching: "SCORE",
      sortCompleted: "SCORE",
      sortPlanning: "SCORE" 
    }
  } else if (type == 'sort-popularity') {
    var variables = {
      userName: userName,
      sortWatching: "MEDIA_POPULARITY",
      sortCompleted: "MEDIA_POPULARITY",
      sortPlanning: "MEDIA_POPULARITY" 
    }
  }

  var mediaListWatching = `
    query ($userName: String, $sortWatching: [MediaListSort]) { 
      MediaListCollection (userName: $userName, type: ANIME, sort: $sortWatching, status: CURRENT) { 
        lists {
          name
          entries {
            score
            media {
              coverImage {
                large
              }
              title {
                romaji
                english
              }
              siteUrl
              format
              status
              seasonYear
              studios {
                edges {
                  isMain
                  node {
                    siteUrl
                    name
                  }
                }
              }
            }
          }
        }
      }
    }`
  var mediaListCompleted = `
  query ($userName: String, $sortCompleted: [MediaListSort]) { 
    MediaListCollection (userName: $userName, type: ANIME, sort: $sortCompleted, status: COMPLETED) { 
      lists {
        name
        entries {
          score
          media {
            coverImage {
              large
            }
            title {
              romaji
              english
            }
            siteUrl
            format
            status
            seasonYear
            studios {
              edges {
                isMain 
                node {
                  name
                  siteUrl
                }
              }
            }
          }
        }
      }
    }
  }`
  var mediaListPlanning = `
  query ($userName: String, $sortPlanning: [MediaListSort]) { 
    MediaListCollection (userName: $userName, type: ANIME, sort: $sortPlanning, status: PLANNING) { 
      lists {
        name
        entries {
          score
          media {
            coverImage {
              large
            }
            title {
              romaji
              english
            }
            siteUrl
            format
            status
            seasonYear 
            studios {
              edges {
                isMain
                node {
                  name
                  siteUrl
                }
              }
            }
          }
        }
      }
    }
  }`


  var mediaOptionsWatching = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: mediaListWatching,
      variables: variables
    })
  }
  var mediaOptionsCompleted = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: mediaListCompleted,
      variables: variables
    })
  }
  var mediaOptionsPlanning = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: mediaListPlanning,
      variables: variables
    })
  }

  fetch(url, mediaOptionsWatching).then(handleResponse).then(handleListWatching).catch(handleError);
  fetch(url, mediaOptionsCompleted).then(handleResponse).then(handleListCompleted).catch(handleError);
  fetch(url, mediaOptionsPlanning).then(handleResponse).then(handleListPlanning).catch(handleError);
}
function sortBtnMob() {
  let sortContainer = document.querySelector('.sort-container')
  let sortOptionContainer = sortContainer.querySelector('#sort-options')
  let sortOptions = sortOptionContainer.children[0]
  let sortOptionsBack = sortContainer.querySelector('.sort-mob-back')


  function openSortOptions() {
    sortContainer.classList.add('active')
    sortOptionContainer.classList.add('active')
    sortOptionsBack.classList.add('active')
    setTimeout(() => sortOptions.classList.add('active'), 400)

    let clickEvent = function (e) {
      if (e.target != sortOptions) {
        document.removeEventListener('click', clickEvent)
        document.removeEventListener('scroll', scrollEvent)
        closeSortOptions()
      }
    }

    let scrollEvent = function (e) {
      document.removeEventListener('scroll', scrollEvent)
      document.removeEventListener('click', clickEvent)
      closeSortOptions()
    }

    setTimeout(() => document.addEventListener('click', clickEvent), 300)
    document.addEventListener('scroll', scrollEvent)
  }

  function closeSortOptions() {
    setTimeout(() => sortOptionContainer.classList.remove('active'), 300)
    sortOptions.classList.remove('active')
    sortContainer.classList.remove('active')
    sortOptionsBack.classList.remove('active')
  }

  openSortOptions()
}


function settingsBarListner() {
  settingsBarSort()
  settingsBarOrder()
  settingsBarView()
}
function settingsBarSort() {
  let sortBtnContainer = document.querySelector('#sort-btn-icon')
  let sortOptions = document.querySelectorAll('.sort-option-btn')
  let sortContainer = document.querySelector('.sort-container')
  let template = document.getElementById("sort-options").innerHTML
  let sortSvgs = sortContainer.querySelector('#sort-svg-container').children

  var sortTippyInstance = tippy(document.getElementById('sort-btn-icon'), {
    allowHTML: true,
    arrow: false,
    content: template,
    delay: 0,
    trigger: "manual",
    holdOnClick: true,
    placement: "bottom",
    interactive: true,
    theme: "custom",
    onMount() {
      sortSvgs[0].classList.remove('active')
      sortSvgs[1].classList.add('active')
      sortContainer.classList.add('active')

      if (!sortContainer.classList.contains('tippy-instance-created')) {
        let listContent = document.querySelector('.tippy-content').children[0]
        let listbtns = listContent.querySelectorAll('h3')
        sortContainer.classList.add('tippy-instance-created')
  
        listbtns.forEach(listbtn => {
          listbtn.addEventListener('click', function _listner(e) {
            let sortContainer = document.querySelector('.sort-container')
            let sortPara = sortContainer.querySelector('p')
            let url = new URL(window.location)

            sortTippyInstance.hide()

            if (!sortPara.classList.contains('active')) {
              sortPara.classList.add('active')
            }
            sortPara.innerText = e.target.innerText

            e.target.classList.add('active')
            
            let sortOptionNames = ['sort-recent', 'sort-alphabet', 'sort-popularity', 'sort-rating']
            let content = document.querySelector('.content')
            sortOptionNames.forEach(option => {
              if (content.classList.contains(option)) {
                content.classList.remove(option)
              }
            })

            let sortOptionContainer = document.querySelector('.option-container')
            let sortOptions = sortOptionContainer.querySelectorAll('.sort-option-btn')
            sortOptions.forEach(option => {
              if (option.classList.contains('active')) {
                option.classList.remove('active')

                if (option.id == e.target.id) {
                  option.classList.add('active')
                }
              } else if (option.id == e.target.id) {
                option.classList.add('active')
              }
            })

            let tippyOptionContainer = document.querySelector('.tippy-content')
            let tippySortOptions = tippyOptionContainer.querySelectorAll('.sort-option-btn')
            tippySortOptions.forEach(option => {
              if (option.classList.contains('active')) {
                option.classList.remove('active')

                if (option.id == e.target.id) {
                  option.classList.add('active')
                }
              } else if (option.id == e.target.id) {
                option.classList.add('active')
              }
            })

            let type = e.target.id
            content.classList.add(type)

            url.searchParams.set('sort', type)
            history.pushState({}, null, url)

            fetchSortedLists(type)
          })
        })
      
      }
    },
    onHide() {
      sortSvgs[1].classList.remove('active')
      sortSvgs[0].classList.add('active')
      setTimeout(() => sortContainer.classList.remove('active'), 300)
    }
  })


  sortBtnContainer.addEventListener('click', () => {
    if (window.innerWidth > 640 && !sortContainer.classList.contains('active')) {
      sortTippyInstance.show()
      
    }

    else if (window.innerWidth <= 640 && !sortContainer.classList.contains('active')) {
      sortBtnMob()
    }
  })

  sortOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      let sortOptionNames = ['sort-recent', 'sort-alphabet', 'sort-popularity', 'sort-rating']
      let content = document.querySelector('.content')
      let url = new URL(window.location)

      sortOptionNames.forEach(option => {
        if (content.classList.contains(option)) {
          content.classList.remove(option)
        }
      })
    
      let sortOptionContainer = document.querySelector('.option-container')
      let sortOptions = sortOptionContainer.querySelectorAll('.sort-option-btn')
      sortOptions.forEach(option => {
        if (option.classList.contains('active')) {
          option.classList.remove('active')

          if (option.id == e.target.id) {
            option.classList.add('active')
          }
        } else if (option.id == e.target.id) {
          option.classList.add('active')
        }
      })

      let type = e.target.id
      content.classList.add(type)

      url.searchParams.set('sort', type)
      history.pushState({}, null, url)

      fetchSortedLists(type)
    })
  })
}
function settingsBarOrder() {
  let orderContainer = document.querySelector('.order-container')
  let content = document.querySelector('.content')

  orderContainer.addEventListener('click', function () {
    let orderSvgs = orderContainer.querySelector('#order-svg-container').children
    let orderPara = orderContainer.getElementsByTagName('p')[0]
    let url = new URL(window.location)

    if (orderSvgs[0].classList.contains('active')) {
      orderSvgs[0].classList.remove('active')
      orderSvgs[1].classList.add('active')
      orderContainer.getElementsByTagName('p')[0].innerText = 'Ascending'
      content.classList.remove('desc')
      url.searchParams.set('order', 'asc')
      history.pushState({}, null, url)

      if (!orderPara.classList.contains('active')) {
        orderPara.classList.add('active')
      }

      if (content.classList.contains('sort-recent')) {
        fetchSortedLists('sort-recent')
      } else if (content.classList.contains('sort-alphabet')) {
        fetchSortedLists('sort-alphabet')
      } else if (content.classList.contains('sort-rating')) {
        fetchSortedLists('sort-rating')
      } else if (content.classList.contains('sort-popularity')) {
        fetchSortedLists('sort-popularity')
      }
    } 
    
    else {
      orderSvgs[1].classList.remove('active')
      orderSvgs[0].classList.add('active')
      orderContainer.getElementsByTagName('p')[0].innerText = 'Descending'
      content.classList.add('desc')
      url.searchParams.set('order', 'desc')
      history.pushState({}, null, url);

      if (!orderPara.classList.contains('active')) {
        orderPara.classList.add('active')
      }

      if (content.classList.contains('sort-recent')) {
        fetchSortedLists('sort-recent')
      } else if (content.classList.contains('sort-alphabet')) {
        fetchSortedLists('sort-alphabet')
      } else if (content.classList.contains('sort-rating')) {
        fetchSortedLists('sort-rating')
      } else if (content.classList.contains('sort-popularity')) {
        fetchSortedLists('sort-popularity')
      }
    }
  })
  
}
function settingsBarView() {
  let viewContainer = document.querySelector('.view-container')
  let content = document.querySelector('.content')

  viewContainer.addEventListener('click', function () {
    let viewSvgs = viewContainer.querySelector('#view-svg-container').children
    let viewPara = viewContainer.getElementsByTagName('p')[0]
    let url = new URL(window.location)

    if (viewSvgs[0].classList.contains('active')) {
      viewSvgs[0].classList.remove('active')
      viewSvgs[1].classList.add('active')
      viewContainer.getElementsByTagName('p')[0].innerText = 'List'

      if (!viewPara.classList.contains('active')) {
        viewPara.classList.add('active')
      }

      content.classList.add('list')
      content.classList.remove('grid')
      url.searchParams.set('view', 'list')
      history.pushState({}, null, url)
    } 
    
    else {
      viewSvgs[1].classList.remove('active')
      viewSvgs[0].classList.add('active')
      viewContainer.getElementsByTagName('p')[0].innerText = 'Grid'

      if (!viewPara.classList.contains('active')) {
        viewPara.classList.add('active')
      }

      content.classList.remove('list')
      content.classList.add('grid')
      url.searchParams.set('view', 'grid')
      history.pushState({}, null, url)
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
}
function handleInfo(data) {
  arrowListner(data)
}



function handleListCompleted(data) {
  let content = document.querySelector('.content')
  let completedParent = content.querySelector('#completed')
  let completed = data.data.MediaListCollection.lists[0]

  completedParent.innerHTML = ''

  if (completed.length != 0) {
    if (content.classList.contains('desc')) {
      completed.entries.reverse().forEach(show => {
        showElement = showElementCreate(show)
        completedParent.appendChild(showElement)
      })
    } else {
      completed.entries.forEach(show => {
        showElement = showElementCreate(show)
        completedParent.appendChild(showElement)
      })
    }
  } else {
    completedParent.classList.add('empty-message')
    completedParent.classList.remove('show-list')
  }
}
function handleListWatching(data) {
  let content = document.querySelector('.content')
  let watchingParent = content.querySelector('#watching')
  let watching = data.data.MediaListCollection.lists[0]

  watchingParent.innerHTML = ''

  if (watching.length != 0) {
    if (content.classList.contains('desc')) {
      watching.entries.reverse().forEach(show => {
        showElement = showElementCreate(show)
        watchingParent.appendChild(showElement)
      })
    } else {
      watching.entries.forEach(show => {
        showElement = showElementCreate(show)
        watchingParent.appendChild(showElement)
      })
    }
  } else {
    watchingParent.classList.add('empty-message')
    watchingParent.classList.remove('show-list')
  }
}
function handleListPlanning(data) {
  let content = document.querySelector('.content')
  let planningParent = content.querySelector('#planning')
  let planning = data.data.MediaListCollection.lists[0]

  planningParent.innerHTML = ''

  if (planning.length != 0) {
    if (content.classList.contains('desc')) {
      planning.entries.reverse().forEach(show => {
        showElement = showElementCreate(show)
        planningParent.appendChild(showElement)
      })
    } else {
      planning.entries.forEach(show => {
        showElement = showElementCreate(show)
        planningParent.appendChild(showElement)
      })
    }
  } else {
    planningParent.classList.add('empty-message')
    planningParent.classList.remove('show-list')
  }
}




// display username
document.querySelector('.name').innerText = userName

// avatar and banner
fetch(url, userOptions).then(handleResponse).then(handleUser).catch(handleError)

// info section
fetch(url, infoOptions).then(handleResponse).then(handleInfo).catch(handleError)

// content sort
let urlSortOptionValues = ['sort-recent', 'sort-alphabet', 'sort-popularity', 'sort-rating']
if (urlSortOption != null) {
  urlSortOptionValues.forEach(value => {
    if (value == urlSortOption) {
      fetchSortedLists(value)
      document.querySelector('.content').classList.add(value)

      document.querySelectorAll('.sort-option-btn').forEach(option => {
        if (option.id == value) {
          option.classList.add('active')
        }
      })
    }
  })
} 
else {
  document.querySelector('.content').classList.add('sort-recent')
  fetchSortedLists('sort-recent')
}

// content list view
if (urlView == 'grid') {
  document.querySelector('.content').classList.add('grid')
  document.querySelector('#view-svg-container').children[0].classList.add('active')
}
else if (urlView == 'list') {
  document.querySelector('.content').classList.add('list')
  document.querySelector('#view-svg-container').children[1].classList.add('active')
}
else {
  document.querySelector('.content').classList.add('grid')
  document.querySelector('#view-svg-container').children[0].classList.add('active')
} 


// content list order
if (urlSortOrder == 'asc') {
  document.querySelector('#order-svg-container').children[1].classList.add('active')
}
else {
  document.querySelector('.content').classList.add('desc')
  document.querySelector('#order-svg-container').children[0].classList.add('active')
} 

// content selector
if (urlSelect == 'watching') {
  document.querySelector('.btn-container').querySelector('#watching').classList.add('active')
  document.querySelector('.content').querySelector('#watching').classList.add('active')
} 
else if (urlSelect == 'planning') {
  document.querySelector('.btn-container').querySelector('#planning').classList.add('active')
  document.querySelector('.content').querySelector('#planning').classList.add('active')
} 
else {
  document.querySelector('.btn-container').querySelector('#completed').classList.add('active')
  document.querySelector('.content').querySelector('#completed').classList.add('active')
}



// selectcard btns
btnListner()  

// remove preloader
setTimeout(() => removePreloader(), 4000)

// settings bar btns
settingsBarListner()