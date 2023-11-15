import { initMaterials } from "https://gikolab.com/components/web-checkout/filters.js";

const fileUploaded1 = document.querySelector(".file-uploaded");
const infoFormula = document.querySelector(".info-formula");
const stepThreeOptions = document.querySelector(".step_three .step_options");
const optionsAfterPhoto = document.querySelector(
  ".step_three .after_take_photo"
);
const remplazarBtn = document.querySelector(".show-step");

document.querySelector("#distanciap").addEventListener("click", function () {
  setTimeout(() => {
    document.querySelectorAll(".modal-backdrop")[1].style.zIndex = "9998";
  }, 500);
  document.querySelector("#dpupilar").style.zIndex = "9999";
});

document
  .querySelectorAll('button[data-target="#od-oi-details"]')
  .forEach((each) => {
    each.addEventListener("click", function () {
      setTimeout(() => {
        document.querySelectorAll(".modal-backdrop")[1].style.zIndex = "9998";
      }, 500);
      document.querySelector("#od-oi-details").style.zIndex = "9999";
    });
  });

function setNewPrice(price) {
  const go_to_cart = document.querySelector("#go-cart");
  go_to_cart.addEventListener("click", () => {
    window.location.replace("https://gikolab.com/carrito");
  });
  const eneableBag = document.querySelector("#goToPay");
  eneableBag.disabled = false;
  eneableBag.style.background = "#4D63FF";

  $(document).ready(function () {
    $("#goToPay").click(function () {
      $("#confirmar_compra").modal("show");
    });
  });

  let baseValue = document.querySelector(".base_price");
  let newValue = document.querySelector(".checkout_price");

  newValue.textContent = parseInt(baseValue.textContent) + parseInt(price);
}

function getFileData(myFile) {
  var file = myFile.files[0];
  var reader = new FileReader();

  AWS.config.update({
    accessKeyId: "AKIAXVLX3OTWWCCMD43R",
    secretAccessKey: "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",
  });
  const bucketName = "cdn-giko";
  const key = "medical-formula/giko_temp_" + Math.random() * 10000 + file.name;

  reader.onload = function (event) {
    const fileContent = event.target.result;
    localStorage.setItem("archivo", fileContent);
  };

  reader.readAsDataURL(file);
  const params = {
    Bucket: bucketName,
    Key: key,
    ACL: "public-read",
    ContentType: file.type,
    Body: file,
  };

  const s3 = new AWS.S3();
  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error al subir el archivo:", err);
    } else {
      console.log("Archivo subido exitosamente:", data["Location"]);
      localStorage.setItem("url-img", data["Location"]);
    }
  });

  obtener.classList.remove("hide");

  // Add
  fileUploaded1.classList.remove("hide");
  infoFormula.classList.add("hide");

  stepThreeOptions.classList.add("hide");
  optionsAfterPhoto.classList.remove("hide");
  remplazarBtn.parentNode.classList.remove("hide");
  remplazarBtn.parentNode.previousElementSibling.classList.add("hide");
}

document.querySelector("#document").addEventListener("change", function (e) {
  getFileData(this);
});

obtener.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(getPhoto());
});

function getPhoto() {
  var base64 = localStorage["file"];
  var base64Parts = base64.split(",");
  var fileFormat = base64Parts[0].split(";")[1];
  var fileContent = base64Parts[1];
  var file = new File([fileContent], "uploaded_photo_formula", {
    type: fileFormat,
  });
  return file;
}

// Function formula modal
// Set data in table checkout
const userAge = document.querySelector(".user-age"),
  dpNumber = document.querySelector(".dp-number span"),
  dpI = document.querySelector(".dp-i span"),
  dpD = document.querySelector(".dp-d span"),
  odSPH = document.querySelector(".od-sph span"),
  odCYL = document.querySelector(".od-cyl span"),
  odAxis = document.querySelector(".od-axis span"),
  oiSPH = document.querySelector(".oi-sph span"),
  oiCYL = document.querySelector(".oi-cyl span"),
  oiAxis = document.querySelector(".oi-axis span");

const add = document.querySelector(".add");
const addWrap = document.querySelector(".add-wrap");

