const { login, updateSaldo, deposit, withdraw, getUser, setUser } = require("../src/app");

function createMockStorage() {
  const store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    _store: store,
  };
}

function createMockDocument() {
  const elements = {};
  return {
    getElementById: jest.fn((id) => {
      if (!elements[id]) {
        elements[id] = { value: "", innerText: "" };
      }
      return elements[id];
    }),
    _elements: elements,
  };
}

beforeEach(() => {
  setUser("");
});

describe("login", () => {
  it("should set the user from the username input", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["username"] = { value: "alice" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);

    expect(getUser()).toBe("alice");
  });

  it("should initialize balance to 100000 for a new user", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["username"] = { value: "bob" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);

    expect(storage.setItem).toHaveBeenCalledWith("bob", 100000);
  });

  it("should not overwrite balance for an existing user", () => {
    const storage = createMockStorage();
    storage._store["charlie"] = "50000";
    const doc = createMockDocument();
    doc._elements["username"] = { value: "charlie" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);

    expect(storage.setItem).not.toHaveBeenCalledWith("charlie", 100000);
  });

  it("should update the saldo display after login", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["username"] = { value: "dave" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 100000");
  });
});

describe("updateSaldo", () => {
  it("should display the current balance from storage", () => {
    const storage = createMockStorage();
    storage._store["eve"] = "75000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("eve");

    updateSaldo(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 75000");
  });

  it("should display null when no user is set in storage", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("nonexistent");

    updateSaldo(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp null");
  });
});

describe("deposit", () => {
  it("should add 10000 to the current balance", () => {
    const storage = createMockStorage();
    storage._store["frank"] = "100000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("frank");

    deposit(storage, doc);

    expect(storage.setItem).toHaveBeenCalledWith("frank", 110000);
  });

  it("should update the display after deposit", () => {
    const storage = createMockStorage();
    storage._store["grace"] = "50000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("grace");

    deposit(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 60000");
  });

  it("should handle multiple consecutive deposits", () => {
    const storage = createMockStorage();
    storage._store["hank"] = "100000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("hank");

    deposit(storage, doc);
    deposit(storage, doc);
    deposit(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 130000");
  });
});

describe("withdraw", () => {
  it("should subtract 10000 from the current balance", () => {
    const storage = createMockStorage();
    storage._store["ivan"] = "100000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("ivan");

    withdraw(storage, doc);

    expect(storage.setItem).toHaveBeenCalledWith("ivan", 90000);
  });

  it("should return true on successful withdrawal", () => {
    const storage = createMockStorage();
    storage._store["judy"] = "50000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("judy");

    const result = withdraw(storage, doc);

    expect(result).toBe(true);
  });

  it("should return false when balance is less than 10000", () => {
    const storage = createMockStorage();
    storage._store["karl"] = "5000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("karl");

    const result = withdraw(storage, doc);

    expect(result).toBe(false);
  });

  it("should not change balance when balance is insufficient", () => {
    const storage = createMockStorage();
    storage._store["lara"] = "5000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("lara");

    withdraw(storage, doc);

    expect(storage._store["lara"]).toBe("5000");
  });

  it("should update the display after successful withdrawal", () => {
    const storage = createMockStorage();
    storage._store["mike"] = "30000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("mike");

    withdraw(storage, doc);

    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 20000");
  });

  it("should allow withdrawal when balance is exactly 10000", () => {
    const storage = createMockStorage();
    storage._store["nina"] = "10000";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("nina");

    const result = withdraw(storage, doc);

    expect(result).toBe(true);
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 0");
  });

  it("should reject withdrawal when balance is zero", () => {
    const storage = createMockStorage();
    storage._store["oscar"] = "0";
    const doc = createMockDocument();
    doc._elements["saldo"] = { innerText: "" };
    setUser("oscar");

    const result = withdraw(storage, doc);

    expect(result).toBe(false);
  });
});

describe("getUser / setUser", () => {
  it("should return the currently set user", () => {
    setUser("testuser");
    expect(getUser()).toBe("testuser");
  });

  it("should default to empty string", () => {
    expect(getUser()).toBe("");
  });
});

describe("integration: login then deposit and withdraw", () => {
  it("should handle a full session flow", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["username"] = { value: "player1" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 100000");

    deposit(storage, doc);
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 110000");

    withdraw(storage, doc);
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 100000");
  });

  it("should prevent overdraft in a full session", () => {
    const storage = createMockStorage();
    const doc = createMockDocument();
    doc._elements["username"] = { value: "player2" };
    doc._elements["saldo"] = { innerText: "" };

    login(storage, doc);

    // Withdraw until balance is 0
    for (let i = 0; i < 10; i++) {
      withdraw(storage, doc);
    }
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 0");

    // Further withdrawal should fail
    const result = withdraw(storage, doc);
    expect(result).toBe(false);
    expect(doc._elements["saldo"].innerText).toBe("Saldo: Rp 0");
  });
});
