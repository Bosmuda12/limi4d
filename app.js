(function () {
  "use strict";

  var STORAGE_PREFIX = "limi4d_user_";
  var MAX_USERNAME_LENGTH = 30;
  var USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
  var DEPOSIT_AMOUNT = 10000;
  var INITIAL_BALANCE = 100000;

  var loggedInUser = "";

  function storageKey(name) {
    return STORAGE_PREFIX + name;
  }

  function isLoggedIn() {
    return loggedInUser.length > 0;
  }

  function validateUsername(name) {
    if (!name || name.trim().length === 0) {
      return "Username tidak boleh kosong.";
    }
    name = name.trim();
    if (name.length > MAX_USERNAME_LENGTH) {
      return "Username terlalu panjang (maks " + MAX_USERNAME_LENGTH + " karakter).";
    }
    if (!USERNAME_PATTERN.test(name)) {
      return "Username hanya boleh huruf, angka, dan underscore.";
    }
    return null;
  }

  function getBalance(name) {
    var raw = localStorage.getItem(storageKey(name));
    var balance = parseInt(raw, 10);
    if (isNaN(balance) || balance < 0) {
      return 0;
    }
    return balance;
  }

  function setBalance(name, amount) {
    localStorage.setItem(storageKey(name), String(amount));
  }

  function updateSaldo() {
    var el = document.getElementById("saldo");
    if (!isLoggedIn()) {
      el.textContent = "Saldo: -";
      return;
    }
    var saldo = getBalance(loggedInUser);
    el.textContent = "Saldo: Rp " + saldo;
  }

  function login() {
    var input = document.getElementById("username").value;
    var error = validateUsername(input);
    if (error) {
      alert(error);
      return;
    }

    var name = input.trim();
    if (localStorage.getItem(storageKey(name)) === null) {
      setBalance(name, INITIAL_BALANCE);
    }

    loggedInUser = name;
    updateSaldo();
  }

  function deposit() {
    if (!isLoggedIn()) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    var saldo = getBalance(loggedInUser);
    saldo += DEPOSIT_AMOUNT;
    setBalance(loggedInUser, saldo);
    updateSaldo();
  }

  function withdraw() {
    if (!isLoggedIn()) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    var saldo = getBalance(loggedInUser);
    if (saldo < DEPOSIT_AMOUNT) {
      alert("Saldo kurang!");
      return;
    }
    saldo -= DEPOSIT_AMOUNT;
    setBalance(loggedInUser, saldo);
    updateSaldo();
  }

  document.getElementById("btn-login").addEventListener("click", login);
  document.getElementById("btn-deposit").addEventListener("click", deposit);
  document.getElementById("btn-withdraw").addEventListener("click", withdraw);
})();
