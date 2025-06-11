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
    // Don't reload items here - use what was set in initializeCombobox
    const self = this;
    return new VanillaMachine(combobox.machine, {
      ...props,
      get collection() {
        return self.getCollection(self.options || []);
      },
      onOpenChange() {
        self.options = self.allItems;
        if (getString(self.el, "json") !== undefined) {
          self.renderOptions();
        } else {
          self.renderItems();
        }
      },
      onInputValueChange({ inputValue }) {
        if (!inputValue.trim()) {
          // Show all items when input is empty
          self.options = self.allItems;
        } else {
          const filter = createFilter({ sensitivity: "base", locale: "en-US" });
          const filtered = self.allItems.filter((item) =>
            filter.contains(item.label, inputValue)
          );
          self.options = filtered.length > 0 ? filtered : self.allItems;
        }
        
        if (getString(self.el, "json") !== undefined) {
          self.renderOptions();
        } else {
          self.renderItems();
        }      
      },
    });
  }

  initApi(): combobox.Api {
    return combobox.connect(this.machine.service, normalizeProps);
  }

  renderOptions() {
    const contentEl = this.el.querySelector('[data-part="content"]');
    if (!contentEl) return;
  
    const existingItems = Array.from(contentEl.querySelectorAll('[data-part="item"]')) as HTMLElement[];
  
    // If DOM nodes already exist, just update them
    if (existingItems.length === this.options.length) {
      for (let i = 0; i < existingItems.length; i++) {
        const el = existingItems[i];
        const item = this.options[i];
  
        el.textContent = item.label;
        el.setAttribute("data-label", item.label);
        el.setAttribute("data-code", item.code);
        spreadProps(el, this.api.getItemProps({ item }));
      }
    } else {
      // Fallback: rebuild the list if counts don’t match
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
  }

  renderItems() {
    const contentEl = this.el.querySelector('[data-part="content"]');
    if (!contentEl) return;
  
    const allDomItems = Array.from(contentEl.querySelectorAll('[data-part="item"]')) as HTMLElement[];
  
    allDomItems.forEach((el) => {
      const code = el.getAttribute("data-code");
      const match = this.options.find((item) => item.code === code);
  
      if (match) {
        el.style.display = "";
        spreadProps(el, this.api.getItemProps({ item: match }));
      } else {
        el.style.display = "none";
      }
    });
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
      this.renderOptions();
    } else {
      this.renderItems();
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
  document.addEventListener("DOMContentLoaded", initializeCombobox);
} else {
  initializeCombobox();
}