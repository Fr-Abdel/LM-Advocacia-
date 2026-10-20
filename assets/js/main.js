/* Funcionalidades progressivas. Nenhum dado é enviado ou persistido. */
(() => {
  'use strict';
  const AREAS = Object.freeze({
    civil: 'Direito Civil e Contratos',
    familia: 'Família e Sucessões',
    empresarial: 'Direito Empresarial',
    consumidor: 'Relações de Consumo',
    outro: 'Outro assunto'
  });

  function validateContact(data) {
    const errors = {};
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();
    if (name.length < 2 || name.length > 80) errors.name = 'Informe um nome fictício entre 2 e 80 caracteres.';
    // Validação de formato para a demo; não verifica existência do endereço.
    if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Use um e-mail de exemplo, como pessoa@example.com.';
    if (!Object.hasOwn(AREAS, data.area)) errors.area = 'Selecione uma das áreas disponíveis.';
    if (message.length < 20 || message.length > 1000) errors.message = 'Escreva uma mensagem entre 20 e 1.000 caracteres.';
    if (data.consent !== true) errors.consent = 'Confirme que compreende o caráter demonstrativo.';
    return errors;
  }

  function formatPreview(data) {
    return [
      'PRÉVIA DEMONSTRATIVA — SEM ENVIO',
      `Nome: ${data.name.trim()}`,
      `E-mail: ${data.email.trim()}`,
      `Assunto: ${AREAS[data.area]}`,
      '',
      data.message.trim()
    ].join('\n');
  }

  function initMenu() {
    const button = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#navegacao');
    if (!button || !nav) return;
    document.documentElement.classList.add('js');
    button.hidden = false;
    const breakpoint = window.matchMedia('(max-width: 760px)');
    // Ao ocultar a navegação, o navegador pode perder o foco antes do evento
    // de matchMedia. Preserva a origem para devolver foco ao controle visível.
    let navHadFocus = false;
    document.addEventListener('focusin', (event) => {
      if (event.target !== document.body && event.target !== document.documentElement) {
        navHadFocus = nav.contains(event.target);
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (!nav.contains(event.target)) navHadFocus = false;
    });
    function closeMenu(restoreFocus = false) {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      if (restoreFocus) button.focus();
    }
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && breakpoint.matches) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && breakpoint.matches && button.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    breakpoint.addEventListener('change', () => {
      const focusWasInNav = nav.contains(document.activeElement) || navHadFocus;
      closeMenu(breakpoint.matches && focusWasInNav);
    });
  }

  function initContact() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    const fields = document.querySelector('#contact-fields');
    const summary = document.querySelector('#error-summary');
    const result = document.querySelector('#contact-result');
    const preview = document.querySelector('#message-preview');
    const copyButton = document.querySelector('#copy-message');
    const copyStatus = document.querySelector('#copy-status');
    const ids = ['name', 'email', 'area', 'message', 'consent'];
    let attempted = false;
    let generation = 0;

    function readData() {
      return Object.fromEntries(ids.map((id) => [id, id === 'consent' ? form.elements[id].checked : form.elements[id].value]));
    }
    function renderErrors(errors) {
      ids.forEach((id) => {
        const field = form.elements[id];
        document.getElementById(`${id}-error`).textContent = errors[id] || '';
        if (errors[id]) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      });
      summary.replaceChildren();
      const entries = Object.entries(errors);
      summary.hidden = entries.length === 0;
      if (!entries.length) return;
      const title = document.createElement('p');
      title.textContent = 'Revise os campos para gerar a prévia:';
      const list = document.createElement('ul');
      entries.forEach(([id, message]) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = message;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          form.elements[id].focus();
        });
        item.append(link);
        list.append(item);
      });
      summary.append(title, list);
    }
    const initialArea = new URLSearchParams(window.location.search).get('area');
    if (Object.hasOwn(AREAS, initialArea)) form.elements.area.value = initialArea;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      attempted = true;
      const data = readData();
      const errors = validateContact(data);
      renderErrors(errors);
      if (Object.keys(errors).length) {
        summary.focus();
        return;
      }
      // textContent mantém qualquer conteúdo digitado como texto, nunca HTML.
      preview.textContent = formatPreview(data);
      copyStatus.textContent = '';
      form.hidden = true;
      result.hidden = false;
      result.focus();
    });
    form.addEventListener('input', () => {
      if (attempted) renderErrors(validateContact(readData()));
    });
    document.querySelector('#edit-message').addEventListener('click', () => {
      generation++;
      result.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
    document.querySelector('#new-message').addEventListener('click', () => {
      generation++;
      form.reset();
      attempted = false;
      renderErrors({});
      preview.textContent = '';
      copyStatus.textContent = '';
      result.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      copyButton.hidden = false;
      copyButton.addEventListener('click', async () => {
        const current = ++generation;
        try {
          await navigator.clipboard.writeText(preview.textContent);
          if (current === generation) copyStatus.textContent = 'Prévia copiada. Nenhuma mensagem foi enviada.';
        } catch {
          if (current === generation) copyStatus.textContent = 'Não foi possível copiar. Selecione o texto da prévia e copie manualmente.';
        }
      });
    }
    // Ativa o formulário somente após registrar os manipuladores de segurança.
    form.noValidate = true;
    fields.disabled = false;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateContact, formatPreview, AREAS };
  }
  if (typeof document !== 'undefined') {
    initMenu();
    initContact();
  }
})();
