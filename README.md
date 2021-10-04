# indexing-local-server

Aplicación de indexación local para leer archivos en tiempo real de una ruta especificada y subirlos a la nube.

## Guía de instalación

1. Instalar versión LTS de [Node.js](https://nodejs.org/es/)

2. Instalar globalmente el administrador de procesos [PM2](https://pm2.keymetrics.io/) + [pm2-windows-startup](https://github.com/marklagendijk/node-pm2-windows-startup) y el gestor de paquetes [pnpm](https://pnpm.io/es/)

   ```bash

   npm i -g pm2 pm2-windows-startup pnpm

   ```

3. Crear carpeta de indexación en el directorio de descargas con el nombre de preferencia.

4. Descargar y descomprimir zip de la última versión de la [aplicación de indexación](https://github.com/Ekisa-Team/indexing-local-server/releases) en cualquier ubicación dentro del disco donde se encuentra la carpeta de descargas.

5. Abrir una terminal en la raiz del proyecto

6. Instalar dependencias del proyecto
   ```
   pnpm install
   ```
7. Renombrar archivo `.env.example` a `.env`.

8. Abrir archivo `.env` con un editor de texto y reemplazar variables de ambiente.

   ```
   // ejemplo

   CLIENT_ID=1
   INDEX_FOLDER=mi_carpeta_de_indexacion
   UPLOAD_FILE_ENDPOINT=https://quiron2consultoriosapi.azurewebsites.net/api/v1/Upload
   ```

9. Crear el proceso de indexación

   ```bash

   pm2 start main.js --name ils

   ```

10. Agregar registro para ejecutar la aplicación cuando se detecte un proceso de arranque.

    ```bash

    pm2-startup install

    ```

11. Guardar lista de procesos de ejecución

    ```bash

    pm2 save

    ```

## Comandos utilitarios

```console
// Listar procesos de ejecución
pm2 ls

// Mostrar log de los procesos de ejecución
pm2 log

// Abrir dashboard de monitoreo
pm2 monit

// Reiniciar un proceso
pm2 restart [pid | pname]

// Eliminar un proceso
pm2 delete [pid | pname]
```