// let start1 = 40;
// let start2 = 52;
// const menorDP = Array.from(
//   { length: 65 - start1 + 1 },
//   (_, index) => start1 + index
// );
// const mayorDP = Array.from(
//   { length: 72 - start2 + 1 },
//   (_, index) => start2 + index
// );
const menorDP = [
  "40/42",
  "41/43",
  "42/44",
  "43/45",
  "44/46",
  "45/47",
  "46/48",
  "47/49",
  "48/50",
  "49/51",
  "50/52",
  "51/53",
  "52/54",
  "53/55",
  "54/56",
  "55/57",
  "56/58",
  "57/59",
  "58/60",
  "59/61",
  "60/62",
  "61/63",
  "62/64",
  "63/65",
];
const mayorDP = [
  "52/54",
  "53/55",
  "54/56",
  "55/57",
  "56/58",
  "57/59",
  "58/60",
  "59/61",
  "60/62",
  "61/63",
  "62/64",
  "63/65",
  "64/66",
  "65/67",
  "66/68",
  "67/69",
  "68/70",
  "69/71",
  "70/72",
];

let startNP1 = 20;
let startNP2 = 26;
const menorNP = Array.from(
  { length: 46 - startNP1 + 1 },
  (_, index) => startNP1 + index * 0.5
);
const mayorNP = Array.from(
  { length: 46 - startNP2 + 1 },
  (_, index) => startNP2 + index * 0.5
);
const selectorDP = document.querySelector('select[name="dpval1"]');
const selectorNP = document.querySelector('select[name="dpval2"]');

const edadModal = document.querySelector('input[name="edad"]');
let inputEdad2 = document.querySelector('input[name="age"]');

// Validacion input edad
const buttonNext = document.querySelector(".submit-preference");
const buttonArrowImg = document.querySelector(".submit-preference img");
const inputAddicion = document.querySelectorAll(".adiccion");
const inputAddCheck = document.querySelector("#adiccion");
const toggleAdd = document.querySelector(".toggleAddCheck");

// Initial statee
buttonNext.disabled = true;
buttonNext.style.border = "2px solid #D1D0DB";
buttonNext.style.color = "#D1D0DB";
buttonArrowImg.style.filter = "grayscale(100%) opacity(0.2)";

// Validate if checkbox is checked
inputAddCheck.addEventListener("change", () => {
  if (inputAddCheck.checked) {
    inputAddicion[0].classList.remove("hide");
    inputAddicion[1].classList.remove("hide");
  } else {
    inputAddicion[0].classList.add("hide");
    inputAddicion[1].classList.add("hide");
  }
});
let mainValues = "";
edadModal.onkeyup = function (e) {
  e.preventDefault();

  inputEdad2.value = this.value;
  inputEdad2.setAttribute("value", this.value);

  if (edadModal.value.length >= 1) {
    buttonNext.disabled = false;
    buttonNext.style.border = "2px solid #4d63ff";
    buttonNext.style.color = "#4d63ff";
    buttonArrowImg.style.filter = "";
  } else {
    buttonNext.disabled = true;
    buttonNext.style.border = "2px solid #D1D0DB";
    buttonNext.style.color = "#D1D0DB";
    buttonArrowImg.style.filter = "grayscale(100%) opacity(0.2)";
  }

  // Habilitar boton de adición si la persona es mayor de 40

  // if (parseInt(edadModal.value) >= 40) {
  //   inputAddicion[0].style.display = "flex";
  //   inputAddicion[1].style.display = "flex";
  //   toggleAdd.style.display = "none";
  // } else {
  //   inputAddicion[0].style.display = "none";
  //   inputAddicion[1].style.display = "none";
  // }

  if (this.value >= 40) {
    document.querySelector('input[name="addicion"]').checked = true;
    document.querySelectorAll('.adiccion')[0].classList.remove('hide');
    document.querySelectorAll('.adiccion')[1].classList.remove('hide');
  } else {
    document.querySelector('input[name="addicion"]').checked = false;
    document.querySelectorAll('.adiccion')[0].classList.add('hide');
    document.querySelectorAll('.adiccion')[1].classList.add('hide');
   }

  if (this.value <= 10) {
    selectorDP.options.length = 0;
    selectorNP.options.length = 0;

    menorDP.forEach((value) => {
      let options = document.createElement("option");
      options.setAttribute("value", value);
      options.text = value;
      selectorDP.appendChild(options);
    });
    menorNP.forEach((value) => {
      let options = document.createElement("option");
      options.setAttribute("value", value);
      options.text = value;
      selectorNP.appendChild(options);
    });
  } else if (this.value > 10) {
    selectorDP.options.length = 0;
    selectorNP.options.length = 0;

    mayorDP.forEach((value) => {
      let options = document.createElement("option");
      options.setAttribute("value", value);
      options.text = value;
      selectorDP.appendChild(options);
    });
    mayorNP.forEach((value) => {
      let options = document.createElement("option");
      options.setAttribute("value", value);
      options.text = value;
      selectorNP.appendChild(options);
    });
  }
};

