var nav = document.getElementById('navbar')
var pageHeader = nav.parentElement
var navOffset = nav.offsetTop
var navToggle = document.getElementById('nav-toggle')
var navLinks = Array.from(nav.children)
var main = document.getElementById('main')

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

function buildTeamHtml(param) {
  var req = new XMLHttpRequest()
  var url = `https://jsonplaceholder.typicode.com/${param}`
  req.open('GET', url, true)
  req.send()
  req.onload = function() {
    if (req.status === 200 && req.readyState === 4) {
      var response = JSON.parse(req.response)
      main.innerHTML = ''
      var div = createEl('div')
      div.classList.add('team')
      append(main, div)

      response.forEach(function(person) {
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
      })
    } else {
      console.log('Error')
    }
  }

  req.onerror = function(err) {
    console.log(err)
  }
}

function createEl(element) {
  return document.createElement(element)
}

function append(parent, element) {
  return parent.appendChild(element)
}
