// import { nextStep, prevStep } from "./js/steps.js";
import {
  getQuestions,
  getLensesAndVariations,
} from "https://gikolab.com/components/web-checkout/js/services/giko.js";
import { initMaterials } from "https://gikolab.com/components/web-checkout/filters.js";

//
let globalData;
let rec_filters = [];
let rec_materials = [];

const $d = document;
const allSteps = $d.querySelectorAll(".body-options section");
const nextButtons = $d.querySelectorAll(".next");
const prevButtons = $d.querySelectorAll("#previus");

// Test
const wrapper = document.querySelector(".wrapper");
const parentWidth = document.querySelector(".body-options").parentNode;
const childsWidth = document.querySelectorAll(".body-options > section");
const body = document.querySelector("body");
const form = document.querySelector("form[name='preference']");

const cardsCount = document.querySelector("#p-count");
const scrollContent = document.querySelector(".wrap");

const nextScroll = (node, value) => {};

$d.querySelector("#no-formula").addEventListener("click", () => {
  $d.querySelector("#no-formula").parentNode.classList.toggle("hide");
  $d.querySelector("#show-again").classList.toggle("hide");
  $d.querySelector("#no-formula").parentNode.nextElementSibling.classList.toggle('hide')
  // $d.querySelector(
  //   "#no-formula"
  // ).parentNode.nextElementSibling.classList.toggle("hide");
  $d.querySelector("#p-open-formula").classList.toggle("hide");
  $d.querySelector("#open-formula").classList.toggle("hide");
  $d.querySelector(".info-formula p").classList.toggle("hide");
  $d.querySelector(".info-formula img").classList.toggle("hide");
  $d.querySelector("#tomar-foto").classList.toggle("hide");
  $d.querySelector("#subir-img").classList.toggle("hide");
});

$d.querySelector("#show-again").addEventListener("click", () => {
  $d.querySelector("#no-formula").parentNode.classList.toggle("hide");
  $d.querySelector("#no-formula").parentNode.nextElementSibling.classList.toggle("hide");
  $d.querySelector("#no-formula").checked = false;
  $d.querySelector("#show-again").classList.toggle("hide");
  // $d.querySelector(
  //   "#no-formula"
  // ).parentNode.nextElementSibling.classList.toggle("hide");
  $d.querySelector("#p-open-formula").classList.toggle("hide");
  $d.querySelector("#open-formula").classList.toggle("hide");
  $d.querySelector(".info-formula p").classList.toggle("hide");
  $d.querySelector(".info-formula img").classList.toggle("hide");
  $d.querySelector("#tomar-foto").classList.toggle("hide");
  $d.querySelector("#subir-img").classList.toggle("hide");
});



// Primer caso cuando el usuario no loggeado
if (location.search.includes('success')) { 
  $("#checkout_formulas").modal("show");
  getUserFormulas()
}


let btnShowFormulas = document.querySelector('#modal-formulas').parentNode.parentNode;
btnShowFormulas.addEventListener('click', async() => { 

  if (document.querySelector('#avatar_user') != null){ 
    $("#checkout_formulas").modal("show");
    const data =  await getUserFormulas();
    const modalBody = document.querySelector('#checkout_formulas .modal-body form')
    modalBody.innerHTML = buildFormulaTiles(data);
  }
})

