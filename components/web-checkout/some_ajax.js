function getPrice(node, options) {
  jQuery(document).ready(function ($) {
    $.ajax({
      url: dcms_vars.ajaxurl,
      type: "post",
      data: {
        action: "dcms_ajax_readmore",
        id_post: node,
        id_options: JSON.stringify(options)
      },
      success: function (response) {
        setNewPrice(response);
      },
    });
  });
}

 const formatPrice = (price) => {
      const currency = Intl.NumberFormat("es-CO", {
        currency: "COP",
      });
    
      return currency.format(price);
    } 
    
function setNewPrice(price) {
  price = price.slice(0, -1);
  console.log(price);
  // const go_to_cart = document.querySelector("#go-cart");
  // go_to_cart.addEventListener("click", () => {
  //   window.location.replace("https://gikolab.com/carrito");
  // });
  const eneableBag = document.querySelector("#goToPay");
  eneableBag.disabled = false;
  eneableBag.style.background = "#4D63FF";
  
  // $(document).ready(function () {
    //   $("#goToPay").click(function () {
      //     $("#confirmar_compra").modal("show");
      //   });
      // });
      
      let baseValue = document.querySelector(".base_price");
      let newValue = document.querySelector(".checkout_price");
      
    const subTotal = document.querySelector("#confirmar_compra .total span");
  
  newValue.textContent = formatPrice(parseInt(baseValue.textContent.replace(/\./g, '')) + parseInt(price));
  
  subTotal.textContent = formatPrice(parseInt(baseValue.textContent.replace(/\./g, '')) + parseInt(price));
}

const checkout_btn = document.querySelector("#checkout-btn");
if (!!checkout_btn) {
  checkout_btn.addEventListener("click", function () {
    jQuery(document).ready(function ($) {
      $.ajax({
        url: dcms_vars.ajaxurl,
        type: "post",
        data: {
          action: "dcms_ajax_update",
        },
      });
    });
  });
}

if (window.location.pathname.includes("order-pay")) {
  document
    .querySelector(".waybox-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      
      const dataf = localStorage.getItem("data-formula");
      const order = parseInt(
        document.querySelector(".order strong").textContent
      );

      jQuery(document).ready(function ($) {
        $.ajax({
          url: dcms_vars.ajaxurl,
          type: "post",
          data: {
            action: "dcms_ajax_put_formula",
            data_json: dataf,
            order_id: order,
          },
          success: function () {
            clearStorage()
          }
        });
      });
    });
}


function clearStorage(){
	localStorage.clear()
}