const verifyFormula = document.querySelector("#verify-formula");
const tableFormula = document.querySelector(".table-formula");
const fileUploadedaMsg = document.querySelector(".file-uploaded");
const fillDataFormulaBtn = document.querySelector(".after_take_photo");
const formulaForm = document.querySelector("#formula-form");
const confirmarFiltros = document.querySelector("#confirmarFiltros");

let dataVerify = [];
verifyFormula.addEventListener("click", (e) => {
  e.preventDefault();
  let data = new FormData(formulaForm);
  data = Object.fromEntries([...data]);

  let numberText = "";
  if (parseInt(data.dpnumber) > 1) {
    numberText = " Números";
    dpD.textContent = data.dpval2;
    document.querySelector(".dp-d").style.display = "block";
    document
      .querySelector(".date_formula .derecho div:nth-child(2)")
      .classList.remove("hide");
    document.querySelector(
      ".date_formula .derecho div:nth-child(2)"
    ).textContent = data.dpval2;
  } else {
    delete(data.dpval2);
    numberText = " Número";
    dpD.textContent = "";
    document.querySelector(".date_formula .derecho").classList.add("hide");
    document.querySelector(".dp-d").style.display = "none";
  }


  userAge.textContent = edadModal.value + " años";
  dpNumber.textContent = data.dpnumber + numberText;
  dpI.textContent = data.dpval1;
  odSPH.textContent = Math.sign(data.odsph) == 1 ? '+' + data.odsph : data.odsph;
  odCYL.textContent = Math.sign(data.odcyl) == 1 ? '-' + data.odcyl : data.odcyl; 
  odAxis.textContent = data.odrangevalue;
  oiSPH.textContent = Math.sign(data.oisph) == 1 ? '+' + data.oisph : data.oisph; 
  oiCYL.textContent = Math.sign(data.oicyl) == 1 ? '-' + data.oicyl : data.oicyl;
  oiAxis.textContent = data.oirangevalue;
  data.edad = edadModal.value;

  
  
  addWrap.classList.add("hide");
  if (data.addicion) {
    add.textContent = data.add;
    addWrap.classList.remove("hide");
    
    data.odsph = parseFloat(data.odsph) + parseFloat(data.add);
    data.oisph = parseFloat(data.oisph) + parseFloat(data.add);
  } else { 
    delete(data.add);
  }


  document.querySelector(".date_formula .edad").textContent =
    edadModal.value + " Años";
  document.querySelector(".date_formula .edad").style.marginRight = "30px";
  document.querySelector(
    ".distancias-pupilar .izquierdo div:nth-child(2)"
  ).textContent = data.dpval1;

  // Params OD
  document.querySelectorAll(".date_formula .od em")[0].textContent = Math.sign(data.odsph) == 1 ? '+' + data.odsph : data.odsph;
  document.querySelectorAll(".date_formula .od em")[1].textContent = Math.sign(data.odcyl) == 1 ? '-' + data.odcyl : data.odcyl; 
  document.querySelectorAll(".date_formula .od em")[2].textContent =
    data.odrangevalue;

  // Params OD
  document.querySelectorAll(".date_formula .oi em")[0].textContent = Math.sign(data.oisph) == 1 ? '+' + data.oisph : data.oisph; 
  document.querySelectorAll(".date_formula .oi em")[1].textContent = Math.sign(data.oicyl) == 1 ? '-' + data.oicyl : data.oicyl;
  document.querySelectorAll(".date_formula .oi em")[2].textContent =
    data.oirangevalue;

  //localStorage.setItem("data-formula", JSON.stringify(data));

  let sku = document.querySelector('div[data-id="179d525"] div div p');
  sku = sku.textContent.split(":")[1].trim();

  if (
    localStorage.getItem("data-formula") &&
    JSON.parse(localStorage.getItem("data-formula")) != null
  ) {
    let temp = localStorage.getItem("data-formula");
    temp = JSON.parse(temp);

    let bool = false;
    temp.forEach((items, i) => {
      if (items.item == window.location.search.split("=")[1]) {
        bool = true;
        items.formula = data;
      }
    });

    if (!bool) {
      temp.push({
        item: window.location.search.split("=")[1],
        sku: sku,
        img: localStorage.getItem("url-img"),
        formula: data,
      });
    }

    localStorage.setItem("data-formula", JSON.stringify(temp));
  } else {
    localStorage.setItem(
      "data-formula",
      JSON.stringify([
        {
          item: window.location.search.split("=")[1],
          sku: sku,
          img: localStorage.getItem("url-img"),
          formula: data,
        },
      ])
    );
  }

  // Send to api
  // oiSPH.textContent = data.oisph;
  // oiCYL.textContent = data.oicyl;
  // odSPH.textContent = data.odsph;
  // odCYL.textContent = data.odcyl;
  initMaterials(
    "",
    edadModal.value,
    data.odcyl,
    data.odsph,
    data.oicyl,
    data.oisph
  );

  tableFormula.classList.remove("hide");
  // document.querySelector("#goToPay").removeAttribute("disabled");
  // document.querySelector("#goToPay").style.background = "#4D63FF";
  tableFormula.nextElementSibling.classList.remove("hide");
  document.querySelector("#p-open-formula").classList.add("hide");
  document.querySelector("#open-formula").classList.add("hide");
  document.querySelector("#show-again").classList.add("hide");

  fillDataFormulaBtn.classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(2)").classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(3)").classList.remove("hide");
});



