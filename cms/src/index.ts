import { fileOpen , fileSave } from 'https://unpkg.com/browser-nativefs';

export const myFunction = (f: any) => {
  console.log('Call myFunction', f);
};

const rootEl = document.getElementById("root");

const title = document.createElement('h1');
title.textContent = "Rifleros JSONs minimal CMS";
rootEl.appendChild(title);

const help = document.createElement('p');
help.textContent = 'Load a JSON data file to edit it\'s attributes. Check example file '
const example = 'https://raw.githubusercontent.com/carmon/rifles/main/data/vanilla/characters/fontana.json';
const link = document.createElement('a');
link.href = example;
link.target = '_blank';
link.textContent = 'here';
help.appendChild(link);

rootEl.appendChild(help);

if (window.isSecureContext) {
  const button = document.createElement('button');
  button.textContent = 'Open JSON';
  button.addEventListener('click', async _ => {
    button.disabled = true;
    button.textContent = 'Loading...';
    const file = await fileOpen({
      mimeTypes: ['application/json'],
      extensions: ['.json'],
      description: 'JSON data files',
    });

    const path = document.createElement('input');
    path.disabled = true;
    path.value = file.name;
    rootEl.appendChild(path);

    const json = await file.text();
    const obj = JSON.parse(json);
    const keys = Object.keys(obj);
    button.disabled = false;
    button.textContent = 'Open JSON';

    // Form
    const form = document.createElement('form');
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const res = keys.reduce((prev, curr) => ({
        ...prev,
        [curr]: form[curr].value,
      }), {});
      const blob = new Blob([JSON.stringify(res, null, 2)], {type : 'application/json'});
      await fileSave(blob, {
        fileName: file.name,
        extensions: ['.json']
      })
    };
    form.name = 'form';
    keys.forEach(k => {
      const label = document.createElement('label');
      label.htmlFor = k;
      label.textContent = `${k}: `;
      form.appendChild(label);
      const input = document.createElement('input');
      input.id = k;
      input.name = k;
      input.type = 'text';
      input.value = obj[k];
      form.appendChild(input);
      form.appendChild(document.createElement('br'));
    });
    const save = document.createElement('button');
    save.textContent = 'Save changes';
    save.type = 'submit';
    form.appendChild(save);
    rootEl.appendChild(form);
  });
  rootEl.appendChild(button);
}

console.log('Compiled JS loaded!');