// Sistema de tradução do site: Português (Brasil, padrão) / English.
//
// Fonte da verdade do PT-BR é o próprio index.html — nunca duplicamos o
// texto em português aqui. Este arquivo captura o HTML original de cada
// elemento marcado com data-i18n/data-i18n-aria-label assim que a página
// carrega (função captureOriginals) e usa essa cópia para "voltar" ao
// português. Só precisamos manter, abaixo, a tradução para os outros
// idiomas (hoje só "en").
//
// Como adicionar conteúdo novo que também deve traduzir (ex.: um novo case
// de projeto):
//   1. No HTML, marque o elemento com data-i18n="uma.chave.unica" (texto
//      visível/innerHTML), data-i18n-aria-label="uma.chave.unica" (atributo
//      aria-label), data-i18n-alt="uma.chave.unica" (atributo alt de
//      imagem) ou data-i18n-href="uma.chave.unica" (atributo href de link,
//      ex.: um arquivo diferente por idioma). Pode reaproveitar a mesma
//      chave em vários elementos que devem ter a mesma tradução (ex.:
//      "cta.viewProject").
//   2. Adicione a mesma chave em EN_CONTENT, EN_ATTRS, EN_ALT ou EN_HREF
//      abaixo (conforme o caso), com o valor em inglês. Não precisa
//      adicionar a versão em português — ela já é o que está escrito no HTML.
//   3. Se o texto não existe no HTML (é só gerado por JS, como o rótulo dos
//      dots do carrossel), adicione as duas versões em DYNAMIC (pt e en) e
//      use i18n.t("chave", ...args) no main.js.
//   4. Estudo de caso completo de um projeto (conteúdo rico: título,
//      parágrafos, listas, imagem) fica num <template id="case-slug"> à
//      parte no index.html (ver <template id="case-compraki">), associado
//      ao card via data-case="slug". Esse HTML nunca passa por
//      captureOriginals()/applyLanguage() (não está na página até ser
//      clonado por main.js) — por isso usa i18n.translateNode(elemento)
//      depois de clonado, não precisa de nenhum passo extra aqui.
(function () {
  "use strict";

  var LANG_KEY = "biafranzoi-lang";
  var VALID_LANGS = ["pt", "en"];

  // Traduções para inglês: inteiro conteúdo (innerHTML) dos elementos
  // marcados com data-i18n="chave" na coluna da esquerda.
  var EN_CONTENT = {
    "topbar.country": "Brazil",
    // mesmo texto do aria-label (EN_ATTRS abaixo), mas aqui como conteúdo pro
    // tooltip visível do botão de configurações (data-i18n no <span>)
    "settings.trigger": "Settings",
    "settings.theme.label": "Theme",
    "settings.theme.dark": "Dark",
    "settings.theme.light": "Light",
    "settings.theme.highContrast": "High contrast",
    "settings.lang.label": "Language",

    "hero.title":
      'Hi, I\'m <span class="accent">Bia Franzoi</span>.<br />\n            I design <span class="accent">products</span> that solve real problems.',
    "hero.subtitle":
      "More than <strong>12 years of experience</strong> in the technology and design ecosystem. <strong>Postgraduate in UX Design</strong> from PUCRS. Full end-to-end mastery — from design to handoff and front-end, in sync with agile methodologies.",
    "hero.ctaPrimary": "View projects",
    "hero.ctaSecondary": "Get in touch",

    "project.compraki.descShort":
      "Smart list manager that uses NFC-e crowdsourcing to compare the total cart cost across supermarkets.",
    "project.compraki.descLong":
      "Smart list manager that uses NFC-e crowdsourcing to compare the total cart cost across supermarkets, optimizing decision-making through data intelligence, geolocation, and real savings.",
    "project.crediario.descShort":
      "End-to-end UX work, from the platform redesign to the evolution of the Design System.",
    "project.crediario.descLong":
      "End-to-end UX work, from the platform redesign to the evolution of the Design System, in ongoing cross-functional collaboration since 2018.",
    "project.destinoideal.desc":
      "Travel planner that recommends tailor-made destinations based on the traveler's profile.",
    "project.nebula.desc":
      "Storage SaaS focused on reducing friction between file upload and collaboration.",
    "project.digidoc.desc":
      "Personal document wallet with QR codes for easy and secure sharing.",
    "tag.8years": "+8 years",
    "cta.viewProject": "View project →",

    "marquee.leadership": "Leadership",
    "marquee.prototyping": "Prototyping",

    "projects.title": 'Featured <span class="accent">projects</span>',

    "focus.label": "Focus on",
    "focus.word1": "experience",
    "focus.word2": "usability",
    "focus.word3": "quality",

    "about.title": 'About <span class="accent">me</span>',
    "about.p1":
      'I\'m a product designer passionate about turning <span class="accent">complex problems</span> into solutions that are simple and enjoyable to use. I believe good design comes from the combination of <span class="accent">research</span>, empathy, and constant iteration.',
    "about.p2":
      'I work with product discovery, prototyping, design systems, and usability testing — always close to the <span class="accent">development</span> team.',
    "about.downloadCv": "Download resume",

    "playground.yega.desc": "Website prototype for a fictional Japanese restaurant",
    "playground.designQuotes.desc": "Posters with quotes about design",
    "playground.newspaper.desc": "Newspaper template for Figma",
    "playground.behance.desc": "Published projects",
    "playground.worldCup.desc":
      'Made for a sticker generator project by <a href="https://github.com/julietedias/2022-cup-sticker" target="_blank" rel="noopener noreferrer">Juliete Dias<span class="sr-only"> (opens in new tab)</span></a>.',
    "playground.generalApp.desc":
      'UI for a game app, by <a href="https://github.com/gabrielkgg/marcador-general" target="_blank" rel="noopener noreferrer">Gabriel Alves<span class="sr-only"> (opens in new tab)</span></a>.',
    "playground.coisaFina.desc": "Visual identity for a thrift store",
    "playground.saiti.desc": "Visual identity for the Saiti brand",
    "playground.decorBanners.desc": "Banners for a home decor e-commerce",
    "playground.decorEmail.desc": "Email marketing for a home decor e-commerce",
    "common.opensNewTab": "(opens in new tab)",
    "common.opensNewTabSpace": " (opens in new tab)",

    "testimonials.title": 'What people <span class="accent">say about me</span>',
    "testimonial1.quote":
      "The most professional and organized person I've ever met. Her work is impeccable, always very cohesive and focused on the end user.",
    "testimonial1.role": "Full-Stack Developer",
    "testimonial2.quote":
      "An excellent professional — working with her gave me a lot of learning and growth.",
    "testimonial2.role": "CS Coordinator",
    "testimonial.linkedinSuffix": " — LinkedIn profile (opens in new tab)",

    "contact.heading": "Contact",

    "modal.kicker": "Case study",
    "modal.titlePlaceholder": "Project name",
    "modal.textPlaceholder":
      "This is where the project content goes: context, challenge, process, images, and results. Replace this placeholder with the full case study.",

    "footer.credits": "Made with love, tokens, and contributions from",
    "footer.wcag": "Compliant with WCAG 2 criteria.",
    "footer.reportIssue":
      'Report issue<span class="sr-only"> — accessibility, via LinkedIn (opens in new tab)</span>',

    "dock.home": "Home",
    "dock.projects": "Projects",
    "dock.about": "About",
    "dock.testimonials": "Testimonials",
    "dock.contact": "Contact",

    // Rótulos de campo reaproveitáveis por qualquer <template id="case-*">
    // (ver seção "Estudo de caso completo" abaixo)
    "caseMeta.category": "Category",
    "caseMeta.role": "My role",
    "caseMeta.duration": "Duration",
    "caseMeta.client": "Client",

    // Estudo de caso completo: Compraki (src/img/biafranzoi-compraki-*.png,
    // <template id="case-compraki"> em index.html)
    "case.compraki.categoryValue": "App · Personal project",
    "case.compraki.roleValue":
      "Research, ideation, wireframing, componentization, and prototyping",
    "case.compraki.durationValue": "3 months",
    "case.compraki.heading1": "Context and challenge",
    "case.compraki.body1":
      "In Rio do Sul, Brazil, food inflation eats up as much as 55% of the minimum wage, and price gaps for basic supermarket items can top 33% between stores. Most consumers notice this variation, but few research prices before shopping — the challenge was building a collaborative price-comparison platform to ease that impact on household budgets.",
    "case.compraki.heading2": "The initial hypothesis",
    "case.compraki.body2":
      "My premise was that users struggled to shop due to a lack of price and promotion information, plus unnecessary travel between stores. I imagined a shopping list integrated with local supermarkets' own systems, showing the price of each item — and of the full list — before heading out to shop.",
    "case.compraki.heading3": "Research and findings",
    "case.compraki.body3":
      "Through desk research and qualitative interviews with 12 potential users in the region, I found:",
    "case.compraki.findings":
      "<li>Most interviewees already use some kind of shopping list — on paper, in WhatsApp, or in an app.</li>" +
      "<li>91% notice price variation between stores, but 75% do no research before shopping.</li>" +
      "<li>58% split their shopping between more than one store to catch promotions.</li>" +
      "<li>The biggest friction isn't a lack of data, it's the time to process it: 53.8% cite “wasting time” as the top pain point.</li>" +
      "<li>Shoppers don't just want one product's price — they want to know where the whole list (say, 20 items) is cheapest.</li>" +
      "<li>Market research confirmed there are no open APIs from major chains, ruling out the direct-integration approach from the initial hypothesis.</li>",
    "case.compraki.body4":
      "A basic-basket price survey across three local supermarkets reinforced the gap:",
    "case.compraki.prices":
      "<li>Store 1 — R$ 163.36 (baseline)</li>" +
      "<li>Store 2 — R$ 218.55 (+33.78%)</li>" +
      "<li>Store 3 — R$ 180.02 (+10.19%)</li>",
    "case.compraki.heading4": "The necessary pivot",
    "case.compraki.body5": "With direct integration off the table, I pivoted the project's scope:",
    "case.compraki.pivot":
      "<li><strong>From:</strong> managing a shopping list with supermarkets' current prices.</li>" +
      "<li><strong>To:</strong> managing a shopping list with approximate, crowdsourced prices.</li>",
    "case.compraki.body6":
      "Real-time price retrieval was replaced by scanning the QR code on the Brazilian electronic receipt (NFC-e): by scanning a receipt, users themselves feed and keep the price database up to date, with no extra manual effort — the same technique used by apps like Méliuz.",
    "case.compraki.heading5": "Updated scope (MVP)",
    "case.compraki.body7": "The solution now focuses on two fronts:",
    "case.compraki.scope":
      "<li><strong>Basket comparison:</strong> automatically calculates where the full list is cheapest, factoring in travel distance too (geolocation).</li>" +
      "<li><strong>Crowdsourced updates:</strong> scanning receipt QR codes keeps the price database current.</li>",
    "case.compraki.body8":
      "A future convenience-prediction feature — store traffic indicators to help shoppers avoid peak hours — has been mapped out for a later version.",
    "case.compraki.note": "Project in progress.",

    // Estudo de caso completo: DestinoIdeal
    // (src/img/biafranzoi-destinoideal-*.png/.gif, <template id="case-destinoideal">)
    "case.destinoideal.lead":
      "A recommendation platform that uses a contextual filtering engine to turn subjective preferences into viable destinations.",
    "case.destinoideal.headingProto": "Try the prototype",
    "case.destinoideal.bodyProto":
      "Browse the prototype right here — or open it full screen in Figma.",
    "case.destinoideal.ctaProto": "View prototype",
    "case.destinoideal.heading1": "The problem",
    "case.destinoideal.body1":
      "The travel industry is built around transactions, not discovery — most booking tools assume travelers already know where they're going. That creates a paradox of choice: plenty of options and information, but little personal relevance to budget, travel-companion preferences, and logistics.",
    "case.destinoideal.heading2": "The solution",
    "case.destinoideal.body2":
      "DestinoIdeal is a curation platform that turns subjective preferences into viable destinations through a contextual filtering engine, addressing choice paralysis right at the top of the funnel. A freemium model connects users to local partner establishments.",
    "case.destinoideal.heading3": "Business hypothesis (monetization)",
    "case.destinoideal.body3": "The revenue structure follows a three-part freemium model:",
    "case.destinoideal.freemium":
      "<li><strong>Core loop:</strong> free destination discovery, to build user volume and behavioral data.</li>" +
      "<li><strong>Premium (R$ 49.90):</strong> convenience and less travel risk, with verified establishments and collaborative planning tools.</li>" +
      "<li><strong>B2B:</strong> a marketplace for local establishments to gain visibility with high-intent travelers.</li>",
    "case.destinoideal.body4":
      "Premium subscribers get access to advanced travel preferences, verified destinations, ratings from other subscribers, group trips, and shareable travel albums, among other perks — while cities and establishments pay for featured placement in search results.",
    "case.destinoideal.heading4": "Interface design and visual strategy",
    "case.destinoideal.body5":
      "The interface aimed to reduce cognitive load during a process that tends to be stressful:",
    "case.destinoideal.design":
      "<li><strong>Component architecture:</strong> Atomic Design ensures scalability, and Figma variables allow fast iteration with systemic consistency.</li>" +
      "<li><strong>Affordance and semantics:</strong> rounded corners and vibrant colors build emotional connection and reduce perceived technical complexity; visual hierarchy prioritizes the discovery CTA through a simplified onboarding.</li>",
    "case.destinoideal.heading5": "Retrospective and next steps",
    "case.destinoideal.body6":
      "Given the two-week conception window, the focus was validating the visual and functional value propositions. Critical next steps include:",
    "case.destinoideal.nextSteps":
      "<li><strong>Product-market fit validation:</strong> guerrilla testing to validate the recommendation algorithm's relevance.</li>" +
      "<li><strong>Using AI:</strong> testing AI agents for user search and recommendations, potentially pivoting the solution's scope.</li>" +
      "<li><strong>Engagement metrics:</strong> defining KPIs like quiz conversion rate and free-account retention.</li>" +
      "<li><strong>Accessibility:</strong> auditing color contrast for WCAG compliance and baseline accessibility standards.</li>",
    "case.destinoideal.note": "Prototype in validation phase.",

    // Estudo de caso completo: Meu Crediário — linha do tempo
    // (src/img/biafranzoi-crediario-*, <template id="case-crediario">).
    // "case.crediario.categoryValue" é omitido de propósito: "SaaS · WebApp"
    // é idêntico nos dois idiomas, então o texto do HTML já serve para EN.
    "case.crediario.lead":
      "Eight years growing a store-branded installment-credit SaaS for retailers — from the first website redesign to building the Design System, from new modules to a spin-off product, working end to end across Product Design, UX/UI, web, graphic design, and marketing.",
    "case.crediario.roleValue": "Product Design, UX/UI, web, graphic design, and marketing",
    "case.crediario.durationValue": "2018 – present",
    "case.crediario.introHeading": "The journey",
    "case.crediario.introBody":
      "A timeline of the main milestones along the way, from the most recent back to the first project, in 2018.",
    "case.crediario.yearPresent": "2018 – present",

    // m0 = marco mais recente (2026), acrescentado depois de m1..m15
    "case.crediario.m0.title": "Leading the UX Squad",
    "case.crediario.m0.items":
      "<li>Defining and tracking the squad's quarterly OKRs and goals;</li>" +
      "<li>Defining the roadmap of projects and product improvement initiatives;</li>" +
      "<li>Collaborating with peer leads from other Product squads and with leadership across other areas of the company;</li>" +
      "<li>Taking part in the company's annual planning.</li>",
    "case.crediario.m1.title": "Contribution to the Crediário Digital product",
    "case.crediario.m1.items":
      "<li>Organized the WebApp launch strategy;</li>" +
      "<li>Prototyped the required features;</li>" +
      "<li>Prototyped a redesigned second version of the WebApp, with UI and usability improvements.</li>",
    "case.crediario.m2.title": "Contribution to the Receivables Advance project",
    "case.crediario.m2.items":
      "<li>Gathered the project requirements;</li>" +
      "<li>Prototyped the features needed for the Internal module, enabling visualization and financial control of the advances.</li>",
    "case.crediario.m3.title": "Creation of the MC Light product",
    "case.crediario.m3.items":
      "<li>Led the project, aligning with stakeholders and the development partner;</li>" +
      "<li>Gathered the project's requirements and metrics;</li>" +
      "<li>Ran research with potential users;</li>" +
      "<li>Full prototyping with a responsive layout;</li>" +
      "<li>Handoff to development;</li>" +
      "<li>Built a Metabase dashboard and wrote SQL queries to track metrics;</li>" +
      "<li>Prototyped experiments to increase the conversion rate.</li>",
    "case.crediario.m4.title": "Redesign of the company's visual identity",
    "case.crediario.m4.items":
      "<li>Designed the symbol and logo from a reference provided by the board;</li>" +
      "<li>Created several versions of the logo;</li>" +
      "<li>Created the brand manual and recommended applications.</li>",
    "case.crediario.m5.title": "Redesign of the Collections module",
    "case.crediario.m5.items":
      "<li>Research with users of the old Collections module;</li>" +
      "<li>Gathered the project requirements;</li>" +
      "<li>Prototyped the module for validation with stakeholders;</li>" +
      "<li>Prototyped the module's final version in collaboration with peers;</li>" +
      "<li>Round of user testing using the Maze tool.</li>",
    "case.crediario.m6.title": "Redesign of the Subscription module",
    "case.crediario.m6.items":
      "<li>Gathered requirements for the project, which aimed to replace closed plans with a credit top-up concept;</li>" +
      "<li>Prototyped the complete module, including a mobile version;</li>" +
      "<li>Validation and adjustments together with the Product Manager;</li>" +
      "<li>Organized the strategy to migrate stores from the previous billing model to the new one.</li>",
    "case.crediario.m7.title": "Creation of the Design System",
    "case.crediario.m7.items":
      "<li>Inventoried components and the system's needs;</li>" +
      "<li>Standardized and componentized reusable elements;</li>" +
      "<li>Built a library in Zeroheight;</li>" +
      "<li>Collaborated with peers to improve contrast following WCAG guidelines;</li>" +
      "<li>Periodic maintenance.</li>",
    "case.crediario.m8.title": "Website redesign",
    "case.crediario.m8.items":
      "<li>Gathered the project requirements;</li>" +
      "<li>Prototyped the new website in AdobeXD;</li>" +
      "<li>Validation with the company's board;</li>" +
      "<li>Built the pages in WordPress.</li>",
    "case.crediario.m9.title": "Creation of the system's first mobile version",
    "case.crediario.m9.items":
      "<li>Built a mobile MVP of the system's core, improving the user experience.</li>",
    "case.crediario.m10.title": "Redesign of the onboarding experience with a self-service strategy",
    "case.crediario.m10.items":
      "<li>Study on self-service in SaaS;</li>" +
      "<li>Gathered ideas and tactics to convert leads into trials and trials into customers;</li>" +
      "<li>Improved the onboarding and first-use experience of the system.</li>",
    "case.crediario.m11.title": "Analysis and prototyping of improvements and new features",
    "case.crediario.m11.items":
      "<li>Research, analysis, prototyping, validation, and delivery of requests from various sources;</li>" +
      "<li>Monitoring system behavior and user experience with Hotjar;</li>" +
      "<li>Generating improvement requests and new features.</li>",
    "case.crediario.m12.title": "Transition into UX",
    "case.crediario.m12.items":
      "<li>UX Design workshop;</li>" +
      "<li>Began studying the field, its activities, and the right tools.</li>",
    "case.crediario.m13.title": "Blog redesign",
    "case.crediario.m13.items":
      "<li>Prototyped the blog's new layout in AdobeXD;</li>" +
      "<li>Handoff and follow-up of development with colleagues.</li>",
    "case.crediario.m14.title": "Website redesign",
    "case.crediario.m14.items":
      "<li>First studies of HTML5 and CSS3;</li>" +
      "<li>Prototyped the new website in Photoshop;</li>" +
      "<li>Validation with the company's board.</li>",
    "case.crediario.m15.title": "Design for the Marketing team",
    "case.crediario.m15.items":
      "<li>Designed and maintained landing pages in RD Station;</li>" +
      "<li>Designed creatives for social media, physical media, email marketing, ads, presentations, t-shirts, and more;</li>" +
      "<li>Laid out e-books;</li>" +
      "<li>Maintained lead nurturing and segmentation flows in RD Station.</li>",
    "case.crediario.note":
      "Thanks to Jeison, Tiago, Natália, and the entire Development, Sales, and CS team for the learning, partnership, and collaboration.",

    // Estudo de caso completo: DigiDoc (src/img/biafranzoi-digidoc-*.png,
    // <template id="case-digidoc">)
    "case.digidoc.lead":
      "An app where people store their personal documents and generate QR codes to share them easily and securely.",
    "case.digidoc.categoryValue": "App · Personal project",
    "case.digidoc.roleValue": "Research, ideation, wireframing, componentization, and prototyping",
    "case.digidoc.durationValue": "3 months",
    "case.digidoc.clientValue": "UX Unicórnio course",
    "case.digidoc.context":
      "In October 2020 I teamed up with two fellow UX designers to tackle a challenge around personal documentation in Brazil. I picked this topic because I run into these problems myself — and because it was the one with the fewest students interested in solving it.",
    "case.digidoc.heading1": "Framing the problem",
    "case.digidoc.body1":
      "Brazil's region-based identification system still leads to a decentralized approach, letting one person hold multiple identities. Physical documents remain dominant and, according to Serasa Experian, " +
      '<a href="https://g1.globo.com/economia/noticia/brasil-tem-1-tentativa-de-fraude-a-cada-16-segundos-em-2017-maior-indice-em-3-anos.ghtml" target="_blank" rel="noopener noreferrer">the country\'s most common fraud attempts rely on stolen or fake identities<span class="sr-only"> (opens in new tab)</span></a>.',
    "case.digidoc.body2":
      "The government has tried to encourage digitization with projects like the " +
      '<a href="https://www.techtudo.com.br/noticias/2019/04/como-vai-funcionar-o-documento-nacional-de-identificacao-dni-no-celular.ghtml" target="_blank" rel="noopener noreferrer">DNI (National Identification Document)<span class="sr-only"> (opens in new tab)</span></a>' +
      ", which would centralize documents in a single app. In practice, though, the current scenario requires " +
      '<a href="https://extra.globo.com/economia-e-financas/celular-ja-substitui-documentos-como-carteira-de-trabalho-cnh-cpf-titulo-de-eleitor-22152110.html" target="_blank" rel="noopener noreferrer">installing several different apps<span class="sr-only"> (opens in new tab)</span></a>' +
      " to carry digital documentation.",
    "case.digidoc.heading2": "Deciding which problem to solve",
    "case.digidoc.body3":
      "Taking on the decentralization of national documentation would have been unrealistic — the complexity is enormous. We chose to work on reissued documents instead: according to the Instituto Geral de Perícias, " +
      '<a href="https://g1.globo.com/sc/santa-catarina/noticia/2020/06/18/igp-de-sc-disponibiliza-pedido-online-para-2a-via-de-carteira-de-identidade.ghtml" target="_blank" rel="noopener noreferrer">Santa Catarina issues 550,000 ID cards a year and 70% are reissues<span class="sr-only"> (opens in new tab)</span></a>' +
      ". Bringing that number down saves citizens time and money, and cuts unnecessary use of public and natural resources.",
    "case.digidoc.goal":
      "<strong>Our goal:</strong> cut the reissuing of ID documents in Santa Catarina by 30% by October 2021.",
    "case.digidoc.heading3": "Understanding how people behave",
    "case.digidoc.body4":
      "We gathered our assumptions in a CSD matrix and prioritized the ones with the highest business impact that we were least certain about. For each hypothesis we wrote questions grounded in people's past or current behavior, so as not to lead the answer. We shared the form in Facebook and WhatsApp groups and collected <strong>96 responses in two days</strong>, later cross-referenced in Data Studio:",
    "case.digidoc.hypotheses":
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--invalid">Invalidated</span>' +
      '<p class="hypothesis__stat">63.5%</p>' +
      '<p class="hypothesis__finding">of those who regularly present documents still use physical ones.</p>' +
      '<p class="hypothesis__belief">“People know digital document apps exist.”</p>' +
      '<p class="hypothesis__note">The question should have probed awareness of the possibility, not usage.</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--invalid">Invalidated</span>' +
      '<p class="hypothesis__stat">36.6%</p>' +
      '<p class="hypothesis__finding">of banking-app users also use government document apps.</p>' +
      '<p class="hypothesis__belief">“Banking-app users are more likely to use digital documents.”</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--valid">Validated</span>' +
      '<p class="hypothesis__stat">72.7%</p>' +
      '<p class="hypothesis__finding">of people aged 49+ don\'t use digital documentation apps — though 45.5% consider digital as safe as physical.</p>' +
      '<p class="hypothesis__belief">“People over 50 find physical documents safer.”</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--invalid">Invalidated</span>' +
      '<p class="hypothesis__stat">56.3%</p>' +
      '<p class="hypothesis__finding">use their documents only occasionally in a week; just 28.1% more than twice.</p>' +
      '<p class="hypothesis__belief">“It matters that people have their documents always accessible digitally.”</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--invalid">Invalidated</span>' +
      '<p class="hypothesis__finding">Physical document use is still the majority across <strong>every age range</strong> surveyed.</p>' +
      '<p class="hypothesis__belief">“People under 40 prefer digital documents.”</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--valid">Validated</span>' +
      '<p class="hypothesis__stat">68.2%</p>' +
      '<p class="hypothesis__finding">of those who present and check documents hold digital ones.</p>' +
      '<p class="hypothesis__belief">“Public servants know digital documents exist.”</p>' +
      '<p class="hypothesis__note">The question should have probed awareness of the possibility, not usage.</p>' +
      "</li>" +
      '<li class="hypothesis">' +
      '<span class="hypothesis__verdict hypothesis__verdict--valid">Validated</span>' +
      '<p class="hypothesis__stat">83.3%</p>' +
      '<p class="hypothesis__finding">find checking digital documents easier than or as easy as physical ones.</p>' +
      '<p class="hypothesis__belief">“Servants who have checked digital documents prefer them.”</p>' +
      "</li>",
    "case.digidoc.body5":
      "We then talked to <strong>10 people with different profiles</strong> to understand the motivations behind those answers. Putting both studies together:",
    "case.digidoc.findings":
      "<li>Little awareness that using digital documents is even possible is one of the main reasons for low adoption;</li>" +
      "<li>Having to install several apps to carry every document is a concrete barrier;</li>" +
      "<li>Public servants are open to accepting digital document checks;</li>" +
      "<li>There's a barrier among older people — who nevertheless don't see digital documents as entirely unsafe;</li>" +
      "<li>Mishaps like a phone running out of battery are a real risk when relying on digital documents.</li>",
    "case.digidoc.heading4": "Our potential users",
    "case.digidoc.body6":
      "People aged 16 to 50 looking for a practical way to carry, present, and share personal documents — ID, driver's license, health plan card, student ID, gym card, and so on. They're open to digital documents and dissatisfied with the current government apps.",
    "case.digidoc.heading5": "Requirements and solution",
    "case.digidoc.body7":
      "The solution had to provide access to valid digital documents accepted in everyday situations, keep them always at hand and secure, allow sharing, and bring every document together in one place. The question that guided us: <em>how might we let people use personal documents practically and securely, reducing loss and damage and speeding up verification?</em>",
    "case.digidoc.body8":
      "We generated ideas and used an impact-versus-effort matrix to land on an MVP. The path we chose: register a document by scanning its QR code (or entering it manually) and keep its data and QR code available in the app for viewing, sharing, and presenting. We went with QR codes because:",
    "case.digidoc.whyQr":
      "<li>It's a widely used, widely understood technology, which makes the solution feel familiar and intuitive;</li>" +
      "<li>Brazilian documents already carry printed QR codes — so it's an approach the government has already made official.</li>",
    "case.digidoc.body9":
      "Integrating every document through the government apps' APIs would require standardizing data across several agencies — too complex for this scope. And digitizing photos via OCR involved a technology we knew less well and considered less dynamic than QR codes.",
    "case.digidoc.heading6": "Designing the app",
    "case.digidoc.body10":
      "Each of us sketched the screens and shared them with the team until we consolidated a single draft. We built a " +
      '<a href="https://marvelapp.com/prototype/5hab93a" target="_blank" rel="noopener noreferrer">paper low-fidelity prototype<span class="sr-only"> (opens in new tab)</span></a>' +
      " with the Marvel app and ran <strong>usability tests with 8 people</strong>: we asked them to imagine needing to book an important medical appointment and share their ID with the clinic — a task that walks through the whole flow, from adding a document to sharing it. Everyone completed it, and the tests surfaced small friction points in the navigation. We then mapped a user flow to see the whole app and define which screens we needed to design.",
    "case.digidoc.heading7": "UI and visual design",
    "case.digidoc.body11":
      "We documented the brand's styles and components — palette, typography, and buttons — with scalability and reuse in mind. A constant concern was picking colors and elements with good contrast and legibility, to support the app's accessibility.",
    "case.digidoc.body12":
      "With the flow, wireframes, and style guide in hand, we moved on to the high-fidelity MVP prototype. In 2024 I redesigned the screens to fix structural, usability, and design flaws, tying the research findings more closely to the solution: simplifying the visuals, building a clearer information architecture, and organizing the on-screen data better.",
    "case.digidoc.headingProto": "Try the prototype",
    "case.digidoc.bodyProto":
      "Browse the MVP prototype right here — or open it full screen in Figma.",
    "case.digidoc.ctaProto": "View prototype",
    "case.digidoc.ctaFile": "View Figma file",
    "case.digidoc.heading8": "Learnings and next steps",
    "case.digidoc.learnings":
      "<li>The project was a chance to learn, experiment, and work together across the different phases a product goes through while being conceived;</li>" +
      "<li>The next step would be another round of usability testing, now with the high-fidelity prototype;</li>" +
      "<li>A year after launch, we'd need to check whether ID reissues in Santa Catarina actually dropped by 30%;</li>" +
      "<li>Today I'd define metrics tied more directly to product adoption and usage, rather than a goal that depends solely on the external environment — subject to countless variables outside our control.</li>",
    "case.digidoc.note":
      "Built as a trio, as a case study for the UX Unicórnio course, with the prototype redesigned in 2024.",

    // Estudo de caso completo: Nebula (src/img/biafranzoi-nebula-*,
    // <template id="case-nebula">)
    "case.nebula.lead":
      "A storage SaaS focused on reducing the friction between uploading a file and collaborating on it.",
    "case.nebula.heading1": "The problem: collaborative friction and information silos",
    "case.nebula.body1":
      "In multimedia workflows, time lost searching for files and inefficient permission management create operational bottlenecks. Generic solutions fall short by offering no social context (who edited what?) and by making secure external sharing hard (links that expire, or excessive access).",
    "case.nebula.heading2": "UX strategy: focused on desktop productivity",
    "case.nebula.body2":
      "Unlike mobile interfaces, the focus here is the density of useful information.",
    "case.nebula.body3":
      "The layout started on paper: the sidebar, the prominent search, and the activity feed on the right were already there in the first sketch.",
    "case.nebula.heading3": "1. Visibility of system status (activity feed)",
    "case.nebula.body4":
      "The “Latest updates” sidebar isn't just decorative; it exists to cut communication overhead. Users grasp the project's status without opening file after file, applying the principle of recognition rather than recall.",
    "case.nebula.heading4": "2. Governance and granular security",
    "case.nebula.body5":
      "A standout in the project is the sharing modal, where I introduced:",
    "case.nebula.governance":
      "<li><strong>Time-based permissions:</strong> access for a limited time (e.g. “for 2 days”), essential for freelancers and external stakeholders;</li>" +
      "<li><strong>Role control:</strong> a clear distinction between Owner, Editor, and Reader, mitigating security risks.</li>",
    "case.nebula.heading5": "3. Data retrieval (search experience)",
    "case.nebula.body6":
      "Search was designed to be the interface's main engine. The real-time results dropdown lets users go straight to the file, bypassing the folder structure when speed is the priority.",
    "case.nebula.heading6": "Interface design: consistency and dark mode",
    "case.nebula.body7":
      "Dark mode isn't just an aesthetic choice, but a visual-comfort decision for professionals who spend long hours in front of a monitor (reducing eye strain).",
    "case.nebula.ui":
      "<li><strong>Atomic Design:</strong> the icon and card system was componentized to support different states (hover, selected, loading);</li>" +
      "<li><strong>Clear affordances:</strong> highlight colors guide the eye toward primary actions, like the “Upload new file” button, keeping the visual hierarchy balanced.</li>",
    "case.nebula.headingProto": "Try the prototype",
    "case.nebula.bodyProto":
      "Browse the prototype right here — or open it full screen in Figma.",
    "case.nebula.ctaProto": "View prototype",
    "case.nebula.heading7": "Retrospective and next steps",
    "case.nebula.body8": "As next steps for this case, I'd focus on:",
    "case.nebula.nextSteps":
      "<li><strong>Efficiency metric:</strong> comparing search task time (how long it takes a user to find a specific file via search vs. folders);</li>" +
      "<li><strong>Efficiency of use:</strong> establishing keyboard shortcuts for system actions, reducing effort for advanced users;</li>" +
      "<li><strong>Accessibility:</strong> auditing interface contrast for compliance with WCAG 2.1 baseline levels, ensuring legibility and visual comfort — especially under the critical contrast constraints of dark mode.</li>",
  };

  // Traduções para inglês: valor do atributo alt dos elementos marcados com
  // data-i18n-alt="chave".
  var EN_ALT = {
    "case.compraki.imageAlt":
      "Compraki prototype screens: product search, list building, market comparison by best total price and best distance, and premium subscription screens.",
    "case.destinoideal.imageAlt":
      "Animated demo of the destination search and recommendation flow in the DestinoIdeal prototype.",
    "case.destinoideal.imageAlt4":
      "DestinoIdeal homepage on desktop and mobile: destination search, curated places section, premium offer, and traveler testimonials.",
    "case.destinoideal.imageAlt3":
      "DestinoIdeal style guide: logo variations, color palette, typography, UI components (buttons, nav bar, cards), and testimonial card variations.",
    "case.crediario.m1.alt1":
      "Crediário Digital settings screen in the WebApp, with Pix payment activation.",
    "case.crediario.m1.alt2":
      "Mobile installment-payment screen of Crediário Digital.",
    "case.crediario.m1.alt3":
      "Mobile screen of a completed Pix payment in Crediário Digital.",
    "case.crediario.m1.alt4":
      "Mobile screen to scan the QR code and pay via Pix in Crediário Digital.",
    "case.crediario.m3.alt1":
      "MC Light home screen to start a customer's analysis.",
    "case.crediario.m3.alt2":
      "MC Light panel with a customer's credit analysis, showing score and financial data.",
    "case.crediario.m3.alt3":
      "Prototyping board of the MC Light screens.",
    "case.crediario.m4.alt1":
      "The new Meu Crediário logo applied to an office wall.",
    "case.crediario.m4.alt2":
      "The new Meu Crediário identity applied to a brand piece with devices.",
    "case.crediario.m5.alt1":
      "Prototyping flow of the Collections module.",
    "case.crediario.m5.alt2":
      "Collections module panel with customer metrics and a list of contracts to collect.",
    "case.crediario.m5.alt3":
      "Mobile screen with a customer's collection details.",
    "case.crediario.m5.alt4":
      "Mobile screen breaking down contracts in the Collections module.",
    "case.crediario.m6.alt1":
      "Desktop screen of the Subscription module in the Meu Crediário system.",
    "case.crediario.m6.alt2":
      "Prototyping board of the Subscription module.",
    "case.crediario.m6.alt3":
      "Mobile screen for a new wallet top-up, with the payment methods.",
    "case.crediario.m6.alt4":
      "Mobile screen to scan the top-up QR code.",
    "case.crediario.m6.alt5":
      "Mobile screen to register a card for the top-up.",
    "case.crediario.m7.alt1":
      "Meu Crediário Design System page, with principles, typography, colors, and components.",
    "case.crediario.m7.alt2":
      "Design System component library: buttons and their states.",
    "case.crediario.m7.alt3":
      "Color palette of the Meu Crediário Design System.",
    "case.crediario.m8.alt1":
      "Meu Crediário website homepage: store-branded installment credit for large and small retailers.",
    "case.crediario.m8.alt2":
      "Wireframe of the new Meu Crediário website.",
    "case.crediario.m8.alt3":
      "Wireframe of the new website's inner pages.",
    "case.crediario.m9.alt1":
      "AdobeXD prototyping board of the Meu Crediário mobile MVP.",
    "case.crediario.m13.alt1":
      "Prototyping board of the new Meu Crediário blog layout.",
    "case.crediario.m15.alt1":
      "Meu Crediário marketing piece: turn your installment credit into a sales machine.",
    "case.crediario.m15.alt2":
      "Marketing piece with a quote from Abilio Diniz about crisis and value.",
    "case.crediario.m15.alt3":
      "Meu Crediário Merry Christmas marketing piece.",
    "case.digidoc.alt1":
      "DigiDoc style guide: color palette with hex codes, Ubuntu type scale (H1 to H6), and button components in their various states.",
    "case.digidoc.alt2":
      "DigiDoc screens: home with most-used and recently shared documents, document detail, sharing screen with duration and password, generated QR code, and scanning a new document's QR code.",
    "case.digidoc.alt3":
      "Banner with several DigiDoc prototype screens: home, document list, sharing, generated QR code, and capturing a photo of the document.",
    "case.digidoc.alt4":
      "Full inventory of DigiDoc screens, organized by flow: splash, home, menu screens (all documents, my ID, shared, and settings), new document (QR scan, form, front and back photo, and document saved), empty search results, and sharing.",
    "case.nebula.alt1":
      "The Nebula dashboard on a laptop: sidebar with Home, Files, and Shared, a prominent search bar, “My files” and “Shared with me” grids, and the “Latest updates” feed on the right.",
    "case.nebula.alt2":
      "Sketch of the Nebula dashboard in a grid notebook: sidebar with Home, Files, and Shared, the “What do you need?” field, file grids, and the latest-activity column.",
    "case.nebula.alt3":
      "The Nebula upload modal showing “Brand Guidelines” being uploaded, with a progress bar and “Cancel upload” / “Finish upload” buttons.",
    "case.nebula.alt4":
      "The Nebula files panel with a PDF selected and the “Open”, “Share”, “Download”, and “Copy link” action bar highlighted.",
    "case.nebula.alt5":
      "The Nebula files panel with a “Sharing successful! Bix Challenge 2025 was successfully shared.” toast in the top-right corner.",
    "case.nebula.alt6":
      "The Nebula home screen with the “My files” and “Shared with me” panels side by side and the “Latest updates” feed on the right.",
    "case.nebula.alt7":
      "The Nebula search field with “Prod” typed in and a live results dropdown showing “Product List (February)” and “Product Roadmap 2025”.",
    "case.nebula.alt8":
      "The Nebula share modal for the “Product Roadmap 2025” file, listing people with access, roles (“Can edit”, “Can view”), and a temporary “For 2 days” permission with a password.",
  };

  // Traduções para inglês: valor do atributo href dos elementos marcados com
  // data-i18n-href="chave" (ex.: o currículo em inglês vive num arquivo à parte).
  var EN_HREF = {
    "about.downloadCvHref":
      "https://drive.google.com/uc?export=download&id=180XFoXax3ydkra7kp2xvDzV9_0Z63f3K",
  };

  // Traduções para inglês: valor do atributo aria-label dos elementos
  // marcados com data-i18n-aria-label="chave".
  var EN_ATTRS = {
    "settings.trigger": "Settings",
    "settings.theme.groupLabel": "Site theme",
    "settings.lang.groupLabel": "Site language",
    "marquee.ariaLabel": "Tools and technologies I use",
    "focus.ariaLabel": "Focus on experience, usability, and quality",
    "about.visualAlt": "Photo of Bia",
    "about.socialsGroupLabel": "Social media",
    "social.linkedin": "LinkedIn (opens in new tab)",
    "social.behance": "Behance (opens in new tab)",
    "social.github": "GitHub (opens in new tab)",
    "carousel.prev": "Previous testimonial",
    "carousel.next": "Next testimonial",
    "carousel.dotsGroupLabel": "Navigate between testimonials",
    "modal.close": "Close",
    "dock.navAriaLabel": "Main navigation",
    "case.digidoc.protoLabel": "Interactive DigiDoc prototype on Figma",
    "case.nebula.protoLabel": "Interactive Nebula prototype on Figma",
    "case.destinoideal.protoLabel": "Interactive DestinoIdeal prototype on Figma",
  };

  // Frases geradas só via JS (não existem como texto estático no HTML, ou
  // são reescritas periodicamente por JS — como o relógio, atualizado a
  // cada segundo — então uma marcação data-i18n estática seria sobrescrita).
  // Precisam das duas versões aqui.
  var DYNAMIC = {
    pt: {
      clockLabel: "Horário oficial de Brasília: ",
      fanBringToFront: function (name) {
        return "Trazer " + name + " para frente";
      },
      fanViewProject: function (name) {
        return "Ver projeto: " + name;
      },
      carouselGoTo: function (n) {
        return "Ir para o depoimento " + n;
      },
      pauseOn: "Pausar animações",
      pauseOff: "Ativar animações",
      modalKicker: "Projeto pessoal",
      clockTooltipPrep: "Estou me preparando para começar o dia.",
      clockTooltipWork: "Provavelmente, estou trabalhando agora.",
      clockTooltipLunch: "Provavelmente, estou almoçando agora.",
      clockTooltipDinner: "Provavelmente, estou jantando agora.",
      clockTooltipNight: [
        "Provavelmente, estou brincando com minha gata Cacau agora.",
        "Provavelmente, estou assistindo um filme ou série agora.",
        "Provavelmente, estou jogando videogame agora.",
      ],
      clockTooltipSleep: "Provavelmente, estou dormindo agora.",
    },
    en: {
      clockLabel: "Official Brasília time: ",
      fanBringToFront: function (name) {
        return "Bring " + name + " to the front";
      },
      fanViewProject: function (name) {
        return "View project: " + name;
      },
      carouselGoTo: function (n) {
        return "Go to testimonial " + n;
      },
      pauseOn: "Pause animations",
      pauseOff: "Enable animations",
      modalKicker: "Personal project",
      clockTooltipPrep: "I'm getting ready to start the day.",
      clockTooltipWork: "I'm probably working right now.",
      clockTooltipLunch: "I'm probably having lunch right now.",
      clockTooltipDinner: "I'm probably having dinner right now.",
      clockTooltipNight: [
        "I'm probably playing with my cat Cacau right now.",
        "I'm probably watching a movie or show right now.",
        "I'm probably playing video games right now.",
      ],
      clockTooltipSleep: "I'm probably sleeping right now.",
    },
  };

  // Kicker do modal (rótulo acima do título) por projeto: o padrão genérico
  // é "Projeto pessoal"/DYNAMIC.modalKicker acima (a maioria dos projetos é
  // pessoal), mas alguns merecem um rótulo próprio (ex.: Meu Crediário é
  // trabalho contínuo pra um cliente, não um projeto pessoal). Chave =
  // card.dataset.case do projeto.
  var KICKER_OVERRIDES = {
    pt: {
      crediario: "+8 anos de trabalho",
    },
    en: {
      crediario: "+8 years of work",
    },
  };

  function kickerFor(caseId) {
    var overrides = KICKER_OVERRIDES[currentLang] || KICKER_OVERRIDES.pt;
    if (caseId && Object.prototype.hasOwnProperty.call(overrides, caseId)) {
      return overrides[caseId];
    }
    var dict = DYNAMIC[currentLang] || DYNAMIC.pt;
    return dict.modalKicker;
  }

  var currentLang = "pt";
  var originalContent = new Map(); // elemento -> innerHTML original (pt-BR)
  var originalAttrs = new Map(); // elemento -> aria-label original (pt-BR)
  var originalAlts = new Map(); // elemento -> alt original (pt-BR)
  var originalHrefs = new Map(); // elemento -> href original (pt-BR)
  var captured = false;

  function captureOriginals() {
    if (captured) return;
    captured = true;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      originalContent.set(el, el.innerHTML);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      originalAttrs.set(el, el.getAttribute("aria-label"));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      originalAlts.set(el, el.getAttribute("alt"));
    });
    document.querySelectorAll("[data-i18n-href]").forEach(function (el) {
      originalHrefs.set(el, el.getAttribute("href"));
    });
  }

  function applyLanguage(lang) {
    if (VALID_LANGS.indexOf(lang) === -1) return;
    captureOriginals();
    currentLang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    // Nota: as buscas abaixo pegam TODO [data-i18n*] do documento, inclusive
    // o conteúdo já clonado de um <template id="case-*"> dentro de um modal
    // aberto. Esses clones NÃO passaram por captureOriginals(), então no ramo
    // "pt" a gente só restaura quem foi capturado (guarda .has()) — sem isso,
    // originalX.get(clone) seria undefined e apagaria o texto. Quem cuida de
    // retraduzir o modal aberto ao trocar de idioma é o listener i18n:change
    // no main.js (re-renderiza o case a partir do template).
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (lang === "pt") {
        if (originalContent.has(el)) el.innerHTML = originalContent.get(el);
      } else if (Object.prototype.hasOwnProperty.call(EN_CONTENT, key)) {
        el.innerHTML = EN_CONTENT[key];
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (lang === "pt") {
        if (originalAttrs.has(el)) el.setAttribute("aria-label", originalAttrs.get(el));
      } else if (Object.prototype.hasOwnProperty.call(EN_ATTRS, key)) {
        el.setAttribute("aria-label", EN_ATTRS[key]);
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (lang === "pt") {
        if (originalAlts.has(el)) el.setAttribute("alt", originalAlts.get(el));
      } else if (Object.prototype.hasOwnProperty.call(EN_ALT, key)) {
        el.setAttribute("alt", EN_ALT[key]);
      }
    });

    document.querySelectorAll("[data-i18n-href]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-href");
      if (lang === "pt") {
        if (originalHrefs.has(el)) el.setAttribute("href", originalHrefs.get(el));
      } else if (Object.prototype.hasOwnProperty.call(EN_HREF, key)) {
        el.setAttribute("href", EN_HREF[key]);
      }
    });

    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      // localStorage indisponível — o idioma ainda funciona nesta visita
    }

    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang } }));
  }

  // Traduz um sub-DOM que nunca passou por captureOriginals()/applyLanguage()
  // — hoje, só o conteúdo clonado de um <template id="case-*"> (ver
  // openProject em main.js). O <template> em si já está em português (é a
  // fonte da verdade, igual ao resto do HTML), então em "pt" não há nada a
  // fazer: cada clone novo já nasce correto. Só precisa agir em "en".
  function translateNode(root) {
    if (currentLang !== "en") return;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(EN_CONTENT, key)) {
        el.innerHTML = EN_CONTENT[key];
      }
    });
    root.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (Object.prototype.hasOwnProperty.call(EN_ALT, key)) {
        el.setAttribute("alt", EN_ALT[key]);
      }
    });
    // mesmos atributos que o applyLanguage trata, pra um clone de <template>
    // ficar completo (ex.: o aria-label do iframe do protótipo do DigiDoc)
    root.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (Object.prototype.hasOwnProperty.call(EN_ATTRS, key)) {
        el.setAttribute("aria-label", EN_ATTRS[key]);
      }
    });
    root.querySelectorAll("[data-i18n-href]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-href");
      if (Object.prototype.hasOwnProperty.call(EN_HREF, key)) {
        el.setAttribute("href", EN_HREF[key]);
      }
    });
  }

  function t(key) {
    var dict = DYNAMIC[currentLang] || DYNAMIC.pt;
    var entry = dict[key];
    if (typeof entry !== "function") return entry;
    var args = Array.prototype.slice.call(arguments, 1);
    return entry.apply(null, args);
  }

  function getLang() {
    return currentLang;
  }

  function getSavedLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      return VALID_LANGS.indexOf(saved) !== -1 ? saved : "pt";
    } catch (e) {
      return "pt";
    }
  }

  window.i18n = {
    applyLanguage: applyLanguage,
    translateNode: translateNode,
    t: t,
    kickerFor: kickerFor,
    getLang: getLang,
    getSavedLang: getSavedLang,
  };
})();