const btnSelectedFormula = document.querySelector('#checkout_formulas .modal-footer button')

btnSelectedFormula.addEventListener('click', () => { 
  // Do something 
  const selectedItem = document.querySelector('#checkout_formulas .modal-body form');
  const items = new FormData(selectedItem)
  console.log([...items]);
  let data = JSON.parse([...items][0][1])


  // Send params to fetch data filters
  initMaterials(
    "",
    data.userage,
    data.odcyl,
    data.odsph,
    data.oicyl,
    data.oisph
  );


  // Set data formula front
  
  // Params OD
  document.querySelectorAll(".date_formula .od em")[0].textContent = Math.sign(data.odsph) == 1 ? '+' + data.odsph : data.odsph;
  document.querySelectorAll(".date_formula .od em")[1].textContent = Math.sign(data.odcyl) == 1 ? '+' + data.odcyl : data.odcyl; 
  document.querySelectorAll(".date_formula .od em")[2].textContent =
    data.odaxis;
  // Params OI
  document.querySelectorAll(".date_formula .oi em")[0].textContent = Math.sign(data.ozsph) == 1 ? '+' + data.ozsph : data.ozsph; 
  document.querySelectorAll(".date_formula .oi em")[1].textContent = Math.sign(data.ozcyl) == 1 ? '+' + data.ozcyl : data.ozcyl;
  document.querySelectorAll(".date_formula .oi em")[2].textContent =
    data.ozaxis;
  
  userAge.textContent = data.userage + " años";
  dpI.textContent = data.dp1;
  // Params 0D
  odSPH.textContent = Math.sign(data.odsph) == 1 ? '+' + data.odsph : data.odsph;
  odCYL.textContent = Math.sign(data.odcyl) == 1 ? '+' + data.odcyl : data.odcyl; 
  odAxis.textContent = data.odaxis;
  // Params 0I
  oiSPH.textContent = Math.sign(data.ozsph) == 1 ? '+' + data.ozsph : data.ozsph; 
  oiCYL.textContent = Math.sign(data.ozcyl) == 1 ? '+' + data.ozcyl : data.ozcyl;
  oiAxis.textContent = data.ozaxis;

  if (data.add) {
    add.textContent = data.add;
    addWrap.classList.remove("hide");
    
    data.odsph = parseFloat(data.odsph) + parseFloat(data.add);
    data.oisph = parseFloat(data.oisph) + parseFloat(data.add);
  }



  //Set local storage options and price
  let sku = document.querySelector('div[data-id="179d525"] div div p');
  sku = sku.textContent.split(":")[1].trim();

  if (
    localStorage.getItem("data-formula") &&
    JSON.parse(localStorage.getItem("data-formula")) != null
  ) {
    let temp = localStorage.getItem("data-formula");
    temp = JSON.parse(temp);

    let bool = false;
    temp.forEach((items, i) => {
      if (items.item == window.location.search.split("=")[1]) {
        bool = true;
        items.formula = data;
      }
    });

    if (!bool) {
      temp.push({
        item: window.location.search.split("=")[1],
        sku: sku,
        img: localStorage.getItem("url-img"),
        formula: data,
      });
    }

    localStorage.setItem("data-formula", JSON.stringify(temp));
  } else {
    localStorage.setItem(
      "data-formula",
      JSON.stringify([
        {
          item: window.location.search.split("=")[1],
          sku: sku,
          img: localStorage.getItem("url-img"),
          formula: data,
        },
      ])
    );
  }


  // Hide elements form interface
  tableFormula.classList.remove("hide");
  tableFormula.nextElementSibling.classList.remove("hide");
  document.querySelector("#p-open-formula").classList.add("hide");
  document.querySelector("#open-formula").classList.add("hide");
  document.querySelector("#show-again").classList.add("hide");

  fillDataFormulaBtn.classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(2)").classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(3)").classList.remove("hide");


  document.querySelector('.info-formula p').classList.add("hide");
  document.querySelector('.info-formula img').classList.add("hide");
  document.querySelector('.step_three .step_options').classList.add("hide");
  
})


