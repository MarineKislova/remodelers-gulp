// это нужно для того, чтобы gulp в браузере открывал и обновлял страницу при изменении файла
export const server = (done) => {
  app.plugins.browserSync.init({
    server: {
      baseDir: `${app.path.build.html}`,
    },
    notify: true,
    port: 3000,
  });
};

