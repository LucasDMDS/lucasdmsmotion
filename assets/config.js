/* ════════════════════════════════════════════════════════════════════════════
   LDMSMOTION — CONFIGURAÇÃO DO SITE
   ────────────────────────────────────────────────────────────────────────────
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR para ativar o rastreamento
   do Google Ads e o formulário de contato. Vale para as 4 páginas do site.

   Como editar: abra este arquivo no Bloco de Notas, troque apenas o texto que
   está entre aspas (' ') e salve. Depois envie a pasta de novo para o Netlify.

   Enquanto os valores continuarem com XXXX, o site funciona normalmente — só
   não envia conversões ao Google Ads (e o formulário usa o e-mail como plano B).
   ════════════════════════════════════════════════════════════════════════════ */

window.SITE_CONFIG = {

  /* 1) GOOGLE ADS — ID da tag (o mesmo para as duas conversões)
        Formato: AW- seguido de números.  Exemplo: 'AW-123456789'            */
  GOOGLE_ADS_ID: 'AW-18139351060',

  /* 2) GOOGLE ADS — RÓTULO da conversão "Formulário enviado"
        É o texto que aparece DEPOIS da barra em AW-123456789/AbCdEfGhIjK
        Exemplo: 'AbCdEfGhIjK'                                                */
  LABEL_FORMULARIO: '-gJcCIrRqrYdEJSQwslD',

  /* 3) GOOGLE ADS — RÓTULO da conversão "Clique no WhatsApp"
        Mesmo formato do item 2, mas é um rótulo DIFERENTE.                   */
  LABEL_WHATSAPP: 'kszNCI3RqrYdEJSQwslD',

  /* 4) FORMULÁRIO — endereço (endpoint) criado no Formspree
        Exemplo: 'https://formspree.io/f/abcdwxyz'                            */
  FORMSPREE_URL: 'https://formspree.io/f/mqpqkkyq',

  /* 5) E-MAIL de contato exibido no rodapé e usado como plano B.
        (O e-mail que RECEBE as mensagens do formulário é definido no Formspree.) */
  CONTACT_EMAIL: 'ldms.motion@gmail.com'
};
