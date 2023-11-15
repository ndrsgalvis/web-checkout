const $d = document;
const breadcrumb = $d.querySelector("#filtersForm .breadcrumbs");

let count = 0;
let price = "";
let clientOptions = [];
let container = $d.querySelector("#container");
let modalBody = $d.querySelector("#filtersForm .modal-body");
let closeModal = $d.querySelector("#filtersForm .return-btn");

closeModal.addEventListener("click", () => {
  removeModalOptions();
});

const removeModalOptions = () => {
  let breadcrumbItems = breadcrumb.querySelectorAll("span");
  breadcrumbItems.forEach((item, i) => {
    item.remove();
  });
  modalBody.querySelectorAll("div").forEach((div) => {
    div.remove();
  });
};

const removeAllOptions = () => {
  container.querySelectorAll("div").forEach((div) => {
    div.remove();
  });
};

const getLensesAndMaterials = async (id, age, cylod, sphod, cyloi, sphoi) => {
  if (parseInt(age) < 40) id = 1;
  const res = await fetch(
    `https://gikolab.com/api/checkout/get_lenses.php?age=${age}&id=${id}&cylod=${cylod}&sphod=${sphod}&cyloi=${cyloi}&sphoi=${sphoi}`
  );
  const data = await res.json();
  return data;
};

const hideOptions = (step) => {
  if (step != "step-1") {
    $d.querySelectorAll(`div[data-step="${step}"]`).forEach((item, i) => {
      item.style.viewTransitionName = `card-${i}`;
      item.style.transition = "display 0.5s";
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          item.classList.add("hide");
        });
      }
    });
  }
};

function showOptions(elementId) {
  const data = elementId.getAttribute("data-stepid");

  //Remove old options
  modalBody.querySelectorAll("div").forEach((div) => {
    //Hide modal if click first breadcrumb
    if (parseInt(data.split("-")[1]) == 1) {
      $(document).ready(function () {
        $("#filtersForm").modal("hide");
      });
    }

    if (
      parseInt(div.getAttribute("data-step").split("-")[1]) >
      parseInt(data.split("-")[1])
    ) {
      div.remove();
    }
  });

  // Remove de class hide
  $d.querySelectorAll(`div[data-step=${data}]`).forEach((item) => {
    item.classList.remove("hide");
  });

  // Remove from breadcrumbs
  let breadcrumbItems = breadcrumb.querySelectorAll("span");
  breadcrumbItems.forEach((item, i) => {
    if (item.getAttribute("data-stepid") == data) {
      breadcrumb.innerHTML = "";
      for (let index = 0; index < i; index++) {
        breadcrumb.appendChild(breadcrumbItems[index]);
      }
    }
  });
}

const createBreadcrumb = (value, step) => {
  const span = document.createElement("span");
  span.setAttribute("data-stepid", step);
  span.textContent = value;

  span.addEventListener("click", () => {
    showOptions(span);
  });

  breadcrumb.appendChild(span);
};

const getVariations = async (idOption) => {
  const data = await getLensesAndMaterials(idOption, "", "", "");
  createOptions(data);
};

