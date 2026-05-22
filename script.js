/* ================================================
   GABRIEL MARQUES — PORTFÓLIO
   script.js
   ================================================ */

// ========== 1. NAVBAR: scrolled state + mobile toggle ==========

const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const allLinks  = document.querySelectorAll('.nav-link');

// Adiciona classe .scrolled quando o usuário rola a página
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

// Abre/fecha o menu mobile
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  // Anima o ícone de hamburguer → X
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Fecha o menu ao clicar em um link
allLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ========== 2. ACTIVE LINK: destaca o item do menu conforme a seção visível ==========

const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  allLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Inicializa no carregamento
updateActiveLink();

// ========== 3. SKILL BARS: animação ao entrar na tela ==========

// IntersectionObserver detecta quando as barras ficam visíveis
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) {
        const targetWidth = fill.getAttribute('data-width');
        // Aplica a largura depois de um pequeno atraso para garantir a transição CSS
        setTimeout(() => {
          fill.style.width = `${targetWidth}%`;
        }, 150);
      }
      skillObserver.unobserve(entry.target); // anima apenas uma vez
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ========== 4. SCROLL REVEAL: anima elementos ao entrar na viewport ==========

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Aplica a todos os cards/seções que queremos revelar
const revealTargets = document.querySelectorAll(
  '.info-card, .skill-card, .project-card, .contact-card, .about-text'
);

revealTargets.forEach((el, index) => {
  // Configuração inicial via CSS inline
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${index * 0.06}s, transform 0.6s ease ${index * 0.06}s`;

  revealObserver.observe(el);
});

// Quando revelado, restaura os valores
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
});

// ========== 5. SMOOTH SCROLL: melhora a experiência de navegação ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // altura da navbar fixa
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========== 6. TYPED EFFECT: efeito de digitação no subtítulo do hero ==========

const subtitleEl = document.querySelector('.hero-subtitle');
if (subtitleEl) {
  const lines = [
    'Desenvolvedor em formação · Teresina, PI',
    'Apaixonado por código limpo e soluções criativas.'
  ];

  // O efeito só roda uma vez, após a animação de entrada do hero
  setTimeout(() => {
    subtitleEl.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;
    let currentHTML = '';

    function typeNextChar() {
      if (lineIndex >= lines.length) {
        // Garante que todo o texto fique visível ao final
        subtitleEl.innerHTML = lines.join('<br/>');
        return;
      }

      const line = lines[lineIndex];

      if (charIndex < line.length) {
        currentHTML += line[charIndex];
        subtitleEl.innerHTML = (lineIndex > 0 ? lines.slice(0, lineIndex).join('<br/>') + '<br/>' : '') + currentHTML;
        charIndex++;
        setTimeout(typeNextChar, 30);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 200);
      }
    }

    typeNextChar();
  }, 900); // aguarda as animações iniciais do hero
}

// ========== 7. YEAR: atualiza o ano no footer automaticamente ==========

const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  footerCopy.textContent = footerCopy.textContent.replace(
    /\d{4}/,
    new Date().getFullYear()
  );
}

// ========== 8. PROJECT CARD: efeito de brilho ao mover o mouse ==========

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = ((e.clientX - rect.left) / rect.width)  * 100;
    const y     = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});