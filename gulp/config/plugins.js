// установка плагина для поиска и замены текста в файлах
// npm install -D gulp-replace
import replace from "gulp-replace";
// установка плагина для обработки ошибок
// npm install -D gulp-plumber
import plumber from "gulp-plumber";
// установки плагина сообщений (подсказок)
// npm install -D gulp-notify
import notify from "gulp-notify";
// установка плагина для синхронизации с браузером через live-reload
// npm install -D browser-sync
import browserSync from "browser-sync";
// установка плагина проверки обновления картинок
// npm install -D gulp-newer
import newer from "gulp-newer";
// установка плагина для условного ответвления в режиме разработки
// npm install -D gulp-if
import ifPlugin from "gulp-if";

export const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  browserSync: browserSync,
  newer: newer,
  if: ifPlugin,
};