const createOptions = (data) => {
  count++;
  const options = Object.entries(data).map((option, i) => {
    if (option[0] == "id_variation") {
      getVariations(option[1]);
      return;
    }

    let inputClass = "input-radio";
    if (option[0] == "description") return;
    if (option[0] == "info") return;
    if (!option[1].description) option[1].description = " ";
    if (option[0].length <= 1) {
      let res = option[1];
      if (!res[1]) return;
      inputClass = "input-radio-1";
      option[0] = [res[0], `  <span>$${formatPrice(res[1])}</span>`].toString();
    }

    const wrap = $d.createElement("div");
    wrap.setAttribute("style", "display: flex;");

    const descript = $d.createElement("p");
    const label = $d.createElement("label");
    const element = $d.createElement("input");
    const titleLabel = $d.createElement("span");
    const localKey = option[0].replace(/ /g, "");

    // Create info img
    const info = $d.createElement("img");
    info.setAttribute(
      "src",
      "https://gikolab.com/wp-content/uploads/2023/09/FontAwsome-question-circle.svg"
    );
    info.setAttribute(
      "style",
      "filter: grayscale(1);width: 35px;margin-top: 25px;padding: 0px 10px;align-self: flex-start;"
    );
    info.addEventListener("click", () => {
      $("#info_prod").modal("show");
      
      $d.querySelector("#info_prod").style.zIndex = '9999';

      let backdrop = $d.querySelectorAll(".modal-backdrop");
      if (backdrop.length > 1) {
        backdrop[1].style.zIndex = '9998';
      } else { 
        backdrop[0].style.zIndex = '9998';
      }

      if (option[0].includes(',')) { 
        $d.querySelector("#info_prod h1").textContent = option[0].split(',')[0];
      } else {
        $d.querySelector("#info_prod h1").textContent = option[0];
      }
      $d.querySelector("#info_prod .modal-body p").innerHTML = option[1].info;
    });

    label.setAttribute("for", `step-${count}-${i}`);
    wrap.appendChild(info);

    element.classList.add(inputClass);
    element.setAttribute("type", "radio");
    element.setAttribute("value", option[0]);
    element.setAttribute("name", `step-${count}`);
    element.setAttribute("id", `step-${count}-${i}`);
    element.setAttribute("data-options", localKey);

    // Open modal
    if (count == 1) {
      element.setAttribute("data-toggle", "modal");
      element.setAttribute("data-target", "#filtersForm");
    }

    window.localStorage.setItem(localKey, JSON.stringify(option[1]));

    titleLabel.innerHTML = option[0];
    label.appendChild(titleLabel);
    label.appendChild(descript);
    label.style.cursor = "pointer";

    descript.innerHTML = option[1].description;
    wrap.style.cursor = "pointer";
    wrap.setAttribute("data-step", `step-${count}`);
    wrap.appendChild(label);
    wrap.appendChild(element);
    return wrap;
  });

  options.map((option) => {
    if (option != undefined) {
      if (count != 1) {
        modalBody.appendChild(option);
        option
          .querySelector("input")
          .addEventListener("click", function (element) {
            setTimeout(() => {
              validateAllOptions();
            }, 700);

            getNewOptions(option.querySelector("input"));

            if (this.classList.contains("input-radio-1")) {
              let breadOptions = document.querySelectorAll(
                "#filtersForm .breadcrumbs span"
              );
              clientOptions = [];
              breadOptions.forEach((element) => {
                clientOptions.push(element.textContent.slice(0, -1));
              });
              clientOptions.push(this.value.split(",")[0]);

              price = this.value.split(",")[1].replace(/[^0-9]/g, "");

              const okBtn = document.querySelector(
                "#filtersForm .modal-footer button"
              );
              const finalizarCompra = document.querySelector(
                "#confirmar_compra .modal-footer button"
              );

              okBtn.removeAttribute("disabled");
              okBtn.style.background = "#4d63ff";
              okBtn.addEventListener("click", () => {
                removeModalOptions();
                $(document).ready(function () {
                  $("#filtersForm").modal("hide");
                  $("#confirmar_compra").modal("show");
                });
              });

              finalizarCompra.addEventListener("click", () => {
                window.location.href = "https://gikolab.com/carrito";
              });

              //Setting img product and info
              const imgProd = document.querySelector(
                'div[data-id="179d525"] div img'
              );
              const imgModal = document.querySelector(".images");
              const cloneImg = imgProd.cloneNode();
              imgModal.innerHTML = "";
              cloneImg.classList.add("imagen-destacada");
              imgModal.appendChild(cloneImg);
              // Title prod
              const title = document.querySelector(".title_referencia span");
              const titleProd = document.querySelector(
                'div[data-id="179d525"] div div h2'
              ).textContent;
              title.textContent = titleProd;
              // Red prod
              const ref1 = document.querySelector(
                ".referencias li:nth-child(1) span"
              );
              const ref2 = document.querySelector(
                ".referencias li:nth-child(2) span"
              );
              const refProd1 = document.querySelector(
                'div[data-id="179d525"] div div p'
              ).textContent;
              const refProd2 = document.querySelector(
                'div[data-id="179d525"] div div div span'
              ).textContent;

              ref1.textContent = refProd1.split(":")[1];
              ref2.textContent = refProd2.split(":")[1];

              // Set in new modal
              let material = clientOptions[clientOptions.length - 1];
              document.querySelector(".title_filter_code").textContent =
                material.split(",")[0];

              let parentUl = document.querySelectorAll(".referencias")[1];
              parentUl.innerHTML = "";
              clientOptions.forEach((element, i) => {
                if (i < clientOptions.length - 1) {
                  let childLi = document.createElement("li");
                  childLi.textContent = "+ " + element;
                  parentUl.appendChild(childLi);
                }
              });
            }
          });
      } else {
        container.appendChild(option);
        option
          .querySelector("input")
          .addEventListener("click", function (element) {
            clientOptions = [];
            clientOptions.push(this.value);
            getNewOptions(option.querySelector("input"));
          });
      }
    }
  });
};

