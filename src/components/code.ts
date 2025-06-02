import Prism from "prismjs";

import { getString } from  "@netoum/corex/lib";

export class Code {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  init(): void {
    const lang = getString(this.el, "lang");

    if (lang && !this.el.classList.contains(`language-${lang}`)) {
      this.el.classList.add(`language-${lang}`);
    }

    Prism.highlightElement(this.el);
  }
}

/**
 * Initialize all code blocks on the page
 */
export function initializeCode(): void {
  document.querySelectorAll<HTMLElement>(".code-js").forEach((codeEl) => {
    const code = new Code(codeEl);
    code.init();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCode);
} else {
  initializeCode();
}
