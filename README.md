# 🎵 Unlifo — Fusionador de playlists de Spotify

Unlifo es una aplicación web que te permite **fusionar múltiples playlists de tu cuenta de Spotify en una sola**, sin duplicar canciones y sin salir de tu cuenta.  
Creada con **React + Vite** en el frontend y un **servidor Node.js/Express** opcional para automatizaciones (como sincronización con cron jobs).

---

## 🚀 Características principales

- 🔐 Inicio de sesión seguro con Spotify (OAuth 2.0 + PKCE)
- 🧩 Fusiona playlists sin canciones duplicadas
- ⚙️ Guarda los cambios directamente en tu cuenta de Spotify
- 💾 Recuerda la última playlist creada por Unlifo
- 🧭 Ordena las playlists alfabéticamente
- 🟢 Distingue visualmente las playlists creadas por Unlifo
- 🔁 Compatible con todas las playlists de la cuenta (paginación incluida)
- ⚡ Posibilidad de automatizar actualizaciones mediante cron (Render - Aún se está haciendo, todavía no funciona)

---

## 🖥️ Demo pública

👉 [https://unlifo.lovestoblog.com](https://unlifo.lovestoblog.com)
⚠️ No podrás iniciar sesión debido a que Spotify solo deja que acceda gente si la configuración está en modo desplegado, pero esto solo se lo aceptan a las empresas.
    Si quiere acceder no dude en contarme ya que permiten hasta 25 colaboradores, si te agrego puedes ver el proyecto sin problemas.

> ⚠️ Debido a las limitaciones de **Spotify Developer Mode**, solo el propietario de la aplicación puede iniciar sesión sin solicitar producción.  
> Si deseas probarlo en tu cuenta, sigue los pasos de instalación local.

---

## 🛠️ Instalación local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/unlifo.git
cd unlifo
