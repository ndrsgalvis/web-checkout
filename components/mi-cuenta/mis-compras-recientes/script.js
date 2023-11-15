const shoppings_wrapper = $d.querySelector("div.shoppings_wrapper");

const show_order_id = $d.getElementById("show_order_id");
const show_date_purchase = $d.getElementById("show_date_purchase");
const show_total = $d.getElementById("show_total");
const show_subtotal = $d.getElementById("show_subtotal");
const show_payment_method = $d.getElementById("show_payment_method");
const show_email = $d.getElementById("show_email");
const show_products = $d.getElementById("show_products");

const getPurchases = () => {
  const state = {
    purchases: [],
  };

  const formatPrice = (price) => {
    const currency = Intl.NumberFormat("es-CO", {
      currency: "COP",
    });

    return currency.format(price);
  };

  const formatDate = (date) => {
    let myDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    myDate = formatter.format(myDate);
    return myDate
      .replace(" ", "")
      .replace("de", "")
      .replace("de", ",")
      .replace(" ,", ",");
  };

  const render = () => {
    const { purchases } = state;
    let html = "";
    purchases.forEach((buys) => {
      const {
        order_id,
        date_purchase,
        deadline,
        payment_method,
        total,
        email,
        products,
      } = buys;

      let htmlProducts = "";

      products.forEach((product, i) => {
        const { name, photo, permalink, amount, options } = product;
        let listOptions = [...options];
        const material = listOptions.pop();
        listOptions = listOptions.reduce(
          (acc, cur) => (acc += `<li>+ ${cur.trim()}</li>`),
          ""
        );
        htmlProducts += `
        <div class="product">
        <div class="column">
          <p>${i === 0 ? "Producto" : ""}</p>
          <div>
            <img
              loading="lazy"
              src="${photo}"
              alt="Foto de gafa ${i}"
            />
            <div>
              <a href="${permalink}">${name}</a>
              <span>${material}</span>
              <ul>
                ${listOptions}
              </ul>
            </div>
          </div>
        </div>
        <div class="column">
        <p>${i === 0 ? "Cantidad" : ""}</p>
          <span class="amount">${amount}</span>
        </div>
      </div>
        `;
      });

      const obj = btoa(JSON.stringify(products));

      html += `<section>
        <ul class="web">
        <li>
          <p>Pedido</p>
          <span>${order_id}</span>
        </li>
        <li>
          <p>Fecha</p>
          <span>${formatDate(date_purchase)}</span>
        </li>
        <li class="total">
          <p>Total pagado</p>
          <span>$${formatPrice(total)}</span>
        </li>
        <li class="method">
          <p>Método de Pago</p>
          <span>${payment_method}</span>
        </li>
        <li class="date">
          <p>Fecha de entrega</p>
          <span>${formatDate(deadline)}</span>
        </li>
      </ul>
      <ul class="mobile">
        <li class="method">
          <p>Método de Pago</p>
          <span>${payment_method}</span>
        </li>
        <li class="date">
          <p>Fecha de entrega</p>
          <span>${formatDate(deadline)}</span>
        </li>
      </ul>
      <div class="info">
        <div class="list_products">
        ${htmlProducts}
        </div>
        <div class="actions">
          <label for="show_shoppings" onClick="showDetail(${order_id}, '${deadline}', '${total}', '${payment_method}', '${email}', '${obj}')"> Ver detalles </label>
          <button onclick="get_repay_url(${order_id})" >Volver a pedir</button>
        </div>
      </div>
    </section>`;
    });
    shoppings_wrapper.insertAdjacentHTML("beforeend", html);
  };

  const setState = (obj = {}) => {
    for (const key in obj) {
      if (state.hasOwnProperty(key)) {
        state[key] = obj[key];
      }
    }
    render();
  };

  const getData = async () => {
    let res = await fetch(
      "https://gikolab.com/api/mi-cuenta/compras/get_recent_purchases.php"
    );
    res = await res.json();
    setState({ purchases: res.data });
  };

  getData();
};

const formatPrice = (price) => {
  const currency = Intl.NumberFormat("es-CO", {
    currency: "COP",
  });
  return currency.format(price);
};

const formatDate = (date) => {
  let myDate = new Date(date);
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  myDate = formatter.format(myDate);
  return myDate
    .replace(" ", "")
    .replace("de", "")
    .replace("de", ",")
    .replace(" ,", ",");
};

function showDetail(
  order_id,
  deadline,
  total,
  payment_method,
  email,
  products
) {
  show_order_id.textContent = order_id;
  show_date_purchase.textContent = formatDate(deadline);
  show_total.textContent = "$" + formatPrice(total);
  show_subtotal.textContent = "$" + formatPrice(total);
  show_payment_method.textContent = payment_method;
  show_email.textContent = email;
  products = JSON.parse(atob(products));
  let html = ``;
  products.forEach((product, i) => {
    const { name, photo, permalink, gross_price, options } = product;
    let listOptions = [];
    
    if (options) { 
      listOptions = [...options];
    }

    const material = listOptions.pop();
    listOptions = listOptions.reduce(
      (acc, cur) => (acc += `<li>+ ${cur.trim()}</li>`),
      ""
    );
    html += `
    <li>
    <div>
      <img
        src="${photo}"
        alt="Foto de la gafa ${i}"
      />
      <div>
        <a href="${permalink}">${name}</a>
        <p class="material">${material}</p>
        <ul>
          ${listOptions}
        </ul>
      </div>
    </div>
    <strong>$${formatPrice(gross_price)}</strong>
  </li>
    `;
  });
  show_products.innerHTML = html;
}


$d.addEventListener("DOMContentLoaded", getPurchases);