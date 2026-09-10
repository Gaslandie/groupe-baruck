(() => {
  const confirmDialog = document.querySelector('#confirm-dialog');
  let pending = null;
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.open);
      if (dialog?.showModal) { dialog.showModal(); dialog.querySelector('input:not([type=hidden]), select, textarea')?.focus(); }
      return;
    }
    if (event.target.closest('[data-close]')) event.target.closest('dialog')?.close();
  });
  for (const dialog of document.querySelectorAll('dialog[data-dialog]')) {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    if (dialog.hasAttribute('data-open-on-load') && dialog.showModal) dialog.showModal();
  }
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.dataset.confirm || !confirmDialog?.showModal || form === pending) return;
    event.preventDefault();
    pending = form;
    confirmDialog.querySelector('#confirm-title').textContent = form.dataset.confirmTitle || 'Confirmer';
    confirmDialog.querySelector('#confirm-text').textContent = form.dataset.confirm;
    confirmDialog.querySelector('#confirm-accept').textContent = form.dataset.confirmLabel || 'Confirmer';
    confirmDialog.showModal();
  });
  confirmDialog?.querySelector('#confirm-accept').addEventListener('click', () => {
    const form = pending;
    confirmDialog.close();
    if (form) HTMLFormElement.prototype.submit.call(form);
  });
  confirmDialog?.addEventListener('close', () => { pending = null; });
})();
