import React from 'react';

function ResultDisplay({ results }) {
  if (!results) {
    return <p>Aucun résultat à afficher.</p>;
  }

  return (
    <div className="results">
      <h2>Résultats :</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <p>Nom : {result.nom}</p>
            <p>Code : {result.code}</p>
            {result.codeRegion && <p>Code Région : {result.codeRegion}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultDisplay;
