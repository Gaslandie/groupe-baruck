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
