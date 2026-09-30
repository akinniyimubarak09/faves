const menuData = [

  {
    id: 1,
    name: "Jollof & Grilled Chicken",
    cat: "rice",
    price: 6500,
    img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85",
    desc: "Smoky party jollof, grilled chicken & house slaw",
    badge: "Popular"
  },

  {
    id: 2,
    name: "Creamy Chicken Pasta",
    cat: "mains",
    price: 7200,
    img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=700&q=85",
    desc: "Silky cream sauce, herbs, chicken & parmesan",
    badge: "Chef's pick"
  },

  {
    id: 3,
    name: "Crispy Chicken Burger",
    cat: "mains",
    price: 5800,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85",
    desc: "Crispy chicken, brioche, fresh slaw & signature sauce",
    badge: ""
  },

  {
    id: 4,
    name: "Loaded Beef Fries",
    cat: "sides",
    price: 5000,
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85",
    desc: "Crispy fries, seasoned beef, cheese & house sauce",
    badge: ""
  },

  {
    id: 5,
    name: "Pepper Soup",
    cat: "mains",
    price: 4500,
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85",
    desc: "Aromatic, spicy and deeply comforting house pepper soup",
    badge: "Hot"
  },

  {
    id: 6,
    name: "Prawn Fried Rice",
    cat: "rice",
    price: 7500,
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85",
    desc: "Wok-tossed rice, prawns, vegetables & smoky seasoning",
    badge: ""
  },

  {
    id: 7,
    name: "Plantain & Suya",
    cat: "sides",
    price: 4200,
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85",
    desc: "Sweet ripe plantain with spicy grilled suya",
    badge: ""
  },

  {
    id: 8,
    name: "Fresh Zobo Cooler",
    cat: "drinks",
    price: 1800,
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85",
    desc: "Chilled hibiscus, ginger, pineapple & citrus",
    badge: "Fresh"
  }

];


let cart =
  JSON.parse(
    localStorage.getItem("bolmeryCart")
  ) || [];


function naira(amount) {

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }
  ).format(amount);

}


/* RENDER MENU */

function renderMenu(filter = "all") {

  const grid =
    document.getElementById("menuGrid");

  const products =
    menuData.filter(
      item =>
        filter === "all" ||
        item.cat === filter
    );


  grid.innerHTML =
    products.map(
      (item, index) => `

      <article
        class="food-card"
        style="animation-delay:${index * .06}s"
      >

        <div class="food-img">

          <img
            loading="lazy"
            src="${item.img}"
            alt="${item.name}"
          >

          ${
            item.badge
              ? `<span class="food-badge">
                  ${item.badge}
                </span>`
              : ""
          }

          <button
            class="add-food"
            data-add="${item.id}"
          >
            +
          </button>

        </div>


        <div class="food-info">

          <h3>
            ${item.name}
          </h3>

          <p>
            ${item.desc}
          </p>

          <div class="food-bottom">

            <b>
              ${naira(item.price)}
            </b>

            <span>
              Made fresh
            </span>

          </div>

        </div>

      </article>

    `
    ).join("");

}


/* SAVE CART */

function saveCart() {

  localStorage.setItem(
    "bolmeryCart",
    JSON.stringify(cart)
  );

}


/* RENDER CART */

function renderCart() {

  const box =
    document.getElementById("cartItems");


  const count =
    cart.reduce(
      (total, item) =>
        total + item.qty,
      0
    );


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  document.getElementById(
    "cartCount"
  ).textContent = count;


  document.getElementById(
    "cartTotal"
  ).textContent = naira(total);


  if (!cart.length) {

    box.innerHTML = `

      <div class="empty-cart">

        <span>🍽️</span>

        <h4>
          Your bag is empty
        </h4>

        <p>
          Add something delicious
          from our menu.
        </p>

      </div>

    `;

    return;
  }


  box.innerHTML =
    cart.map(
      item => `

      <div class="cart-row">

        <img
          src="${item.img}"
          alt="${item.name}"
        >

        <div>

          <h4>
            ${item.name}
          </h4>

          <p>
            ${naira(item.price)}
          </p>


          <div class="qty">

            <button
              data-minus="${item.id}"
            >
              −
            </button>

            <span>
              ${item.qty}
            </span>

            <button
              data-plus="${item.id}"
            >
              +
            </button>

          </div>

        </div>


        <div class="price">

          ${naira(
            item.price * item.qty
          )}

        </div>

      </div>

    `
    ).join("");

}


/* ADD PRODUCT */

function addToCart(id) {

  const item =
    menuData.find(
      product => product.id === id
    );


  const existing =
    cart.find(
      product => product.id === id
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      ...item,
      qty: 1
    });

  }


  saveCart();

  renderCart();

  openCart();

}


/* CHANGE QUANTITY */

function changeQuantity(id, amount) {

  const item =
    cart.find(
      product => product.id === id
    );


  if (!item) return;


  item.qty += amount;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        product => product.id !== id
      );

  }


  saveCart();

  renderCart();

}


/* CART OPEN */

function openCart() {

  document
    .getElementById("cartDrawer")
    .classList.add("open");


  document
    .getElementById("overlay")
    .classList.add("show");


  document.body
    .classList.add("no-scroll");

}


/* CART CLOSE */

