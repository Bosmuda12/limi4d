<!DOCTYPE html>
<html>
<head>
  <title>App Simple</title>
</head>
<body>

<h2>Login Sederhana</h2>

<input id="username" placeholder="Username"><br><br>
<button onclick="login()">Login</button>

<h3 id="saldo">Saldo: -</h3>

<br>
<button onclick="deposit()">Deposit 10.000</button>
<button onclick="withdraw()">Withdraw 10.000</button>

<script>
let user = "";

function isLoggedIn() {
  if (!user) {
    alert("Silakan login terlebih dahulu!");
    return false;
  }
  return true;
}

function readSaldo() {
  var raw = localStorage.getItem(user);
  var saldo = parseInt(raw, 10);
  if (isNaN(saldo)) {
    localStorage.setItem(user, 0);
    return 0;
  }
  return saldo;
}

function login() {
  var input = document.getElementById("username").value.trim();
  if (!input) {
    alert("Username tidak boleh kosong!");
    return;
  }

  user = input;

  try {
    if (!localStorage.getItem(user)) {
      localStorage.setItem(user, 100000);
    }
  } catch (e) {
    alert("Gagal mengakses penyimpanan: " + e.message);
    return;
  }

  updateSaldo();
}

function updateSaldo() {
  if (!isLoggedIn()) return;
  var saldo = readSaldo();
  document.getElementById("saldo").innerText = "Saldo: Rp " + saldo;
}

function deposit() {
  if (!isLoggedIn()) return;
  var saldo = readSaldo();
  saldo += 10000;
  try {
    localStorage.setItem(user, saldo);
  } catch (e) {
    alert("Gagal menyimpan saldo: " + e.message);
    return;
  }
  updateSaldo();
}

function withdraw() {
  if (!isLoggedIn()) return;
  var saldo = readSaldo();
  if (saldo < 10000) {
    alert("Saldo kurang!");
    return;
  }

  saldo -= 10000;
  try {
    localStorage.setItem(user, saldo);
  } catch (e) {
    alert("Gagal menyimpan saldo: " + e.message);
    return;
  }
  updateSaldo();
}
</script>

</body>
</html>
