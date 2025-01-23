import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [territory, setTerritory] = useState(null); // Par défaut, aucun territoire sélectionné
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (query && territory) {
      // Simuler une API pour suggestions
      const data = {
        Départements: ['Gironde', 'Loire-Atlantique', 'Morbihan'],
        Communes: ['Nantes', 'Rennes', 'Vannes'],
        Epcis: ['Métropole de Rennes', 'EPCI Loire', 'EPCI Gironde'],
      };
      setSuggestions(
        data[territory].filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [query, territory]);

  const handleDownload = () => {
    if (selected) {
      // Crée un GeoJSON simulé basé sur la sélection
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: selected,
              category: territory,
            },
            geometry: {
              type: 'Point',
              coordinates: [Math.random() * 10, Math.random() * 10], // Coordonnées simulées
            },
          },
        ],
      };

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

      {/* Titre principal */}
      <h1>SIGAT OFTech</h1>
      <div className="subtitle">Sélectionner une limite administrative</div>

      {/* Section de sélection des territoires */}
      <div className="section">
        <div className="buttons-group">
          <button
            className={territory === 'Départements' ? 'active' : ''}
            onClick={() => {
              setTerritory('Départements');
              setQuery('');
              setSuggestions([]);
              setSelected(null);
            }}
          >
            Départements
          </button>
          <button
            className={territory === 'Communes' ? 'active' : ''}
            onClick={() => {
              setTerritory('Communes');
              setQuery('');
              setSuggestions([]);
              setSelected(null);
            }}
          >
            Communes
          </button>
          <button
            className={territory === 'Epcis' ? 'active' : ''}
            onClick={() => {
              setTerritory('Epcis');
              setQuery('');
              setSuggestions([]);
              setSelected(null);
            }}
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
                {suggestions.map((item) => (
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
              query && (
                <div className="no-suggestions">Aucune suggestion trouvée</div>
              )
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

      {/* Footer avec le lien vers GitHub */}
      <footer className="footer">
        <p>
          Lien vers le{' '}
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
