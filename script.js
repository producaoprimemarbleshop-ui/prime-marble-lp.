const DATA_URL =
  "./68916c6e3a49f1d8/pages/6af5b6c37292c274/page_variants/a/elements.json";
const ASSET_ROOT = "./68916c6e3a49f1d8/assets";

const localCarouselAssets = [
  ["727a85ee-a189-4cc4-9526-aa51fce9b132", "frame-839.png"],
  ["da832111-9d30-4efb-9a0f-d8e3fcd6cb2e", "frame-837.png"],
  ["a8f7a9fa-06b7-4fce-98cc-c2c0c273c100", "frame-836.png"],
  ["e665dad6-a2ba-4f5a-89fc-bac7d72ae107", "frame-835.png"],
  ["38d69c37-8d75-4f8e-839b-1591233eec76", "frame-834.png"],
  ["4666eedf-42ec-447d-878f-48a6b159c93d", "frame-833.png"],
  ["8aea555b-b677-487e-b07e-3d7535939bf5", "frame-832.png"],
  ["79828740-9be6-4463-b8db-65e548ad21b2", "frame-831.png"],
  ["8a09cc29-4b99-4351-aa18-959a31d19e46", "frame-830.png"],
  ["36f6fcfb-b47e-47aa-81db-72862f27ec44", "frame-829.png"],
  ["1e9b84ac-9248-41b1-8aff-017168b19bf8", "frame-838.png"],
  ["18b228b3-d01b-4845-87e9-5356e3f0378c", "frame-840.png"],
].map(([uuid, file]) => `${ASSET_ROOT}/${uuid}/${file}`);

let elements = [];
let lastBreakpoint = "";

init();

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    elements = await response.json();
    lastBreakpoint = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    renderLandingPage();
    window.addEventListener("resize", () => {
      const current = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
      if (current !== lastBreakpoint) {
        lastBreakpoint = current;
        renderLandingPage();
      }
    });
  } catch (error) {
    document.getElementById("landing-page").innerHTML =
      '<div class="error">Nao foi possivel carregar a landing page.</div>';
    console.error(error);
  }
}

function renderLandingPage() {
  const app = document.getElementById("landing-page");
  const isMobile = lastBreakpoint === "mobile";
  const blocks = elements.filter((item) => item.type === "lp-pom-block");
  app.replaceChildren(...blocks.map((block) => renderBlock(block, isMobile)));
  startCarousel();
}

function renderBlock(block, isMobile) {
  const section = document.createElement("section");
  const geometry = getGeometry(block, isMobile);
  section.className = "lp-section";
  section.id = block.id;
  const sectionHeight =
    block.id === "lp-pom-block-11" && isMobile
      ? Math.max(geometry.size.height, 560)
      : geometry.size.height;
  section.style.height = `${sectionHeight}px`;
  applyBackground(section, block, isMobile);

  const stage = document.createElement("div");
  stage.className = "lp-stage";
  section.append(stage);

  const children = getChildren(block.id);
  children.forEach((child) => {
    const node = renderElement(child, isMobile);
    if (node) stage.append(node);
  });

  if (block.id === "lp-pom-block-11") {
    stage.append(renderBudgetButton(isMobile));
  }

  return section;
}

function renderElement(element, isMobile) {
  const geometry = getGeometry(element, isMobile);
  if (!geometry.visible) return null;

  if (element.type === "lp-pom-text") return renderText(element, geometry, isMobile);
  if (element.type === "lp-pom-image") return renderImage(element, geometry);
  if (element.type === "lp-pom-button") return renderButton(element, geometry);
  if (element.type === "lp-pom-box") return renderBox(element, geometry, isMobile);
  if (element.type === "lp-code") return renderCode(element, geometry);
  return null;
}

function renderText(element, geometry, isMobile) {
  const text = document.createElement("div");
  text.className = "lp-el lp-text";
  text.id = element.id;
  text.innerHTML = getTextHtml(element, isMobile);
  applyGeometry(text, geometry, isMobile);
  return text;
}

function getTextHtml(element, isMobile) {
  if (element.id === "lp-pom-text-160") {
    if (isMobile) {
      return (
        '<p style="line-height: 20px; word-wrap: break-word; white-space: normal;">' +
        '<span style="font-weight: 700; font-family: Poppins; font-size: 13px; color: rgb(255, 255, 255);">Onde estamos: </span>' +
        '<span style="font-weight: 400; font-family: Poppins; font-size: 12px; color: rgb(255, 255, 255);">Estr. do Engenho, 1800 - Bangu, Rio de Janeiro - RJ, 21840-000</span>' +
        "</p>"
      );
    }
    return (
      '<p style="line-height: 22px; white-space: nowrap;">' +
      '<span style="font-weight: 700; font-family: Poppins; font-size: 16px; color: rgb(255, 255, 255); font-style: normal;">Onde estamos: </span>' +
      '<span style="font-weight: 400; font-family: Poppins; font-size: 15px; color: rgb(255, 255, 255); font-style: normal;">Estr. do Engenho, 1800 - Bangu, Rio de Janeiro - RJ, 21840-000, Brasil</span>' +
      "</p>"
    );
  }

  if (element.id === "lp-pom-text-204") {
    return (
      '<p style="line-height: 20px; text-align: center;">' +
      '<span style="font-weight: 400; font-family: Poppins; font-size: ' + (isMobile ? '12' : '16') + 'px; color: rgb(0, 0, 0); font-style: normal;">2024 © Todos os direitos reservados. Desenvolvido por Prime Marble Shop</span>' +
      "</p>"
    );
  }

  return element.content?.text || "";
}

