// установка плагина webpack для работы с JavaScript-файлами (export и import js файлов)
// npm install -D webpack webpack-stream
import webpack from "webpack-stream";

export const js = () => {
  return app.gulp
    .src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      webpack({
        mode: app.isBuild ? "production" : "development", // режим разработки
        output: {
          filename: "app.min.js", // название выходного файла
        },
      })
    )
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browserSync.stream()); //обновление браузера при изменении файла
};