let buttonModal = document.querySelector("#filtersForm .modal-footer button");
buttonModal.addEventListener("click", () => {
  let dataFormula = window.localStorage.getItem("data-formula");
  let options = window.localStorage.getItem("options");
  let idLente = window.location.search;
  let temp = "";
  let tempFormula = [];
  let sku = document.querySelector('div[data-id="179d525"] div div p');
  sku = sku.textContent.split(":")[1].trim();

  if (dataFormula) {
    dataFormula = JSON.parse(dataFormula);
    dataFormula.forEach((item) => {
      if (item.item == idLente.split("=")[1]) {
        item.option = clientOptions;
      }
    });
    window.localStorage.setItem("data-formula", JSON.stringify(dataFormula));
  } else { 
    tempFormula.push({
      item: window.location.search.split("=")[1],
      sku: sku,
      img: '',
      formula: {},
      option: clientOptions
    });
    window.localStorage.setItem("data-formula", JSON.stringify(tempFormula));
  }
  
  

  if (options) {
    temp = JSON.parse(options);

    var objetoExistente = false;
    temp.forEach((item) => {
      if (item.id_product == idLente.split("=")[1]) {
        item.price = price,
        item.options = clientOptions;
        objetoExistente = true;
      }
    });

    if (!objetoExistente) {
      temp.push({
        id_product: idLente.split("=")[1],
        options: clientOptions,
        price: price,
      });
    }

    window.localStorage.setItem("options", JSON.stringify(temp));
    getPrice(price, temp);
  } else {
    let temp = [
      {
        id_product: idLente.split("=")[1],
        options: clientOptions,
        price: price,
      },
    ];

    getPrice(price, temp);
    window.localStorage.setItem("options", JSON.stringify(temp));
  }

  if (localStorage.getItem("url-img")) {
    localStorage.removeItem("archivo");
    localStorage.removeItem("url-img");
  }
});

const validateAllOptions = () => {
  // let actualNode = document.querySelectorAll(
  //   ".modal-body > div[data-step]:not(.hide)"
  // );

  // let noNodes = [];

  // actualNode.forEach((node) => {
  //   if (!node.querySelector("input").classList.contains("input-radio-1")) {
  //     noNodes.push(node);
  //   }
  // });

  // if (noNodes.length != actualNode.length) {
  //   noNodes.forEach((node, i) => {
  //     node.style.viewTransitionName = `card-${i}`;
  //     if (document.startViewTransition) {
  //       document.startViewTransition(() => {
  //         node.remove();
  //       });
  //     } else {
  //       node.remove();
  //     }
  //   });
  // }
};

function getNewOptions(data) {
  const key = data.getAttribute("data-options");
  if (key.includes(",")) return;

  let selectedText = data.parentNode.querySelector("label span").textContent;

  let stepId = data.parentElement.getAttribute("data-step");

  hideOptions(stepId);
  createBreadcrumb(data.getAttribute("value"), stepId);
  document.querySelector("h3.title").textContent = selectedText;

  const options = window.localStorage.getItem(key);
  const dataFilters = Object.entries(JSON.parse(options));

  setTimeout(() => {
    if (JSON.parse(options).filters != undefined) {
      createOptions(JSON.parse(options).filters);
    } else createOptions(JSON.parse(options));

    if (dataFilters[0][0].length == 1) {
      let seen = new Set();
      let newValues = [];
      let i = 0;
      const materials = dataFilters.reduce((accu, item, index) => {
        const valor = Object.entries(item[1]);
        if (valor[2]) {
          newValues.push([valor[0][0], valor[0][1]]);
        }

        if (!seen.has(valor[0][0]) && valor.length > 1) {
          seen.add(valor[0][0]);
          accu.push([valor[0][0], valor[0][1]]);

          accu[i].description = valor[1][1];
          valor[2][1] == "true"
            ? (accu[i].info = valor[3][1])
            : (accu[i].info = valor[2][1]);

          i++;
        }

        return accu;
      }, []);

      replacePrices(materials, newValues);
      createOptions(materials);
    }
  }, 500);
}

function replacePrices(arr1, arr2) {
  // for (let i = 0; i < arr1.length; i++) {
  //   for (let j = 0; j < arr2.length; j++) {
  //     if (arr1[i][0] === arr2[j][0]) {
  //       arr1[i][1] = arr2[j][1];
  //     }
  //   }
  // }
}

const formatPrice = (price) => {
  const currency = Intl.NumberFormat("es-CO", {
    currency: "COP",
  });

  return currency.format(price);
};

const initMaterials = async (id, age, cylod, sphod, cyloi, sphoi) => {
  removeAllOptions();
  count = 0;
  // localStorage.clear();
  const data = await getLensesAndMaterials(id, age, cylod, sphod, cyloi, sphoi);
  createOptions(data);
};

export { initMaterials };

// Modal