function renderImage(element, geometry) {
  const asset = element.content?.asset;
  if (!asset?.uuid || !asset?.name) return null;

  const img = document.createElement("img");
  img.className = "lp-el lp-image";
  img.src = assetPath(asset);
  img.alt = asset.name.replace(/\.[^.]+$/, "").replace(/-/g, " ");
  img.loading = "eager";
  applyGeometry(img, geometry);
  return img;
}

function renderButton(element, geometry) {
  const link = document.createElement("a");
  link.className = "lp-el lp-button";
  link.href = element.action?.url || "#";
  link.target = element.action?.target || "_self";
  link.rel = link.target === "_blank" ? "noopener" : "";
  link.textContent = element.content?.label || "";
  link.setAttribute("aria-label", element.content?.label || "Abrir link");
  applyGeometry(link, geometry);
  applyButtonStyle(link, element);
  return link;
}

function renderBudgetButton(isMobile) {
  const link = document.createElement("a");
  link.className = "lp-el lp-button budget-button";
  link.href = "./orcamento/";
  link.target = "_self";
  link.textContent = "Gere seu orçamento aqui";
  link.setAttribute("aria-label", "Gerar orçamento");

  applyGeometry(link, {
    offset: isMobile ? { left: 37.5, top: 472 } : { left: 405, top: 598 },
    size: isMobile ? { width: 260, height: 42 } : { width: 331, height: 42 },
    zIndex: 6,
    scale: 1,
  });

  link.style.backgroundColor = "#ffffff";
  link.style.color = "#000000";
  link.style.fontFamily = "Poppins";
  link.style.fontSize = "16px";
  link.style.fontWeight = "700";
  link.style.borderRadius = "5px";
  link.style.border = "0";

  return link;
}

function renderBox(element, geometry, isMobile) {
  const box = document.createElement("div");
  box.className = "lp-el lp-box";
  applyGeometry(box, geometry);
  applyBackground(box, element, isMobile);

  const border = element.style?.border;
  if (border?.style && border.style !== "none") {
    box.style.border = `${border.width || 1}px ${border.style} #${border.color || "ccc"}`;
  }

  const radius = geometry.cornerRadius ?? element.geometry?.cornerRadius;
  if (radius) box.style.borderRadius = `${radius}px`;

  getChildren(element.id).forEach((child) => {
    const node = renderElement(child, isMobile);
    if (node) box.append(node);
  });

  return box;
}

function renderCode(element, geometry) {
  const code = document.createElement("div");
  code.className = "lp-el lp-code";
  applyGeometry(code, geometry);

  if (element.id === "lp-code-268") {
    code.append(renderCarousel());
    return code;
  }

  code.innerHTML = element.content?.html || "";
  return code;
}

function renderCarousel() {
  const carousel = document.createElement("div");
  carousel.className = "portfolio-carousel";
  localCarouselAssets.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "portfolio-slide";
    slide.dataset.index = String(index);
    slide.style.backgroundImage = `url("${src}")`;
    slide.addEventListener("click", () => openLightbox(index));
    carousel.append(slide);
  });
  return carousel;
}

function startCarousel() {
  const slides = [...document.querySelectorAll(".portfolio-slide")];
  if (!slides.length) return;

  let active = 0;
  const total = slides.length;

  const paint = () => {
    slides.forEach((slide, index) => {
      slide.className = "portfolio-slide";
      const diff = (index - active + total) % total;
      if (diff === 0) slide.classList.add("is-active");
      else if (diff === 1) slide.classList.add("is-next");
      else if (diff === 2) slide.classList.add("is-far-next");
      else if (diff === total - 1) slide.classList.add("is-prev");
      else if (diff === total - 2) slide.classList.add("is-far-prev");
    });
  };

  const advance = () => {
    active = (active + 1) % total;
    paint();
  };

  paint();
  window.clearInterval(window.primeCarouselTimer);
  window.primeCarouselTimer = window.setInterval(advance, 3000);

  const carousel = slides[0]?.parentElement;
  if (!carousel) return;

  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    window.clearInterval(window.primeCarouselTimer);
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) active = (active + 1) % total;
      else active = (active - 1 + total) % total;
      paint();
    }
    window.primeCarouselTimer = window.setInterval(advance, 3000);
  }, { passive: true });

  slides.forEach((slide) => {
    slide.addEventListener("click", (e) => {
      const idx = Number(slide.dataset.index);
      if (slide.classList.contains("is-prev") || slide.classList.contains("is-far-prev")) {
        active = idx;
        paint();
        e.stopPropagation();
      } else if (slide.classList.contains("is-next") || slide.classList.contains("is-far-next")) {
        active = idx;
        paint();
        e.stopPropagation();
      }
    });
  });
}

