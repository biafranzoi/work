// Idioma: Português (padrão) / English. Aplica o mais cedo possível — antes
// de qualquer outro código que leia texto traduzido do DOM (ex.: o modal de
// projeto usa o texto já traduzido de .project-card__desc).
window.i18n.applyLanguage(window.i18n.getSavedLang());

// Seletor de tema/idioma: Escuro (padrão), Claro, Alto contraste + Português,
// English. Tema persiste no localStorage; o <script> inline no <head> já
// aplicou o tema salvo antes desta página pintar, então aqui só sincronizamos
// a UI do menu com ele. Os dois grupos (tema/idioma) dividem o mesmo painel,
// então compartilham a lógica de abrir/fechar.
const THEME_KEY = "biafranzoi-theme";
const THEME_VALUES = ["dark", "light", "high-contrast"];

const themeToggle = document.querySelector("#theme-menu-toggle");
const themeMenu = document.querySelector("#theme-menu");
if (themeToggle && themeMenu) {
  const themeOptions = [...themeMenu.querySelectorAll("[data-theme-value]")];
  const langOptions = [...themeMenu.querySelectorAll("[data-lang-value]")];

  const currentTheme = () =>
    document.documentElement.getAttribute("data-theme") || "dark";

  const syncThemeOptions = () => {
    const active = currentTheme();
    for (const opt of themeOptions) {
      opt.setAttribute(
        "aria-checked",
        String(opt.dataset.themeValue === active),
      );
    }
  };

  const syncLangOptions = () => {
    const active = window.i18n.getLang();
    for (const opt of langOptions) {
      opt.setAttribute("aria-checked", String(opt.dataset.langValue === active));
    }
  };

  const applyTheme = (value) => {
    if (!THEME_VALUES.includes(value)) return;
    if (value === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value);
    }
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      // localStorage indisponível (modo privado, etc.) — o tema ainda
      // funciona nesta visita, só não persiste pra próxima
    }
    syncThemeOptions();
  };

  const openMenu = () => {
    themeMenu.hidden = false;
    themeToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = ({ refocus = false } = {}) => {
    themeMenu.hidden = true;
    themeToggle.setAttribute("aria-expanded", "false");
    if (refocus) themeToggle.focus();
  };

  themeToggle.addEventListener("click", () => {
    if (themeMenu.hidden) openMenu();
    else closeMenu();
  });

  for (const opt of themeOptions) {
    opt.addEventListener("click", () => {
      applyTheme(opt.dataset.themeValue);
      closeMenu({ refocus: true });
    });
  }

  for (const opt of langOptions) {
    opt.addEventListener("click", () => {
      window.i18n.applyLanguage(opt.dataset.langValue);
      syncLangOptions();
      closeMenu({ refocus: true });
    });
  }

  document.addEventListener("click", (e) => {
    if (themeMenu.hidden) return;
    // themeToggle.contains (não ===): um clique no ícone svg/path lá dentro
    // tem e.target igual ao svg, não ao botão — a checagem estrita fechava
    // o menu no mesmo clique que acabou de abri-lo
    if (!themeMenu.contains(e.target) && !themeToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !themeMenu.hidden) closeMenu({ refocus: true });
  });

  syncThemeOptions();
  syncLangOptions();
}

// Revela os elementos conforme entram na viewport
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

// Leque interativo: clicar num card de trás o traz para a posição principal,
// trocando de lugar com o card que estava na frente. Leque de 4 cartas,
// simétrico em torno de 0deg — como são 4 (par) não há carta exatamente no
// centro, então a principal (topo, z mais alto) fica na casa interna a +3deg,
// quase reta; o leque abre pra ambos os lados no hover, todas girando a partir
// do mesmo pino (ver transform-origin no CSS). Os valores aqui espelham os do
// CSS (nth-child); se um mudar, o outro precisa acompanhar.
const SLOTS = [
  { r: "-9deg", open: "-21deg", z: 2 },
  { r: "-3deg", open: "-7deg", z: 4 },
  { r: "3deg", open: "7deg", z: 5 },
  { r: "9deg", open: "21deg", z: 3 },
];
const MAIN_SLOT = 2;

const cards = [...document.querySelectorAll(".fan__card")];
const slotOf = new Map(cards.map((card, i) => [card, i]));

