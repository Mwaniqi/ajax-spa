// sticky nav
var nav = document.getElementById('navbar')
var header = nav.parentElement
var navOffset = nav.offsetTop

function stickyNav() {
  if (window.pageYOffset > navOffset) {
    nav.classList.add('nav-sticky')
    header.style.marginBottom = '2rem'
  } else {
    nav.classList.remove('nav-sticky')
    header.style.marginBottom = '0'
  }
}

window.onscroll = () => {stickyNav()}

// nav toggle
var navToggle = document.getElementById('nav-toggle')

navToggle.addEventListener('click', function() {
  nav.classList.toggle('hidden')
})