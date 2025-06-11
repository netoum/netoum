import "@netoum/corex"
import "./main.css";

import { initializeSiteSearch } from "@netoum/corex/components/site-search";

if (import.meta.env?.VITE_PAGEFIND === "true") {
  (async () => {
    try {
      // @ts-ignore
      const pagefind = await import("../dist/corex/pagefind/pagefind.js");

      await pagefind.options({
        bundlePath: "../dist/corex/pagefind/pagefind.js",
        baseUrl: "/corex",
      });
      await pagefind.init();
      initializeSiteSearch(pagefind);
    } catch (error) {
      console.error("Failed to initialize Pagefind:", error);
    }
  })();
}

document.getElementById("my-callback-dialog")
  ?.addEventListener("my-callback-dialog-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-tabs")
  ?.addEventListener("my-callback-tabs-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-toggle-group")
  ?.addEventListener("my-callback-toggle-group-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-tree-view")
  ?.addEventListener("my-callback-tree-view-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-menu")
  ?.addEventListener("my-callback-menu-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-clipboard")
  ?.addEventListener("my-callback-clipboard-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-listbox")
  ?.addEventListener("my-callback-listbox-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-accordion")
  ?.addEventListener("my-callback-accordion-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-collapsible")
  ?.addEventListener("my-callback-collapsible-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-checkbox")
  ?.addEventListener("my-callback-checkbox-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-switch")
  ?.addEventListener("my-callback-switch-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-date-picker")
  ?.addEventListener("my-callback-date-picker-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("my-callback-timer")
  ?.addEventListener("my-callback-timer-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
  document.getElementById("my-callback-combobox")
  ?.addEventListener("my-callback-combobox-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
document.getElementById("mode-switcher-demo")?.addEventListener("update-mode-switcher", (event) => {
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  const targetEl = document.getElementById("mode-switcher-side");
  if (targetEl && targetEl !== event.target) {
    targetEl.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
  const targetEl2 = document.getElementById("mode-switcher-header");
  if (targetEl2 && targetEl2 !== event.target) {
    targetEl2.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
});
document.getElementById("mode-switcher-side")?.addEventListener("update-mode-switcher", (event) => {
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  const targetEl = document.getElementById("mode-switcher-demo");
  if (targetEl && targetEl !== event.target) {
    targetEl.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
  const targetEl2 = document.getElementById("mode-switcher-header");
  if (targetEl2 && targetEl2 !== event.target) {
    targetEl2.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
});
document.getElementById("mode-switcher-header")?.addEventListener("update-mode-switcher", (event) => {
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  const targetEl = document.getElementById("mode-switcher-demo");
  if (targetEl && targetEl !== event.target) {
    targetEl.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
  const targetEl2 = document.getElementById("mode-switcher-side");
  if (targetEl2 && targetEl2 !== event.target) {
    targetEl2.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
});
document.getElementById("theme-switcher-header")?.addEventListener("update-theme-switcher-side", (event) => {
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  const targetEl = document.getElementById("theme-switcher-side");
  if (targetEl && targetEl !== event.target) {
    targetEl.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
});
document.getElementById("theme-switcher-side")?.addEventListener("update-theme-switcher-header", (event) => {
  console.log("sfd")
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  const targetEl = document.getElementById("theme-switcher-header");
  if (targetEl && targetEl !== event.target) {
    console.log(targetEl)
    targetEl.dispatchEvent(new CustomEvent("switcher:set-value", {
      detail: { value }
    }));
  }
});
document.getElementById("timer-2")
  ?.addEventListener("timer-done-event", (event) => {
    console.log("Received event:", (event as CustomEvent).detail);
  });
const form = document.getElementById('my-form') as HTMLFormElement | null;
const result = document.getElementById('result') as HTMLDivElement | null;
if (form && result) {
  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newsletter = (formData.get('newsletter') as string) || 'no';
    result.textContent = `Submitted: newsletter: ${newsletter}`;
  });
}
const formBirth = document.getElementById('my-form-birth') as HTMLFormElement | null;
const resultBirth = document.getElementById('result') as HTMLDivElement | null;
if (formBirth && resultBirth) {
  formBirth.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(formBirth);
    const dateOfBirth = (formData.get('date-of-birth') as string);
    resultBirth.textContent = `Submitted: birth day: ${dateOfBirth}`;
  });
}

const formFlight = document.getElementById('my-form-flight') as HTMLFormElement | null;
const resultFlight  = document.getElementById('result-flight') as HTMLDivElement | null;
if (formFlight  && resultFlight ) {
  formFlight.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(formFlight );
    const dep = (formData.get('departure') as string);
    const ret = (formData.get('return') as string);
    resultFlight.textContent = `Submitted: departure: ${dep} and return: ${ret}`;
  });
}

const formCurrency = document.getElementById('my-form') as HTMLFormElement | null;
const resultCurrency  = document.getElementById('result') as HTMLDivElement | null;

if (formCurrency && resultCurrency) {
  formCurrency.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(formCurrency);
    const currency = (formData.get('currency') as string) || 'none';
    resultCurrency.textContent = `Submitted currency: ${currency}`;
  });
}