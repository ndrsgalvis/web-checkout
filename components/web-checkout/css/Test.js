let steps = document.querySelectorAll(".step");
let stepSpan = document.querySelectorAll(".step__span");
let previusBtn = document.querySelectorAll("#previus");
let nextBtn = document.querySelectorAll("#next");

let options_stepOne = document.querySelectorAll(
  ".step_one .step_options button"
);

let options_stepThree = document.querySelectorAll(
  ".step_three .step_options button"
);

let stepOne = document.querySelector(".step_one");
let stepTwo = document.querySelector(".step_one-two");
let stepThree = document.querySelector(".step_three");
let stepFour = document.querySelector(".step_four");

// Previus buttons
previusBtn[0].addEventListener("click", () => {
  stepOne.classList.remove("hide");
  stepTwo.classList.add("hide");

  steps[2].classList.remove("active");
  stepSpan[1].classList.remove("active__span");
});

previusBtn[1].addEventListener("click", () => {
  stepThree.classList.add("hide");
  stepTwo.classList.remove("hide");

  steps[4].classList.remove("active");
  stepSpan[2].classList.remove("active__span");

  steps.forEach((step, i) => {
    if (i != 0 && i != 1) {
      step.classList.add("hide");
    }
  });
});

// Options froms step one
options_stepOne.forEach((option) => {
  option.addEventListener("click", function () {
    stepOne.classList.add("hide");
    stepTwo.classList.remove("hide");
  });
});

nextBtn[0].addEventListener("click", () => {
  stepTwo.classList.add("hide");
  stepThree.classList.remove("hide");

  steps[2].classList.add("active");
  stepSpan[1].classList.add("active__span");

  steps.forEach((step) => {
    step.classList.remove("hide");
  });
});

nextBtn[1].addEventListener("click", () => {
  stepThree.classList.add("hide");
  stepFour.classList.remove("hide");

  steps[2].classList.add("active");
  stepSpan[1].classList.add("active__span");

  steps.forEach((step) => {
    step.classList.remove("hide");
  });
});

options_stepThree.forEach((option) => {
  option.addEventListener("click", function () {});
});

const activeSteps = () => {
  steps.forEach((step) => {
    step.classList.remove("hide");
  });
};