const buildFormulaTiles = (data) => { 
  let items = ''; 
  data.forEach((item) => { 
    console.log(item);
    items += `<label for="miCheckbox-${item.id}" class="formulas_medicas">
    <div class="grid-item">
      <div class="icons-formula">
        <button class="icons"><img src="https://cdn-giko.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/09/21135739/Group-4874.png"></img></button>
        <h1 class="tu-formula">${item.nombre}</h1>
      </div>
      <div class="grid-items">Edad del usuario: ${item.userage} años </div>
      `;
    
    if (item.photo) {
      items += `<div class="user-photo">Foto del usuario
        <a src="${item.photo}" target="_blank">
          
        </a>
      </div>`;
    }
    
    items += `</div>
    <div class="date_formula">
      <div class="checkbox">
        <input type="radio" id="miCheckbox-${item.id}" name="miCheckbox" value='${JSON.stringify(item)}'>
      </div>
      <div class="date_formula">
        <h1 class="distancia_formula">Distancia pupilar: 2 Números / <b>Adición:</b> ${item.add} </h1>
        <div class="grid-container">
          <div class="grid-item-pupilar">
            <p style="display: flex; justify-content: space-between; gap: 10px; font-weight: 500;"><span>Derecho:</span> ${item.dp1}</p>
            <p>Ojo derecho:</p>
          </div>
          <div class="grid-item-pupilars">
            <p style="display: flex; justify-content: space-between; gap: 10px; font-weight: 500;"><span>Izquierdo:</span> ${item.dp2}</p>
            <p>Ojo izquierdo:</p>
          </div>

        </div>

        <div class="grid_esfera">
          <div class="esfera">
            <p><span>Esfera</span> ${item.odsph}</p>
            <p><span>Cilindro</span> ${item.odcyl}</p>
            <p><span>Eje</span> ${item.odaxis}</p>
            <p><span>Esfera</span> ${item.ozsph}</p>
            <p><span>Cilindro</span> ${item.ozcyl}</p>
            <p><span>Eje</span> ${item.ozaxis}</p>
          </div>
        </div>
      </div>
    </div>
  </label >`;
  })
  

  return items;

}


const getUserFormulas = async() => { 
  const res = await fetch('https://gikolab.com/api/checkout/get_formulas.php');
  const data = await res.json();
  return data;
}



document.querySelector(".body-options").addEventListener(
  "mousewheel",
  function (e) {
    e.stopPropagation();

    var max = this.scrollWidth - this.offsetWidth;

    if (this.scrollLeft + e.deltaX < 0 || this.scrollLeft + e.deltaX > max) {
      e.preventDefault();
      this.scrollLeft = Math.max(0, Math.min(max, this.scrollLeft + e.deltaX));
    }
  },
  { passive: false }
);

let globalDataQuestions = "";
const fillQuestionsForm = async () => {
  let questions = "";
  const res = await fetch(`https://gikolab.com/api/checkout/get_questions.php`);
  let data = await res.json();

  data = Object.entries(data);
  globalDataQuestions = data;
  data.map((elements) => {
    questions += `
      <div>
        <label for="option${elements[0]}">${elements[1]["pregunta"]}</label>
        <div>
          <span>Sí</span>
          <input type="radio" value="1" name="id${elements[0]}" id="">
          <span>No</span>
          <input type="radio" value="0" name="id${elements[0]}" id="" checked>
        </div>
      </div>`;
  });

  return questions;
};

const fillMaterialsOptions = async () => {
  let options = "";
  let data = await getLensesAndVariations();
  data = Object.entries(data);
  globalData = data;

  data.map((elements, i) => {
    options += `
      <button data-toggle="modal"  data-id="${i}" data-target="#filtersForm" class="step_options--button">
        <span> ${elements[1]["lente"]} </span>
        <p class="step_options--descript">
          Es liviano para uso prolongado, proporciona nitidez en la visión. Resistente a arañazos. No se recomienda
          para deportes o trabajo pesado.
        </p>
      </button>`;
  });

  return options;
};

const fillVariations = (id) => {
  let options = "";
  id = Object.entries(id);

  let isRecomended = "";

  id.map((elements) => {
    if (rec_filters.find((name) => name == elements[1]["nombre"])) {
      isRecomended = "recomendado";
    } else {
      isRecomended = "";
    }
    options += `
      <button class="step_options--button ${isRecomended}" data-filter="${elements[0]}">
        <span>${elements[1]["nombre"]}</span>
        <p class="step_options--descript">
          Es liviano para uso prolongado, proporciona nitidez en la visión. Resistente a arañazos. No se recomienda
          para deportes o trabajo pesado.
        </p>
      </button>`;
  });

  return options;
};

