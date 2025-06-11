import * as combobox from "@zag-js/combobox";

import {
  Component,
  VanillaMachine,
  generateId,
  normalizeProps,
  renderPart,
  spreadProps,
  getString
} from "@netoum/corex/lib";

import { createFilter } from "@zag-js/i18n-utils"


function loadJsonItems(path: string): Item[] {
  try {
    const script = document.querySelector(`script[type="application/json"][data-combobox="${path}"]`);
    if (!script) throw new Error(`No inline JSON script found for ${path}`);
    return JSON.parse(script.textContent || "[]");
  } catch (e) {
    console.error("Failed to load JSON items:", e);
    return [];
  }
}

function getDomItems(rootEl: HTMLElement): Array<{ label: string; code: string }> {
  const items: Array<{ label: string; code: string }> = [];
  rootEl.querySelectorAll('[data-part="item"]').forEach((el) => {
    const label = el.getAttribute("data-label") || el.textContent?.trim() || "";
    const code = el.getAttribute("data-code") || "";
    items.push({ label, code });
  });
  return items;
}

type Item = { label: string; code: string };

export class Combobox extends Component<combobox.Props, combobox.Api> {
  options: Item[] = [];
  allItems: Item[] = [];

  setItems(items: Item[]) {
    this.allItems = items;
    this.options = items;
  }

  getCollection(items: Item[]) {
    return combobox.collection({
      items,
      itemToValue: (item) => item.code,
      itemToString: (item) => item.label,
    });
  }

  initMachine(props: combobox.Props): VanillaMachine<any> {
    const items: Item[] = getDomItems(this.el);
    this.allItems = items;
    const self = this;
    return new VanillaMachine(combobox.machine, {
      ...props,
      get collection() {
        return self.getCollection(self.options || []);
      },
      onOpenChange() {
        self.options = self.allItems
        self.renderOptions();
      },
      onInputValueChange({ inputValue }) {
        const filter = createFilter({ sensitivity: "base", locale: "EN-US" });
        const filtered = self.allItems.filter((item) =>
          filter.contains(item.label, inputValue)
        );
        self.options = filtered.length > 0 ? filtered : self.allItems;
        self.renderOptions();
      },
    });
  }

  initApi(): combobox.Api {
    return combobox.connect(this.machine.service, normalizeProps);
  }

  renderOptions() {
    const contentEl = this.el.querySelector('[data-part="content"]');
    if (!contentEl) return;

    contentEl.innerHTML = "";
    for (const item of this.options) {
      const li = document.createElement("li");
      li.textContent = item.label;
      li.setAttribute("data-part", "item");
      li.setAttribute("data-label", item.label);
      li.setAttribute("data-code", item.code);
      spreadProps(li, this.api.getItemProps({ item }));
      contentEl.appendChild(li);
    }
  }

  renderItems() {
    const contentEl = this.el.querySelector('[data-part="content"]');
    if (!contentEl) return;
  
    const existingItems = Array.from(contentEl.querySelectorAll('[data-part="item"]')) as HTMLElement[];
    const total = this.options.length;
  
    // Update existing items
    for (let i = 0; i < total; i++) {
      const item = this.options[i];
      const li = existingItems[i];
  
      if (li) {
        // Update the existing item
        li.textContent = item.label;
        li.setAttribute("data-label", item.label);
        li.setAttribute("data-code", item.code);
        spreadProps(li, this.api.getItemProps({ item }));
      } else {
        // Create and append if it doesn't exist
        const newLi = document.createElement("li");
        newLi.textContent = item.label;
        newLi.setAttribute("data-part", "item");
        newLi.setAttribute("data-label", item.label);
        newLi.setAttribute("data-code", item.code);
        spreadProps(newLi, this.api.getItemProps({ item }));
        contentEl.appendChild(newLi);
      }
    }
  
    // Remove extra DOM nodes if options list is shorter
    for (let i = total; i < existingItems.length; i++) {
      existingItems[i].remove();
    }
  }
  

  render() {
    const parts = [
      "root",
      "label",
      "control",
      "input",
      "trigger",
      "positioner",
      "content",
      "clearTrigger",
      "itemGroup",
      "itemGroupLabel",
      "itemIndicator",
      "itemText",
      "list",

    ];
    for (const part of parts) {
      renderPart(this.el, part, this.api);
    }

    const jsonPath = getString(this.el, "json");
    if (jsonPath !== undefined) {
      this.renderItems();
    } else {
      this.renderOptions();
    }

  }
}

export function initializeCombobox(): void {
  document.querySelectorAll<HTMLElement>(".combobox-js").forEach((rootEl) => {
    let items: Item[];

    const jsonPath = getString(rootEl, "json");
    if (jsonPath !== undefined) {
      items = loadJsonItems(jsonPath);
    } else {
      items = getDomItems(rootEl);
    }

    const comboboxComponent = new Combobox(rootEl, {
      id: generateId(rootEl, "combobox"),
      placeholder: "Type or select country",
    });

    comboboxComponent.setItems(items);
    comboboxComponent.options = items;
    comboboxComponent.init();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCombobox)
} else {
  initializeCombobox()
}
