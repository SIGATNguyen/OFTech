import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [territory, setTerritory] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geojsonData, setGeojsonData] = useState(null);

  const apiMapping = {
    Communes: "communes",
    Epcis: "epcis",
  };

  useEffect(() => {
    if (query && territory) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/${apiMapping[territory]}?nom=${query}&limit=5`
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
  }, [query, territory]);

  const handleValidate = async () => {
    if (selected && territory) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${
          selected.code
        }?format=geojson&geometry=contour`;

        const response = await fetch(apiUrl);
        const geojson = await response.json();
        setGeojsonData(geojson);
        setIsModalOpen(true);
      } catch (error) {
        alert(
          "Erreur lors de la récupération des données. Veuillez vérifier votre sélection."
        );
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
      link.setAttribute(
        "download",
        `${selected.nom.replace(/\s+/g, "_")}_${territory}.geojson`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Fermer le pop-up après le téléchargement
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container">
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
              onChange={(e) => setQuery(e.target.value)}
            />
            {suggestions.length > 0 ? (
              <ul className="suggestions-list">
                {suggestions.map((item) => (
                  <li
                    key={item.code}
                    onClick={() => {
                      setSelected(item);
                      setQuery(item.nom);
                      setSuggestions([]);
                    }}
                  >
                    {item.nom}
                  </li>
                ))}
              </ul>
            ) : (
              query && <div className="no-suggestions">Aucune suggestion trouvée</div>
            )}
          </div>
          <div className="section">
            <button className="validate-button" onClick={handleValidate}>
              Valider
            </button>
          </div>
        </>
      )}
      {isModalOpen && geojsonData && (
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
  );
};

export default App;
