import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSDOM } from 'jsdom';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
* Extracts HTML content from an element by ID and formats it
* @param {Document} document - DOM document
* @param {string} id - Element ID to extract content from
* @returns {string} Formatted HTML content
*/
const extractElementContent = (document, id) => {
 const element = document.getElementById(id);
 if (!element) return '';
 
 return element.innerHTML.trim()
   .split('\n')
   .map(line => line.trim())
   .filter(line => line.length > 0)
   .join('\n');
};

/**
* Extracts component data from an HTML file based on element IDs
* @param {string} htmlFile - Path to HTML file
* @param {string} componentPrefix - Prefix for element IDs (e.g., 'button-', 'tabs-')
* @param {string[]} sections - List of section names to extract
* @returns {Object} Component data object
*/
const extractComponentData = (htmlFile, componentPrefix, sections) => {
 const html = readFileSync(htmlFile, 'utf-8');
 const dom = new JSDOM(html);
 const document = dom.window.document;
 
 const data = {};
 
 sections.forEach(section => {
   const id = `${componentPrefix}${section}`;
   data[section] = extractElementContent(document, id);
 });
 
 return data;
};

const buttonSections = ['variant', 'color', 'font-color', 'size', 'idle', 'idle', 'shape', 'disabled', 'mix', 'custom', 'anatomy', 'rtl'];
const buttonData = extractComponentData('partials/main/button.html', 'button-', buttonSections);

const linkSections = ['font-color', 'size', 'mix', 'custom', 'anatomy', 'rtl'];
const linkData = extractComponentData('partials/main/link.html', 'link-', linkSections);

const tabsSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl'];
const tabsData = extractComponentData('partials/main/tabs.html', 'tabs-', tabsSections);

const toggleGroupSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl', 'duo'];
const toggleGroupData = extractComponentData('partials/main/toggle-group.html', 'toggle-group-', toggleGroupSections);

const menuSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl', 'group'];
const menuData = extractComponentData('partials/main/menu.html', 'menu-', menuSections);

const listboxSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl', 'group'];
const listboxData = extractComponentData('partials/main/listbox.html', 'listbox-', listboxSections);

const accordionSections = ['anatomy', 'attribute',  'callback', 'custom', 'rtl', 'disabled', 'orientation'];
const accordionData = extractComponentData('partials/main/accordion.html', 'accordion-', accordionSections);


const avatarSections = ['anatomy', 'attribute',  'callback', 'custom', 'rtl', 'font-color', 'color', 'size', 'mix', 'variant'];
const avatarData = extractComponentData('partials/main/avatar.html', 'avatar-', avatarSections);


const clipboardSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl', 'group'];
const clipboardData = extractComponentData('partials/main/clipboard.html', 'clipboard-', clipboardSections);

const treeViewSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl'];
const treeViewData = extractComponentData('partials/main/tree-view.html', 'tree-view-', treeViewSections);

const switcherSections = ['anatomy', 'attribute',  'callback', 'variant', 'color', 'size', 'mix', 'custom', 'rtl', 'example', 'duo'];
const switcherData = extractComponentData('partials/main/switcher.html', 'switcher-', switcherSections);

const dialogSections = ['anatomy', 'attribute', 'callback', 'state'];
const dialogData = extractComponentData('partials/main/dialog.html', 'dialog-', dialogSections);

const badgeSections = ['variant', 'color', 'font-color', 'size', 'idle', 'idle', 'shape', 'disabled', 'mix', 'custom', 'anatomy', 'rtl'];
const badgeData = extractComponentData('partials/main/badge.html', 'badge-', badgeSections);

const collapsibleSections = ['anatomy', 'attribute',  'callback', 'custom', 'rtl', 'font-color', 'color', 'size', 'mix', 'variant', 'state'];
const collapsibleData = extractComponentData('partials/main/collapsible.html', 'collapsible-', collapsibleSections);


const checkboxSections = ['anatomy', 'attribute', 'callback', 'state', 'form', 'custom', 'color','size','shape', 'mix'];
const checkboxData = extractComponentData('partials/main/checkbox.html', 'checkbox-', checkboxSections);


const switchSections = ['anatomy', 'attribute', 'callback', 'state', 'form', 'custom', 'color','size','shape', 'mix'];
const switchData = extractComponentData('partials/main/switch.html', 'switch-', switchSections);


const handlebarsHelpers = {
  eq: (a, b) => a === b
}

function getHtmlInputs(baseDir) {
  const inputMap = {};

  function walk(dir) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.html')) {
        const name = relative(baseDir, fullPath).replace(/\\/g, '/').replace(/\.html$/, '');
        inputMap[name] = fullPath;
      }
    }
  }

  walk(baseDir);
  return inputMap;
}

const corexHtmlInputs = getHtmlInputs(resolve(__dirname, 'corex'));

export default defineConfig({
  plugins: [
    {
      name: 'html-entry-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/corex') {
            res.writeHead(302, { Location: '/corex/documentation/introduction.html' });
            res.end();
            return;
          }
          next();
        });
      }
    },
    tailwindcss(),
    handlebars({
      helpers: handlebarsHelpers,
      partialDirectory: [resolve(__dirname, 'partials')],
      runtimeOptions: {
        data: {
          button: buttonData,
          badge: badgeData,
          tabs: tabsData,
          toggleGroup: toggleGroupData,
          treeView: treeViewData,
          switcher: switcherData,
          link: linkData,
          dialog: dialogData,
          menu: menuData,
          listbox: listboxData,
          clipboard: clipboardData,
          accordion: accordionData,
          avatar: avatarData,
          collapsible: collapsibleData,
          checkbox: checkboxData,
          switch: switchData





        }
      }
    })
  ],
  build: {
    cssMinify: false,
    rollupOptions: {
      input: {
        ...corexHtmlInputs,
        index: resolve(__dirname, 'index.html'), // if needed
        corex: resolve(__dirname, 'corex.html'), // if needed

      },
    },
  }
});
