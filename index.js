const nav = document.querySelector(".nav");
const pageHeader = nav.parentElement;
const menuIcon = document.querySelector(".icon-menu");
const navOffset = nav.offsetTop;
const navLinks = Array.from(nav.children);
let main = document.getElementById("main");
let productsDOM;
let teamPhotos, team;

window.onscroll = () => stickyNav();

let App = {
  init() {
    let products = new Products();
    loadHtml("home").then(() => {
      ui.displayProducts(products);
    });
  },
};

// nav collapse
menuIcon.addEventListener("click", function (e) {
  nav.classList.toggle("showNav");
});

// sticky nav
function stickyNav() {
  if (window.pageYOffset > navOffset) {
    nav.classList.add("nav-sticky");
    // pageHeader.style.marginBottom = '2rem'
  } else {
    nav.classList.remove("nav-sticky");
    // pageHeader.style.marginBottom = '0'
  }
}

//  toggle .active class
nav.addEventListener("click", function (e) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  e.target.classList.add("active");
  nav.classList.remove("showNav");
  let pageurl = e.target.innerText.toLowerCase();
  if (pageurl === "home") {
    let storedProducts =
      JSON.parse(localStorage.getItem("products")) || Products();
    loadHtml("home").then(() => {
      ui.displayProducts(storedProducts);
    });
  }
  if (pageurl === "team") {
    let teamData = JSON.parse(localStorage.getItem("teamData"));
    // getTeamData().then((teamData) => ui.displayTeam(teamData));
    if (JSON.parse(localStorage.getItem("teamData"))) {
      ui.displayTeam(teamData);
    } else {
      getTeamData().then((data) => ui.displayTeam(data));
    }
  }
  if (pageurl === "contact") {
    loadHtml("contact");
  }
});

async function loadHtml(page) {
  try {
    let result = await fetch(`${page}.html`);
    let response = await result.text();
    main.innerHTML = response;
  } catch (error) {
    console.error();
  }
}
// function loadHtml(page) {
//   let xhr = new XMLHttpRequest();
//   let url = `${page}.html`;

//   xhr.onload = function () {
//     if (this.readyState === 4 && this.status === 200) {
//       main.innerHTML = this.response;
//     }
//   };

//   xhr.open("GET", url, true);
//   xhr.send();
// }

// Promise-based xhr
let makeRequest = function (url) {
  let req = new XMLHttpRequest();

  // wrap xhr in a Promise
  return new Promise(function (resolve, reject) {
    req.onload = function () {
      if (req.status === 200 && req.readyState === 4) {
        resolve(req);
      } else {
        reject({ statusText: req.statusText });
      }
    };
    req.open("GET", url, true);
    req.send();
  });
};

let ui = {
  displayProducts(products) {
    productsDOM = document.querySelector(".products");
    let result = "";
    products.forEach((product) => {
      result += `
        <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fa fa-shopping-cart">Add to cart</i>
            </button>
          </div>
          <h3>${product.name}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end single product -->`;
    });
    productsDOM.innerHTML = result;
  },
  displayTeam(teamData) {
    main.innerHTML = "";
    let div = createEl("div");
    div.classList.add("team");
    append(main, div);
    let list = "";
    console.l;
    teamData.team.forEach(function (person) {
      list += `
        <ul>
          <img src=${randomPhotoUrl(teamData)}>
          <li>${person.name}</li>
          <li>${person.email}</li>
          <li>${person.company.bs}</li>
          <li>${person.company.catchPhrase}</li>
        </ul>`;
      div.innerHTML = list;
    });
  },
};

let Store = {
  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  },
  saveTeamData(teamData) {
    localStorage.setItem("teamData", JSON.stringify(teamData));
  },
};

// get products
function Products() {
  let products = [];
  for (let i = 0; i < 10; i++) {
    const name = faker.commerce.productName();
    const price = faker.commerce.price();
    const image = faker.image.technics();
    const id = faker.random.uuid();
    products.push({ name, price, image, id });
  }
  Store.saveProducts(products);
  return products;
}

// get team data
// function getTeamData() {
//   makeRequest("https://jsonplaceholder.typicode.com/albums/1/photos")
//     .then(function (req) {
//       teamPhotos = JSON.parse(req.response);
//       return makeRequest("https://jsonplaceholder.typicode.com/users");
//     })
//     .then(function (req) {
//       team = JSON.parse(req.response);
//     })
//     .then(function () {
//       let teamData = { teamPhotos, team };
//       // Store.saveTeamData(teamData);
//       return teamData;
//     })
//     .catch(function (err) {
//       console.log("Error:", err);
//     });
// }

async function getTeamData() {
  try {
    let teamPhotos = await fetch(
      "https://jsonplaceholder.typicode.com/albums/1/photos"
    );
    let team = await fetch("https://jsonplaceholder.typicode.com/users");
    teamPhotos = await teamPhotos.json();
    team = await team.json();
    let teamData = { teamPhotos, team };
    Store.saveTeamData(teamData);
    return teamData;
  } catch (error) {
    console.error(error);
  }
}

function createEl(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.appendChild(element);
}

// select random photo
function randomPhotoUrl(data) {
  let index = Math.floor(Math.random() * data.team.length);
  let photo = data.teamPhotos[index];
  return photo.thumbnailUrl;
}
// show home on first load
document.addEventListener("DOMContentLoaded", function () {
  App.init();
});
