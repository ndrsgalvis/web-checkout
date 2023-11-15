const formulas_wrapper = $d.querySelector("div.formulas_wrapper");

const getFormulas = () => {
  const state = {
    formulas: [],
  };

  const render = () => {
    const { formulas } = state;
    let html = "";
    formulas.forEach((formula) => {
      const {
        id,
        nombre,
        photo,
        userage,
        dp1,
        dp2,
        odaxis,
        odcyl,
        odsph,
        ozaxis,
        ozcyl,
        ozsph,
      } = formula;
      let namefile = "Sin foto";
      if (photo) {
        const urlObj = new URL(photo);
        let path = urlObj.pathname;
        path = path.split("/");
        namefile = path[path.length - 1];
      }
      html += ` 
      <section class="animate__animated animate__fadeIn" id="formula_${id}">
      <div class="header">
        <h4>
          <img
            src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/08/22165152/check-item.svg"
            alt="Icono check"
          />
          ${nombre ?? "Tu fórmula"}
        </h4>
        <button onclick="deleteFormula(${id})">
          <img
            src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/12102900/simple-trash-ico.png"
            alt="Icono de borrar"
          />
        </button>
      </div>
      <div class="content">
        <div>
          <p>Edad del usuario:</p>
          <p>${userage} años</p>
        </div>
        <a href="${photo ?? ""}" target="_blank">
          <img
            src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/12095549/Icono_IMG.svg"
            alt="Icono de imagen"
          />${namefile}
        </a>
      </div>
      <label for="show_fomulas" onclick="editFormula('${
        nombre ?? "Tu Formula"
      }', ${userage}, ${id}, ${dp1}, ${dp2}, '${odaxis}', '${ozaxis}', '${odsph}', '${odcyl}', '${ozsph}', '${ozcyl}')">
        <img
          src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/12083742/774c2b9c14f8465a3d95736caac2a66f.svg"
          alt="Icono de lapiz"
        />
        Editar
      </label>
    </section>
     `;
    });
    formulas_wrapper.insertAdjacentHTML("beforeend", html);
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
      "https://gikolab.com/api/mi-cuenta/formulas/get_formulas.php"
    );
    res = await res.json();
    setState({ formulas: res.data });
  };

  getData();
};

async function deleteFormula(id) {
  const confirm = await Swal.fire({
    title: "Confirmación",
    text: "¿Estás seguro de que deseas eliminar esta Fórmula?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, volver atrás",
  });

  if (confirm.isConfirmed) {
    let res = await fetch(
      `https://gikolab.com/api/mi-cuenta/formulas/delete_by_id.php?id=${id}`,
      {
        method: "DELETE",
      }
    );
    res = await res.json();
    if (res.ok) {
      const section = $d.getElementById(`formula_${id}`);
      section.remove();
    }
  }
}

async function editFormula(
  name,
  age,
  id,
  dpi,
  dpd,
  axisd,
  axisi,
  odsph,
  odcyl,
  ozsph,
  ozcyl
) {
  const checkbox = document.getElementById("show_fomulas");
  const input_search = document.getElementById("search_formula");
  const id_formula = document.getElementById("id_formula");
  const title = document.getElementById("title_formula");
  const age_user = document.getElementById("age_user");
  const show_dpi = document.getElementById("dpi");
  const show_dpd = document.getElementById("dpd");
  const show_axisd = document.getElementById("axisd");
  const show_axisi = document.getElementById("axisi");

  const show_odsph = document.getElementById("odsph");
  const show_odcyl = document.getElementById("odcyl");
  const show_ozsph = document.getElementById("ozsph");
  const show_ozcyl = document.getElementById("ozcyl");
  name = !checkbox.checked ? name : "";
  input_search.value = name;
  id_formula.value = id;
  show_dpi.textContent = "Izquierdo: " + parseFloat(dpi);
  show_dpd.textContent = "Derecho: " + parseFloat(dpd);
  show_axisd.textContent = parseFloat(axisd);
  show_axisi.textContent = parseFloat(axisi);
  show_odsph.textContent = "+" + odsph;
  show_odcyl.textContent = "+" + odcyl;
  show_ozsph.textContent = "+" + ozsph;
  show_ozcyl.textContent = "+" + ozcyl;
  title.innerHTML = `
  <img
    src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/08/22165152/check-item.svg"
    alt="Icono check"  
   />
   ${name} `;
  age_user.innerText = `${age} años`;
}

document.getElementById("save_formula").addEventListener("click", async () => {
  const id_formula = document.getElementById("id_formula").value;
  const name = document.getElementById("search_formula").value;
  let res = await fetch(
    `https://gikolab.com/api/mi-cuenta/formulas/update_by_id.php?id=${id_formula}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }
  );
  res = await res.json();
  if (res.ok) {
    location.href = "https://gikolab.com/mi-cuenta/formulas/";
  }
});


$d.addEventListener("DOMContentLoaded", getFormulas);