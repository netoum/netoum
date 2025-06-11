import * as combobox from "@zag-js/combobox";

import {
  Component,
  VanillaMachine,
  generateId,
  normalizeProps,
  renderPart,
  spreadProps,
} from "@netoum/corex/lib";

import { createFilter } from "@zag-js/i18n-utils"


// function getDomItems(rootEl: HTMLElement): Array<{ label: string; code: string }> {
//   const items: Array<{ label: string; code: string }> = [];
//   rootEl.querySelectorAll('[data-part="item"]').forEach((el) => {
//     const label = el.getAttribute("data-label") || el.textContent?.trim() || "";
//     const code = el.getAttribute("data-code") || "";
//     items.push({ label, code });
//   });
//   return items;
// }

type Item = { label: string; code: string };

const comboboxData = [
  { label: "Zambia", code: "ZA" },
  { label: "Benin", code: "BN" },
]
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
    const self = this;
    return new VanillaMachine(combobox.machine, {
      ...props,
      get collection() {
        return self.getCollection(self.options || comboboxData)
      },
      onOpenChange() {
        self.options = comboboxData
        self.renderOptions();
      },
      onInputValueChange({ inputValue }) {
        const filter = createFilter({ sensitivity: "base" });
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

  render() {
    const parts = [
      "root",
      "label",
      "control",
      "input",
      "trigger",
      "positioner",
      "content",
    ];
    for (const part of parts) {
      renderPart(this.el, part, this.api);
    }

    this.renderOptions();
  }
}

export function initializeCombobox(): void {
  document.querySelectorAll<HTMLElement>(".combobox-js").forEach((rootEl) => {
    const items: Item[] = [
      { label: "Nigeria", code: "ng" },
      { label: "Ghana", code: "gh" },
      { label: "Kenya", code: "ke" },
    ];

    const comboboxComponent = new Combobox(rootEl, {
      id: generateId(rootEl, "combobox"),
      placeholder: "Type or select country",
    });

    comboboxComponent.setItems(items);
    comboboxComponent.init();
    console.log(comboboxComponent)
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCombobox)
} else {
  initializeCombobox()
}
