const nav = document.querySelector(".nav");
const pageHeader = nav.parentElement;
const menuIcon = document.querySelector(".icon-menu");
const navOffset = nav.offsetTop;
const navLinks = Array.from(nav.children);
const main = document.getElementById("main");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
let productsDOM;
let teamPhotos, team;
let cart = [];
let bagButtonsDOM = [];

window.onscroll = () => stickyNav();

let App = {
  init() {
    let products = new Products();
    loadHtml("home")
      .then(() => {
        ui.displayProducts(products);
      })
      .then(() => {
        ui.getBagBtns();
        ui.cartLogic();
      });
  },
  setup() {
    cartBtn.addEventListener("click", () => ui.showCart());
    closeCartBtn.addEventListener("click", () => ui.hideCart());
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
    console.error(error);
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
// let makeRequest = function (url) {
//   let req = new XMLHttpRequest();

//   // wrap xhr in a Promise
//   return new Promise(function (resolve, reject) {
//     req.onload = function () {
//       if (req.status === 200 && req.readyState === 4) {
//         resolve(req);
//       } else {
//         reject({ statusText: req.statusText });
//       }
//     };
//     req.open("GET", url, true);
//     req.send();
//   });
// };

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
              alt="product-image"
              class="product-img image-bg"
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
  getBagBtns() {
    const bagBtns = [...document.querySelectorAll(".bag-btn")];
    bagButtonsDOM = bagBtns;
    bagBtns.forEach((button) => {
      let id = button.dataset.id;
      button.addEventListener("click", () => {
        //check if item is already in cart
        let itemInCart = cart.find((item) => item.id == id);
        if (itemInCart) {
          button.innerText = "added to cart";
          button.disabled = true;
        } else {
          button.innerText = "added to cart";
          button.disabled = true;
          // get products in local storage
          let cartItem = { ...Store.getProduct(id), amount: 1 };
          // add item to cart array
          cart = [...cart, cartItem];
          // save updated cart to local storage
          Store.saveCart(cart);
          // calculate cart values
          this.calculateCartValues(cart);
          // add cart item to shopping cart
          this.addCartItemToDom(cartItem);
          // show the cart
          this.showCart();
        }
      });
    });
  },
  calculateCartValues(cart) {
    let tempPrice = 0;
    let itemsTotal = 0;
    // cart.map((item) => {
    //   itemsTotal += item.amount;
    //   tempPrice += item.price * item.amount;
    // });
    for (const cartItem of cart) {
      itemsTotal += cartItem.amount;
      tempPrice += cartItem.price * cartItem.amount;
    }
    cartItems.innerText = itemsTotal;
    cartTotal.innerText = parseFloat(tempPrice.toFixed(2));
  },
  addCartItemToDom(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src=${cartItem.image} alt="product" class="image-bg" />
      <div>
        <h4>${cartItem.name}</h4>
        <h5>$${cartItem.price}</h5>
        <span class="remove-item" data-id=${cartItem.id}>remove</span>
      </div>
      <div>
        <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
        <p class="item-amount">${cartItem.amount}</p>
        <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
      </div>`;
    cartContent.appendChild(div);
  },
  showCart() {
    cartOverlay.classList.add("transparent-bg");
    cartDOM.classList.add("showCart");
  },
  hideCart() {
    cartOverlay.classList.remove("transparent-bg");
    cartDOM.classList.remove("showCart");
  },
  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (e) => {
      let target = e.target;
      let id = target.dataset.id;
      if (target.classList.contains("fa-chevron-up")) {
        let itemToAdd = cart.find((item) => item.id == id);
        itemToAdd.amount = itemToAdd.amount + 1;
        // updated cart in local storage
        Store.saveCart(cart);
        // recalculate cart values
        this.calculateCartValues(cart);
        // update amount in cart
        target.nextElementSibling.innerText = itemToAdd.amount;
      } else if (target.classList.contains("fa-chevron-down")) {
        let itemToReduce = cart.find((item) => item.id == id);
        itemToReduce.amount = itemToReduce.amount - 1;
        if (itemToReduce.amount > 0) {
          // updated cart in local storage
          Store.saveCart(cart);
          // recalculate cart values
          this.calculateCartValues(cart);
          // update amount in cart
          target.previousElementSibling.innerText = itemToReduce.amount;
        } else {
          // if item reduced to zero
          this.removeItem(id);
          //remove item from dom
          cartContent.removeChild(target.parentElement.parentElement);
        }
      } else if (target.classList.contains("remove-item")) {
        this.removeItem(id);
        cartContent.removeChild(target.parentElement.parentElement);
      }
    });
  },
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.calculateCartValues(cart);
    Store.saveCart(cart);
    let button = bagButtonsDOM.find((button) => button.dataset.id == id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart">add to cart</i>`;
  },
  clearCart() {
    // get ids of all items in cart
    let ids = cart.map((item) => item.id);
    ids.forEach((id) => this.removeItem(id));
    // update DOM
    while (cartContent.children.length > 0) {
      // remove every first child until there's no more
      cartContent.removeChild(cartContent.children[0]);
    }
  },
};

let Store = {
  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  },
  saveTeamData(teamData) {
    localStorage.setItem("teamData", JSON.stringify(teamData));
  },
  getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id == id);
  },
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
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
  App.setup();
});
