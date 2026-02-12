// установка плагина, который конвертирует изображения PNG/JPEG → WebP прямо во время сборки проекта.
// npm install -D gulp-webp
import webp from "gulp-webp";
// установка плагина для сжатия изображений
// npm install -D gulp-imagemin
import imagemin from "gulp-imagemin";


export const processImages = () => {
  return (
    app.gulp
      .src(app.path.src.images, { encoding: false })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "IMAGES",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(app.plugins.newer(app.path.build.images)) //для обработки только новых изображений или изменений в существующих
      .pipe(app.plugins.if(app.isBuild, webp())) //конвертируем изображения в WebP
      .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images))) // коируем в исходную папку
      .pipe(app.gulp.src(app.path.src.images, { encoding: false }))
      .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images)))
      // .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images)))
      // --- оптимизация исходных изображений
      .pipe(
        app.plugins.if(
          app.isBuild,
          imagemin({
            progressive: true, //если true, изображения будут сжаты с продвинутыми технологиями
            svgoConfig: [{ removeViewBox: false }], //убираем viewBox из SVG
            interlaced: true, //если true, изображения будут сжаты параллельно
            optimizationLevel: 3, //уровень сжатия изображений (от 0 до 7)
          })
        )
      ) //сжимаем изображения
      .pipe(app.gulp.dest(app.path.build.images))
      // --- копирование SVG
      // .pipe(app.gulp.src(app.path.src.svg))
      // // .pipe(app.plugins.newer(app.path.build.images))
      // .pipe(app.gulp.dest(app.path.build.images))
      // --- обновление в браузере при изменении изображений
      .pipe(app.plugins.browserSync.stream())
  );
};

export const copySvg = () => {
  return app.gulp
    .src(app.path.src.svg)
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream()); // Stream только после последней операции
};
