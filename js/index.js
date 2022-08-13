// landing game
let btnS = document.querySelector(".btn-s");
let containerS = document.querySelector(".Game-start");
btnS.addEventListener("click", function (e) {
  let x = e.clientX - e.target.offsetLeft;
  let y = e.clientY - e.target.offsetTop;
  let ripples = document.createElement("span");
  ripples.className = "span-effect";
  ripples.style.left = x + "px";
  ripples.style.top = y + "px";
  this.appendChild(ripples);
  setTimeout(() => {
    ripples.remove();
  }, 1000);
});

// fix multiple clicks
let clickStart = false;
btnS.addEventListener("click", function (e) {
  let levelGame = document.querySelector(".level-opt");
  if (clickStart == false) {
    setTimeout(() => {
      containerS.classList.add("left");
    }, 500);
    setTimeout(() => {
      containerS.remove();
      creatGame(levelGame);
    }, 1000);
    clickStart = true;
  }
});

// generate list of covi crad
let divcovi = [];
let counter = 0;
for (let i = 1; i <= 16; i++) {
  counter++;
  let div = `<div class="covi-i" data-postion="p-${i}"><img data-fillter="n-${counter}" src="./assets/${counter}.png" alt=""></div>`;
  divcovi.push(div);
  if (counter == 8) {
    counter = 0;
  }
}

// start game
function creatGame(levelGame) {
  let div = document.createElement("div");
  div.className = "container Game-c";
  div.innerHTML += `
    <div class="nav">
                <div class="time">
                    <img src="../assets/timer.png"/>
                    <p>-</p><span>s</span>
                </div>       
                <div class="try">
                    <img src="../assets/chamces.png"/>
                    <p>-</p>
                </div>           
    </div>`;
  div.innerHTML += `
                    <div class="succ">
                        <h1>success!</h1>
                    </div>`;
  let div2 = document.createElement("div");
  div2.className = "crad-grid";
  div.appendChild(div2);

  // generate random covi form generate list
  let lengthcovi = divcovi.length;
  for (let i = 0; i < lengthcovi; i++) {
    let mt = Math.trunc(Math.random() * divcovi.length - 1);
    div2.innerHTML += divcovi[mt];
    divcovi.splice(divcovi.indexOf(divcovi[mt]), 1);
  }

  div.innerHTML += `<div class="win-section">
                        <div></div>
                        <div></div>
                    </div>
                    <div class="monkey-liser">
                        <img src="./assets/won.png">
                    </div>
                    </div>`;
  document.body.appendChild(div);
  gameStrat(levelGame);
}

function gameStrat(levelGame) {
  let covi = document.querySelectorAll(".covi-i");
  // show all covi
  covi.forEach((e) => {
    flipAnim(e);
  });

  // time fillter with level game
  let timeShow = 3000;
  switch (levelGame.value) {
    case "hard":
      timeShow = 3800;
      break;
    case "don't try":
      timeShow = 5000;
      break;
    default:
      timeShow = 3000;
      break;
  }
  //
  setTimeout(() => {
    covi.forEach((e) => {
      flipAnim(e, "hide");
    });
    setTimeout(() => {
      eventClickFlip(covi, levelGame);
    }, 1000);
  }, timeShow);
}

