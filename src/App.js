import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const App = () => {
  // État pour le dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Autres états
  const [territory, setTerritory] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);

  // pour la carte & les couches
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);

  const apiMapping = {
    Communes: "communes",
    Epcis: "epcis",
  };

  // Mise à jour de la classe "dark" sur le "body"
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Init la carte
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([46.85, 2.35], 6);
      // Ajout du tile layer selon le mode (dark et light)
      tileLayerRef.current = L.tileLayer(
        darkMode
          ? "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
          : "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        {
          attribution:
            'Map tiles by <a href="https://carto.com/">CARTO</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.',
        }
      ).addTo(mapRef.current);
    }
  }, []);

  // MAJ du tile en dark mode
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = L.tileLayer(
        darkMode
          ? "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
          : "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        {
          attribution:
            'Map tiles by <a href="https://carto.com/">CARTO</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.',
        }
      ).addTo(mapRef.current);
    }
  }, [darkMode]);

  // Récup des suggestions 3max + boost pop
  useEffect(() => {
    if (query && territory && !isItemSelected) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/${apiMapping[territory]}?nom=${query}&boost=population&limit=3` // boost=pop pour classer par pop.
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, territory, isItemSelected]);

  // Affichage sur la carte lors du survol d'une suggestion
  const handleHover = async (item) => {
    if (item && territory) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${item.code}?format=geojson&geometry=contour`;
        const response = await fetch(apiUrl);
        const geojson = await response.json();

        if (geojsonLayerRef.current) {
          mapRef.current.removeLayer(geojsonLayerRef.current);
        }
        const newLayer = L.geoJSON(geojson, {
          style: { color: "#ffcc00", weight: 2 },
        }).addTo(mapRef.current);
        geojsonLayerRef.current = newLayer;
        mapRef.current.fitBounds(newLayer.getBounds());
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    }
  };

  // Sélection d'une suggestion (#Problème réglé avec IsItemSelected)
  const handleSelect = (item) => {
    setSelected(item);
    setQuery(item.nom);
    setSuggestions([]);
    setIsItemSelected(true);
  };

  // Validation de la sélection et affichage de la modal = popup en gros
  const handleValidate = async () => {
    if (selected && territory) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${selected.code}?format=geojson&geometry=contour`;
        const response = await fetch(apiUrl);
        const geojson = await response.json();
        setGeojsonData(geojson);
        setIsModalOpen(true);
      } catch (error) {
        alert("Erreur lors de la récupération des données. Veuillez vérifier votre sélection.");
        console.error(error);
      }
    } else {
      alert("Veuillez sélectionner une suggestion avant de valider.");
    }
  };

  const handleDownload = () => {
    if (geojsonData) {
      const data = JSON.stringify(geojsonData, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selected.nom.replace(/\s+/g, "_")}_${territory}.geojson`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Bouton dark mode fixé */}
      <header className="menu">
        <div className="menu-content">
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Mode Clair ☀️" : "Mode Sombre 🌕"}
          </button>
        </div>
      </header>

      {/* Zone principale en trois colonnes */}
      <div className="container">
        {/* Colonne de gauche : "Menu" */}
        <div className="left-column">
          <div className="logo-container">
            <img src="/LogoSIG.svg" alt="Logo de la promotion" className="logo" />
            <img src="/OF.svg" alt="Logo de OF" className="logo" />
          </div>
          <h1>SIGAT OFTech</h1>
          <div className="subtitle">Sélectionner une limite administrative</div>
          <div className="section">
            <div className="buttons-group">
              <button
                className={territory === "Communes" ? "active" : ""}
                onClick={() => {
                  setTerritory("Communes");
                  setQuery("");
                  setSuggestions([]);
                  setSelected(null);
                  setGeojsonData(null);
                  setIsItemSelected(false);
                }}
              >
                Communes
              </button>
              <button
                className={territory === "Epcis" ? "active" : ""}
                onClick={() => {
                  setTerritory("Epcis");
                  setQuery("");
                  setSuggestions([]);
                  setSelected(null);
                  setGeojsonData(null);
                  setIsItemSelected(false);
                }}
              >
                Epcis
              </button>
            </div>
          </div>
          {territory && (
            <>
              <div className="section">
                <input
                  type="text"
                  placeholder={`Rechercher ${territory.toLowerCase()}`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsItemSelected(false);
                  }}
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((item) => (
                      <li
                        key={item.code}
                        onMouseEnter={() => handleHover(item)}
                        onMouseDown={() => handleSelect(item)}
                      >
                        {item.nom}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="section">
                <button className="validate-button" onClick={handleValidate}>
                  Valider
                </button>
              </div>
            </>
          )}
        </div>

        {/* Colonne du milieu : "indicateurs" */}
        <div className="middle-column">
          <h2>Indicateurs</h2>
          <div className="indicators-buttons-group">
            <button className="indicator-button">Variation de population</button>
            <button className="indicator-button">Taux de chômage</button>
            <button className="indicator-button">Prix de l'immobilier</button>
            <button className="indicator-button">Prix de l'immobilier</button>
            <button className="indicator-button">Prix de l'immobilier</button>
          </div>
        </div>

        {/* Colonne de droite : "carte" */}
        <div className="right-column">
          <div id="map" className="map-container"></div>
        </div>
      </div>

      {/* Footer en bas, hors container */}
      <footer className="footer">
        <p>
          Projet disponible sur{" "}
          <a
            href="https://github.com/SIGATNguyen/OFTech"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
        </p>
      </footer>

      {/* Modal - affichage des données en GeoJSON */}
      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <h3>Données GeoJSON :</h3>
            <pre className="geojson-data">
              {JSON.stringify(geojsonData, null, 2)}
            </pre>
            <div className="modal-buttons">
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                Fermer
              </button>
              <button className="download-button" onClick={handleDownload}>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
