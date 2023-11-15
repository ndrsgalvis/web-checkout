const shoppings_wrapper = $d.querySelector("div.shoppings_wrapper");
const motive_wrapper = $d.querySelector("section#wrapper_motive");
const wrapper_motive_detail = $d.querySelector("section#wrapper_motive_detail");
const motive_text = $d.querySelector("p#motive_text");
const motive_description = $d.querySelector("p#motive_description");
const steps = $d.querySelectorAll("ul#steps_claim li");
const evidences = $d.querySelector("div#evidence_photos");
const buttonSubmit = $d.querySelector("button[type='submit']");

const form = $d.querySelector("#form_options");

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

  const formatDate = (date, complete = false) => {
    let myDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    myDate = formatter.format(myDate);
    return complete
      ? myDate
      : myDate
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
        id_claim,
        date_start_claim,
        claim_status,
        claim_status_id,
        claim_reason_name,
        claim_description,
        photo_claim,
        products,
      } = buys;

      let htmlProducts = viewHtmlProducts(products);
      const claim = id_claim !== null;

      html += `
        <section>
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
            ${
              claim
                ? `<div class="claim"> <p>Reclamación</p> <span class="ref">#${id_claim}</span><span style="
    font-size: 10px !important;
">Iniciada el ${formatDate(
                    date_start_claim,
                    true
                  )}</span> <span class="state">${claim_status}</span></div>`
                : "<div></div>"
            }
            <label  id="volverLabel" for="show_shoppings" onclick="showDataClaim(${
              claim ? "'show'" : "'create'"
            }, ${order_id}, '${formatDate(date_purchase)}', '${formatPrice(
        total
      )}', '${payment_method}', '${formatDate(deadline)}', ${JSON.stringify(
        products
      )
        .replace("<span>", "")
        .replace("</span>", "")
        .replace(
          /"/g,
          "'"
        )}, '${claim_reason_name}', '${claim_description}', ${claim_status_id}, ${JSON.stringify(
        photo_claim
      ).replace(/"/g, "'")})"> ${
        claim ? "Ver detalles" : "Iniciar reclamación"
      }</label>
          </div>
        </div>
      </section>`;
    });

    if (purchases.length) {
      html = `
      <div class="custom_devolutions">
        <p>
          Estos son los pedidos vigentes disponibles para devolución. Recuerda
          que solo puedes iniciar un proceso de cambio dentro de los 15 días
          posteriores a la entrega
        </p>
        ${html}
      </div>
      `;
    }

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
      "https://gikolab.com/api/mi-cuenta/devoluciones/get_claims.php"
    );
    res = await res.json();
    setState({ purchases: res.data });
  };

  getData();
};

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const motivoSelect = document.getElementById("motivo-select");
  const motivoSeleccionado =
    motivoSelect.options[motivoSelect.selectedIndex].value;
  const motivoEntero = parseInt(motivoSeleccionado);

  if (motivoSeleccionado === "") {
    alert("Por favor, selecciona un motivo de reclamación.");
  } else {
    const mensajeUsuario = document.querySelector(
      ".mensaje-usuario textarea"
    ).value;
    const archivosAdjuntos = document.querySelector(
      '.archivo input[type="file"]'
    ).files;

    if (mensajeUsuario.trim() === "") {
      alert("El campo de descripción es requerido.");
    } else {
      buttonSubmit.setAttribute("disabled", true);
      buttonSubmit.textContent = "Cargando...";
      const order = parseInt(document.querySelector(".orden").textContent);
      let fotos = [];
      if (archivosAdjuntos.length) {
        for (const file of archivosAdjuntos) {
          const { name } = file;
          const random = Math.random().toString(16).slice(2);
          const key = `claims/${order}/giko_temp_${random}_${name}`;
          await uploadS3(file, key);
          fotos.push(key);
        }
      }
      const photo_claim =
        fotos.length > 0 ? JSON.stringify({ fotos }) : '{"fotos": []}';
      const reclamacion = {
        id_order: order,
        complaint_reason: motivoEntero,
        claim_description: mensajeUsuario,
        photo_claim,
      };
      await postData(reclamacion);
      location.href = "https://gikolab.com/mi-cuenta/cambios/";
    }
  }
});

