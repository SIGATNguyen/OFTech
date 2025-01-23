import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [territory, setTerritory] = useState(null); // Par défaut, aucun territoire sélectionné
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  // Correspondance entre le territoire sélectionné et l'API
  const apiMapping = {
    Départements: 'departements',
    Communes: 'communes',
    Epcis: 'epcis',
  };

  useEffect(() => {
    // Si une recherche est saisie et un territoire est sélectionné
    if (query && territory) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/${apiMapping[territory]}?nom=${query}&limit=5`
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des suggestions:', error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, territory]);

  const handleDownload = async () => {
    if (selected && territory) {
      try {
        // URL API spécifique pour chaque territoire
        const apiUrl = `https://geo.api.gouv.fr/${apiMapping[territory]}/${
          selected.code
        }?format=geojson${
          territory === 'Départements' ? '&geometry=contour' : '&geometry=contour'
        }`;

        const response = await fetch(apiUrl);
        const geojson = await response.json();

        // Convertir l'objet en chaîne JSON
        const data = JSON.stringify(geojson, null, 2);

        // Créer un blob et un lien de téléchargement
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${selected.nom.replace(/\s+/g, '_')}_${territory}.geojson`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        alert(
          'Erreur lors du téléchargement des données. Veuillez vérifier votre sélection.'
        );
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
                    key={item.code} // Chaque suggestion doit avoir un identifiant unique
                    onClick={() => {
                      setSelected(item); // Définit la sélection quand on clique
                      setQuery(item.nom); // Met à jour le champ de recherche avec la valeur sélectionnée
                      setSuggestions([]); // Vide les suggestions après sélection
                    }}
                  >
                    {item.nom}
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
          Projet disponible sur{' '}
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