const fillMaterials = (idFilter, idData, node) => {
  let options = "";
  let parent = node.parentNode;
  let childs = node.parentNode.querySelectorAll("button");

  for (let index = 0; index < childs.length; index++) {
    parent.removeChild(childs[index]);
  }

  let variaciones = Object.entries(
    globalData[idData][1]["filtros"][idFilter]["variaciones"]
  );

  let isTwoLevel = false;
  let isRecomended = "";
  variaciones.map((item) => {
    if (item[1]["nombre"]) {
      if (rec_materials.find((name) => name == item[1]["nombre"])) {
        isRecomended = "recomendado";
      } else {
        isRecomended = "";
      }
      options += `
        <button class="step_options--button ${isRecomended}" data-dismiss="modal" onclick="getPrice(this)" data-precio="${
        item[1]["precio"]
      }">
          <span>${item[1]["nombre"]}</span>   <span>  $${formatPrice(
        item[1]["precio"]
      )} </span>
          <p class="step_options--descript">
            Es liviano para uso prolongado, proporciona nitidez en la visión. Resistente a arañazos. No se recomienda
            para deportes o trabajo pesado.
          </p>
        </button>`;
    } else {
      isTwoLevel = true;
      if (rec_filters.find((name) => name == item[1][0])) {
        isRecomended = "recomendado";
      } else {
        isRecomended = "";
      }
      options += `
        <button class="step_options--button ${isRecomended}" data-material="${item[0]}">
          <span>${item[1][0]}</span>
          <p class="step_options--descript">
            Es liviano para uso prolongado, proporciona nitidez en la visión. Resistente a arañazos. No se recomienda
            para deportes o trabajo pesado.
          </p>
        </button>`;
    }
  });

  parent.innerHTML = options;
  if (isTwoLevel) {
    parent.querySelectorAll("button").forEach((button, i) => {
      button.addEventListener("click", function () {
        fillMaterials2Level(variaciones[i][1], this);
      });
    });
  }
};

const fillMaterials2Level = (data, node) => {
  let options = "";
  let parent = node.parentNode;
  let childs = node.parentNode.querySelectorAll("button");

  for (let index = 0; index < childs.length; index++) {
    parent.removeChild(childs[index]);
  }

  let variaciones = Object.entries(data["materiales"]);
  let isRecomended = "";
  variaciones.map((item) => {
    if (rec_materials.find((name) => name == item[1]["nombre"])) {
      isRecomended = "recomendado";
    } else {
      isRecomended = "";
    }
    options += `
        <button class="step_options--button ${isRecomended}" data-dismiss="modal" onclick="getPrice(this)" data-precio="${
      item[1]["precio"]
    }">
          <span>${item[1]["nombre"]}</span>  <span> $${formatPrice(
      item[1]["precio"]
    )} </span>
          <p class="step_options--descript">
            Es liviano para uso prolongado, proporciona nitidez en la visión. Resistente a arañazos. No se recomienda
            para deportes o trabajo pesado.
          </p>
        </button>`;
  });

  parent.innerHTML = options;
};

const formatPrice = (price) => {
  const currency = Intl.NumberFormat("es-CO", {
    currency: "COP",
  });

  return currency.format(price);
};

