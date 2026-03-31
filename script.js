const projectsContainer = document.getElementById("projects-container");
const paginationContainer = document.getElementById("pagination");
const projectsSection = document.getElementById("projects-section");
const projectsPerPage = 8;

let allProjects = [];
let currentPage = 1;

const createProjectCard = (project) => {
  const card = document.createElement("article");
  card.className = "project";
  const tags = Array.isArray(project.tags)
    ? project.tags
    : project.tag
      ? [project.tag]
      : [];
  const tagMarkup = tags
    .map((tag) => `<span class="project-tag">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <div class="project-image-panel">
      <img src="${project.image}" alt="${project.alt}" loading="lazy">
      <div class="project-image-overlay" aria-hidden="true"></div>
    </div>
    <div class="project-content">
      <p class="project-eyebrow">${project.eyebrow}</p>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-actions">
        <div class="project-tags">
          ${tagMarkup}
        </div>
        <a href="${project.url}" target="_blank" rel="noreferrer" aria-label="View ${project.title}">
          <i class="bi bi-eye"></i>
        </a>
      </div>
    </div>
  `;

  return card;
};

const renderPagination = () => {
  const totalPages = Math.ceil(allProjects.length / projectsPerPage);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  paginationContainer.innerHTML = `
    <button class="pagination-button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>
      Previous
    </button>
    <span class="pagination-status">Page ${currentPage} of ${totalPages}</span>
    <button class="pagination-button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>
      Next
    </button>
  `;

  paginationContainer
    .querySelectorAll(".pagination-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const nextPage = Number(button.dataset.page);
        if (nextPage >= 1 && nextPage <= totalPages) {
          currentPage = nextPage;
          renderProjects();
          projectsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
};

const renderProjects = async () => {
  try {
    if (allProjects.length === 0) {
      const response = await fetch("./projects.json");

      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }

      allProjects = await response.json();
    }

    const startIndex = (currentPage - 1) * projectsPerPage;
    const projectsToShow = allProjects.slice(
      startIndex,
      startIndex + projectsPerPage,
    );

    projectsContainer.innerHTML = "";
    projectsToShow.forEach((project) => {
      projectsContainer.appendChild(createProjectCard(project));
    });
    renderPagination();
  } catch (error) {
    projectsContainer.innerHTML = `
      <article class="project project-loading">
        <div class="project-content">
          <p>The projects could not be loaded right now. Please try again in a moment.</p>
        </div>
      </article>
    `;
    paginationContainer.innerHTML = "";
    console.error(error);
  }
};

renderProjects();
