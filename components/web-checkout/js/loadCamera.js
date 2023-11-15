const stepThreeOptions = document.querySelector(".step_three .step_options");
const optionsAfterPhoto = document.querySelector(
  ".step_three .after_take_photo"
);

const fileUploaded = document.querySelector(".file-uploaded");
const infoFormula = document.querySelector(".info-formula");
const cameraModal = document.querySelector("#exampleModal");
const tableFormulaInfo = document.querySelector(".table-formula");

const parent = document.querySelector(".modal-body");
const usePhotoBtn = document.querySelector(
  ".modal-footer .step_options--bgfull"
);
const takePhotoBtn = document.querySelector(".take-photo");
const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
const $listaDeDispositivos = document.querySelector("#listaDeDispositivos");
// Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");

const constraints = {
  audio: false,
  video: {
    facingMode: "user",
  },
};

function closeModal() {
  cameraModal.classList.remove("show");
  cameraModal.style.display = "none";
  cameraModal.setAttribute("aria-hidden", "true");
  const backdropModal = document.querySelector(".modal-backdrop");
  backdropModal.classList.remove("show");
  backdropModal.style.display = "none";
}

function getVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((localMediaStream) => {
      // console.log(localMediaStream);
      // llenarSelectConDispositivosDisponibles();
      //  DEPRECIATION :
      //       The following has been depreceated by major browsers as of Chrome and Firefox.
      //       video.src = window.URL.createObjectURL(localMediaStream);
      //       Please refer to these:
      //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
      // console.dir(video);
      if ("srcObject" in video) {
        video.srcObject = localMediaStream;
      } else {
        video.src = URL.createObjectURL(localMediaStream);
      }
      // video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch((err) => {
      canvas.style.height = "0px";
      canvas.after(
        "Ops!, Al parecer no tenemos permisos para acceder a tu camara."
      );
    });
}

function llenarSelectConDispositivosDisponibles() {
  navigator.mediaDevices.enumerateDevices().then(function (dispositivos) {
    const dispositivosDeVideo = [];
    dispositivos.forEach(function (dispositivo) {
      const tipo = dispositivo.kind;
      if (tipo === "videoinput") {
        dispositivosDeVideo.push(dispositivo);
      }
    });

    // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
    if (dispositivosDeVideo.length > 0) {
      // Llenar el select
      dispositivosDeVideo.forEach((dispositivo) => {
        const option = document.createElement("option");
        option.value = dispositivo.deviceId;
        option.text = dispositivo.label;
        $listaDeDispositivos.appendChild(option);
        console.log("$listaDeDispositivos => ", $listaDeDispositivos);
      });
    }
  });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    // let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);
    // put them back
    // ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // played the sound
  // snap.currentTime = 0;
  // snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "tuFormula");
  link.innerHTML = `<img src="${data}" style="width: inherit;" alt="Handsome Man" />`;
  link.style.width = "100%";
  link.style.display = "flex";

  console.log(data);

  parent.insertBefore(link, strip);
  canvas.classList.add("hide");
  strip.classList.add("hide");
  usePhotoBtn.classList.remove("hide");
  fileUploaded.classList.remove("hide");
  takePhotoBtn.classList.add("hide");
  infoFormula.classList.add("hide");
  takePhotoBtn.classList.add("hide");

  stepThreeOptions.classList.add("hide");
  optionsAfterPhoto.classList.remove("hide");
}

function showStepThree() {
  const formula = document.querySelector('a[download="tuFormula"]');
  if (formula) {
    formula.remove();
  }

  takePhotoBtn.classList.remove("hide");
  usePhotoBtn.classList.add("hide");
  canvas.classList.remove("hide");
  fileUploaded.classList.add("hide");
  tableFormulaInfo.classList.add("hide");
  tableFormulaInfo.nextElementSibling.classList.add("hide");
  optionsAfterPhoto.classList.add("hide");
  infoFormula.classList.remove("hide");
  stepThreeOptions.classList.remove("hide");
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

document
  .querySelector('button[data-target="#exampleModal"]')
  .addEventListener("click", () => {
    getVideo();
  });

video.addEventListener("canplay", paintToCanvas);