function closeCart() {

  document
    .getElementById("cartDrawer")
    .classList.remove("open");


  document
    .getElementById("overlay")
    .classList.remove("show");


  document.body
    .classList.remove("no-scroll");

}


/* CLICK EVENTS */

document.addEventListener(
  "click",
  event => {

    if (
      event.target.matches(
        "[data-add]"
      )
    ) {

      addToCart(
        Number(
          event.target.dataset.add
        )
      );

    }


    if (
      event.target.matches(
        "[data-plus]"
      )
    ) {

      changeQuantity(
        Number(
          event.target.dataset.plus
        ),
        1
      );

    }


    if (
      event.target.matches(
        "[data-minus]"
      )
    ) {

      changeQuantity(
        Number(
          event.target.dataset.minus
        ),
        -1
      );

    }

  }
);


/* MENU FILTER */

document
  .querySelectorAll(
    ".category-tabs button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelector(
            ".category-tabs .active"
          )
          .classList
          .remove("active");


        button.classList.add(
          "active"
        );


        renderMenu(
          button.dataset.filter
        );

      }
    );

  });


/* CART BUTTONS */

document
  .getElementById("openCart")
  .onclick = openCart;


document
  .getElementById("closeCart")
  .onclick = closeCart;


document
  .getElementById("overlay")
  .onclick = closeCart;


/* MOBILE MENU */

document
  .getElementById("menuToggle")
  .onclick = () => {

    document
      .querySelector(".nav")
      .classList.toggle("open");

  };


document
  .querySelectorAll(".nav a")
  .forEach(link => {

    link.onclick = () => {

      document
        .querySelector(".nav")
        .classList.remove("open");

    };

  });


/* CTA */

document
  .getElementById("ctaOrder")
  .onclick = () => {

    document
      .getElementById("menu")
      .scrollIntoView({
        behavior: "smooth"
      });

  };


/* CHECKOUT */

const modal =
  document.getElementById(
    "checkoutModal"
  );


document
  .getElementById("checkoutBtn")
  .onclick = () => {

    if (!cart.length) {

      alert(
        "Your cart is empty."
      );

      return;
    }


    closeCart();

    modal.classList.add("open");

  };


document
  .getElementById("closeCheckout")
  .onclick = () => {

    modal.classList.remove(
      "open"
    );

  };


modal.addEventListener(
  "click",
  event => {

    if (
      event.target === modal
    ) {

      modal.classList.remove(
        "open"
      );

    }

  }
);


/* WHATSAPP ORDER */

document
  .getElementById("checkoutForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const formData =
        new FormData(
          event.target
        );


      const items =
        cart.map(
          item =>
            `• ${item.name} x${item.qty} — ${naira(
              item.price * item.qty
            )}`
        ).join("\n");


      const total =
        cart.reduce(
          (sum, item) =>
            sum +
            item.price *
            item.qty,
          0
        );


      const message =

`Hello Bolmery Kitchen! 👋

I'd like to place an order:

${items}

Subtotal:
${naira(total)}

Name:
${formData.get("name")}

Phone:
${formData.get("phone")}

Address:
${formData.get("address")}

Note:
${formData.get("note") || "None"}`;


      /*
        CHANGE THIS NUMBER
        TO YOUR REAL WHATSAPP NUMBER.

        Example:
        2348063682721
      */

      const restaurantNumber =
        "2347053979600";


      const whatsappURL =
        "https://wa.me/2347053979600" +
        2347053979600 +
        "?text=" +
        encodeURIComponent(
          message
        );


      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );


/* REVIEWS */

const reviews = [

  [
    "“Every bite tasted fresh and intentional. Bolmery Kitchen has become our go-to spot for a proper comfort meal.”",
    "Ada M.",
    "Regular guest"
  ],

  [
    "“The jollof is seriously addictive. Great portions, beautiful presentation and the service feels genuinely warm.”",
    "Daniel O.",
    "Food lover"
  ],

  [
    "“We ordered for the whole family and everyone found something they loved. We’ll definitely be back.”",
    "Maya K.",
    "Happy guest"
  ]

];


let reviewIndex = 0;


function showReview(index) {

  reviewIndex =
    (index + reviews.length) %
    reviews.length;


  document.getElementById(
    "reviewText"
  ).textContent =
    reviews[reviewIndex][0];


  document.getElementById(
    "reviewName"
  ).textContent =
    reviews[reviewIndex][1];


  document.getElementById(
    "reviewDate"
  ).textContent =
    reviews[reviewIndex][2];


  document
    .querySelectorAll(".dots i")
    .forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index === reviewIndex
        );

      }
    );

}


document
  .querySelector(".review-arrow.prev")
  .onclick = () =>
    showReview(
      reviewIndex - 1
    );


document
  .querySelector(".review-arrow.next")
  .onclick = () =>
    showReview(
      reviewIndex + 1
    );


/* SCROLL REVEAL */

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("visible");

          }

        }
      );

    },
    {
      threshold: .12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    element =>
      observer.observe(element)
  );


/* HEADER SCROLL */

window.addEventListener(
  "scroll",
  () => {

    document
      .getElementById("header")
      .classList.toggle(
        "scrolled",
        window.scrollY > 30
      );

  }
);


/* LOADER */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        document
          .querySelector(".loader")
          .classList
          .add("done");

      },
      700
    );

  }
);


/* INITIALIZE */

renderMenu();

renderCart();