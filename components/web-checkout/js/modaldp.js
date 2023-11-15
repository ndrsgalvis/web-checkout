const tabButtons = document.querySelectorAll(".tab-button");

tabButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    // Active
    document.querySelectorAll(".tab-button").forEach((content) => {
      content.classList.remove("active");
    });

    this.classList.add("active");
    const targetId = event.target.getAttribute("data-target");

    document.querySelectorAll(".sectionmodal").forEach((content) => {
      if (content.getAttribute("id") == targetId) {
        content.classList.remove("hidden-content");
      } else {
        content.classList.add("hidden-content");
      }
    });
  });
});

const tabButtons1 = document.querySelectorAll(".tab-button-1");

tabButtons1.forEach((button) => {
  button.addEventListener("click", function (event) {
    // Active
    document.querySelectorAll(".tab-button-1").forEach((content) => {
      content.classList.remove("active");
    });

    this.classList.add("active");
    const targetId = event.target.getAttribute("data-target");

    document.querySelectorAll(".sectionmodal-1").forEach((content) => {
      if (content.getAttribute("id") == targetId) {
        content.classList.remove("hidden-content");
      } else {
        content.classList.add("hidden-content");
      }
    });
  });
});

document.querySelectorAll("#distanciap")[3].addEventListener("click", () => {
  // Active
  document.querySelectorAll(".tab-button-1").forEach((content) => {
    content.classList.remove("active");
  });

  document.querySelectorAll(".tab-button-1")[3].classList.add("active");
  
  document.querySelectorAll(".sectionmodal-1").forEach((content) => {
    content.classList.add("hidden-content");    
  });
  
  document.querySelectorAll(".sectionmodal-1")[3].classList.remove("hidden-content");

});