export default initSteps = () => {
  let count = 0;
  const $d = document;
  const nextButtons = $d.querySelectorAll(".next");
  const childsWidth = document.querySelectorAll(".body-options > section");
  function nextStep(event, steps) {
    // if (count < steps.length) {
    //   if (event.target.classList[0] == "step_options--button") {
    //     event.target.classList.add("active");
    //   }
    //   if (event.target.classList[0] == "step_options--descript") {
    //     event.target.parentElement.classList.add("active");
    //   }
    //   delayedBtn(steps[count], steps[count + 1]);
    // }
    // count++;
    // console.log(count);
    nextButtons.forEach((nxtButton) => {
      nxtButton.addEventListener("click", (event) => {
        event.preventDefault();

        parentWidth.scrollTo(200, 0);
        childsWidth[1].scrollIntoView({
          behavior: "smooth",
        });

        // nextStep(event, allSteps);
        // nxtButton.style.pointerEvents = "none";
      });
    });
  }

  const prevStep = (steps) => {
    if (count > 0) {
      steps[count].classList.add("hide");
      steps[count - 1].classList.remove("hide");
    }
    count--;
  };

  const delayedBtn = (node1, node2) => {
    setTimeout(() => {
      node1.classList.add("hide");
      node2.classList.remove("hide");
    }, 700);
  };
};
