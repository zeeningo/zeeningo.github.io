document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  // "Send an inquiry" buttons: preselect the matching topic in the contact form
  var form = document.getElementById('contact-form');
  var topicSelect = form ? form.querySelector('select[name="topic"]') : null;

  document.querySelectorAll('a[data-topic]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (topicSelect) topicSelect.value = link.getAttribute('data-topic');
    });
  });

  // Contact form: send via FormSubmit without leaving the page
  if (form && window.fetch) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var fallback = 'Sorry, something went wrong. Please email oyamovement@gmail.com directly.';

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      status.classList.remove('is-error');
      status.textContent = 'Sending…';
      button.disabled = true;

      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (String(data.success) === 'true') {
            form.reset();
            status.textContent = 'Thank you! Your message was sent — Zee will be in touch soon.';
          } else {
            throw new Error(data.message || 'Send failed');
          }
        })
        .catch(function () {
          status.classList.add('is-error');
          status.textContent = fallback;
        })
        .then(function () { button.disabled = false; });
    });
  }
});
