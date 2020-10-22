



function removePreloader() {
  let preloaderEl = document.querySelector('.preloader-container')

  preloaderEl.classList.add('active')
  setTimeout(() => preloaderEl.style.display = 'none', 1000)

}

function inputListner() {
    let inputEnter = document.querySelector('#user-input')
    let inputBtn = document.querySelector('.search-icon')


    inputEnter.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            inputHandler()
        }
    })

    inputBtn.addEventListener('click', () => {
        inputHandler()
    })


}

function inputHandler() {
    let inputEnterValue = document.querySelector('#user-input').value

    window.location = `/?user=${inputEnterValue}`;
}



// remove preloader
setTimeout(() => removePreloader(), 1000)

// input bar listner
inputListner()