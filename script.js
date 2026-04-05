let main = "x";
let sert = [];
let countx = 0;
let county = 0;
let f1 = document.querySelector(".ass");
let x = document.getElementById("10");
let y = document.getElementById("11");

// استرجاع النتيجة من localStorage عند فتح الصفحة
countx = parseInt(window.localStorage.getItem("x")) || 0;
county = parseInt(window.localStorage.getItem("o")) || 0;

x.innerHTML = `x is ${countx}`;
y.innerHTML = `o is ${county}`;

// prevent click on header
let sh = document.getElementById("0");

function result() {
  if (f1.innerHTML === "x winner") {
    countx++;
    window.localStorage.setItem("x", countx);
    x.innerHTML = `x is ${countx}`;
    y.innerHTML = `o is ${county}`;
  } else if (f1.innerHTML === "o winner") {
    county++;
    window.localStorage.setItem("o", county);
    y.innerHTML = `o is ${county}`;
    x.innerHTML = `x is ${countx}`;
  }
}

function endgame(n1, n2, n3) {
  f1.innerHTML = `${sert[n1]} winner`;
  document.getElementById(n1).style.backgroundColor = "#005758";
  document.getElementById(n2).style.backgroundColor = "#005758";
  document.getElementById(n3).style.backgroundColor = "#005758";
  result();

  // تعطيل كل الخلايا بعد الفوز
  for (let i = 1; i <= 9; i++) {
    let f3 = document.getElementById(i);
    f3.onclick = null;
  }

  setInterval(function () {
    f1.innerHTML += "*";
  }, 1000);

  setTimeout(function () {
    location.reload();
  }, 4000);
}

// زر عرض النتيجة
let rt = document.querySelector(".result");
rt.onclick = function () {
  sh.style.height = "493px";

  let rt2 = document.getElementById("10");
  let rt3 = document.getElementById("11");

  x.innerHTML = `x is ${countx}`;
  y.innerHTML = `o is ${county}`;

  if (rt2.style.display === "block" && rt3.style.display === "block") {
    rt2.style.display = "none";
    rt3.style.display = "none";
    rt.innerHTML = "show result";
    rt.style.backgroundColor = "#24b2e6";
    sh.style.height = "405px";
  } else {
    rt2.style.display = "block";
    rt3.style.display = "block";
    rt.innerHTML = "close result";
    rt.style.backgroundColor = "#005758";
  }
};

// اللعب
for (let i = 1; i <= 9; i++) {
  let f2 = document.getElementById(i);
  f2.onclick = function game() {
    if (main === "x" && f2.innerHTML == "") {
      f2.innerHTML = "x";
      main = "o";
      f1.innerHTML = "the role of o";
    } else if (main === "o" && f2.innerHTML == "") {
      f2.style.color = "red";
      f2.innerHTML = "o";
      main = "x";
      f1.innerHTML = "the role of x";
    }
    winner();
    nowinner();
  };
}

function winner() {
  for (let i = 1; i <= 9; i++) {
    sert[i] = document.getElementById(i).innerHTML;
  }
  if (sert[1] == sert[2] && sert[2] == sert[3] && sert[1] !== "") { endgame(1, 2, 3); }
  else if (sert[4] == sert[5] && sert[5] == sert[6] && sert[4] !== "") { endgame(4, 5, 6); }
  else if (sert[7] == sert[8] && sert[8] == sert[9] && sert[7] !== "") { endgame(7, 8, 9); }
  else if (sert[1] == sert[4] && sert[4] == sert[7] && sert[1] !== "") { endgame(1, 4, 7); }
  else if (sert[2] == sert[5] && sert[5] == sert[8] && sert[2] !== "") { endgame(2, 5, 8); }
  else if (sert[3] == sert[6] && sert[6] == sert[9] && sert[3] !== "") { endgame(3, 6, 9); }
  else if (sert[1] == sert[5] && sert[5] == sert[9] && sert[1] !== "") { endgame(1, 5, 9); }
  else if (sert[3] == sert[5] && sert[5] == sert[7] && sert[3] !== "") { endgame(3, 5, 7); }
}

function nowinner() {
  for (let i = 1; i <= 9; i++) {
    sert[i] = document.getElementById(i).innerHTML;
  }
  if (
    sert[1] !== "" && sert[2] !== "" && sert[3] !== "" &&
    sert[4] !== "" && sert[5] !== "" && sert[6] !== "" &&
    sert[7] !== "" && sert[8] !== "" && sert[9] !== ""
  ) {
    // تعطيل كل الخلايا
    for (let i = 1; i <= 9; i++) {
      document.getElementById(i).onclick = null;
    }
    f1.innerHTML = "no winner";
    setInterval(function () {
      f1.innerHTML += "*";
    }, 1000);
    setTimeout(function () {
      location.reload();
    }, 4000);
  }
}