function applySlots() {
  for (const [card, i] of slotOf) {
    const slot = SLOTS[i];
    const num = cards.indexOf(card) + 1;
    const name =
      card.querySelector(".project-card__name")?.textContent?.trim() ??
      `Projeto ${num}`;
    card.style.setProperty("--r", slot.r);
    card.style.setProperty("--r-open", slot.open);
    card.style.zIndex = String(slot.z);
    const isMain = i === MAIN_SLOT;
    card.classList.toggle("fan__card--main", isMain);
    card.setAttribute(
      "aria-label",
      isMain
        ? window.i18n.t("fanViewProject", name)
        : window.i18n.t("fanBringToFront", name),
    );
  }
}

// refaz os aria-labels do leque na nova língua (o nome do projeto não muda,
// mas o template "Ver projeto: {nome}"/"Trazer {nome} para frente" muda)
document.addEventListener("i18n:change", applySlots);

// Modal fullscreen do projeto
const modal = document.querySelector("#project-modal");
const modalKicker = modal.querySelector(".project-modal__kicker");
const modalTitle = modal.querySelector(".project-modal__title");
const modalBody = modal.querySelector(".project-modal__body");
// snapshot do placeholder (texto padrão), já na língua atual — cards sem
// <template id="case-*"> próprio caem nele
const defaultModalBodyHTML = modalBody.innerHTML;
modal
  .querySelector(".project-modal__close")
  .addEventListener("click", () => modal.close());

// Estudo de caso completo: cards com data-case="slug" têm um
// <template id="case-slug"> em algum lugar do documento (ver index.html,
// logo depois do <dialog>) com o conteúdo completo do case. Os demais caem
// no texto curto (.project-card__desc) do próprio card como placeholder.

// card cujo case está aberto no momento (pra re-renderizar ao trocar idioma)
let currentCard = null;

// preenche kicker/título/corpo do modal a partir do card, SEM abri-lo
function renderProject(card) {
  const name = card.querySelector(".project-card__name")?.textContent?.trim();
  modalTitle.textContent = name ?? "Projeto";
  // padrão "Estudo de caso" pra maioria, mas alguns projetos (ex.: Compraki,
  // projeto pessoal) têm um rótulo próprio — ver KICKER_OVERRIDES em i18n.js
  modalKicker.textContent = window.i18n.kickerFor(card.dataset.case);

  const caseTemplate = card.dataset.case
    ? document.querySelector(`#case-${card.dataset.case}`)
    : null;

  if (caseTemplate) {
    modalBody.innerHTML = "";
    modalBody.append(caseTemplate.content.cloneNode(true));
    // o <template> nunca passa pelo captureOriginals()/applyLanguage()
    // globais (seu conteúdo não faz parte do DOM renderizado até este
    // clone), então cada abertura traduz a cópia fresca pra língua atual
    window.i18n.translateNode(modalBody);
  } else {
    const desc = card.querySelector(".project-card__desc")?.textContent?.trim();
    modalBody.innerHTML = defaultModalBodyHTML;
    if (desc) modalBody.querySelector(".project-modal__text").textContent = desc;
  }
}

function openProject(card) {
  currentCard = card;
  renderProject(card);
  modal.showModal();
  // o <dialog> é um único elemento reaproveitado por todos os projetos: o
  // scroll de uma visita anterior (mesmo já fechada) fica guardado nele e
  // reaparece ao reabrir, mesmo para outro projeto. Sem este reset, o modal
  // abre "no meio do caso" sempre que a visita anterior tiver rolado a
  // página. Depois do showModal(), não antes: um <dialog> fechado (display:
  // none) não tem caixa de layout, então scrollTop não pega enquanto ele
  // ainda não foi exibido.
  modal.scrollTop = 0;
}

// ao trocar de idioma com um case aberto, re-renderiza a partir do template
// (o applyLanguage do i18n não mexe no clone; ver a nota lá). Re-renderizar,
// e não deixar o applyLanguage tocar o clone, evita o bug de "undefined" e
// mantém o modal na língua certa — inclusive o kicker, que o applyLanguage
// acabou de sobrescrever com o rótulo genérico do data-i18n="modal.kicker".
// currentCard não é limpo no "close": o evento close do <dialog> é assíncrono
// e zeraria a referência DEPOIS de um reabrir imediato. Como o guard abaixo
// já exige modal.open, guardar o último card é inofensivo.
document.addEventListener("i18n:change", () => {
  if (currentCard && modal.open) renderProject(currentCard);
});

