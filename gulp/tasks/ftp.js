// импорт собственной конфигурации, которая обычно хранится в отдельном файле ftp.js
import { configFTP } from "../config/ftp.js";
// Подключение к FTP и заливка файлов через Gulp
// npm install -D vinyl-ftp
import vinylFTP from "vinyl-ftp";
// Логирование ошибок и информации в консоль
// npm install -D fancy-log
import log from "fancy-log";
// Цвета для логирования
// npm install -D chalk
import chalk from "chalk";

export const ftp = () => {
  configFTP.log = log;
  const ftpConnect = vinylFTP.create(configFTP);
  return app.gulp
    .src(`${app.path.buildFolder}/**/*.*`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FTP",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`))
    .on("end", () => log(chalk.green("✅ Деплой завершён!")))
    .on("error", (err) => log(chalk.red("❌ Ошибка при деплое:"), err.message));
};


// export const ftp = () => {
//   // Создаём FTP соединение
//   const ftpConnect = vinylFTP.create({
//     host: configFTP.host,
//     user: configFTP.user,
//     password: configFTP.password,
//     parallel: configFTP.parallel || 5,
//     log: log, // fancy-log для логирования
//   });

//   return gulp
//     .src(`${path.buildFolder}/**/*.*`, { base: path.buildFolder, buffer: false })
//     .pipe(
//       plumber(
//         notify.onError({
//           title: 'FTP',
//           message: 'Error: <%= error.message %>',
//         })
//       )
//     )
//     .pipe(ftpConnect.dest(`/${configFTP.remotePath || path.rootFolder}`))
//     .on('end', () => log(chalk.green('✅ Деплой завершён!')))
//     .on('error', (err) => log(chalk.red('❌ Ошибка при деплое:'), err.message));
// };