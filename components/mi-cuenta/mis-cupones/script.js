import { CREDENTIALS, WC_BASE_URL } from "../../credentials.js";
const $d = document;

const wrapper = $d.getElementById("list_coupons");
const imgLoader = $d.getElementById("logo_giko");
const textLoader = $d.getElementById("text_giko");

const getCoupons = () => {
  const state = {
    coupons: [],
  };

  const render = () => {
    const { coupons } = state;
    let html = "";
    coupons.forEach(({ code, status, description, meta_data }, i) => {
      if (status === "publish") {
        let [title] = description.split(",");
        meta_data = meta_data.filter(({ key }) => key === "amazonS3_cache")[0];
        const links = Object.keys(meta_data.value);
        const img = links.find((url) => url.includes("cdn-giko.s3"));
        html += `<section class="animate__animated animate__fadeIn">
              <h3>${title.trim()}</h3>
              <img loading="lazy" src="https:${img}" alt="Cupón ${++i}">
              <div class="info">
                <p>Código de validación</p>
                <div>
                  <span>${code}</span>
                  <button onclick="copy('${code}')">Redimir Bono</button>
                </div>
              </div>
            </section>`;
      }
    });
    wrapper.insertAdjacentHTML("beforeend", html);
    imgLoader.src = coupons.length
      ? "https://gikolab.com/wp-content/uploads/2023/08/main_animation-1.gif"
      : "https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/07/19164228/favicon_32%402x.png";
    textLoader.textContent = coupons.length
      ? "Cargando..."
      : "Aún no tienes cupones por cambiar";
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
    const { wc_username, wc_password } = CREDENTIALS;
    let res = await fetch(`${WC_BASE_URL}/coupons`, {
      headers: {
        Authorization: "Basic " + btoa(wc_username + ":" + wc_password),
      },
    });

    res = await res.json();
    setState({ coupons: res ?? [] });
  };

  getData();
};





$d.addEventListener("DOMContentLoaded", getCoupons);