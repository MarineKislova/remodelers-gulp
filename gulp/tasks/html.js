//нужно установить плагин для работы с HTML-файлами:
// npm install -D gulp-file-include
// устанавливается один раз в проекте на первом index.html
import fileInclude from "gulp-file-include";
// импорт модуля для работы с webp-изображениями
// npm install -D gulp-webp-html-nosvg
import webpHtmlNosvg from "gulp-webp-html-nosvg";
//плагин для кеш-бастинга
// npm install -D gulp-version-number
import versionNumber from "gulp-version-number";
//плагин для pug
// npm install -D gulp-pug
// import pug from "gulp-pug";

export const html = () => {
  return (
    app.gulp
      .src(app.path.src.html)
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(fileInclude())
      /*
		.pipe(pug({
			// Cжатие HTML файла
			pretty: true,
			// Показывать в терминале какой файл обработан
			verbose: true
		}))
		*/
      .pipe(app.plugins.replace(/\/?assets\/img\//g, "img/"))
      // .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
      .pipe(
        app.plugins.if(
          app.isBuild,
          app.plugins.replace(/(<img\s+[^>]*?srcset=")([^"]*?)("[^>]*?>)/gi, (match, opening, srcsetUrls, closing) => {
            // Заменяем все .jpg и .png на .webp в списке URL
            const webpSrcset = srcsetUrls.replace(/\.(jpe?g|png)/gi, ".webp");

            // Возвращаем новую структуру: <picture> с source webp и оригинальным <img>
            return `
                <picture>
                  <source srcset="${webpSrcset}" type="image/webp" sizes="100vw">
                  ${match}
                </picture>
              `;
          })
        )
      )
      .pipe(
        app.plugins.if(
          app.isBuild,
          versionNumber({
            value: "%DT%",
            append: {
              key: "_v",
              cover: 0,
              to: ["css", "js"],
            },
            output: {
              file: "gulp/version.json",
            },
          })
        )
      )
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browserSync.stream()) //обновление браузера при изменении файла
  );
};
