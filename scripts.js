const renderTargets = document.querySelectorAll("[data-render]");
const page = document.body.dataset.page;

const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const pillList = (items = []) =>
  items.map((item) => `<span class="pill">${escapeHTML(item)}</span>`).join("");

const imageMarkup = (src, alt, className = "") =>
  `<img class="${className}" src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" />`;

const waveButton = (classes, url, label, icon = "") => `
  <a class="wave-button ${classes}" href="${escapeHTML(url)}">
    <span>${escapeHTML(label)}</span>
    ${icon ? `<i class="bi ${escapeHTML(icon)}" aria-hidden="true"></i>` : ""}
  </a>
`;

const projectCard = (project, isMini = false) => `
  <article class="${isMini ? "mini-card" : "project-card"} reveal">
    <a class="image-frame" href="${escapeHTML(project.liveUrl)}" aria-label="Open ${escapeHTML(project.title)}">
      ${imageMarkup(project.image, project.imageAlt)}
    </a>
    <div class="card-content">
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="pill-row">${pillList(project.pills)}</div>
      <div class="card-links">
        <a href="${escapeHTML(project.liveUrl)}">Live site <i class="bi bi-arrow-up-right"></i></a>
        <a href="${escapeHTML(project.codeUrl)}">View code <i class="bi bi-github"></i></a>
      </div>
    </div>
  </article>
`;

const illustrationCard = (item, isPreview = false) => `
  <article class="${isPreview ? "illustration-tile" : "illustration-card"} reveal">
    <div class="image-frame">
      ${imageMarkup(item.image, item.imageAlt)}
    </div>
    <div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      ${isPreview ? "" : `<div class="pill-row">${pillList(item.pills)}</div>`}
    </div>
  </article>
`;

const renderHero = (target, data) => {
  const { hero } = data;

  target.innerHTML = `
    <div class="hero-copy reveal">
      <h1>${escapeHTML(hero.title)}</h1>
      <p>${escapeHTML(hero.description)}</p>
      <div class="button-row">
        ${waveButton("primary", hero.primaryCta.url, hero.primaryCta.label, "bi-arrow-right")}
        ${waveButton("secondary", hero.secondaryCta.url, hero.secondaryCta.label)}
      </div>
    </div>
    <div class="hero-art reveal">
      ${imageMarkup(hero.image, hero.imageAlt)}
    </div>
  `;
};

