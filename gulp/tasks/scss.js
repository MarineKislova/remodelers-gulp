// импорт предпроцессора Dart Sass
// npm install -D sass
import dartSass from "sass";
// установка плагина для работы с SASS-файлами в Gulp
// npm install -D gulp-sass
import gulpSass from "gulp-sass";
// установка плагина для переименования CSS-файлов
// npm install -D gulp-rename
import rename from "gulp-rename";
// установка плагина для сжатия CSS-файлов
// npm install -D gulp-clean-css
import cleanCSS from "gulp-clean-css";
// установка плагина для вывода WEBP изображений
//npm i -D gulp-webp-css
// import webpCSS from "gulp-webp-css";
//npm i -D gulp-webpcss
import webpCSS from "gulp-webpcss";

// установка плагина для автопрефиксации CSS-файлов
// npm install -D gulp-autoprefixer
import autoprefixer from "gulp-autoprefixer";
// установка плагина для группировки медиазапросов
// npm install -D gulp-group-css-media-queries
import groupCSSMediaQueries from "gulp-group-css-media-queries";

const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp
    .src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(app.plugins.if(app.isBuild, groupCSSMediaQueries()))
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpCSS({
          webpClass: ".webp", //если браузер поддерживает WEBP, добавляем класс.no-webp
          noWebpClass: ".no-webp", //если браузер не поддерживает WEBP, добавляем класс.no-webp
        })
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        autoprefixer({
          grid: true, // указываем, что работаем с CSS Grid
          overrideBrowserslist: ["last 3 versions"], // автопрефиксирование для последних 3 версий браузеров
          cascade: true, // каскадирование префиксов
        })
      )
    )
    .pipe(app.gulp.dest(app.path.build.css)) //!раскомментировать, если нужен не сжатый дубль файла стилей
    .pipe(app.plugins.if(app.isBuild, cleanCSS()))
    .pipe(
      rename({
        extname: ".min.css", // переименовываем CSS-файл в .min.css
      })
    )
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browserSync.stream()); //обновление браузера при изменении файла
};
