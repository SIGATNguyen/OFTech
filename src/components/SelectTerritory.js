import React from 'react';

function SelectTerritory({ setTerritory, activeTerritory }) {
  return (
    <div>
      <h2>Sélectionner un territoire</h2>
      <div className="buttons-group">
        <button
          onClick={() => setTerritory('departements')}
          className={activeTerritory === 'departements' ? 'active' : ''}
        >
          Départements
        </button>
        <button
          onClick={() => setTerritory('communes')}
          className={activeTerritory === 'communes' ? 'active' : ''}
        >
          Communes
        </button>
        <button
          onClick={() => setTerritory('epcis')}
          className={activeTerritory === 'epcis' ? 'active' : ''}
        >
          Epcis
        </button>
      </div>
    </div>
  );
}

export default SelectTerritory;
