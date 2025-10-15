import React, { useEffect, useState } from "react";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = "https://unlifo.lovestoblog.com";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ");
function generateCodeVerifier(len = 128) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let out = "";
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  for (const c of arr) out += chars[c % chars.length];
  return out;
}
async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function save(key, v) {
  if (v === null || v === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(v));
}
function load(key) {
  const v = localStorage.getItem(key);
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}
export default function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [originalSelected, setOriginalSelected] = useState(null);
  const [targetId, setTargetId] = useState("");
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) exchange(code);
    else {
      const t = load("token");
      if (t) setToken(t);
    }
  }, []);
  useEffect(() => {
    if (token) init();
  }, [token]);
  async function exchange(code) {
    const ver = load("ver");
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
  async function sp(url, opt = {}) {
    const r = await fetch(url, {
      ...opt,
      headers: { ...(opt.headers || {}), Authorization: "Bearer " + token },
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
  async function fetchAll(url, key = "items") {
    const results = [];
    while (url) {
      const r = await sp(url);
      results.push(...(r[key] || []));
      url = r.next;
    }
    return results;
  }
  async function init() {
    setLoading(true);
    setStatus("Cargando playlists...");
    setStatusType("loading");
    try {
      const me = await sp("https://api.spotify.com/v1/me");
      setUserId(me.id);
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
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
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
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
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
              "/unlifo.lovestoblog.com/",
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
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }
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
  function logout() {
    setToken(null);
    setUserId(null);
    setPlaylists([]);
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
  return (
    <div className="container">
      {!token ? (
        <>
          <div className="right-button">
            <button onClick={login} className="btn primary">Login Spotify</button>
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
                </a>
              )}
              <button onClick={logout} className="btn danger">
                Cerrar sesión
              </button>
            </div>
          </div>
          <div className="playlists">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className={`card ${pl.isUnlifo ? "unlifo-card" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {pl?.images?.length > 0 && (
                      <img src={pl.images[0].url} alt={pl.name || "imagen"} class="image"/>
                    )}
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
                            checked={selectedTracks.has(t.uri)}
                            onChange={(e) => {
                              const newSet = new Set(selectedTracks);
                              if (e.target.checked) newSet.add(t.uri);
                              else newSet.delete(t.uri);
                              setSelectedTracks(newSet);
                            }}/>
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
          </div>
          {status && <div className={`status ${statusType}`}>{status}</div>}
        </>
      )}
    </div>
  );
}