window.onload = async function () {
  let count = 1;

  let recomendaciones = [];

  let options = await fillQuestionsForm();
  $d.getElementById("preguntas").innerHTML = options;
  // $d.querySelector(".step_four .step_options").innerHTML =
  //   await fillMaterialsOptions();

  $d.querySelector("#continuar-formula").addEventListener("click", () => {
    $d.querySelectorAll(".head-steps div")[2].classList.remove("hide");
    $d.querySelectorAll(".head-steps div span")[2].classList.add(
      "active__span"
    );
  });

  document
    .querySelector(".submit-preference")
    .addEventListener("click", async () => {
      const data = new FormData(form);

      $d.querySelectorAll(".head-steps div")[1].classList.remove("hide");
      $d.querySelectorAll(".head-steps div span")[1].classList.add(
        "active__span"
      );

      // console.log(Object.entries(globalDataQuestions[1][1]["recomendaciones"]));
      // [...data].map((item, i) => {
      //   if (item[1] != 0) {
      //     console.log(i);
      //     recomendaciones.push(
      //       Object.entries(globalDataQuestions[i - 1][1]["recomendaciones"])
      //     );
      //   }
      // });

      let allAttrs = Object.entries(recomendaciones);
      allAttrs.forEach((element, i) => {
        element[1].map((item) => {
          if (item[0] == "filtros") {
            Object.entries(item[1]).map((temp) => {
              rec_filters.push(temp[1]);
            });
          }
          if (item[0] == "material") {
            Object.entries(item[1]).map((temp) => {
              rec_materials.push(temp[1]);
            });
          }
        });
      });

      const temp = new Set(rec_filters);
      rec_filters = [...temp];
      const temp2 = new Set(rec_materials);
      rec_materials = [...temp2];
      $d.querySelectorAll("head-steps div");
    });

  const addToBag = document.querySelector("#goToPay");
  if (!!addToBag) {
    addToBag.addEventListener("click", () => {
      if (count == 1) window.location.replace("https://gikolab.com/carrito");
    });
  }

  let scrollWidth = document.querySelector(
    ".body-options .step_one"
  ).scrollWidth;


  let banderaNoFormula = false;
  
  
  nextButtons.forEach((nxtButton) => {
    nxtButton.addEventListener("click", (event) => {
      banderaNoFormula = false;
      event.preventDefault();
      if (count == 1) {
        addToBag.disabled = true;
        addToBag.style.background = "#D1D0DB";
      }
      if (navigator.appVersion.split(';')[0].includes('Macintosh')){ 
        parentWidth.scrollBy({
          top: 0,
          left: scrollWidth * 1.7,
          behavior: "smooth",
        });
      }else{ 
        parentWidth.scrollBy({
          top: 0,
          left: scrollWidth,
          behavior: "smooth",
        });
      }
      

      count++;
    });
  });

  let showOptionsBtn = document.querySelector("#show-options");
  

  showOptionsBtn.addEventListener("click", () => {
    banderaNoFormula = true;
    initMaterials("", 20, 0.0, 0.0, 0.0, 0.0);


    // Modal styles
    document.querySelector('#confirmar_compra .modal-dialog')
    document.querySelector('#confirmar_compra .modal-body article')
    document.querySelector('#confirmar_compra .title_formula')
    document.querySelector('#confirmar_compra .date_formula')
    document.querySelector('#confirmar_compra .images').style.width = '100%';



    parentWidth.scrollBy({
      top: 0,
      left: scrollWidth * 5,
      behavior: "smooth",
    });
  });

  // TODO
  /*
    Cuando el usuario de click en el boton mostrar filtros
    el volver debe retornar al primer step.

    Cuando el usuario ingresa por esta opción sin formula no deberia
    insertar ninguna formula.
  */ 


  $d.querySelectorAll("button[data-id]").forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      let dataId = this.getAttribute("data-id");
      $d.querySelector("#filtersForm .modal-body").innerHTML = fillVariations(
        globalData[dataId][1]["filtros"]
      );
      console.log(this.querySelector("span").textContent);
      console.log(this.textContent + ", " + dataId);

      $d.querySelectorAll("button[data-filter]").forEach((node) => {
        node.addEventListener("click", function (e) {
          e.preventDefault();

          console.log(this.querySelector("span").textContent);

          fillMaterials(
            node.getAttribute("data-filter"),
            dataId,
            this,
            rec_filters,
            rec_materials
          );
        });
      });
    });
  });


  

  prevButtons.forEach((prvButton) => {
    prvButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (banderaNoFormula) { 
        parentWidth.scrollBy({
          top: 0,
          left: -scrollWidth * 5,
          behavior: "smooth",
        });
      } else { 
        if (navigator.appVersion.split(';')[0].includes('Macintosh')) {
          parentWidth.scrollBy({
            top: 0,
            left: -scrollWidth * 1.2,
            behavior: "smooth",
          });
        } else {
          parentWidth.scrollBy({
            top: 0,
            left: -scrollWidth,
            behavior: "smooth",
          });
        }
      }
    });
  });
};