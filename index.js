var nav = document.getElementById('navbar')
var pageHeader = nav.parentElement
var navOffset = nav.offsetTop
var navToggle = document.getElementById('nav-toggle')
var navLinks = Array.from(nav.children)
var main = document.getElementById('main')
var photos, users

// .matchMedia to match css media queries
if (window.matchMedia('(min-width: 37.5rem)').matches) {
  window.onscroll = () => stickyNav()  
}

// nav collapse
if (window.matchMedia('(max-width: 37.5rem)').matches) {
  pageHeader.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.tagName ==='IMG') {
      nav.classList.toggle('show')    
    }
  })
}

// sticky nav
function stickyNav() {
  if (window.pageYOffset > navOffset) {
    nav.classList.add('nav-sticky')
    pageHeader.style.marginBottom = '2rem'
  } else {
    nav.classList.remove('nav-sticky')
    pageHeader.style.marginBottom = '0'
  }
}

//  toggle .active class
nav.addEventListener('click', function(e) {
  navLinks.forEach((link) => {
    link.classList.remove('active')
  });
  e.target.classList.add('active')
})

// show home on first load
document.addEventListener('DOMContentLoaded', function() {
  loadHtml('home')
})

function loadHtml(page) {
  var xhr = new XMLHttpRequest()
  var url = `${page}.html`

  xhr.onload = function() {
    if (this.readyState === 4 && this.status === 200) {
      main.innerHTML = this.response
    }
  }

  xhr.open('GET', url, true)
  xhr.send()
}

// Promise-based xhr
var makeRequest = function(url) {
  var req = new XMLHttpRequest

  // wrap xhr in a Promise
  return new Promise(function(resolve, reject) {
    req.onload = function() {
      if (req.status === 200 && req.readyState === 4) {
        resolve(req)
      } else {
        reject({statusText: req.statusText})
      }
    }
    req.open('GET', url, true)
    req.send()
  })
}

function buildTeamHtml() {
  makeRequest('https://jsonplaceholder.typicode.com/photos')
    .then(function(req) {  
      photos = JSON.parse(req.response)
      return makeRequest('https://jsonplaceholder.typicode.com/users')
    }).then(function(req) {
      users = JSON.parse(req.response)
    }).then(function() {
      main.innerHTML = ''
      var div = createEl('div')
      div.classList.add('team')
      append(main, div)

      users.forEach(function(person) {
        var ul = createEl('ul')
        var name = createEl('li')
        var email = createEl('li')
        var motto = createEl('li')
        var phrase = createEl('li')
        var mottoStr = person.company.bs
        mottoStr = mottoStr.replace(mottoStr.charAt(0), mottoStr.charAt(0).toUpperCase())

        name.textContent = person.name
        email.textContent = person.email
        motto.textContent = mottoStr
        phrase.textContent = person.company.catchPhrase

        append(div, ul)
        append(ul, name)
        append(ul, email)
        append(ul, motto)
        append(ul, phrase)

        randomPhoto()
      })
    }).catch(function(err) {
      console.log('Error:', err)
    })
}

function createEl(element) {
  return document.createElement(element)
}

function append(parent, element) {
  return parent.appendChild(element)
}

// select random photo
function randomPhoto() {
  var index = Math.floor(Math.random() * users.length)
  var ul = document.querySelectorAll('ul')
  var photo = photos[index]

  var img = createEl('img')
  var li = createEl('li')

  img.src = photo.thumbnailUrl
  var img_li = append(li, img)

  // insert img before other items in ul
  ul.forEach(function(list) {
    list.insertBefore(img_li, list.childNodes[0])
  })
}
