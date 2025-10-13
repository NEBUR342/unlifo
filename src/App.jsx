import React, { useEffect, useState } from "react";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = "https://unlifo.lovestoblog.com";
<<<<<<< HEAD
=======
var alllength = 0;

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ");
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
function generateCodeVerifier(len = 128) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let out = "";
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  for (const c of arr) out += chars[c % chars.length];
  return out;
}
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
function save(key, v) {
  if (v === null || v === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(v));
}
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
function load(key) {
  const v = localStorage.getItem(key);
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
export default function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
<<<<<<< HEAD
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [originalSelected, setOriginalSelected] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
=======
  const [selected, setSelected] = useState(new Set());
  const [originalSelected, setOriginalSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [mergedId, setMergedId] = useState(load("merged_id"));
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) exchange(code);
    else {
      const t = load("token");
      if (t) setToken(t);
    }
  }, []);
<<<<<<< HEAD
  useEffect(() => {
    if (token) init();
  }, [token]);
  async function exchange(code) {
    const ver = load("ver");
=======

  useEffect(() => {
    if (token) init();
  }, [token]);

  async function exchange(code) {
    const ver = load("ver");
    if (!ver) {
      setStatus("Falta PKCE");
      setStatusType("error");
      return;
    }
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: ver,
    });
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const d = await r.json();
    setToken(d.access_token);
    save("token", d.access_token);
    window.history.replaceState({}, document.title, REDIRECT_URI);
  }
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  async function sp(url, opt = {}) {
    const r = await fetch(url, {
      ...opt,
      headers: { ...(opt.headers || {}), Authorization: "Bearer " + token },
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
<<<<<<< HEAD
  async function fetchAll(url, key = "items") {
    const results = [];
    while (url) {
      const r = await sp(url);
      results.push(...(r[key] || []));
      url = r.next;
    }
    return results;
  }
=======
  async function fetchAll(url, itemsKey = "items") {
    const results = [];
    while (url) {
      const res = await sp(url);
      results.push(...(res[itemsKey] || []));
      url = res.next;
    }
    return results;
  }

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  async function init() {
    setLoading(true);
    setStatus("Cargando playlists...");
    setStatusType("loading");
    try {
      const me = await sp("https://api.spotify.com/v1/me");
      setUserId(me.id);
<<<<<<< HEAD
      const pls = await fetchAll("https://api.spotify.com/v1/me/playlists?limit=50");
      pls.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
      pls.forEach((pl) => {
        pl.isUnlifo = pl.description?.includes("unlifo.lovestoblog.com");
      });
      pls.sort((a, b) => {
        if (a.isUnlifo && !b.isUnlifo) return -1;
        if (!a.isUnlifo && b.isUnlifo) return 1;
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      });
      const updatedTracks = {};
      await Promise.allSettled(
        pls.map(async (pl) => {
          const items = await fetchAll(`https://api.spotify.com/v1/playlists/${pl.id}/tracks?limit=100`);
          updatedTracks[pl.id] = items
            .filter((t) => t.track)
            .map((t) => ({
              id: t.track.id,
              uri: t.track.uri,
              name: t.track.name,
              artist: t.track.artists?.[0]?.name || "",
            }))
            .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
        })
      );
      setPlaylistTracks(updatedTracks);
      setPlaylists(pls);
      setStatus(`Cargadas ${pls.length} playlists`);
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Error al cargar playlists");
=======
      const all = await fetchAll("https://api.spotify.com/v1/me/playlists?limit=50");
      alllength = all.length;
      all.sort((a, b) => {
        const aUnlifo = a.description?.toLowerCase().includes("unlifo.lovestoblog.com") ? 0 : 1;
        const bUnlifo = b.description?.toLowerCase().includes("unlifo.lovestoblog.com") ? 0 : 1;
        if (aUnlifo !== bUnlifo) return aUnlifo - bUnlifo;
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      });

      setPlaylists(all);
      setStatus(`Cargadas ${all.length} playlists`);
      setStatusType("success");
    } catch (e) {
      setStatus("Error cargando playlists");
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
<<<<<<< HEAD
  async function loadTargetSelection(id) {
    setLoading(true);
    try {
      if (!id) {
        setSelectedTracks(new Set());
        setOriginalSelected(null);
        setTargetId("");
        return;
      }
      const trackUris = new Set();
      const tracks = await fetchAll(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`);
      tracks.forEach((t) => t.track && trackUris.add(t.track.uri));
      setSelectedTracks(trackUris);
      setOriginalSelected(new Set(trackUris));
      setTargetId(id);
      const updatedTracks = {};
      for (const pl of playlists) {
        const items = await fetchAll(`https://api.spotify.com/v1/playlists/${pl.id}/tracks?limit=100`);
        const mapped = items
          .filter((t) => t.track)
          .map((t) => ({
            id: t.track.id,
            uri: t.track.uri,
            name: t.track.name,
            artist: t.track.artists?.[0]?.name || "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
        updatedTracks[pl.id] = mapped;
      }
      setPlaylistTracks(updatedTracks);
    } catch (err) {
      console.error(err);
      setStatus("Error al cargar la lista");
=======

  async function loadTargetSelection(id) {
    setLoading(true);
    setStatus("Cargando selección...");
    setStatusType("loading");
    try {
      if (!id) {
        setSelected(new Set());
        setOriginalSelected(null);
        setTargetId("");
        setStatus(`Cargadas ${alllength} playlists`);
        setStatusType("success");
        return;
      }
      const targetTracks = new Set();
      const targetTracksData = await fetchAll(
        `https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`
      );
      for (const it of targetTracksData) if (it.track) targetTracks.add(it.track.uri);
      const sel = new Set();
      for (const pl of playlists) {
        if (pl.id === id) continue;
        const plTracks = await fetchAll(
          `https://api.spotify.com/v1/playlists/${pl.id}/tracks?limit=100`
        );
        if (plTracks.some((it) => it.track && targetTracks.has(it.track.uri))) {
          sel.add(pl.id);
        }
      }

      setSelected(sel);
      setOriginalSelected(new Set(sel));
      setTargetId(id);
      setStatus(`Playlist cargada: ${sel.size} listas marcadas`);
      setStatusType("success");
    } catch (err) {
      setStatus("Error cargando selección");
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
<<<<<<< HEAD
  function selectAll() {
    const all = new Set();
    Object.values(playlistTracks).forEach((tracks) =>
      tracks.forEach((t) => all.add(t.uri))
    );
    setSelectedTracks(all);
  }
  function deselectAll() {
    setSelectedTracks(new Set());
  }
  function undoChanges() {
    if (originalSelected) {
      setSelectedTracks(new Set(originalSelected));
      setStatus("Cambios deshechos");
      setStatusType("warning");
    }
  }
  function hasChanges() {
    if (!originalSelected) return false;
    if (selectedTracks.size !== originalSelected.size) return true;
    for (const uri of selectedTracks) if (!originalSelected.has(uri)) return true;
    return false;
  }
  async function toggleExpand(pl) {
    const copy = new Set(expanded);
    if (copy.has(pl.id)) copy.delete(pl.id);
    else {
      copy.add(pl.id);
      if (!playlistTracks[pl.id]) {
        const tracks = await fetchAll(`https://api.spotify.com/v1/playlists/${pl.id}/tracks?limit=100`);
        setPlaylistTracks((prev) => ({
          ...prev,
          [pl.id]: tracks
            .filter((t) => t.track)
            .map((t) => ({
              id: t.track.id,
              uri: t.track.uri,
              name: t.track.name,
              artist: t.track.artists?.[0]?.name || "",
            }))
            .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" })),
        }));
      }
    }
    setExpanded(copy);
  }
  async function mergePlaylists() {
    if (!userId || selectedTracks.size === 0) {
      setStatus("No hay canciones seleccionadas.");
      setStatusType("warning");
      return;
    }
    setLoading(true);
    setStatus("Fusionando listas...");
    setStatusType("loading");
    try {
      const sortedTracks = Array.from(selectedTracks).sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" })
      );
      let playlistId = targetId;
      if (!playlistId) {
        const created = await sp(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Unlifo - ${new Date().toLocaleDateString("es-ES")}`,
            description:
              "Creada automáticamente por Unlifo (no modificar esta descripción para que funcione correctamente en la página de unlifo.lovestoblog.com).",
            public: false,
          }),
        });
        playlistId = created.id;
        setTargetId(created.id);
        setPlaylists((prev) =>
          [...prev, created].sort((a, b) =>
            a.name.localeCompare(b.name, "es", { sensitivity: "base" })
          )
        );
      } else {
        await sp(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uris: [] }),
        });
      }
      sortedTracks.sort(() => Math.random() - 0.5);
      for (let i = 0; i < sortedTracks.length; i += 100) {
        await sp(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uris: sortedTracks.slice(i, i + 100) }),
        });
      }
      setStatus(`Playlist fusionada con ${sortedTracks.length} canciones.`);
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Error al fusionar playlists.");
=======

  async function merge() {
    setLoading(true);
    setStatus("Preparando fusión...");
    setStatusType("loading");
    try {
      const uris = [];
      const seen = new Set();
      for (const id of selected) {
        const plTracks = await fetchAll(
          `https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`
        );
        for (const it of plTracks) {
          if (it.track && !seen.has(it.track.uri)) {
            seen.add(it.track.uri);
            uris.push(it.track.uri);
          }
        }
      }

      let playlistId = targetId;
      if (!playlistId) {
        const pl = await sp(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: "POST",
          body: JSON.stringify({
            name: "Unlifo",
            description:
              "Creada automáticamente por Unlifo (no modificar esta descripción para que la página de unlifo.lovestoblog.com funcione correctamente)",
            public: false,
          }),
          headers: { "Content-Type": "application/json" },
        });
        playlistId = pl.id;
        setPlaylists((prev) => {
          const updated = [pl, ...prev];
          updated.sort((a, b) => {
            const aUnlifo = a.description?.toLowerCase().includes("unlifo.lovestoblog.com")
              ? 0
              : 1;
            const bUnlifo = b.description?.toLowerCase().includes("unlifo.lovestoblog.com")
              ? 0
              : 1;
            if (aUnlifo !== bUnlifo) return aUnlifo - bUnlifo;
            return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
          });
          return updated;
        });
        setTargetId(pl.id);
      } else {
        await sp(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "PUT",
          body: JSON.stringify({ uris: [] }),
          headers: { "Content-Type": "application/json" },
        });
      }
      for (let i = 0; i < uris.length; i += 100) {
        await sp(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "POST",
          body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
          headers: { "Content-Type": "application/json" },
        });
      }

      setMergedId(playlistId);
      save("merged_id", playlistId);
      setOriginalSelected(new Set(selected));
      setStatus(`La playlist cuenta con ${uris.length} canciones`);
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Error al fusionar");
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  function login() {
    const ver = generateCodeVerifier();
    save("ver", ver);
    sha256(ver).then((ch) => {
      const state = Math.random().toString(36).slice(2);
      const p = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        state,
        code_challenge_method: "S256",
        code_challenge: ch,
      });
      window.location = "https://accounts.spotify.com/authorize?" + p;
    });
  }
<<<<<<< HEAD
=======

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  function logout() {
    setToken(null);
    setUserId(null);
    setPlaylists([]);
<<<<<<< HEAD
    setTargetId("");
    setSelectedTracks(new Set());
    save("token", null);
    setStatus("Sesión cerrada.");
    setStatusType("warning");
  }
  function isPlaylistFullySelected(plId) {
    const tracks = playlistTracks[plId] || [];
    if (tracks.length === 0) return false;
    return tracks.every((t) => selectedTracks.has(t.uri));
  }
=======
    setSelected(new Set());
    setMergedId(null);
    setTargetId("");
    save("token", null);
    save("merged_id", null);
    setStatus("Sesión cerrada.");
    setStatusType("warning");
  }

  function selectAll() {
    setSelected(new Set(playlists.filter((p) => p.id !== targetId).map((p) => p.id)));
  }

  function deselectAll() {
    setSelected(new Set());
  }

  function undoChanges() {
    if (originalSelected) {
      setSelected(new Set(originalSelected));
      setStatus("Cambios deshechos");
      setStatusType("warning");
    }
  }

  function hasChanges() {
    if (!originalSelected) return false;
    if (selected.size !== originalSelected.size) return true;
    for (let id of selected) if (!originalSelected.has(id)) return true;
    return false;
  }

  const unlifoPlaylists = playlists
    .filter((pl) => pl.description?.toLowerCase().includes("unlifo.lovestoblog.com"))
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
  return (
    <div className="container">
      {!token ? (
        <>
          <div className="right-button">
<<<<<<< HEAD
            <button onClick={login} className="btn primary">Login Spotify</button>
=======
          <button onClick={login} className="btn primary">Login Spotify</button>
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
          </div>
          <h1>¿Qué es unlifo?</h1>
          <p>Unlifo sirve para unir listas de una cuenta de spotify, de esta manera si tienes listas que te gustaría unir no tendrás que esforzarte en hacerlo a mano, sino que ingresas aquí y de forma muy dinámica puedes crear o editar una lista sin canciones duplicadas.</p>
          <h1>¿Lo mejor de Unlifo?</h1>
          <p>Las listas que creas o editas son del propio Spotify, por lo que los cambios se guardan dirtectamente en tu cuenta.</p>
        </>
      ) : (
        <>
          {loading && (
            <div className="overlay">
              <div className="overlay-content">Cargando datos... No toques nada</div>
            </div>
          )}
          <div className="controls">
            <div className="left-controls">
              <button onClick={selectAll} className="btn secondary">
                Seleccionar todo
              </button>
              <button onClick={deselectAll} className="btn secondary">
                Deseleccionar todo
              </button>
              {hasChanges() && (
                <button onClick={undoChanges} className="btn warning">
                  Deshacer cambios
                </button>
              )}
            </div>
            <div className="right-controls">
              <select
                value={targetId}
<<<<<<< HEAD
                onChange={(e) => loadTargetSelection(e.target.value)}
                className="btn secondary">
                <option value="">Crear nueva</option>
                {playlists
                  .filter((pl) => pl.isUnlifo)
                  .map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name}
                    </option>
                  ))}
              </select>
              <button onClick={mergePlaylists} className="btn primary">
                Fusionar
              </button>
              {targetId && (
                <a
                  href={`https://open.spotify.com/playlist/${targetId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn ghost">
                  Abrir en Spotify
=======
                onChange={(e) => {
                  setTargetId(e.target.value);
                  loadTargetSelection(e.target.value);
                }}
                className="btn secondary">
                <option value="">Crear nueva</option>
                {unlifoPlaylists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
              <button onClick={merge} className="btn primary">
                Fusionar
              </button>
              {(targetId || mergedId) && (
                <a href={`https://open.spotify.com/playlist/${targetId || mergedId}`} target="_blank" rel="noreferrer" className="btn ghost">
                  Abrir Playlist
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
                </a>
              )}
              <button onClick={logout} className="btn danger">
                Cerrar sesión
              </button>
            </div>
          </div>
          <div className="playlists">
<<<<<<< HEAD
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className={`card ${pl.isUnlifo ? "unlifo-card" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={isPlaylistFullySelected(pl.id)}
                      onChange={(e) => {
                        const newSet = new Set(selectedTracks);
                        const tracks = playlistTracks[pl.id] || [];
                        if (e.target.checked) tracks.forEach((t) => newSet.add(t.uri));
                        else tracks.forEach((t) => newSet.delete(t.uri));
                        setSelectedTracks(newSet);
                      }}
                      disabled={pl.id === targetId}/>
                    <span>{pl.name}</span>
                  </label>
                  <div style={{ marginLeft: "auto" }}>
                    <span
                      onClick={() => toggleExpand(pl)}
                      style={{ cursor: "pointer", fontWeight: "500" }}>
                      {expanded.has(pl.id) ? "▼" : "▶"}
                    </span>
                  </div>
                </div>
                {expanded.has(pl.id) && (
                  <div className="track-list open">
                    {playlistTracks[pl.id] ? (
                      playlistTracks[pl.id].map((t) => (
                        <label key={t.uri} className="track-item">
                          <hr/>
                          <input
                            type="checkbox"
                            checked={isPlaylistFullySelected(pl.id)}
                            onChange={async (e) => {
                              const checked = e.target.checked;

                              const newSet = new Set(selectedTracks);
                              let tracks = playlistTracks[pl.id];
                              if (!tracks) {
                                try {
                                  const items = await fetchAll(`https://api.spotify.com/v1/playlists/${pl.id}/tracks?limit=100`);
                                  tracks = items
                                    .filter((t) => t.track)
                                    .map((t) => ({
                                      id: t.track.id,
                                      uri: t.track.uri,
                                      name: t.track.name,
                                      artist: t.track.artists?.[0]?.name || "",
                                    }))
                                    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
                                  setPlaylistTracks((prev) => ({ ...prev, [pl.id]: tracks }));
                                } catch (err) {
                                  console.error("Error al cargar canciones de la playlist:", pl.name, err);
                                  setStatus("Error al cargar canciones de la lista");
                                  setStatusType("error");
                                  return;
                                }
                              }
                              if (checked) tracks.forEach((t) => newSet.add(t.uri));
                              else tracks.forEach((t) => newSet.delete(t.uri));

                              setSelectedTracks(newSet);
                            }}
                            disabled={pl.id === targetId}
                          />
                          {t.name}
                        </label>
                      ))
                    ) : (
                      <em>Cargando canciones...</em>
                    )}
                  </div>
                )}
              </div>
            ))}
=======
            {playlists.map((pl) => {
              const isUnlifo = pl.description?.toLowerCase().includes("unlifo.lovestoblog.com");
              return (
                <label key={pl.id} className={`card ${isUnlifo ? "unlifo-card" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(pl.id)}
                    onChange={() => {
                      const s = new Set(selected);
                      s.has(pl.id) ? s.delete(pl.id) : s.add(pl.id);
                      setSelected(s);
                    }}
                    disabled={pl.id === targetId}
                  />
                  {pl.name}
                </label>
              );
            })}
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
          </div>
          {status && <div className={`status ${statusType}`}>{status}</div>}
        </>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f53748951b858dda397e3dda0ae9994c792ce672