document
  .querySelector(".step_one-two button.next")
  .addEventListener("click", () => {
    mainValues = document.querySelector("#dp-val-1").innerHTML;
  });

// Distancia pupilar
const dpRadio = document.querySelectorAll("#dp-number");
const dpVal2 = document.querySelector("#dp-val-2");
dpRadio.forEach((radio) => {
  radio.addEventListener("click", () => {
    if (radio.value != "1") {
      dpVal2.classList.remove("hide");
      document.querySelector("#dp-val-1").innerHTML = dpVal2.innerHTML;
    } else {
      dpVal2.classList.add("hide");
      document.querySelector("#dp-val-1").innerHTML = mainValues;
    }
  });
});

// Validation SPH y Cyl
const odSphInput = [
  document.querySelector("#od-sph"),
  document.querySelector("#oi-sph"),
];

odSphInput.forEach((input) => {
  input.addEventListener("blur", function () {
    let temp = parseFloat(this.value).toFixed(2);
    if (temp <= 10 && temp >= -10) {
      this.value = roundToNearestQuarter(temp);
    } else {
      this.value = 0;
    }
  });
});

const odCylInput = [
  document.querySelector("#od-cyl"),
  document.querySelector("#oi-cyl"),
];

odCylInput.forEach((input) => {
  input.addEventListener("blur", function () {
    let temp = parseFloat(this.value).toFixed(2);
    if (temp <= 6 && temp >= 0) {
      this.value = roundToNearestQuarter(temp);
    } else {
      this.value = 0;
    }
  });
});

function roundToNearestQuarter(inputValue) {
  const roundedValue = Math.round(inputValue * 4) / 4;
  return roundedValue;
}

const addInput = document.querySelector("#add");

addInput.addEventListener("blur", function () {
  let temp = parseFloat(this.value).toFixed(2);
  if (temp <= 3 && temp >= 0.75) {
    this.value = roundToNearestQuarter(temp);
  } else {
    this.value = 0.75;
  }
});

const edadCatch = document.querySelector("input[name=edad]");

edadCatch.addEventListener("blur", function () {
  let temp = Math.abs(parseInt(this.value));
  this.value = temp;
});

const parentODRange = document.querySelector(
  "label[for=odrangevalue]"
).parentNode;
const parentOIRange = document.querySelector(
  "label[for=oirangevalue]"
).parentNode;