function openLightbox(index) {
  if (document.querySelector(".lightbox-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";

  const img = document.createElement("img");
  img.className = "lightbox-img";
  img.src = localCarouselAssets[index];
  img.alt = `Projeto ${index + 1}`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Fechar");

  const prevBtn = document.createElement("button");
  prevBtn.className = "lightbox-nav lightbox-prev";
  prevBtn.textContent = "‹";
  prevBtn.setAttribute("aria-label", "Anterior");

  const nextBtn = document.createElement("button");
  nextBtn.className = "lightbox-nav lightbox-next";
  nextBtn.textContent = "›";
  nextBtn.setAttribute("aria-label", "Próximo");

  let current = index;
  const total = localCarouselAssets.length;

  const show = (i) => {
    current = ((i % total) + total) % total;
    img.src = localCarouselAssets[current];
    img.alt = `Projeto ${current + 1}`;
  };

  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });
  closeBtn.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  document.addEventListener("keydown", function handler(e) {
    if (!document.querySelector(".lightbox-overlay")) {
      document.removeEventListener("keydown", handler);
      return;
    }
    if (e.key === "Escape") overlay.remove();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  let lbTouchStartX = 0;
  overlay.addEventListener("touchstart", (e) => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) show(current + 1);
      else show(current - 1);
    }
  }, { passive: true });

  overlay.append(closeBtn, prevBtn, img, nextBtn);
  document.body.append(overlay);
}

function getChildren(containerId) {
  return elements
    .filter((item) => item.containerId === containerId)
    .sort((a, b) => (a.geometry?.zIndex || 0) - (b.geometry?.zIndex || 0));
}

function getGeometry(element, isMobile) {
  const desktop = element.geometry || {};
  const mobile = isMobile ? element.breakpoints?.mobile?.geometry || {} : {};
  const transform = mobile.transform || desktop.transform || {};
  const size = {
    ...(desktop.size || {}),
    ...(mobile.size || {}),
    ...(transform.size ? transform.size : {}),
  };
  const offset = {
    ...(desktop.offset || {}),
    ...(mobile.offset || {}),
  };
  const visible =
    typeof mobile.visible === "boolean"
      ? mobile.visible
      : typeof desktop.visible === "boolean"
      ? desktop.visible
      : true;

  return {
    ...desktop,
    ...mobile,
    offset,
    size,
    visible,
    scale: mobile.scale ?? desktop.scale ?? 1,
    zIndex: mobile.zIndex ?? desktop.zIndex ?? 1,
  };
}

function applyGeometry(node, geometry, isMobile) {
  const left = geometry.offset?.left || 0;
  const top = geometry.offset?.top || 0;
  let width = geometry.size?.width || 0;
  const height = geometry.size?.height || 0;

  if (node.id === "lp-pom-text-160") {
    width = isMobile ? 300 : Math.max(width, 700);
  }

  node.style.left = `${left}px`;
  node.style.top = `${top}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  node.style.zIndex = String(geometry.zIndex || 1);
  if (geometry.scale && geometry.scale !== 1) {
    node.style.transform = `scale(${geometry.scale})`;
  }
}

function applyBackground(node, element, isMobile) {
  const style = isMobile
    ? { ...(element.style || {}), ...(element.breakpoints?.mobile?.style || {}) }
    : element.style || {};
  const background = style.background || {};
  const newBackground = style.newBackground || {};
  const solid = newBackground.solidColor?.bgColor || background.backgroundColor;

  if (solid) {
    node.style.backgroundColor = `#${solid}`;
  }

  const image = background.image || newBackground.image?.image || newBackground.pattern?.image;
  if (image?.uuid && image?.name) {
    node.style.backgroundImage = `url("${assetPath(image)}")`;
  }
}

function applyButtonStyle(link, element) {
  const style = element.style || {};
  const up = style.up || {};
  const opacity = Number(up.opacity ?? 100) / 100;
  const bg = up.backgroundColor || style.background?.backgroundColor || "fede27";
  const color = up.color || "000000";
  const border = up.border || {};

  link.style.backgroundColor = `rgba(${hexToRgb(bg).join(",")}, ${opacity})`;
  link.style.color = `#${color}`;
  link.style.fontFamily = style.fontFamily || "Poppins";
  link.style.fontSize = `${style.fontSize || 16}px`;
  link.style.fontWeight = style.textStyles?.strong ? "700" : style.fontWeight || "400";
  link.style.borderRadius = `${element.geometry?.cornerRadius || 0}px`;
  link.style.border = border.style && border.style !== "none" ? `${border.style} 1px` : "0";
}

function assetPath(asset) {
  return `${ASSET_ROOT}/${asset.uuid}/${asset.name}`;
}

function hexToRgb(hex) {
  const clean = String(hex).replace("#", "");
  const value = clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean;
  const number = Number.parseInt(value || "000000", 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}