for (const card of cards) {
  card.addEventListener("click", () => {
    const current = slotOf.get(card);
    if (current === MAIN_SLOT) {
      // card principal: abre o projeto correspondente
      openProject(card);
      return;
    }
    const mainCard = cards.find((c) => slotOf.get(c) === MAIN_SLOT);
    slotOf.set(mainCard, current);
    slotOf.set(card, MAIN_SLOT);
    applySlots();
  });
}
applySlots();

// Cards do grid de projetos: abrem o mesmo modal do leque
for (const card of document.querySelectorAll(".project-card")) {
  card.addEventListener("click", () => openProject(card));
}

// Inclinação 3D dos cards de projeto: o ponteiro "empurra" a borda por onde
// passa. Aqui o JS só publica a posição dele dentro do card (--mx/--my, de -1
// a 1); quem vira isso em rotação e parallax é o CSS. Como o cursor
// customizado, não é animação autônoma — só reage ao mouse, então fica fora do
// botão global de pausa. Sem mouse de verdade (toque) não há hover para
// acompanhar, e com prefers-reduced-motion o efeito não se aplica.
if (
  matchMedia("(pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const clamp = (n) => Math.min(1, Math.max(-1, n));

  for (const card of document.querySelectorAll(".project-card")) {
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const applyTilt = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const mx = clamp(((pointerX - rect.left) / rect.width) * 2 - 1);
      const my = clamp(((pointerY - rect.top) / rect.height) * 2 - 1);
      card.style.setProperty("--mx", mx.toFixed(3));
      card.style.setProperty("--my", my.toFixed(3));
    };

    card.addEventListener("pointermove", (e) => {
      // caneta/toque não têm hover contínuo: deixariam o card travado inclinado
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!frame) frame = requestAnimationFrame(applyTilt);
    });

    card.addEventListener("pointerleave", () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      // sem valor inline as variáveis voltam ao 0 do CSS e o card desinclina
      // pela transição, em vez de saltar
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  }
}

// Marquee: clona a lista até a trilha cobrir qualquer largura de tela e
// ajusta a duração para a velocidade ficar constante (~40px/s)
const track = document.querySelector(".marquee__track");
const baseList = track?.querySelector(".marquee__list");
if (track && baseList) {
  const ensureCoverage = () => {
    const listWidth = baseList.offsetWidth;
    if (listWidth === 0) return;
    const listsPerHalf = Math.max(2, Math.ceil(window.innerWidth / listWidth) + 1);
    while (track.children.length < listsPerHalf * 2) {
      const clone = baseList.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
    const actualHalf = (track.children.length / 2) * listWidth;
    track.style.setProperty(
      "--marquee-duration",
      `${Math.round(actualHalf / 40)}s`,
    );
  };
  ensureCoverage();
  window.addEventListener("resize", ensureCoverage);
}

// Dock: destaca o item da seção visível no momento (scroll spy)
const dockLinks = [...document.querySelectorAll(".dock__item")];
const spiedSections = dockLinks
  .map((a) => document.querySelector(a.hash))
  .filter((s) => s !== null);

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const hash = `#${entry.target.id}`;
      for (const link of dockLinks) {
        link.classList.toggle("is-active", link.hash === hash);
      }
    }
  },
  // faixa central da viewport: a seção que a ocupa é a "ativa"
  { rootMargin: "-40% 0px -55% 0px" },
);

spiedSections.forEach((s) => spy.observe(s));

