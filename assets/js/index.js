const QuerySubmit = document.querySelector(".submit");
const QuerySubmitOpen = document.querySelectorAll(".submit-open");
const QuerySubmitClose = document.querySelectorAll(".submit-close");

const openSubmit = () => {
  QuerySubmit.style.display = "block";
  setTimeout(closeSubmit, 5000);
};

const closeSubmit = () => (QuerySubmit.style.display = "none");

const scaleContainer = () => {
  const container = document.querySelector(".container");
  let base1 = innerWidth <= innerHeight ? 900 : 1600;
  let base2 = innerWidth <= innerHeight ? 1600 : 900;
  let scale = Math.min(innerWidth / base1, innerHeight / base2);

  container.setAttribute(
    "style",
    `
    width: ${base1}px;
    height: ${base2}px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${scale});
  `
  );
};

addEventListener("load", scaleContainer);
addEventListener("resize", scaleContainer);

QuerySubmitOpen.forEach((submit) =>
  submit.addEventListener("click", openSubmit)
);
QuerySubmitClose.forEach((submit) =>
  submit.addEventListener("click", closeSubmit)
);

window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
  document.body.classList.remove("loading");
  document.getElementById("loader").remove("loading");
});
