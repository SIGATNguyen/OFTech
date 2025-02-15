import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const App = () => {
  // Territoire (Communes/EPCI/IRIS)
  const [territory, setTerritory] = useState(null);
  // Recherche + suggestions
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  // Sélections
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedGeojsons, setSelectedGeojsons] = useState([]);
  // Modal "Voir la sélection"
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Références pour la carte Leaflet
  const mapRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  // API Mapping
  const apiMapping = {
    Communes: "communes",
    Epcis: "epcis",
    Iris: "iris"
  };

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([46.85, 2.35], 6);
      L.tileLayer(
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        {
          attribution:
            'Map tiles by <a href="https://carto.com/">CARTO</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. ' +
            'Data by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.'
        }
      ).addTo(mapRef.current);
    }
  }, []);

  // Fetch suggestions (limit=4, boost=population)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!territory || !query) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/${apiMapping[territory]}?nom=${query}&boost=population&limit=4`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Erreur fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [query, territory]);

  // Sélection d'une entité
  const handleSelectItem = async (item) => {
    if (selectedItems.some((sel) => sel.code === item.code)) return;
    setSelectedItems([...selectedItems, item]);
    try {
      const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${item.code}?format=geojson&geometry=contour`;
      const response = await fetch(apiUrl);
      const geojson = await response.json();
      setSelectedGeojsons([...selectedGeojsons, { code: item.code, data: geojson }]);
    } catch (error) {
      console.error("Erreur fetch geojson:", error);
    }
    setQuery("");
    setSuggestions([]);
  };

  // Retirer un item de la sélection
  const handleRemoveSelectedItem = (code) => {
    setSelectedItems(selectedItems.filter((it) => it.code !== code));
    setSelectedGeojsons(selectedGeojsons.filter((g) => g.code !== code));
  };

  // Combiner et afficher les entités sur la carte
  useEffect(() => {
    if (!mapRef.current) return;
    if (geojsonLayerRef.current) {
      mapRef.current.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }
    if (selectedGeojsons.length === 0) return;
    const combined = { type: "FeatureCollection", features: [] };
    selectedGeojsons.forEach(({ data }) => {
      if (data.type === "FeatureCollection") {
        combined.features.push(...data.features);
      } else if (data.type === "Feature") {
        combined.features.push(data);
      }
    });
    geojsonLayerRef.current = L.geoJSON(combined, {
      style: { color: "#007bff", weight: 2 }
    }).addTo(mapRef.current);
    if (geojsonLayerRef.current.getBounds().isValid()) {
      mapRef.current.fitBounds(geojsonLayerRef.current.getBounds());
    }
  }, [selectedGeojsons]);

  // Tout sélectionner
  const handleSelectAll = async () => {
    if (!territory) return;
    let apiUrl = "";
    if (territory === "Communes") {
      apiUrl = "https://geo.api.gouv.fr/communes?geometry=contour&format=geojson";
    } else if (territory === "Epcis") {
      apiUrl = "https://geo.api.gouv.fr/epcis?geometry=contour&format=geojson";
    } else if (territory === "Iris") {
      apiUrl = "https://geo.api.gouv.fr/communes?geometry=contour&format=geojson"; // Placeholder
    }
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSelectedItems([{ nom: `Toutes les ${territory}`, code: "ALL" }]);
      setSelectedGeojsons([{ code: "ALL", data }]);
    } catch (error) {
      console.error("Erreur tout sélectionner:", error);
    }
  };

  // Télécharger
  const handleDownload = () => {
    if (selectedGeojsons.length === 0) {
      alert("Aucune entité sélectionnée.");
      return;
    }
    const combined = { type: "FeatureCollection", features: [] };
    selectedGeojsons.forEach(({ data }) => {
      if (data.type === "FeatureCollection") {
        combined.features.push(...data.features);
      } else if (data.type === "Feature") {
        combined.features.push(data);
      }
    });
    const dataStr = JSON.stringify(combined, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `selection_${territory || "multi"}.geojson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag & Drop
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        alert("Fichier déposé (exemple) :\n" + content.slice(0, 200) + "...");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-row">
          <h1>SIGAT OFTech</h1>
          <div className="logos">
            <img src="/OF.svg" alt="Ouest France" className="logo-of" />
            <img src="/LogoSIG.svg" alt="SIGAT" className="logo-sigat" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="left-panel">
          <div className="territory-row">
            <button
              className={`territory-btn ${territory === "Communes" ? "selected" : ""}`}
              onClick={() => {
                setTerritory("Communes");
                setQuery("");
                setSuggestions([]);
                setSelectedItems([]);
                setSelectedGeojsons([]);
              }}
            >
              COMMUNES
            </button>
            <button
              className={`territory-btn ${territory === "Epcis" ? "selected" : ""}`}
              onClick={() => {
                setTerritory("Epcis");
                setQuery("");
                setSuggestions([]);
                setSelectedItems([]);
                setSelectedGeojsons([]);
              }}
            >
              EPCI
            </button>
            <button
              className={`territory-btn ${territory === "Iris" ? "selected" : ""}`}
              onClick={() => {
                setTerritory("Iris");
                setQuery("");
                setSuggestions([]);
                setSelectedItems([]);
                setSelectedGeojsons([]);
              }}
            >
              IRIS
            </button>
          </div>

          <div className="search-block">
            <input
              type="text"
              placeholder="Taper votre recherche"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((item) => (
                  <li key={item.code} onClick={() => handleSelectItem(item)}>
                    {item.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="indicators">
            <button>Variation de population</button>
            <button>Variation de population</button>
            <button>Variation de population</button>
            <button>Variation de population</button>
          </div>

          <div className="bottom-row">
            <button onClick={() => setIsModalOpen(true)}>Voir la sélection</button>
            <button onClick={handleSelectAll}>Tout sélectionner</button>
            <span className="counter">
              Nombre de sélection : {selectedItems.length}
            </span>
            <button onClick={handleDownload} className="download-btn">
              télécharger
            </button>
          </div>

          <div className="drag-drop" onDragOver={handleDragOver} onDrop={handleDrop}>
            <p>Glissez un fichier .geojson, .shp, .csv, etc. ici</p>
          </div>
        </div>

        <div className="right-panel">
          <div id="map" className="map-container"></div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Projet disponible sur{" "}
          <a href="https://github.com/SIGATNguyen/OFTech" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          — Réalisé par l'association eSIGAT - Université Rennes 2
        </p>
      </footer>

      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <h2>Sélection actuelle</h2>
            {selectedItems.length === 0 ? (
              <p>Aucune sélection.</p>
            ) : (
              <ul className="selected-list">
                {selectedItems.map((it) => (
                  <li key={it.code}>
                    {it.nom}{" "}
                    <button className="remove-btn" onClick={() => handleRemoveSelectedItem(it.code)}>
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
