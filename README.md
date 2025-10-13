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

> Debido a las limitaciones de **Spotify Developer Mode**, solo el propietario de la aplicación puede iniciar sesión sin solicitar producción.

> Si deseas probarlo en tu cuenta, sigue los pasos de instalación local.

> Si no quiere instalarlo puede contactarme ya que permiten hasta 25 colaboradores, si agrego la cuenta puede ver el proyecto sin problemas desde la url.

---

# 🛠️ Instalación local
## 1️⃣ Clonar el repositorio
```shell
git clone https://github.com/tuusuario/unlifo.git
cd unlifo
```

## 2️⃣ Instalar dependencias

Asegúrate de tener Node.js 18 o superior instalado:

```shell
npm install
```
npm install

## 3️⃣ Configurar variables de entorno

Crea un archivo llamado .env en la raíz del proyecto con el siguiente contenido:

```shell
CLIENT_ID=tu_client_id_de_spotify
```

> No uses comillas (") alrededor de los valores.

> El archivo .env ya está en .gitignore para evitar exponer credenciales.

> Puedes obtener tus credenciales en Spotify Developer Dashboard

> ⚠️ De momento la única credencial que funciona es CLIENT_ID=tu_client_id_de_spotify
.

## 4️⃣ Ejecutar la aplicación

```shell
npm run dev
```

Luego abre en tu navegador:

http://localhost:3000

## 5️⃣ Iniciar sesión en Spotify

Pulsa "Login Spotify"

Autoriza el acceso

Espera a que se carguen tus playlists (el sistema incluye paginación automática)