import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./doPublish`; // папка сборки для публикации
const srcFolder = `./assets`; // папка с исходными файлами

export const path = {
  build: {
    js: `${buildFolder}/js/`,
    json: `${buildFolder}/js/data/`,
    css: `${buildFolder}/css/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
    html: `${buildFolder}/`,
    files: `${buildFolder}/files/`,
  },
  src: {
    js: `${srcFolder}/js/app.js`,
    json: `${srcFolder}/js/data/**/*.json`,
    scss: `${srcFolder}/scss/style.scss`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    html: `${srcFolder}/*.html`, //.pug
    files: `${srcFolder}/files/**/*.*`,
    svgicons: `${srcFolder}/icons/*.svg`,
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    json: `${srcFolder}/js/data/`,
    scss: `${srcFolder}/scss/**/*.scss`,
    images: `${srcFolder}img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    html: `${srcFolder}/**/*.html`, //.pug
    files: `${srcFolder}/files/**/*.*`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
  ftp: `test`, // ваш FTP-адрес, заполняем в самый последний момент при наличии FTP-сервера
};