const viewHtmlProducts = (products) => {
  let htmlProducts = "";
  products.forEach((product, i) => {
    const { options } = product;

    
    let listOptions = [];
    
    if (options) { 
      listOptions = [...options];
    }
    
    const material = listOptions.pop();
    listOptions = listOptions.reduce(
      (acc, cur) => (acc += `<li>+ ${cur.trim()}</li>`),
      ""
    );
    htmlProducts += `
      <div class="product">
      <div class="column">
        <p>${i === 0 ? "Producto" : ""}</p>
        <div class="img_gafas">
          <img
            loading="lazy"
            src="${product.photo}"
            alt="Foto de gafa ${i}"
          />
          <div class="content">
            <a href="${product.permalink}">${product.name}</a>
            <span style="
    position: relative;
    left: 70px;
">${material}</span>
            <ul>
              ${listOptions}
            </ul>
          </div>
        </div>
      </div>
      <div class="column">
      <p class="quantity">${i === 0 ? "Cantidad" : ""}</p>
        <span class="amount">${product.amount}</span>
      </div>

    </div>     
      `;
  });
  return htmlProducts;
};

function showDataClaim(
  typeForm,
  id,
  date_purchase,
  total,
  payment_method,
  deadline,
  list_products,
  claim_reason_name,
  claim_description,
  claim_status_id,
  photo_claim
) {
  const typeFormLabel = $d.querySelector("div#nav_screen2 span");
  if (typeForm === "create") {
    typeFormLabel.textContent = "Iniciar Reclamación";
    motive_wrapper.style.display = "flex";
    wrapper_motive_detail.style.display = "none";
  } else {
    typeFormLabel.textContent = "Detalles de reclamación";
    motive_wrapper.style.display = "none";
    wrapper_motive_detail.style.display = "flex";
    motive_text.textContent = claim_reason_name;
    motive_description.textContent = claim_description;

    steps.forEach((li, i) => {
      if (i + 1 < claim_status_id) {
        li.classList.add("check");
      } else if (i + 1 === claim_status_id) {
        li.classList.add("active");
      }
    });

    if (photo_claim) {
      const htmlEvidences = photo_claim.reduce(
        (acc, cur, i) =>
          (acc += `<a href="https://cdn-giko.s3.amazonaws.com/${cur}" target="_blank">
      <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/22090806/Icono_Adjuntar.svg" alt="Foto de evidencia ${
        i + 1
      }">
      Evidencia ${i + 1}
    </a>`),
        " <h4>Evidencias</h4>"
      );
      evidences.innerHTML = htmlEvidences;
    }
  }

  const orderId = document.getElementById("order_id");
  orderId.textContent = id;

  const dateDay = document.getElementById("date_purchase");
  dateDay.textContent = date_purchase;

  const price = document.getElementById("total");
  price.textContent = total;

  const payment = document.getElementById("payment_method");
  payment.textContent = payment_method;

  const date = document.getElementById("deadline");
  date.textContent = deadline;

  const itemsPedidos = document.getElementById("itemsPedido");
  itemsPedidos.innerHTML = viewHtmlProducts(list_products);
}

function deletePhoto(child) {
  document.querySelector(".archivos-subidos").removeChild(child.parentElement);
}

document
  .querySelector('input[type="file"]')
  .addEventListener("change", function () {
    const archivosSubidos = document.querySelector(".archivos-subidos");
    archivosSubidos.innerHTML = "";
    if (this.files.length <= 2) {
      for (let i = 0; i < this.files.length; i++) {
        const nombreArchivo = this.files[i].name;
        const elementoArchivo = document.createElement("div");
        elementoArchivo.classList.add("archivo-subido");
        elementoArchivo.innerHTML = `
          <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/22090806/Icono_Adjuntar.svg">
          <p>${nombreArchivo}</p>
        `;
        archivosSubidos.appendChild(elementoArchivo);
      }
    } else {
     Swal.fire('No se pueden subir más de 2 evidencias')
      archivosSubidos.innerHTML = "";
    }
  });

const postData = async (reclaim) => {
  const data = await fetch(
    "https://gikolab.com/api/mi-cuenta/devoluciones/create_claim.php",
    {
      method: "POST",
      body: JSON.stringify(reclaim),
    }
  );

  const res = await data.json();
  return res;
};

async function uploadS3(formFile, key) {
  let file = formFile;
  AWS.config.update({
    accessKeyId: "AKIAXVLX3OTWWCCMD43R",
    secretAccessKey: "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",
    region: "us-east-2",
  });

  const bucketName = "cdn-giko";

  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: file.type,
    ACL: "public-read",
    Body: file,
  };

  const s3 = new AWS.S3();
  try {
    await s3.upload(params).promise();
  } catch (err) {
    console.error(err);
  }
}

$d.addEventListener("DOMContentLoaded", getPurchases);