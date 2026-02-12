export let configFTP = {
  host: "ftp.example.com", //адрес FTP-сервера
  user: "your_username", // Имя пользователя FTP
  password: "your_password", // Пароль пользователя FTP
  parallel: 5, // Number of connections to FTP server (количество одновременных подключений к FTP серверу)
};


// не забываем в path.js указать путь до папки с проектом в FTP в самом внизу