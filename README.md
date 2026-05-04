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

function login() {
  user = document.getElementById("username").value;

  if (!localStorage.getItem(user)) {
    localStorage.setItem(user, 100000);
  }

  updateSaldo();
}

function updateSaldo() {
  let saldo = localStorage.getItem(user);
  document.getElementById("saldo").innerText = "Saldo: Rp " + saldo;
}

function deposit() {
  let saldo = parseInt(localStorage.getItem(user));
  saldo += 10000;
  localStorage.setItem(user, saldo);
  updateSaldo();
}

function withdraw() {
  let saldo = parseInt(localStorage.getItem(user));
  if (saldo < 10000) return alert("Saldo kurang!");

  saldo -= 10000;
  localStorage.setItem(user, saldo);
  updateSaldo();
}
</script>

</body>
</html>
