const favorites_wrapper = $d.querySelector("div.favorites_wrapper");

const GENDERS = {
  hombre: "25115834/FontAwsome-male.svg",
  mujer: "25115850/FontAwsome-female.svg",
  unisex: "25115433/Grupo-4553.svg",
};

const SHAPES = {
  pilot: "25114731/pilot.svg",
  ovalada: "25114656/ovalada.svg",
  agatada: "25114634/agatada.svg",
  redonda: "25114610/redonda.svg",
  cuadrada: "25114546/cuadrada.svg",
  rectangular: "25114509/rectangular.svg",
};

const getFavorites = () => {
  const state = {
    favorites: [],
  };

  const formatPrice = (price) => {
    const currency = Intl.NumberFormat("es-CO", {
      currency: "COP",
    });

    return currency.format(price);
  };

  const render = () => {
    const { favorites } = state;
    let html = "";
    favorites.forEach((favorite, i) => {
      const {
        ID,
        photo,
        color,
        reference,
        title,
        price,
        gender,
        uses,
        shape,
        brand,
        permalink,
      } = favorite;
      html += ` 
        <section id="favorite_${ID}">
          <button onclick="deleteFavorite(${ID}, ${i})" >
            <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/04082828/favorite-1.svg" alt="Icono de favorito">
          </button>
          <img src="${photo}" alt="Gafa 1">
          <div class="name">
            <span>Ref: ${reference}</span>
            <h3>${title}</h3>
            <p>Marca: ${brand}</p>
          </div>
          <div class="info">
            <div class="details">
              <div class="colors">
                <div>
                  <span>Forma</span>
                  <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/07/${
                    SHAPES[shape.toLowerCase()] ?? "25114634/agatada.svg"
                  }" alt="Forma gafa 1">
                </div>
                <div>
                  <span>Color</span>
                  <ul>
                    <li style="background: ${color};" class="active"></li>
                  </ul>
                </div>
              </div>
              <div class="genders">
                <span>${gender}</span>
                <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/07/${
                  GENDERS[gender.toLowerCase()]
                }" alt="Logo de ${gender}">
              </div>
            </div>
            <div class="recomendations">
              <p>
                <span class="use_title">Uso Recomendado</span>
              </p> 
              ${uses}
            </div>
          </div>
          <div class="price">
            <span>$${formatPrice(price)}</span>
            <a href="${permalink}">
              <img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/07/11135616/shop_bag-1.svg" alt="Logo de compra">
            </a>
          </div>
        </section>
     `;
    });
    favorites_wrapper.insertAdjacentHTML("beforeend", html);
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
      "https://gikolab.com/api/mi-cuenta/favoritos/get_favoritos.php"
    );
    res = await res.json();
    setState({ favorites: res.data });
  };

  getData();
};

async function deleteFavorite(id) {
  let res = await fetch(
    `https://gikolab.com/api/mi-cuenta/favoritos/delete_by_id.php?id=${id}`,
    {
      method: "DELETE",
    }
  );
  res = await res.json();
  if (res.ok) {
    const section = $d.getElementById(`favorite_${id}`);
    section.remove();
  }
}




$d.addEventListener("DOMContentLoaded", getFavorites);