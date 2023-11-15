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
const loadingState = document.getElementById("loadingCamera");
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
      //   aviableDevices();
      //  DEPRECIATION :
      //       The following has been depreceated by major browsers as of Chrome and Firefox.
      //       video.src = window.URL.createObjectURL(localMediaStream);
      //       Please refer to these:
      //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
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

function aviableDevices() {
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
        // console.log("$listaDeDispositivos => ", $listaDeDispositivos);
      });
    }
  });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  loadingState.style.display = "none";

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

function takePhoto() {
  // played the sound
  // snap.currentTime = 0;
  // snap.play();

  // take the data out of the canvas**]]]
  const data = canvas.toDataURL();

  const link = document.createElement("a");
  window.localStorage.setItem("formula", data);
  window.localStorage.setItem("canvas", canvas);
  link.href = data;

  uploadToS3(canvas);

  link.setAttribute("download", "tuFormula");
  link.innerHTML = `<img src="${data}" style="width: inherit;" alt="Handsome Man" />`;
  link.style.width = "100%";
  link.style.display = "flex";

  parent.insertBefore(link, strip);
  canvas.classList.add("hide");
  strip.classList.add("hide");
  usePhotoBtn.classList.remove("hide");
  fileUploaded.classList.remove("hide");
  takePhotoBtn.classList.add("hide");
  infoFormula.classList.add("hide");
  takePhotoBtn.classList.add("hide");

  stepThreeOptions.classList.add("hide");
  if (document.querySelector(".table-formula").classList.contains("hide")) {
    optionsAfterPhoto.classList.remove("hide");
  }

  stopVideo();
}

function stopVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((localMediaStream) => {
      if (localMediaStream) {
        // Stop all tracks in the stream.
        localMediaStream.getTracks().forEach((track) => {
          track.stop();
        });

        // Clear the video source and stop playback.
        if ("srcObject" in video) {
          video.srcObject = null;
        } else {
          video.src = "";
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

AWS.config.update({
  accessKeyId: "AKIAXVLX3OTWWCCMD43R",
  secretAccessKey: "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",
});
const bucketName = "cdn-giko";
// Remplazar math rand por el id del cookie
const key = "medical-formula/giko_temp_" + Math.random() * 1000000000 + ".png";

function uploadToS3(data) {
  data.toBlob(function (blob) {
    if (!blob) {
      console.error("Error creating Blob from canvas.");
      return;
    }

    localStorage.setItem("archivo", blob);
    // console.log(blob);
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: blob,
      ACL: "public-read",
      ContentType: "image/png",
    };

    const s3 = new AWS.S3();
    s3.upload(params, function (err, data) {
      if (err) {
        console.log("Error al subir el archivo:", err);
      } else {
        // console.log('Archivo subido exitosamente:', data['Location']);
        localStorage.setItem("url-img", data["Location"]);
      }
    });
  }, "image/jpeg");
}

function showStepThree(event) {
  event.parentNode.classList.add("hide");
  event.parentNode.previousElementSibling.classList.remove("hide");
  const formula = document.querySelector('a[download="tuFormula"]');
  if (formula) {
    formula.remove();
  }
  takePhotoBtn.classList.remove("hide");
  usePhotoBtn.classList.add("hide");
  canvas.classList.remove("hide");

  usePhotoBtn.addEventListener("click", () => {
    event.parentNode.classList.remove("hide");
    event.parentNode.previousElementSibling.classList.add("hide");
  });
  // fileUploaded.classList.add("hide");
  // tableFormulaInfo.classList.add("hide");
  // tableFormulaInfo.nextElementSibling.classList.add("hide");
  // optionsAfterPhoto.classList.add("hide");
  // infoFormula.classList.remove("hide");
  // stepThreeOptions.classList.remove("hide");
}

document
  .querySelectorAll('button[data-target="#cameraModal"]')
  .forEach((item) => {
    item.addEventListener("click", () => {
      getVideo();
    });
  });

takePhotoBtn.addEventListener("click", () => {
  takePhoto();
});

let btnShowStepThree = document.querySelector(".show-step");
let parrafos = document.querySelectorAll(".file-uploaded > p");

btnShowStepThree.addEventListener("click", (event) => {
  showStepThree(event.target);
  parrafos[0].classList.add("hide");
  parrafos[1].classList.remove("hide");
});

video.addEventListener("canplay", paintToCanvas);
