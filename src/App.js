import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const App = () => {
  // État pour le dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Autres états de l'application
  const [territory, setTerritory] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);

  // Références pour la carte et ses couches
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null); // Référence pour la couche de tuiles
  const geojsonLayerRef = useRef(null);

  const apiMapping = {
    Communes: "communes",
    Epcis: "epcis",
  };

  // Ajoute ou retire la classe "dark" sur le <body>
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([46.85, 2.35], 6);
      // Ajout du tile layer en fonction de darkMode
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
  }, []); // S'exécute une seule fois à l'initialisation

  // Met à jour la couche de tuiles lorsque darkMode change
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      // Retirer l'ancienne couche
      mapRef.current.removeLayer(tileLayerRef.current);
      // Ajouter la nouvelle couche en fonction du mode actuel
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

  // Récupération des suggestions uniquement si aucun élément n'est sélectionné
  useEffect(() => {
    if (query && territory && !isItemSelected) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/${apiMapping[territory]}?nom=${query}&boost=population&limit=5`
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

  // Affichage d'un aperçu sur la carte lors du survol d'une suggestion
  const handleHover = async (item) => {
    if (item && territory) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${item.code}?format=geojson&geometry=contour`;
        const response = await fetch(apiUrl);
        const geojson = await response.json();

        // Retirer l'ancienne couche GeoJSON si elle existe
        if (geojsonLayerRef.current) {
          mapRef.current.removeLayer(geojsonLayerRef.current);
        }
        // Ajouter la nouvelle couche GeoJSON
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

  // Sélection d'une suggestion (avec onMouseDown pour éviter la perte de focus)
  const handleSelect = (item) => {
    setSelected(item);
    setQuery(item.nom);
    setSuggestions([]);
    setIsItemSelected(true);
  };

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
      {/* Bouton dark mode fixé en haut à droite */}
      <header className="menu">
        <div className="menu-content">
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Mode Clair ☀️" : "Mode Sombre 🌕"}
          </button>
        </div>
      </header>

      {/* Conteneur principal en deux colonnes */}
      <div className="container">
        {/* Colonne de gauche : contenu */}
        <div className="left-column">
          <div className="logo-container">
            <img src="/LogoSIG.svg" alt="Logo de la promotion" className="logo" />
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
        </div>

        {/* Colonne de droite : carte */}
        <div className="right-column">
          <div id="map" className="map-container"></div>
        </div>
      </div>

      {/* Modal d'affichage des données GeoJSON */}
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
