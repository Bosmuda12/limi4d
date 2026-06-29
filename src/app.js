let user = "";

function login(storage, document) {
  const name = document.getElementById("username").value;
  if (!name) return false;

  user = name;

  if (!storage.getItem(user)) {
    storage.setItem(user, 100000);
  }

  updateSaldo(storage, document);
  return true;
}

function updateSaldo(storage, document) {
  const saldo = storage.getItem(user);
  document.getElementById("saldo").innerText = "Saldo: Rp " + saldo;
}

function deposit(storage, document) {
  let saldo = parseInt(storage.getItem(user));
  if (isNaN(saldo)) return false;

  saldo += 10000;
  storage.setItem(user, saldo);
  updateSaldo(storage, document);
  return true;
}

function withdraw(storage, document) {
  let saldo = parseInt(storage.getItem(user));
  if (isNaN(saldo) || saldo < 10000) return false;

  saldo -= 10000;
  storage.setItem(user, saldo);
  updateSaldo(storage, document);
  return true;
}

function getUser() {
  return user;
}

function setUser(name) {
  user = name;
}

module.exports = { login, updateSaldo, deposit, withdraw, getUser, setUser };