// Carrossel de depoimentos: setas, dots e sincronização com o scroll
const carousel = document.querySelector(".carousel");
// exposta para o controle único de play/pause (definido mais abaixo) comandar
// o autoplay do carrossel junto com as outras animações
let setCarouselAutoplayPaused = null;
if (carousel) {
  const viewport = carousel.querySelector(".carousel__viewport");
  const slides = [...viewport.querySelectorAll(".carousel__slide")];
  const dotsWrap = document.querySelector(".carousel__dots");

  const currentIndex = () =>
    Math.round(viewport.scrollLeft / (viewport.clientWidth || 1));

  const goTo = (index) => {
    // as setas dão a volta: depois do último vem o primeiro
    const target = (index + slides.length) % slides.length;
    viewport.scrollTo({ left: target * viewport.clientWidth, behavior: "smooth" });
  };

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", window.i18n.t("carouselGoTo", i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.append(dot);
    return dot;
  });

  const syncDots = () => {
    const active = currentIndex();
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  };

  document.addEventListener("i18n:change", () => {
    dots.forEach((dot, i) => dot.setAttribute("aria-label", window.i18n.t("carouselGoTo", i + 1)));
  });

  viewport.addEventListener("scroll", syncDots, { passive: true });
  const carouselNav = document.querySelector(".carousel__nav");
  carouselNav
    .querySelector(".carousel__btn--prev")
    .addEventListener("click", () => goTo(currentIndex() - 1));
  carouselNav
    .querySelector(".carousel__btn--next")
    .addEventListener("click", () => goTo(currentIndex() + 1));
  syncDots();

  // Autoplay: avança sozinho, pausando no hover, foco, toque e aba oculta
  const AUTOPLAY_MS = 5000;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let autoplayTimer;
  // pausa explícita do usuário via botão: hover/foco não devem retomar sozinhos
  let userPaused = reduceMotion.matches;

  const play = () => {
    if (reduceMotion.matches || userPaused || autoplayTimer !== undefined) return;
    autoplayTimer = window.setInterval(() => goTo(currentIndex() + 1), AUTOPLAY_MS);
    carousel.dataset.autoplay = "on";
  };

  const pause = () => {
    if (autoplayTimer !== undefined) {
      clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    }
    carousel.dataset.autoplay = "off";
  };

  for (const area of [carousel, carouselNav]) {
    area.addEventListener("mouseenter", pause);
    area.addEventListener("mouseleave", play);
    area.addEventListener("focusin", pause);
    area.addEventListener("focusout", play);
  }
  viewport.addEventListener("touchstart", pause, { passive: true });
  viewport.addEventListener("touchend", play, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pause();
    } else {
      play();
    }
  });

  // Comandado pelo botão único de play/pause (WCAG 2.2.2): hover/foco
  // continuam pausando temporariamente, mas só retomam sozinhos se o
  // usuário não tiver pausado explicitamente ali
  setCarouselAutoplayPaused = (value) => {
    userPaused = value;
    if (userPaused) pause();
    else play();
  };

  play();
}

// Controle único de play/pause para todas as animações contínuas da página
// (letreiro, órbita de ícones, palavras rotativas e avanço automático dos
// depoimentos) — WCAG 2.2.2 Pause, Stop, Hide. Um só botão fixo no canto
// superior direito, em vez de um controle por animação. O cursor customizado
// fica de fora: ele só se move em resposta direta ao mouse do usuário, não
// é uma animação autônoma.
const globalPauseBtn = document.querySelector("#global-pause-toggle");
if (globalPauseBtn) {
  const playIcon = globalPauseBtn.querySelector(".anim-toggle__play");
  const pauseIcon = globalPauseBtn.querySelector(".anim-toggle__pause");
  const pauseTooltip = globalPauseBtn.querySelector(".topbar__tooltip");
  const pausableTargets = [
    document.querySelector(".marquee"),
    document.querySelector(".orbit"),
    document.querySelector(".focus"),
  ].filter(Boolean);

  const applyState = (paused) => {
    pausableTargets.forEach((el) => el.classList.toggle("is-paused", paused));
    if (setCarouselAutoplayPaused) setCarouselAutoplayPaused(paused);
    globalPauseBtn.setAttribute("aria-pressed", String(paused));
    // "Ativar animações" quando pausado, "Pausar animações" quando rodando —
    // mesma string no aria-label e no tooltip visível, pra ficarem em sincronia
    const label = window.i18n.t(paused ? "pauseOff" : "pauseOn");
    globalPauseBtn.setAttribute("aria-label", label);
    if (pauseTooltip) pauseTooltip.textContent = label;
    // toggleAttribute em vez da propriedade .hidden: em alguns motores o
    // IDL "hidden" não é refletido de forma confiável em elementos <svg>
    playIcon.toggleAttribute("hidden", !paused);
    pauseIcon.toggleAttribute("hidden", paused);
  };

  let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  applyState(paused);
  globalPauseBtn.addEventListener("click", () => {
    paused = !paused;
    applyState(paused);
  });
  // reaplica só o aria-label (não o estado) na nova língua
  document.addEventListener("i18n:change", () => applyState(paused));
}

