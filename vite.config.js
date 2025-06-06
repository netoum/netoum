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
* Discovers all sections for a component by scanning the HTML file for elements with the component prefix
* @param {string} htmlFile - Path to HTML file
* @param {string} componentPrefix - Prefix for element IDs (e.g., 'button-', 'tabs-')
* @returns {string[]} Array of discovered section names
*/
const discoverComponentSections = (htmlFile, componentPrefix) => {
 try {
   const html = readFileSync(htmlFile, 'utf-8');
   const dom = new JSDOM(html);
   const document = dom.window.document;
   
   const sections = [];
   const elements = document.querySelectorAll(`[id^="${componentPrefix}"]`);
   
   elements.forEach(element => {
     const id = element.id;
     if (id.startsWith(componentPrefix)) {
       const section = id.substring(componentPrefix.length);
       if (section && !sections.includes(section)) {
         sections.push(section);
       }
     }
   });
   
   return sections.sort(); // Sort for consistency
 } catch (error) {
   console.warn(`Could not read or parse ${htmlFile}:`, error.message);
   return [];
 }
};

/**
* Extracts component data from an HTML file by discovering and extracting all sections
* @param {string} htmlFile - Path to HTML file
* @param {string} componentPrefix - Prefix for element IDs (e.g., 'button-', 'tabs-')
* @returns {Object} Component data object
*/
const extractComponentData = (htmlFile, componentPrefix) => {
 const sections = discoverComponentSections(htmlFile, componentPrefix);
 
 if (sections.length === 0) {
   console.warn(`No sections found for component with prefix "${componentPrefix}" in ${htmlFile}`);
   return {};
 }
 
 const html = readFileSync(htmlFile, 'utf-8');
 const dom = new JSDOM(html);
 const document = dom.window.document;
 
 const data = {};
 
 sections.forEach(section => {
   const id = `${componentPrefix}${section}`;
   const content = extractElementContent(document, id);
   if (content) { // Only add non-empty content
     data[section] = content;
   }
 });
 
 return data;
};

/**
* Dynamically extracts data for all components
* @returns {Object} Object containing all component data
*/
const extractAllComponentData = () => {
 const components = [
   { name: 'button', file: 'partials/main/button.html', prefix: 'button-' },
   { name: 'badge', file: 'partials/main/badge.html', prefix: 'badge-' },
   { name: 'tabs', file: 'partials/main/tabs.html', prefix: 'tabs-' },
   { name: 'toggleGroup', file: 'partials/main/toggle-group.html', prefix: 'toggle-group-' },
   { name: 'treeView', file: 'partials/main/tree-view.html', prefix: 'tree-view-' },
   { name: 'switcher', file: 'partials/main/switcher.html', prefix: 'switcher-' },
   { name: 'link', file: 'partials/main/link.html', prefix: 'link-' },
   { name: 'dialog', file: 'partials/main/dialog.html', prefix: 'dialog-' },
   { name: 'menu', file: 'partials/main/menu.html', prefix: 'menu-' },
   { name: 'listbox', file: 'partials/main/listbox.html', prefix: 'listbox-' },
   { name: 'clipboard', file: 'partials/main/clipboard.html', prefix: 'clipboard-' },
   { name: 'accordion', file: 'partials/main/accordion.html', prefix: 'accordion-' },
   { name: 'avatar', file: 'partials/main/avatar.html', prefix: 'avatar-' },
   { name: 'collapsible', file: 'partials/main/collapsible.html', prefix: 'collapsible-' },
   { name: 'checkbox', file: 'partials/main/checkbox.html', prefix: 'checkbox-' },
   { name: 'switch', file: 'partials/main/switch.html', prefix: 'switch-' },
   { name: 'scrollbar', file: 'partials/main/scrollbar.html', prefix: 'scrollbar-' },
   { name: 'code', file: 'partials/main/code.html', prefix: 'code-' },
   { name: 'timer', file: 'partials/main/timer.html', prefix: 'timer-' },
   { name: 'datePicker', file: 'partials/main/date-picker.html', prefix: 'date-picker-' },
   { name: 'typo', file: 'partials/main/typo.html', prefix: 'typo-' },


 ];

 const allComponentData = {};
 
 components.forEach(({ name, file, prefix }) => {
   try {
     const data = extractComponentData(file, prefix);
     allComponentData[name] = data;
     
     // Log discovered sections for debugging
     const sections = Object.keys(data);
     if (sections.length > 0) {
       console.log(`${name}: found sections [${sections.join(', ')}]`);
     }
   } catch (error) {
     console.warn(`Failed to extract data for ${name}:`, error.message);
     allComponentData[name] = {};
   }
 });
 
 return allComponentData;
};

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

// Extract all component data dynamically
const componentData = extractAllComponentData();

export default defineConfig({
  base: '/',
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
        data: componentData
      }
    })
  ],
  build: {
    cssMinify: true,
    rollupOptions: {
      input: {
        ...corexHtmlInputs,
        index: resolve(__dirname, 'index.html'), // if needed
        corex: resolve(__dirname, 'corex.html'), // if needed
      },
    },
  }
});