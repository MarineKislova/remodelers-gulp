import * as commonFunctions from "./modules/functions.js";

window.addEventListener("DOMContentLoaded", () => {
  "use strict";
  commonFunctions.isWebp();

  // Создаем табы для сайта
  function tabs(selectorTab, selectorContent, selectorParent, activeClass) {
    // Добавляем точки к селекторам, если их забыли
    const tabs = document.querySelectorAll(selectorTab);
    const tabsContent = document.querySelectorAll(selectorContent);
    const tabsParent = document.querySelector(selectorParent);

    function hideTabContent() {
      tabsContent.forEach((item) => {
        item.style.display = "none";
      });
      tabs.forEach((item) => {
        item.classList.remove(activeClass);
      });
    }

    function showTabContent(i = 0) {
      // Для #projects нам нужен grid, для остальных можно block
      const displayType = tabsContent[i].id === "projects" ? "grid" : "block";
      tabsContent[i].style.display = displayType;
      tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent(0);

    // Используем делегирование на родителя (это эффективнее)
    tabsParent.addEventListener("click", (e) => {
      const target = e.target;
      // Проверяем, что кликнули именно по табу (убираем точку из селектора для проверки класса)
      if (target && target.classList.contains(selectorTab.replace(".", ""))) {
        tabs.forEach((item, i) => {
          if (target == item) {
            hideTabContent();
            showTabContent(i);
          }
        });
      }
    });
  }

  // Вызываем правильно с селекторами (с точками!)
  tabs(".tablinks", ".tabcontent", ".tab", "active-btn");

  /* -------  PROJECTS ------- */

  //загрузка проектов из JSON
  let projectsData = [];
  async function loadProjects() {
    try {
      const response = await fetch("js/data/dataProjects.json"); // путь к твоему файлу
      projectsData = await response.json();
      console.log("Данные внутри функции:", projectsData);

      renderProjects(projectsData);
      // После загрузки проверяем URL, вдруг пользователь перешел по прямой ссылке
      // checkInitialUrl();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }

  //рендер карточек проектов
  function renderProjects(projects) {
    const projectsContainer = document.getElementById("projects");
    if (!projectsContainer) return;
    const projectAmount = document.getElementById("projects-amount");
    if (!projectAmount) return;

    projectsContainer.innerHTML = "";
    projectAmount.textContent = "";

    projects.forEach((project) => {
      if (!project.id) return;

      const projectElement = document.createElement("div");
      projectElement.classList.add("project__card");
      projectElement.dataset.id = project.id;
      projectElement.innerHTML = `
      <div class="project__img">
                    <img
                    src="${project.demoImg}"
                    sizes="100vw"
                    alt="${project.title}"
                    loading="lazy"
                    srcset="
                      ${project.demoImg}  320w,
                      ${project.demoImg}  375w,
                      ${project.demoImg}  414w,
                      ${project.demoImg}  768w,
                      ${project.demoImg}  900w,
                      ${project.demoImg} 1024w,
                      ${project.demoImg} 1200w,
                      ${project.demoImg} 1440w,
                      ${project.demoImg} 1920w
                    "
              />
        </div>
      <button class="project__btn">${project.title}</button>`;

      projectsContainer.appendChild(projectElement);
    });

    projectAmount.textContent = `(${projects.length - 1})`;
  }

  loadProjects();

  // рендер проектов
  function renderProjectDetails(project) {
    const title = document.getElementById("pd-title");
    const description = document.getElementById("pd-description");
    const gallery = document.getElementById("pd-gallery");
    const modalSlidesContainer = document.querySelector(".modal-content-slides"); // Слайды в модалке
    const thumbnailsContainer = document.querySelector(".modal-thumbnails"); // Миниатюры в модалке

    title.textContent = project.title;
    description.innerHTML = project.description;

    // Очистка и отрисовка галереи
    gallery.innerHTML = project.gallery
      .map(
        (img) => `
        <div class="project-gallery__item">
            <img
                    src="${img.src}"
                    sizes="100vw"
                    alt="${img.alt}"
                    loading="lazy"
                    srcset="
                      ${img.src}  320w,
                      ${img.src}  375w,
                      ${img.src}  414w,
                      ${img.src}  768w,
                      ${img.src}  900w,
                      ${img.src} 1024w,
                      ${img.src} 1200w,
                      ${img.src} 1440w,
                      ${img.src} 1920w
                    "
              />
        </div>
    `,
      )
      .join("");

    // Рендерим слайды для модалки
    modalSlidesContainer.innerHTML = project.gallery
      .map(
        (img, index) => `
    <div class="mySlides">
      <div class="numbertext">${index + 1} / ${project.gallery.length}</div>
                  <img
                    src="${img.src}"
                    sizes="100vw"
                    alt="${img.alt}"
                    loading="lazy"
                    srcset="
                      ${img.src}  320w,
                      ${img.src}  375w,
                      ${img.src}  414w,
                      ${img.src}  768w,
                      ${img.src}  900w,
                      ${img.src} 1024w,
                      ${img.src} 1200w,
                      ${img.src} 1440w,
                      ${img.src} 1920w
                    "
              />
    </div>
  `,
      )
      .join("");

    // Рендерим миниатюры (внизу модалки)
    thumbnailsContainer.innerHTML = project.gallery
      .map(
        (img, index) => `
    <div class="column">
      <img class="demo cursor" src="${img.src}" alt="${img.alt}">
    </div>
  `,
      )
      .join("");

    document.querySelectorAll(".project-gallery__item").forEach((item) => {
      item.addEventListener("click", openModal);
    });

    thumbnailsContainer.querySelectorAll("img.demo").forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        currentSlide(index + 1);
      });
    });
    slideIndex = 1;
    showSlides(slideIndex);
  }

  // функция открытия проекта
  function openProject(projectId) {
    const project = projectsData.find((p) => p.id === projectId);

    if (project) {
      renderProjectDetails(project);

      // Скрываем навигацию табов и все контентные блоки
      document.querySelector(".tab").style.display = "none";
      document.querySelectorAll(".tabcontent").forEach((tab) => (tab.style.display = "none"));

      // Показываем блок деталей
      document.getElementById("project-details").style.display = "block";

      // Обновляем URL
      history.pushState({ projectId: projectId }, "", `?project=${projectId}`);
    }
  }

  // Слушатель кликов на карточки
  document.querySelector("#projects").addEventListener("click", (e) => {
    const card = e.target.closest(".project__card");
    if (card) {
      openProject(card.dataset.id);
    }
  });

  // закрытие
  function closeProject() {
    // Скрываем навигацию табов и все контентные блоки
    document.querySelector(".tab").style.display = "flex";
    // document.querySelectorAll(".tabcontent").forEach((tab) => (tab.style.display = "grid"));
    document.getElementById("projects").style.display = "grid";

    // Показываем блок деталей
    document.getElementById("project-details").style.display = "none";
    console.log("close");
  }

  document.querySelector("#close-project").addEventListener("click", closeProject);

  //modal
  let slideIndex = 1;
  showSlides(slideIndex);

  function openModal() {
    document.getElementById("myModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("myModal").style.display = "none";
  }
  document.querySelector(".close-cursor").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // если нажали Esc
      closeModal();
    }
  });
  document.getElementById("myModal").addEventListener("click", (e) => {
    // если кликнули именно по модалке (фон), а не по контенту
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }
  const prevBtn = document.querySelector(".prev");
  prevBtn.addEventListener("click", () => plusSlides(-1));
  const nextBtn = document.querySelector(".next");
  nextBtn.addEventListener("click", () => plusSlides(1));

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");

    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].style.display = "flex";
      dots[slideIndex - 1].className += " active";
      captionText.innerHTML = dots[slideIndex - 1].alt;
    }
  }

  /* ------- BLOG ------- */

  //рендер статей

  //загрузка проектов из JSON
  let articlesData = [];
  async function loadArticles() {
    try {
      const response = await fetch("js/data/dataBlog.json"); // путь к твоему файлу
      articlesData = await response.json();
      console.log("Данные внутри функции:", articlesData);

      renderArticles(articlesData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }

  function renderArticles(articles) {
    const articlesContainer = document.getElementById("blog");
    if (!articlesContainer) return;
    const articlesAmount = document.getElementById("articles-amount");
    if (!articlesAmount) return;
    const articleItems = document.getElementById("blog-accordion");
    if (!articleItems) return;

    articlesAmount.textContent = "";
    articleItems.innerHTML = "";

    articles.forEach((article) => {
      const articleItem = document.createElement("div");
      articleItem.classList.add("accordion__item", "accordion-item");
      articleItem.setAttribute("id", article.id);

      const articleMaintitle = document.createElement("div");
      articleMaintitle.classList.add("accordion__item-maintitle");
      articleMaintitle.style.background = `url(${article.titleImg}) center/100% no-repeat`;
      articleItem.appendChild(articleMaintitle);
      const articleH2 = document.createElement("h2");
      articleH2.textContent = article.title;
      articleMaintitle.appendChild(articleH2);

      const articleHeader = document.createElement("div");
      articleHeader.classList.add("accordion__item-header", "accordion-toggle");
      articleItem.appendChild(articleHeader);
      const articleTitle = document.createElement("h3");
      articleTitle.classList.add("accordion__item-title");
      articleTitle.textContent = article.brief;
      articleHeader.appendChild(articleTitle);
      const articleIcon = document.createElement("span");
      articleIcon.classList.add("accordion__item-icon", "accordion-icon");
      articleIcon.textContent = "+";
      articleHeader.appendChild(articleIcon);

      const articleBody = document.createElement("div");
      articleBody.classList.add("accordion__item-body");
      articleBody.innerHTML = article.description;
      articleItem.appendChild(articleBody);

      if (!article.id) return;

      articleItems.appendChild(articleItem);
    });

    articlesAmount.textContent = `(${articles.length - 1})`;

    // аккордиеон
    const accordionToggle = document.querySelectorAll(".accordion-toggle");
    accordionToggle.forEach((item) => {
      item.addEventListener("click", () => {
        const parentItem = item.closest(".accordion-item");
        const content = item.nextElementSibling;
        const icon = item.querySelector(".accordion-icon");

        // Если нужно, чтобы при открытии одного закрывались остальные:
        const isOpen = parentItem.classList.contains("collapsed");

        // Сначала сбрасываем все элементы
        document.querySelectorAll(".accordion-item").forEach((el) => {
          el.classList.remove("collapsed");
          el.querySelector(".accordion__item-body").style.display = "none";
          el.querySelector(".accordion-icon").textContent = "+";
        });

        // Если кликнутый элемент не был открыт — открываем его
        if (!isOpen) {
          parentItem.classList.add("collapsed");
          content.style.display = "flex";
          icon.textContent = "-";
        }
      });
    });
  }

  loadArticles();
});
