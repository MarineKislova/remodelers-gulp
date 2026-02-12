// основной модуль приложения
import gulp from "gulp";
// импорт модуля для работы с путями
import { path } from "./gulp/config/path.js";
// импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";

// передаем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes("--build"), //проверяем, запущен ли процесс с ключом --build
  isDev: !process.argv.includes("--dev"), //проверяем, запущен ли процесс с ключом --dev
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// импорт задач из copy.js
import { copy } from "./gulp/tasks/copy.js";
// импорт задач из reset.js
import { reset } from "./gulp/tasks/reset.js";
// импорт задач из html.js
import { html } from "./gulp/tasks/html.js";
// импорт сервера browsersync для локального сервера
import { server } from "./gulp/tasks/server.js";
// импорт scss из scss.js
import { scss } from "./gulp/tasks/scss.js";
// импорт js из js.js
import { js } from "./gulp/tasks/js.js";
// импорт json из json.js
import { json } from "./gulp/tasks/json.js";
// импорт images из images.js
import { processImages, copySvg } from "./gulp/tasks/images.js";
// импорт otfToTtf, ttfToWoff, fontsStyle из fonts.js
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
// импорт svgSpriteTask из svgSprive.js
import { svgSpriteTask } from "./gulp/tasks/svgSprive.js";
// импорт zip из zip.js
import { zip } from "./gulp/tasks/zip.js";
// импорт ftp из ftp.js
import { ftp } from "./gulp/tasks/ftp.js";

const images = app.gulp.series(processImages, copySvg);

// наблюдатель за изменениями в папке assets
function watchAssets() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  // gulp.watch(path.watch.html, gulp.series(html, ftp)); // если хотим чтобы побубликовалось сразу после публикации в ftp и так нужно сделать с каждм watch
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.json, json);
  gulp.watch(path.watch.images, images);
}

export { svgSpriteTask };

// последовательная обработка шрифтов
const fontsTasks = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// основные задачи для сборки проекта с использованием fonts.js
const mainTasks = gulp.series(fontsTasks, gulp.parallel(copy, html, scss, js, json, images, svgSpriteTask));

// // основные задачи для сборки проекта
// const mainTasks = gulp.parallel(copy, html, scss, js, json.images); // параллельное выполнение html и copy

// построение сценариев по умоллчанию
const dev = gulp.series(reset, mainTasks, gulp.parallel(watchAssets, server)); // режим разработчика (т.е. сборка и наблюдение в режиме разработки)
const build = gulp.series(reset, mainTasks, gulp.parallel(watchAssets, server)); //! режим сборки ЗАКОММЕНТИРВАТЬ
// const build = gulp.series(reset, mainTasks, ); //! режим сборки РАЗКОММЕНТИРВАТЬ

const deployZip = gulp.series(reset, mainTasks, zip); // режим публикации
const deployFtp = gulp.series(reset, mainTasks, ftp); // режим публикации с ftp

//экспорт сценариев для различных режимов сборки
export { dev };
export { build };
export { deployZip };
export { deployFtp };

// выполнение сценария по умолчанию
gulp.task("default", dev);
