const $d = document;

// Set data in table checkout
const userAge = $d.querySelector(".user-age"),
  dpNumber = $d.querySelector(".dp-number span"),
  dpI = $d.querySelector(".dp-i span"),
  dpD = $d.querySelector(".dp-d span"),
  odSPH = $d.querySelector(".od-sph span"),
  odCYL = $d.querySelector(".od-cyl span"),
  odAxis = $d.querySelector(".od-axis span"),
  oiSPH = $d.querySelector(".oi-sph span"),
  oiCYL = $d.querySelector(".oi-cyl span"),
  oiAxis = $d.querySelector(".oi-axis span");

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
  userAge.textContent = data.age + " años";
  dpNumber.textContent = data.dpnumber + " Números";
  dpI.textContent = data.dpval1;
  dpD.textContent = data.dpval2;
  odSPH.textContent = data.odsph;
  odCYL.textContent = data.odcyl;
  odAxis.textContent = data.odrangevalue;
  oiSPH.textContent = data.oisph;
  oiCYL.textContent = data.oicyl;
  oiAxis.textContent = data.oirangevalue;

  // console.log(data);
  tableFormula.classList.remove("hide");
  tableFormula.nextElementSibling.classList.remove("hide");
  fillDataFormulaBtn.classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(2)").classList.add("hide");
  fileUploadedaMsg.querySelector(":nth-child(3)").classList.remove("hide");
});

// Distancia pupilar
const dpRadio = document.querySelectorAll("#dp-number");
const dpVal2 = document.querySelector("#dp-val-2");
dpRadio.forEach((radio) => {
  radio.addEventListener("click", () => {
    if (radio.value != "1") {
      dpVal2.classList.remove("hide");
    } else {
      dpVal2.classList.add("hide");
    }
  });
});

// Plus button
const plusButton = document.querySelectorAll(".plus-button");
plusButton.forEach((plus) => {
  const inputQuantity = plus.nextElementSibling;
  plus.addEventListener("click", (e) => {
    e.preventDefault();
    let actualVal = parseFloat(inputQuantity.value);
    actualVal = actualVal + 0.01;
    inputQuantity.setAttribute("value", actualVal.toFixed(2));
  });
});

// Minus button
const minusButton = document.querySelectorAll(".minus-button");
minusButton.forEach((minus) => {
  const inputQuantity = minus.previousElementSibling;
  minus.addEventListener("click", (e) => {
    e.preventDefault();
    let actualVal = parseFloat(inputQuantity.value);
    actualVal = actualVal - 0.01;
    inputQuantity.setAttribute("value", actualVal.toFixed(2));
  });
});
