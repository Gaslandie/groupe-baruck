(() => {
  const form = document.querySelector('[data-page-editor]');
  const validation = document.querySelector('#page-validate-form');
  if (!form || !validation) return;
  const button = validation.querySelector('[data-page-validate]');
  const review = validation.querySelector('[name=english_reviewed]');
  const message = document.querySelector('#page-unsaved');
  const unrecorded = form.dataset.unrecorded === 'true';
  const values = () => new URLSearchParams(new FormData(form)).toString();
  const initial = values();
  let controlId = 0;
  function rename(root, before, after) {
    for (const element of root.querySelectorAll('[name], [data-list-name], [data-item-prefix]')) {
      for (const attribute of ['name','data-list-name','data-item-prefix']) {
        const value = element.getAttribute(attribute);
        if (value?.startsWith(before)) element.setAttribute(attribute, after + value.slice(before.length));
      }
    }
    for (const template of root.querySelectorAll('template')) rename(template.content, before, after);
  }
  function renumber(list) {
    const rows = [...list.querySelector(':scope > [data-list-items]').children];
    rows.forEach((row,index) => {
      const before = row.dataset.itemPrefix;
      const after = `${list.dataset.listName}[${index}]`;
      rename(row,before,after); row.dataset.itemPrefix = after;
      row.querySelector(':scope > div:last-child > [data-list-up]').disabled = index === 0;
      row.querySelector(':scope > div:last-child > [data-list-down]').disabled = index === rows.length - 1;
    });
    list.querySelector(':scope > [data-list-add]').disabled = rows.length >= Number(list.dataset.max);
    list.querySelector(':scope > [data-list-status]').textContent = `${rows.length} élément(s) sur ${list.dataset.max}.`;
  }
  form.addEventListener('click', event => {
    const button = event.target.closest('[data-list-add], [data-list-up], [data-list-down], [data-list-remove]');
    if (!button) return;
    const list = button.closest('[data-page-list]');
    const items = list.querySelector(':scope > [data-list-items]');
    const row = button.closest('[data-list-item]');
    if (button.hasAttribute('data-list-add')) {
      if (items.children.length >= Number(list.dataset.max)) return;
      const added = list.querySelector(':scope > template').content.firstElementChild.cloneNode(true);
      for (const input of added.querySelectorAll('input[id],textarea[id],select[id]')) {
        const label = [...added.querySelectorAll('label')].find(label => label.htmlFor === input.id);
        input.id = 'page-added-' + (++controlId); if (label) label.htmlFor = input.id;
      }
      items.append(added); renumber(list);
      added.querySelector('input:not([type=hidden]),textarea,select,button')?.focus();
    } else if (button.hasAttribute('data-list-remove')) { row.remove(); renumber(list); list.querySelector(':scope > [data-list-add]').focus(); }
    else if (button.hasAttribute('data-list-up') && row.previousElementSibling) { items.insertBefore(row,row.previousElementSibling); renumber(list); button.focus(); }
    else if (button.hasAttribute('data-list-down') && row.nextElementSibling) { items.insertBefore(row.nextElementSibling,row); renumber(list); button.focus(); }
    for (const nested of list.querySelectorAll('[data-page-list]')) renumber(nested);
    form.dispatchEvent(new Event('input', {bubbles:true}));
  });
  for (const list of form.querySelectorAll('[data-page-list]')) renumber(list);
  let submitting = false;
  const dirty = () => unrecorded || values() !== initial;
  form.addEventListener('input', () => {
    const changed = dirty();
    button.disabled = changed;
    message.hidden = !changed;
    review.checked = false;
  });
  for (const element of [form, validation]) element.addEventListener('submit', () => { submitting = true; });
  window.addEventListener('beforeunload', event => {
    if (!submitting && dirty()) { event.preventDefault(); event.returnValue = ''; }
  });
})();