const renderSpotlights = (target, data) => {
  target.innerHTML = data.spotlights
    .map(
      (item) => `
        <article class="spotlight-card reveal">
          <span class="icon-disc"><i class="bi ${escapeHTML(item.icon)}"></i></span>
          <div>
            <h2>${escapeHTML(item.title)}</h2>
            <p>${escapeHTML(item.description)}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderDevelopmentIntro = (target, data) => {
  const pageContent = data.developmentPage;

  target.innerHTML = `
    <p class="eyebrow">${escapeHTML(pageContent.eyebrow)}</p>
    <h1>${escapeHTML(pageContent.title)}</h1>
    <p>${escapeHTML(pageContent.description)}</p>
  `;
};

const renderIllustrationIntro = (target, data) => {
  const pageContent = data.illustrationPage;

  target.innerHTML = `
    <p class="eyebrow">${escapeHTML(pageContent.eyebrow)}</p>
    <h1>${escapeHTML(pageContent.title)}</h1>
    <p>${escapeHTML(pageContent.description)}</p>
  `;
};

const renderAboutPreview = (target, data) => {
  const about = data.about;

  target.innerHTML = `
    <div>
      <h2>${escapeHTML(about.title)}</h2>
      <p>${escapeHTML(about.summary)}</p>
      <a class="text-link" href="about.html">Read more about me <i class="bi bi-arrow-right"></i></a>
    </div>
    ${imageMarkup(about.image, about.imageAlt)}
  `;
};

const renderAboutPage = (target, data) => {
  const about = data.about;
  const [leadParagraph, ...storyParagraphs] = about.intro;

  target.innerHTML = `
    <div class="about-hero-card reveal">
      <div class="about-story">
        <p class="eyebrow">${escapeHTML(data.site.role)}</p>
        <h1>${escapeHTML(about.title)}</h1>
        <p>${escapeHTML(leadParagraph)}</p>
      </div>
      <div class="about-portrait">
        ${imageMarkup(about.image, about.imageAlt)}
        <span class="sparkle one"></span>
        <span class="sparkle two"></span>
      </div>
      <div class="about-hero-continuation">
        ${storyParagraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      </div>
    </div>
    <div class="about-asides reveal">
      ${about.sections
        .map(
          (section) => `
            <section class="about-copy-section">
              <h2>${escapeHTML(section.title)}</h2>
              ${section.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
            </section>
          `
        )
        .join("")}
    </div>
  `;
};

const renderSkills = (target, data) => {
  target.innerHTML = `
    <h2>Skills & tools</h2>
    <div class="pill-row skill-pills">${pillList(data.skills)}</div>
  `;
};

const renderContactPage = (target, data) => {
  const { contact } = data;

  target.innerHTML = `
    <div class="contact-copy reveal">
      <p class="eyebrow">Contact</p>
      <h1>${escapeHTML(contact.title)}</h1>
      <p>${escapeHTML(contact.description)}</p>
    </div>
    <div class="contact-links reveal">
      ${contact.links
        .map(
          (link) => `
            <a href="${escapeHTML(link.url)}">
              <i class="bi ${escapeHTML(link.icon)}"></i>
              <span>
                <small>${escapeHTML(link.label)}</small>
                ${escapeHTML(link.value)}
              </span>
            </a>
          `
        )
        .join("")}
      <a href="cv.html">
        <i class="bi bi-file-earmark-person"></i>
        <span>
          <small>CV</small>
          View curriculum
        </span>
      </a>
    </div>
  `;
};

const renderCvPage = (target, data) => {
  const { site, cv } = data;

  target.innerHTML = `
    <div class="cv-toolbar reveal">
      <a class="text-link" href="contact.html"><i class="bi bi-arrow-left"></i> Back to contact</a>
      <button class="wave-button primary" type="button" data-print-cv>
        <span>Save as PDF</span>
        <i class="bi bi-download" aria-hidden="true"></i>
      </button>
    </div>
    <article class="cv-sheet reveal">
      <header class="cv-header">
        <div>
          <p class="eyebrow">${escapeHTML(site.role)}</p>
          <h1>${escapeHTML(site.name)}</h1>
          <p>${escapeHTML(cv.intro)}</p>
        </div>
        <ul class="cv-contact-list">
          <li>${escapeHTML(site.email)}</li>
          <li>${escapeHTML(site.location)}</li>
          <li>${escapeHTML(site.github.replace("https://", ""))}</li>
        </ul>
      </header>
      <section class="cv-section cv-profile">
        <h2>Profile</h2>
        ${cv.profile.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      </section>
      <div class="cv-layout">
        <section class="cv-section cv-experience">
          <h2>Work Experience</h2>
          <div class="cv-timeline">
            ${cv.experience
              .map(
                (item) => `
                  <article class="cv-timeline-item">
                    <div class="cv-date">${escapeHTML(item.dates)}</div>
                    <div>
                      <h3>${escapeHTML(item.role)}</h3>
                      <p class="cv-meta">${escapeHTML(item.company)}</p>
                      <ul>
                        ${item.details.map((detail) => `<li>${escapeHTML(detail)}</li>`).join("")}
                      </ul>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
        <aside class="cv-sidebar">
          <section class="cv-section">
            <h2>Education</h2>
            <div class="cv-stack">
              ${cv.education
                .map(
                  (item) => `
                    <article>
                      <p class="cv-date">${escapeHTML(item.dates)}</p>
                      <h3>${escapeHTML(item.degree)}</h3>
                      <p>${escapeHTML(item.school)} | ${escapeHTML(item.location)}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
          <section class="cv-section cv-certifications">
            <h2>Certification</h2>
            <div class="cv-stack">
              ${cv.certifications
                .map(
                  (item) => `
                    <article>
                      <p class="cv-date">${escapeHTML(item.date)}</p>
                      <h3>${escapeHTML(item.name)}</h3>
                      <p>${escapeHTML(item.issuer)}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
        </aside>
      </div>
      <section class="cv-section">
        <h2>Skills & Tools</h2>
        <div class="pill-row skill-pills">${pillList(data.skills)}</div>
      </section>
    </article>
  `;
};

const renderFooter = (target, data) => {
  const { site, contact, footer } = data;

  target.innerHTML = `
    <div class="footer-main">
      <div class="footer-cta">
        <h2>${escapeHTML(contact.title)}</h2>
        ${waveButton("light", "contact.html", "Get in touch", "bi-arrow-right")}
      </div>
      <div class="footer-links">
        ${contact.links
          .map((link) =>
            link.url === "#"
              ? `<span><i class="bi ${escapeHTML(link.icon)}"></i>${escapeHTML(link.value)}</span>`
              : `<a href="${escapeHTML(link.url)}"><i class="bi ${escapeHTML(link.icon)}"></i>${escapeHTML(link.value)}</a>`
          )
          .join("")}
      </div>
      <div class="footer-art" aria-hidden="true">
        ${imageMarkup(footer.image, footer.imageAlt)}
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${escapeHTML(site.copyright)}</span>
    </div>
  `;
};

const renderContent = (data) => {
  renderTargets.forEach((target) => {
    const renderType = target.dataset.render;
    const featured = data.projects.filter((project) => project.featured);
    const more = data.projects.filter((project) => !project.featured);

    const renderers = {
      hero: () => renderHero(target, data),
      spotlights: () => renderSpotlights(target, data),
      "development-intro": () => renderDevelopmentIntro(target, data),
      "illustration-intro": () => renderIllustrationIntro(target, data),
      "featured-projects": () => (target.innerHTML = featured.map((item) => projectCard(item)).join("")),
      "more-projects": () => (target.innerHTML = more.map((item) => projectCard(item, true)).join("")),
      "all-projects": () => (target.innerHTML = data.projects.map((item) => projectCard(item)).join("")),
      "illustration-preview": () =>
        (target.innerHTML = data.illustrations.slice(0, 4).map((item) => illustrationCard(item, true)).join("")),
      "illustration-gallery": () =>
        (target.innerHTML = data.illustrations.map((item) => illustrationCard(item)).join("")),
      "about-preview": () => renderAboutPreview(target, data),
      "about-page": () => renderAboutPage(target, data),
      skills: () => renderSkills(target, data),
      "contact-page": () => renderContactPage(target, data),
      "cv-page": () => renderCvPage(target, data),
      footer: () => renderFooter(target, data)
    };

    renderers[renderType]?.();
  });
};

const activateNav = () => {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
};

const setupNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = `<i class="bi ${isOpen ? "bi-x-lg" : "bi-list"}"></i>`;
  });
};

const setupButtonSounds = () => {
  const sound = new Audio("assets/sounds/buttonClick.mp3");

  document.querySelectorAll("button, .wave-button").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    });
  });
};

const setupCvPrint = () => {
  document.querySelector("[data-print-cv]")?.addEventListener("click", () => {
    window.print();
  });
};

const setupImageProtection = () => {
  document.querySelectorAll("img").forEach((image) => {
    image.setAttribute("draggable", "false");
    image.addEventListener("contextmenu", (event) => event.preventDefault());
    image.addEventListener("dragstart", (event) => event.preventDefault());
  });
};

const setupReveals = () => {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
    observer.observe(item);
  });
};

const loadPortfolio = async () => {
  try {
    const response = await fetch("./data.json?v=about-update");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    renderContent(data);
    activateNav();
    setupNavigation();
    setupButtonSounds();
    setupCvPrint();
    setupImageProtection();
    setupReveals();
  } catch (error) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<p class="data-error">The portfolio content could not be loaded.</p>`
    );
    console.error("Failed to load JSON data:", error);
  }
};

loadPortfolio();
