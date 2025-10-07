# 🎵 Unlifo — Fusionador de playlists de Spotify

Unlifo es una aplicación web que te permite **fusionar múltiples playlists de tu cuenta de Spotify en una sola**, sin duplicar canciones y sin salir de tu cuenta.  
Creada con **React + Vite** en el frontend y un **servidor Node.js/Express** opcional para automatizaciones (como sincronización con cron jobs).

---

# 🚀 Características principales

- 🔐 Inicio de sesión seguro con Spotify (OAuth 2.0 + PKCE)
- 🧩 Fusiona playlists sin canciones duplicadas
- ⚙️ Guarda los cambios directamente en tu cuenta de Spotify
- 💾 Recuerda la última playlist creada por Unlifo
- 🧭 Ordena las playlists alfabéticamente
- 🟢 Distingue visualmente las playlists creadas por Unlifo
- 🔁 Compatible con todas las playlists de la cuenta (paginación incluida)
- ⚡ Posibilidad de automatizar actualizaciones mediante cron (Render - Aún se está haciendo, todavía no funciona)

---

# 🖥️ Demo pública

👉 [https://unlifo.lovestoblog.com](https://unlifo.lovestoblog.com)

> ⚠️ Debido a las limitaciones de **Spotify Developer Mode**, solo el propietario de la aplicación puede iniciar sesión sin solicitar producción.
> Si deseas probarlo en tu cuenta, sigue los pasos de instalación local.
> Si no quiere instalarlo puede contarme ya que permiten hasta 25 colaboradores, si agrego la cuenta puede ver el proyecto sin problemas desde la url.

---

# 🛠️ Instalación local
## 1️⃣ Clonar el repositorio
git clone https://github.com/tuusuario/unlifo.git
cd unlifo

## 2️⃣ Instalar dependencias

Asegúrate de tener Node.js 18 o superior instalado:

npm install

## 3️⃣ Configurar variables de entorno

Crea un archivo llamado .env en la raíz del proyecto con el siguiente contenido:

CLIENT_ID=tu_client_id_de_spotify
CLIENT_SECRET=tu_client_secret_de_spotify
REFRESH_TOKEN=tu_refresh_token
REDIRECT_URI=http://localhost:3000
PORT=3000


📌 Notas importantes:

No uses comillas (") alrededor de los valores.

El archivo .env ya está en .gitignore para evitar exponer credenciales.

Puedes obtener tus credenciales en Spotify Developer Dashboard
.

## 4️⃣ Ejecutar la aplicación
npm run dev


Luego abre en tu navegador:

http://localhost:3000

## 5️⃣ Iniciar sesión en Spotify

Pulsa "Login Spotify"

Autoriza el acceso

Espera a que se carguen tus playlists (el sistema incluye paginación automática)

☁️ Despliegue en Render
## 1️⃣ Crear una cuenta en Render

Ve a https://render.com
 y crea una cuenta gratuita.

## 2️⃣ Conectar el repositorio

Conecta tu cuenta de GitHub

Importa el repositorio de Unlifo

Render detectará automáticamente el entorno Node.js

## 3️⃣ Configurar variables de entorno

En la sección Environment del panel de Render, añade las siguientes variables:

Variable	Descripción
CLIENT_ID	Tu Client ID de Spotify
CLIENT_SECRET	Tu Client Secret de Spotify
REFRESH_TOKEN	Token de actualización
REDIRECT_URI	URL pública de Render (por ejemplo: https://unlifo.onrender.com)
PORT	Puerto de ejecución (por defecto 3000)
## 4️⃣ Comandos de build y start

Build Command

npm install && npm run build


Start Command

npm start

## 5️⃣ Despliegue automático

Cada vez que hagas un push a GitHub, Render reconstruirá y desplegará la aplicación automáticamente.

⚙️ Automatización con Cron Jobs (opcional)

Si usas un backend Node.js, puedes agregar un cron job en Render para actualizar las playlists Unlifo automáticamente.
Ejemplo con node-cron:

import cron from "node-cron";
import { syncUnlifoPlaylists } from "./sync.js";

cron.schedule("0 * * * *", () => {
  console.log("⏰ Ejecutando sincronización cada hora...");
  syncUnlifoPlaylists();
});

📜 .gitignore recomendado
### Dependencias
node_modules/

### Archivos de logs
logs/
*.log

### Variables de entorno
.env

### Carpetas de compilación
dist/
build/

### Sistema operativo
.DS_Store
Thumbs.db

# 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/unlifo.git
cd unlifo