// Cursor customizado: só para mouse de verdade e sem prefers-reduced-motion.
// Opção 1 ("ring"): ponto + anel que cresce nos interativos.
// Opção 2 ("trail"): ponto com rastro de partículas — troque na constante abaixo.
const CURSOR_VARIANT = "ring";

if (
  matchMedia("(pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(dot);
  // esconde o cursor nativo só agora, com o substituto já no DOM
  document.documentElement.classList.add("has-custom-cursor");

  const INTERACTIVE = "a, button, [role='button'], input, textarea, select";
  let mouseX = 0;
  let mouseY = 0;
  let visible = false;
  const followers = [];
  // reposiciona os seguidores no ponto do mouse quando ele (re)entra na janela
  let snap = () => {};
  // reavalia se o cursor está sobre algo clicável — cada variante define a sua
  let syncHover = () => {};

  if (CURSOR_VARIANT === "ring") {
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.insertBefore(ring, dot);
    followers.push(ring);

    let ringX = 0;
    let ringY = 0;
    snap = () => {
      ringX = mouseX;
      ringY = mouseY;
    };

    const FOLLOW = 0.18;
    const tick = () => {
      ringX += (mouseX - ringX) * FOLLOW;
      ringY += (mouseY - ringY) * FOLLOW;
      ring.style.translate = `${ringX}px ${ringY}px`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    syncHover = () => {
      ring.classList.toggle(
        "cursor-ring--hover",
        Boolean(document.elementFromPoint(mouseX, mouseY)?.closest(INTERACTIVE)),
      );
    };
    window.addEventListener("mousedown", () =>
      ring.classList.add("cursor-ring--down"),
    );
    window.addEventListener("mouseup", () =>
      ring.classList.remove("cursor-ring--down"),
    );
  } else {
    const TRAIL_COUNT = 10;
    const trail = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const el = document.createElement("div");
      el.className = "cursor-trail";
      // partículas encolhem e desvanecem ao longo do rastro
      const t = i / TRAIL_COUNT;
      const size = 7 - 5 * t;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.setProperty("--trail-opacity", String(0.55 * (1 - t)));
      document.body.insertBefore(el, dot);
      followers.push(el);
      return { el, x: 0, y: 0 };
    });

    snap = () => {
      for (const p of trail) {
        p.x = mouseX;
        p.y = mouseY;
      }
    };

    // cada partícula persegue a anterior; a primeira persegue o mouse
    const FOLLOW = 0.35;
    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;
      for (const p of trail) {
        p.x += (targetX - p.x) * FOLLOW;
        p.y += (targetY - p.y) * FOLLOW;
        p.el.style.translate = `${p.x}px ${p.y}px`;
        targetX = p.x;
        targetY = p.y;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // sem o anel, é o próprio ponto que cresce nos interativos
    syncHover = () => {
      dot.classList.toggle(
        "cursor-dot--hover",
        Boolean(document.elementFromPoint(mouseX, mouseY)?.closest(INTERACTIVE)),
      );
    };
    window.addEventListener("mousedown", () =>
      dot.classList.add("cursor-dot--down"),
    );
    window.addEventListener("mouseup", () =>
      dot.classList.remove("cursor-dot--down"),
    );
  }

  const setVisible = (on) => {
    visible = on;
    for (const el of [dot, ...followers]) {
      el.classList.toggle("is-visible", on);
    }
  };

  // o <dialog> do case study abre na top layer, sempre acima de qualquer
  // position:fixed do documento normal — com o modal aberto, o cursor
  // customizado (que vive em <body>) ficaria pintado atrás dele, invisível.
  // Solução: mover ponto/anel (ou rastro) pra dentro do próprio <dialog>
  // enquanto ele estiver aberto, já que aí entram na mesma top layer;
  // e de volta pro <body> quando fechar.
  const projectModal = document.querySelector("#project-modal");
  if (projectModal) {
    const cursorEls = [dot, ...followers];
    new MutationObserver(() => {
      const target = projectModal.open ? projectModal : document.body;
      for (const el of cursorEls) target.append(el);
    }).observe(projectModal, { attributes: true, attributeFilter: ["open"] });
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      snap();
      setVisible(true);
    }
    dot.style.translate = `${mouseX}px ${mouseY}px`;
    syncHover();
  });

  // durante o scroll o mouse não se move, mas o conteúdo desliza por baixo
  // dele — reavalia o que está sob o cursor para o estado não ficar preso.
  // capture:true também pega o scroll de containers internos (ex.: o
  // viewport do carrossel), não só o scroll da página
  window.addEventListener(
    "scroll",
    () => {
      if (visible) syncHover();
    },
    { passive: true, capture: true },
  );

  // some quando o mouse sai da janela
  document.documentElement.addEventListener("mouseleave", () =>
    setVisible(false),
  );
}

