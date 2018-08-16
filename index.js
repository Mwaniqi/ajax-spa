var nav = document.getElementById('navbar')
var pageHeader = nav.parentElement
var navOffset = nav.offsetTop
var navToggle = document.getElementById('nav-toggle')
var navLinks = Array.from(nav.children)

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