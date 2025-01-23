import React from 'react';

function SearchDepartment({ setDepartment }) {
  return (
    <div>
      <h2>Rechercher le département</h2>
      <input
        type="text"
        placeholder="Ex: Gironde"
        onChange={(e) => setDepartment(e.target.value)}
      />
    </div>
  );
}

export default SearchDepartment;
