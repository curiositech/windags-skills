(() => {
  const catalog = JSON.parse(document.getElementById("demo-catalog").textContent);
  const bySku = new Map(catalog.items.map(item => [item.sku, item]));
  const storageKey = `storefront-preview-bag:${catalog.store}`;
  const formatter = new Intl.NumberFormat("en", { style: "currency", currency: catalog.currency });
  const money = cents => formatter.format(cents / 100);
  const dialog = document.querySelector(".bag");
  const trigger = document.querySelector(".bag-trigger");
  const status = document.querySelector("[role=status]");
  const list = document.querySelector(".bag-items");
  const controls = document.querySelector(".bag-totals");
  const empty = document.querySelector(".bag-empty");
  const count = document.querySelector(".bag-count");
  const subtotal = document.querySelector(".subtotal");
  const close = dialog.querySelector("button");
  let restoreFocus = trigger;

  // Recheck saved quantities against this render's catalog so retired or unavailable lines cannot persist.
  function currentBag() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) return new Map();
      return new Map(saved.filter(([sku, qty]) => bySku.has(sku) && Number.isInteger(qty) && qty > 0)
        .map(([sku, qty]) => [sku, Math.min(qty, bySku.get(sku).limit)])
        .filter(([, qty]) => qty > 0));
    } catch {
      return new Map();
    }
  }

  const bag = currentBag();

  function button(label, accessibleLabel, sku, change, disabled = false) {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "secondary-button";
    node.textContent = label;
    node.setAttribute("aria-label", accessibleLabel);
    node.dataset.sku = sku;
    node.dataset.change = change;
    node.disabled = disabled;
    return node;
  }

  function bagRow(item, qty) {
    const row = document.createElement("li");
    const header = document.createElement("div");
    const name = document.createElement("span");
    const extended = document.createElement("strong");
    const quantityControl = document.createElement("div");
    const number = document.createElement("span");

    header.className = "bag-item";
    name.className = "bag-item-title";
    name.textContent = item.name;
    extended.className = "money";
    extended.textContent = money(item.cents * qty);
    quantityControl.className = "qty-controls";
    number.className = "quantity";
    number.textContent = qty;
    header.append(name, extended);
    quantityControl.append(
      button("−", `Reduce quantity of ${item.name}`, item.sku, "-1"),
      number,
      button("+", `Increase quantity of ${item.name}`, item.sku, "1", qty >= item.limit),
      button("Remove", `Remove ${item.name} from bag`, item.sku, "remove"),
    );
    row.append(header, quantityControl);
    return row;
  }

  function renderBag() {
    let totalCount = 0;
    let total = 0;
    const rows = [];
    for (const [sku, qty] of bag) {
      const item = bySku.get(sku);
      totalCount += qty;
      total += item.cents * qty;
      rows.push(bagRow(item, qty));
    }
    list.replaceChildren(...rows);
    empty.hidden = totalCount > 0;
    controls.hidden = totalCount === 0;
    count.textContent = totalCount;
    subtotal.textContent = money(total);
  }

  function setQuantity(sku, quantity) {
    const item = bySku.get(sku);
    if (!item) return;
    const next = Math.min(Math.max(quantity, 0), item.limit);
    if (next === 0) {
      bag.delete(sku);
      status.textContent = `${item.name} removed.`;
    } else {
      bag.set(sku, next);
      status.textContent = next < quantity
        ? `${item.name} has a limit of ${item.limit} in this preview.`
        : `${next} × ${item.name} in your bag.`;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify([...bag]));
    } catch {
      // The current page's bag stays usable when the browser blocks persistence.
    }
    renderBag();
  }

  function showBag(previousFocus) {
    if (dialog.open) return;
    restoreFocus = previousFocus;
    dialog.showModal();
  }

  if (typeof dialog.showModal === "function") {
    trigger.hidden = false;
    renderBag();
    trigger.addEventListener("click", () => showBag(trigger));
    dialog.addEventListener("close", () => (restoreFocus?.isConnected ? restoreFocus : trigger).focus());
    document.querySelectorAll("[data-add]").forEach(control => {
      const variants = control.form?.elements.namedItem("sku");
      const price = control.form?.querySelector("[data-detail-price]");
      if (variants && price) {
        const showSelection = () => {
          const item = bySku.get(variants.value);
          price.textContent = money(item.cents);
          control.disabled = item.limit === 0;
          control.textContent = item.limit ? "Add to bag" : "Unavailable";
        };
        variants.addEventListener("change", showSelection);
        showSelection();
      }
      control.hidden = false;
      control.addEventListener("click", () => {
        const sku = variants?.value || control.dataset.add;
        setQuantity(sku, (bag.get(sku) || 0) + 1);
        showBag(control);
      });
    });
    list.addEventListener("click", event => {
      const clicked = event.target.closest("button[data-sku]");
      if (!clicked) return;
      const { sku, change } = clicked.dataset;
      setQuantity(sku, change === "remove" ? 0 : (bag.get(sku) || 0) + Number(change));
      const remaining = Array.from(list.querySelectorAll("button[data-sku]:enabled"))
        .filter(control => control.dataset.sku === sku);
      (remaining.find(control => control.dataset.change === change) || remaining[0] || close).focus();
    });
  }

  const filters = document.querySelector(".filters");
  if (filters) {
    filters.hidden = false;
    const buttons = Array.from(filters.querySelectorAll("button"));
    const cards = Array.from(document.querySelectorAll(".product-card"));
    const results = document.querySelector(".results");
    for (const control of buttons) {
      control.addEventListener("click", () => {
        const filter = control.dataset.filter;
        let visible = 0;
        for (const card of cards) {
          card.hidden = Boolean(filter && filter !== card.dataset.category);
          if (!card.hidden) visible++;
        }
        for (const item of buttons) item.setAttribute("aria-pressed", String(item === control));
        results.textContent = `${visible} ${visible === 1 ? "item" : "items"}`;
      });
    }
  }
})();