// Relógio com o horário oficial de Brasília (America/Sao_Paulo), independente
// do fuso do visitante. Sem aria-live: o valor muda a cada segundo e ficaria
// irritante para leitores de tela anunciar em loop — fica disponível sob
// demanda, como qualquer outro texto da página.
const clock = document.querySelector("#brazil-clock");
if (clock) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const label = clock.querySelector(".sr-only");
  const timeEl = clock.querySelector(".topbar__clock-time");
  const tick = () => {
    const now = new Date();
    const time = formatter.format(now);
    clock.setAttribute("datetime", now.toISOString());
    timeEl.textContent = time;
    if (label) label.textContent = `${window.i18n.t("clockLabel")}${time}. `;
  };
  tick();
  setInterval(tick, 1000);
  // o próprio tick() já lê o idioma atual, só precisa rodar de novo agora
  // em vez de esperar até 1s pelo próximo intervalo
  document.addEventListener("i18n:change", tick);

  // Tooltip da pill: uma frase sobre o que a Bia provavelmente está fazendo,
  // de acordo com a faixa de horário em Brasília. O texto só é calculado no
  // momento em que o tooltip vai aparecer (hover/foco/toque) — não a cada
  // tick do relógio, senão a frase aleatória da faixa da noite trocaria a
  // cada segundo enquanto o tooltip estivesse visível.
  const clockTooltip = clock.querySelector(".topbar__clock-tooltip");
  if (clockTooltip) {
    const partsFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    const messageForMinutes = (totalMinutes) => {
      if (totalMinutes >= 421 && totalMinutes <= 480)
        return window.i18n.t("clockTooltipPrep");
      if (totalMinutes >= 481 && totalMinutes <= 720)
        return window.i18n.t("clockTooltipWork");
      if (totalMinutes >= 721 && totalMinutes <= 810)
        return window.i18n.t("clockTooltipLunch");
      if (totalMinutes >= 811 && totalMinutes <= 1080)
        return window.i18n.t("clockTooltipWork");
      if (totalMinutes >= 1081 && totalMinutes <= 1200)
        return window.i18n.t("clockTooltipDinner");
      if (totalMinutes >= 1201 && totalMinutes <= 1380) {
        const options = window.i18n.t("clockTooltipNight");
        return options[Math.floor(Math.random() * options.length)];
      }
      // 23h01–7h (cobre a virada da meia-noite)
      return window.i18n.t("clockTooltipSleep");
    };

    const updateTooltipText = () => {
      const parts = partsFormatter.formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === "hour").value);
      const minute = Number(parts.find((p) => p.type === "minute").value);
      clockTooltip.textContent = messageForMinutes(hour * 60 + minute);
    };

    clock.addEventListener("mouseenter", updateTooltipText);
    clock.addEventListener("focus", updateTooltipText);
    clock.addEventListener("click", () => {
      if (clock.classList.contains("is-open")) {
        clock.classList.remove("is-open");
      } else {
        updateTooltipText();
        clock.classList.add("is-open");
      }
    });
    document.addEventListener("click", (event) => {
      if (!clock.contains(event.target)) clock.classList.remove("is-open");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") clock.classList.remove("is-open");
    });
  }
}
