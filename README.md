# indexing-local-server

Aplicación de indexación local para leer archivos en tiempo real de una ruta especificada y subirlos a la nube.

## Guía de instalación

1. Instalar versión LTS de [Node.js](https://nodejs.org/es/)

2. Instalar globalmente el administrador de procesos [PM2](https://pm2.keymetrics.io/) y [pm2-windows-startup](https://github.com/marklagendijk/node-pm2-windows-startup)

   ```bash

   npm i -g pm2

   npm i -g pm2-windows-startup

   ```

3. Agregar registro para ejecutar la aplicación cuando se detecte un proceso de arranque.

   ```bash

   pm2-startup install

   ```

4. Guardar lista de procesos de ejecución

   ```bash

   pm2 save

   ```

5. Crear carpeta de indexación en el directorio de descargas con el nombre de preferencia.

6. Descargar y descomprimir zip de la última versión de la [aplicación de indexación](https://github.com/Ekisa-Team/indexing-local-server/releases) en la ubicación de preferencia.

7. Renombrar archivo `.env.example` a `.env`.

8. Abrir archivo `.env` con un editor de texto y reemplazar variables de ambiente.

   ```
   // ejemplo

   CLIENT_ID=1
   INDEX_FOLDER=mi_carpeta_de_indexacion
   UPLOAD_FILE_ENDPOINT=https://quiron2consultoriosapi.azurewebsites.net/api/v1/Upload
   ```

9. Abrir una terminal en la raiz del proyecto

10. Crear el proceso de indexación

    ```bash

    pm2 start main.js --name ils

    ```

## Comandos de monitoreo

```console
// Listar procesos de ejecución
pm2 ls

// Mostrar log de los procesos de ejecución
pm2 log

// Abrir dashboard de monitoreo
pm2 monit
```
