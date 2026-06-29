let user = "";

function login(storage, document) {
  user = document.getElementById("username").value;

  if (!storage.getItem(user)) {
    storage.setItem(user, 100000);
  }

  updateSaldo(storage, document);
}

function updateSaldo(storage, document) {
  const saldo = storage.getItem(user);
  document.getElementById("saldo").innerText = "Saldo: Rp " + saldo;
}

function deposit(storage, document) {
  let saldo = parseInt(storage.getItem(user));
  saldo += 10000;
  storage.setItem(user, saldo);
  updateSaldo(storage, document);
}

function withdraw(storage, document) {
  let saldo = parseInt(storage.getItem(user));
  if (saldo < 10000) return false;

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
