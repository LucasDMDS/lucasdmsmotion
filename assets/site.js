/* LDMSMotion — site.js (compartilhado pelas 4 páginas)
   Os IDs do Google Ads e o endpoint do formulário ficam em assets/config.js */
(function () {
  'use strict';

  var CFG  = window.SITE_CONFIG || {};
  var LANG = (document.documentElement.lang || 'pt').slice(0, 2) === 'en' ? 'en' : 'pt';
  var EMAIL = CFG.CONTACT_EMAIL || 'ldms.motion@gmail.com';

  var T = {
    pt: { sending: '▶ Enviando...', send: '▶ Enviar', ok: '✓ Mensagem enviada com sucesso!',
          err: '✕ Erro ao enviar. Tente novamente ou escreva para ', reel: 'Reproduzir Motion Reel 2026',
          vhsOn: '◼ VHS OFF', vhsOff: '▶ VHS', subject: 'Novo contato pelo site' },
    en: { sending: '▶ Sending...', send: '▶ Send', ok: '✓ Message sent successfully!',
          err: '✕ Error sending. Please try again or write to ', reel: 'Play Motion Reel 2026',
          vhsOn: '◼ VHS OFF', vhsOff: '▶ VHS', subject: 'New contact from the website' }
  }[LANG];

  function log() {
    if (window.console && console.info) {
      console.info.apply(console, ['[LDMS]'].concat([].slice.call(arguments)));
    }
  }

  /* ── Google tag (Google Ads) ───────────────────────────────────────────────
     Só é carregada se GOOGLE_ADS_ID estiver preenchido com um ID válido. */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }   // precisa usar "arguments"
  window.gtag = gtag;

  var ADS_ID = CFG.GOOGLE_ADS_ID || '';
  var ADS_OK = /^AW-\d{6,}$/.test(ADS_ID);

  if (ADS_OK) {
    gtag('js', new Date());
    gtag('config', ADS_ID);
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS_ID);
    document.head.appendChild(gs);
  } else {
    log('Google Ads NÃO configurado (edite assets/config.js). Nenhuma conversão será enviada.');
  }

  function labelOk(l) { return typeof l === 'string' && /^[A-Za-z0-9_-]{8,}$/.test(l) && !/X{4,}/i.test(l); }

  /* Dispara uma conversão do Google Ads. Retorna true se enviou. */
  function track(name, label) {
    if (!ADS_OK || !labelOk(label)) {
      log('Conversão "' + name + '" NÃO enviada: ID ou rótulo não configurados em assets/config.js');
      return false;
    }
    var sendTo = ADS_ID + '/' + label;
    gtag('event', 'conversion', { send_to: sendTo });
    log('Conversão "' + name + '" enviada →', sendTo);
    return true;
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {

    /* ── E-mail do rodapé vindo da configuração ── */
    [].forEach.call(document.querySelectorAll('[data-email]'), function (el) {
      el.textContent = EMAIL;
      if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + EMAIL);
    });

    /* ── Parallax do fundo ── */
    var pbg = document.getElementById('parallax-bg');
    var raf;
    if (pbg) {
      window.addEventListener('scroll', function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var off = window.scrollY * 0.12;
          pbg.style.transform = 'scale(1.15) translateY(-' + off + 'px)';
          pbg.style.setProperty('--py', '-' + off + 'px');
        });
      }, { passive: true });
    }

    /* ── Entrada suave dos itens da galeria ── */
    var items = document.querySelectorAll('.gallery-item');
    if ('IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      [].forEach.call(items, function (el) { revealIO.observe(el); });
    } else {
      [].forEach.call(items, function (el) { el.classList.add('visible'); });
    }

    /* ── Prévias de vídeo: carregam só perto da tela e descarregam ao se afastar ── */
    var previews = [].slice.call(document.querySelectorAll('iframe[data-preview]'));
    var saveData = navigator.connection && navigator.connection.saveData;
    function loadPrev(f)   { var u = f.getAttribute('data-preview'); if (f.getAttribute('src') !== u) f.setAttribute('src', u); }
    function unloadPrev(f) { if (f.getAttribute('src') && f.getAttribute('src') !== 'about:blank') f.setAttribute('src', 'about:blank'); }
    if (previews.length && !saveData) {
      if ('IntersectionObserver' in window) {
        var loadIO = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) loadPrev(e.target); });
        }, { rootMargin: '300px 0px' });
        var unloadIO = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (!e.isIntersecting) unloadPrev(e.target); });
        }, { rootMargin: '1500px 0px' });
        previews.forEach(function (f) { loadIO.observe(f); unloadIO.observe(f); });
      } else {
        previews.forEach(loadPrev);
      }
    }

    /* ── Vídeo principal: só carrega o player do YouTube quando clicar ── */
    [].forEach.call(document.querySelectorAll('.yt-facade'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-yt');
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&modestbranding=1';
        f.title = T.reel;
        f.setAttribute('allow', 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen');
        f.setAttribute('allowfullscreen', '');
        b.parentNode.replaceChild(f, b);
      });
    });

    /* ── Janela (modal) de vídeo ── */
    var modal = document.getElementById('modal');
    var modalVideo = document.getElementById('modal-video');
    window.openModal = function (src) {
      modalVideo.innerHTML = '<iframe src="' + src + '" allow="autoplay;fullscreen" allowfullscreen></iframe>';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    window.closeModal = function () {
      modalVideo.innerHTML = '';
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    [].forEach.call(document.querySelectorAll('[data-src]'), function (el) {
      el.addEventListener('click', function () { if (el.dataset.src) window.openModal(el.dataset.src); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.closeModal(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) window.closeModal(); });

    /* ── Botão VHS ── */
    window.toggleVHS = function () {
      document.body.classList.toggle('vhs');
      document.getElementById('vhsBtn').textContent =
        document.body.classList.contains('vhs') ? T.vhsOn : T.vhsOff;
    };

    /* ── Menu mobile (sanduíche) ── */
    var ham = document.getElementById('hamburger');
    var mNav = document.getElementById('mobileNav');
    var backdrop = document.getElementById('navBackdrop');
    function closeNav() {
      ham.classList.remove('open'); mNav.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }
    function openNav() {
      ham.classList.add('open'); mNav.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    }
    if (ham && mNav) {
      ham.addEventListener('click', function () { mNav.classList.contains('open') ? closeNav() : openNav(); });
      [].forEach.call(mNav.querySelectorAll('a'), function (a) { a.addEventListener('click', closeNav); });
      if (backdrop) backdrop.addEventListener('click', closeNav);
    }

    /* ── Botão do WhatsApp → conversão ── */
    var wa = document.getElementById('waBtn');
    if (wa) wa.addEventListener('click', function () { track('whatsapp', CFG.LABEL_WHATSAPP); });

    /* ── Formulário de contato ── */
    var form = document.getElementById('contactForm');
    if (form) {
      var btn = document.getElementById('submitBtn');
      var fb  = document.getElementById('formFeedback');
      var endpointOk = /^https:\/\/\S+$/.test(CFG.FORMSPREE_URL || '') && !/X{4,}/i.test(CFG.FORMSPREE_URL || '');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(form);
        if (data.get('_gotcha')) return;                    // robô: ignora em silêncio

        var nome = data.get('nome') || data.get('name') || '';
        var tipo = data.get('tipo_de_projeto') || data.get('project_type') || '';
        var msg  = data.get('mensagem') || data.get('message') || '';
        var mail = data.get('email') || '';

        /* Plano B: endpoint ainda não configurado → abre o programa de e-mail */
        if (!endpointOk) {
          log('FORMSPREE_URL não configurado em assets/config.js — usando mailto como plano B.');
          window.location.href = 'mailto:' + EMAIL + '?subject=' +
            encodeURIComponent(T.subject + ' — ' + tipo) + '&body=' +
            encodeURIComponent((LANG === 'pt' ? 'Nome: ' : 'Name: ') + nome + '\nE-mail: ' + mail + '\n\n' + msg);
          return;
        }

        btn.textContent = T.sending; btn.disabled = true; fb.className = 'form-feedback';
        data.append('_subject', T.subject + ' — ' + tipo);

        fetch(CFG.FORMSPREE_URL, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            fb.textContent = T.ok; fb.className = 'form-feedback success';
            form.reset();
            try { track('formulario', CFG.LABEL_FORMULARIO); } catch (err) { log('erro ao enviar conversão', err); }
          })
          .catch(function (err) {
            log('Falha no envio do formulário:', err && err.message);
            fb.textContent = T.err + EMAIL; fb.className = 'form-feedback error';
          })
          .then(function () { btn.textContent = T.send; btn.disabled = false; });
      });
    }
  });
})();
