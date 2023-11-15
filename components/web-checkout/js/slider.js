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

  initSlider(0, 100, 10, output, input);
});