// Plus button
const plusButton = document.querySelectorAll(".plus-button");
plusButton.forEach((plus) => {
  const inputQuantity = plus.nextElementSibling;
  plus.addEventListener("click", (e) => {
    e.preventDefault();

    if (
      plus.nextElementSibling.id == "od-cyl" ||
      plus.nextElementSibling.id == "oi-cyl"
    ) {
      let actualVal = parseFloat(inputQuantity.value);

      if (actualVal == 6) return;
      actualVal = actualVal + 0.25;
      inputQuantity.value = actualVal.toFixed(2);

      if (plus.nextElementSibling.id == "od-cyl") {
        if (actualVal != 0) {
          parentODRange.querySelector("div input").removeAttribute("disabled");
          parentODRange.querySelector("div output").removeAttribute("disabled");
        } else {
          parentODRange
            .querySelector("div input")
            .setAttribute("disabled", true);
          parentODRange
            .querySelector("div output")
            .setAttribute("disabled", true);
        }
      } else {
        if (actualVal != 0) {
          parentOIRange.querySelector("div input").removeAttribute("disabled");
          parentOIRange.querySelector("div output").removeAttribute("disabled");
        } else {
          parentOIRange
            .querySelector("div input")
            .setAttribute("disabled", true);
          parentOIRange
            .querySelector("div output")
            .setAttribute("disabled", true);
        }
      }
    }
    if (
      plus.nextElementSibling.id == "od-sph" ||
      plus.nextElementSibling.id == "oi-sph"
    ) {
      let actualVal = parseFloat(inputQuantity.value);
      if (actualVal == 10.0) return;
      actualVal = actualVal + 0.25;
      inputQuantity.value = actualVal.toFixed(2);
    }

    if (plus.nextElementSibling.id == "add") {
      let actualVal = parseFloat(inputQuantity.value);

      if (actualVal == 3) return;
      actualVal = actualVal + 0.25;
      inputQuantity.value = actualVal.toFixed(2);
    }
  });
});

// Minus button
const minusButton = document.querySelectorAll(".minus-button");
minusButton.forEach((minus) => {
  const inputQuantity = minus.previousElementSibling;
  minus.addEventListener("click", (e) => {
    e.preventDefault();

    if (
      minus.previousElementSibling.id == "od-cyl" ||
      minus.previousElementSibling.id == "oi-cyl"
    ) {
      let actualVal = parseFloat(inputQuantity.value);
      if (actualVal == 0) return;
      actualVal = actualVal - 0.25;
      inputQuantity.value = actualVal.toFixed(2);

      if (minus.previousElementSibling.id == "od-cyl") {
        if (actualVal != 0) {
          parentODRange.querySelector("div input").removeAttribute("disabled");
          parentODRange.querySelector("div output").removeAttribute("disabled");
        } else {
          parentODRange
            .querySelector("div input")
            .setAttribute("disabled", true);
          parentODRange
            .querySelector("div output")
            .setAttribute("disabled", true);
        }
      } else {
        if (actualVal != 0) {
          parentOIRange.querySelector("div input").removeAttribute("disabled");
          parentOIRange.querySelector("div output").removeAttribute("disabled");
        } else {
          parentOIRange
            .querySelector("div input")
            .setAttribute("disabled", true);
          parentOIRange
            .querySelector("div output")
            .setAttribute("disabled", true);
        }
      }
    }
    if (
      minus.previousElementSibling.id == "od-sph" ||
      minus.previousElementSibling.id == "oi-sph"
    ) {
      let actualVal = parseFloat(inputQuantity.value);
      if (actualVal == -10.0) return;
      actualVal = actualVal - 0.25;
      inputQuantity.value = actualVal.toFixed(2);
    }

    if (minus.previousElementSibling.id == "add") {
      let actualVal = parseFloat(inputQuantity.value);
      if (actualVal == 0.75) return;
      actualVal = actualVal - 0.25;
      inputQuantity.value = actualVal.toFixed(2);
    }
  });
});

// Sliders Axis EJE
// range slider output
const sliders = document.querySelectorAll(".slider-wrapper");

function initSlider(min, max, startValue, sliderOutput, sliderInput) {
  sliderInput.value = startValue;

  const onSliderChange = function (event) {
    let value = event.target.value;
    sliderOutput.innerHTML = value;
  };

  sliderInput.addEventListener("input", onSliderChange);
  sliderInput.addEventListener("change", onSliderChange);

  // set slider to initial value
  const initialInput = new Event("input", {
    target: { value: startValue },
  });
}

sliders.forEach((slider) => {
  let input = slider.querySelector("input");
  let output = slider.querySelector("output");

  initSlider(0, 100, 0, output, input);
});