function eventClickFlip(covi, levelGame) {
  let counterWin = 0;
  let counterClick = 0;
  let coviOne = null;
  let coviPostion = [];

  //

  let trySec = document.querySelector(".try p");

  //
  let tryCounter = 20;
  let timerSec = document.querySelector(".time p");
  let s = null;
  // Filter work for each level
  switch (levelGame.value) {
    case "easy":
      s = 50;
      break;
    case "medium":
      s = 40;
      tryCounter = 16;
      break;
    case "hard":
      s = 25;
      tryCounter = 8;
      break;
    case "don't try":
      s = "-";
      tryCounter = 1;
      break;
    default:
      s = "-";
      break;
  }
  trySec.innerHTML = tryCounter;
  timerSec.innerHTML = s;
  let time = setInterval(() => {
    if (typeof s == "number") {
      if (timerSec.innerHTML != 0) {
        timerSec.innerHTML = --s;
      } else {
        clearInterval(time);
        failedAnim();
      }
    }
  }, 1000);
  //

  covi.forEach((e) => {
    e.addEventListener("click", function () {
      //
      if (
        counterClick < 2 &&
        coviPostion.includes(this.dataset.postion) == false
      ) {
        flipAnim(this);
        if (counterClick < 1) {
          coviOne = this;
        }
        counterClick++;

        if (
          counterClick == 2 &&
          coviOne.dataset.postion != this.dataset.postion &&
          coviPostion.includes(coviOne.dataset.postion) == false &&
          coviPostion.includes(this.dataset.postion) == false
        ) {
          if (
            coviOne.firstElementChild.dataset.fillter !=
            this.firstElementChild.dataset.fillter
          ) {
            setTimeout(() => {
              flipAnim(coviOne, "hide");
              flipAnim(this, "hide");
              if (trySec.innerHTML > 1) {
                trySec.innerHTML = --tryCounter;
              } else {
                failedAnim();
              }
              counterClick = 0;
            }, 800);
          } else {
            // storage coviPostion to don't click again
            coviPostion.push(coviOne.dataset.postion);
            coviPostion.push(this.dataset.postion);

            counterWin++;
            if (counterWin == 8) {
              clearInterval(time);
              winAnim();
            }
            setTimeout(() => {
              counterClick = 0;
            }, 800);
            //

            //
          }
        } else {
          counterClick = 1;
          coviOne = this;
        }
      }
      //
    });
  });
}

// win
function winAnim() {
  let covi = document.querySelectorAll(".covi-i");
  let succ = document.querySelector(".succ");
  let winSec = document.querySelector(".win-section");
  let cradGrid = document.querySelector(".crad-grid");
  let winMon = document.querySelector(".monkey-liser");
  let nav = document.querySelector(".nav");
  succ.firstElementChild.style.color = "red ";
  nav.setAttribute("style", "opacity: 0;");
  winSec.classList.add("win-rotate");
  setTimeout(() => {
    winMon.classList.add("win-top");
    cradGrid.classList.add("win-scale");
    covi.forEach((e) => {
      return e.setAttribute("style", "filter: blur(3px);");
    });
    setTimeout(() => {
      succ.classList.add("win-opa");
    }, 500);
  }, 2000);
}

// failde
function failedAnim() {
  let covi = document.querySelectorAll(".covi-i");
  let succ = document.querySelector(".succ");
  let winSec = document.querySelector(".win-section");
  let cradGrid = document.querySelector(".crad-grid");
  let winMon = document.querySelector(".monkey-liser");
  let nav = document.querySelector(".nav");
  nav.setAttribute("style", "opacity: 0;");
  succ.firstElementChild.innerHTML = "failed!";
  succ.firstElementChild.style.color = "red";
  cradGrid.setAttribute("style", "z-index: -1;");
  winMon.firstElementChild.src ="./assets/corona.png";
  setTimeout(() => {
    winMon.classList.add("win-top");
    cradGrid.classList.add("win-scale");
    covi.forEach((e) => {
      return e.setAttribute("style", "filter: blur(3px);");
    });
    setTimeout(() => {
      succ.classList.add("win-opa");
    }, 500);
  }, 800);
}

// flip anmation

function flipAnim(element, type = "show") {
  if (type == "show") {
    element.classList.remove("Nclicked");
    element.classList.add("clicked");
    setTimeout(() => {
      element.firstElementChild.style.display = "block";
    }, 300);
  }
  if (type == "hide") {
    element.classList.remove("clicked");
    element.classList.add("Nclicked");
    setTimeout(() => {
      element.firstElementChild.style.display = "none";
    }, 300);
  }
}
