/* KTech Solutions — interactions (léger, sans dépendance) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* === CONFIG ===
     FORM_ENDPOINT : URL d'un service de formulaire (Formspree, Getform, votre API…).
     Laisser vide tant qu'aucun service n'est branché : le formulaire est validé
     puis un message de confirmation s'affiche, sans envoi réel. */
  var FORM_ENDPOINT = '';

  /* Header : bordure au scroll */
  var header = document.querySelector('.header');
  var onScroll = function () { header && header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  var btn = document.querySelector('.menu-btn'), mnav = document.getElementById('mobile-nav');
  if (btn && mnav) {
    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      mnav.classList.toggle('open', open);
      mnav.toggleAttribute('inert', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    mnav.setAttribute('inert', '');
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('open')) { setOpen(false); btn.focus(); } });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* Apparitions au scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  /* Filtres portfolio */
  document.querySelectorAll('[data-filters]').forEach(function (bar) {
    var grid = document.getElementById(bar.dataset.filters);
    var empty = grid && grid.parentElement.querySelector('.empty');
    var status = document.getElementById(bar.dataset.filters + '-status');
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.filter'); if (!b) return;
      bar.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var f = b.dataset.filter, n = 0;
      grid.querySelectorAll('.work').forEach(function (w) {
        var show = f === 'all' || w.dataset.cat.split(' ').indexOf(f) > -1;
        w.hidden = !show; if (show) n++;
      });
      if (empty) empty.hidden = n > 0;
      if (status) status.textContent = n + ' réalisation' + (n > 1 ? 's' : '') + ' affichée' + (n > 1 ? 's' : '');
    });
  });

  /* Fiche détaillée d'une réalisation */
  var dlg = document.getElementById('case');
  if (dlg) {
    var last;
    document.addEventListener('click', function (e) {
      var w = e.target.closest('.work[data-title]'); if (!w) return;
      last = w;
      var d = w.dataset;
      dlg.querySelector('.case-media .art').className = 'art ' + d.art;
      dlg.querySelector('[data-k=cat]').textContent = d.label;
      dlg.querySelector('[data-k=title]').textContent = d.title;
      ['context', 'need', 'solution', 'deliverables', 'results'].forEach(function (k) {
        dlg.querySelector('[data-k=' + k + ']').textContent = d[k] || 'À venir';
      });
      dlg.showModal();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.case-close')) dlg.close(); });
    dlg.addEventListener('close', function () { last && last.focus(); });
  }

  /* Formulaires : validation au blur, effacement immédiat de l'erreur */
  document.querySelectorAll('form.form').forEach(function (form) {
    var check = function (input) {
      var field = input.closest('.field'); if (!field) return true;
      var ok = input.checkValidity();
      field.classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', !ok);
      return ok;
    };
    form.querySelectorAll('.input').forEach(function (i) {
      i.addEventListener('blur', function () { if (i.value) check(i); });
      i.addEventListener('input', function () { if (i.closest('.field').classList.contains('invalid')) check(i); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      form.querySelectorAll('.input').forEach(function (i) { if (!check(i) && !first) first = i; });
      if (first) { first.focus(); return; }
      var submit = form.querySelector('[type=submit]'), label = submit.innerHTML;
      submit.disabled = true; submit.textContent = 'Envoi en cours…';
      var done = function () { form.classList.add('sent'); var s = form.nextElementSibling; s && s.focus(); };
      if (!FORM_ENDPOINT) { setTimeout(done, 500); return; }
      fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; done(); })
        .catch(function () {
          submit.disabled = false; submit.innerHTML = label;
          var err = form.querySelector('.form-error');
          if (err) err.hidden = false;
        });
    });
  });

  /* Pré-sélection du service via ?service=… (liens "Demander un devis") */
  var p = new URLSearchParams(location.search).get('service');
  var sel = document.getElementById('service');
  if (p && sel) { for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === p) sel.selectedIndex = i; }
})();
