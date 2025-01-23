import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [territory, setTerritory] = useState(null); // Par défaut, aucun territoire sélectionné
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fonction pour récupérer les options de l'API en fonction du territoire
  const fetchSuggestions = async (territoryType) => {
    if (territoryType) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${territoryType}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Extraire les noms des éléments retournés par l'API
        const options = data.map((item) => item.nom || item.name || item.libelle);
        setSuggestions(options);
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions :", error);
        setSuggestions([]);
      }
    }
  };

  // Gestion du clic sur les boutons de territoire
  const handleTerritoryClick = (territoryType) => {
    setTerritory(territoryType);
    setQuery(''); // Réinitialise la recherche
    setSuggestions([]);
    setSelected(null); // Réinitialise la sélection
    fetchSuggestions(territoryType); // Recharge les suggestions
  };

  // Gestion du téléchargement des contours
  const handleDownload = async () => {
    if (selected && territory) {
      try {
        const apiUrl = `https://geo.api.gouv.fr/${territory}/${selected}?format=geojson&geometry=contour`;
        const response = await axios.get(apiUrl);
        const geojson = response.data;

        // Vérification si le GeoJSON est correct
        if (!geojson || geojson.type !== 'FeatureCollection') {
          alert("Erreur : les contours demandés ne sont pas disponibles.");
          return;
        }

        // Convertir l'objet en chaîne JSON
        const data = JSON.stringify(geojson, null, 2);

        // Créer un blob et un lien de téléchargement
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selected}_${territory}.geojson`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        alert("Erreur lors de la récupération des contours. Vérifiez votre connexion ou la validité de votre sélection.");
        console.error(error);
      }
    } else {
      alert('Veuillez sélectionner une suggestion avant de télécharger.');
    }
  };

  return (
    <div className="container">
      {/* Ajout du logo */}
      <div className="logo-container">
        <img src="/LogoSIG.svg" alt="Logo de la promotion" className="logo" />
      </div>

      <h1>SIGAT OFTech</h1>
      <div className="subtitle">Sélectionner une limite administrative</div>

      {/* Section de sélection des territoires */}
      <div className="section">
        <div className="buttons-group">
          <button
            className={territory === 'departements' ? 'active' : ''}
            onClick={() => handleTerritoryClick('departements')}
          >
            Départements
          </button>
          <button
            className={territory === 'communes' ? 'active' : ''}
            onClick={() => handleTerritoryClick('communes')}
          >
            Communes
          </button>
          <button
            className={territory === 'epcis' ? 'active' : ''}
            onClick={() => handleTerritoryClick('epcis')}
          >
            Epcis
          </button>
        </div>
      </div>

      {/* Section de recherche */}
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
                {suggestions
                  .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                  .map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        setSelected(item);
                        setQuery(item);
                        setSuggestions([]);
                      }}
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            ) : (
              query && <div className="no-suggestions">Aucune suggestion trouvée</div>
            )}
          </div>

          {/* Bouton de téléchargement */}
          <div className="section">
            <button className="download-button" onClick={handleDownload}>
              Télécharger
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
