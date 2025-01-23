import React from 'react';

function FormatSelector({ setFormat, activeFormat }) {
  return (
    <div>
      <h2>Sélectionner un format</h2>
      <div className="buttons-group">
        <button
          onClick={() => setFormat('geojson')}
          className={activeFormat === 'geojson' ? 'active' : ''}
        >
          GEOJSON
        </button>
        <button
          onClick={() => setFormat('geojson.gz')}
          className={activeFormat === 'geojson.gz' ? 'active' : ''}
        >
          GEOJSON/GZ
        </button>
        <button
          onClick={() => setFormat('shp')}
          className={activeFormat === 'shp' ? 'active' : ''}
        >
          SHP
        </button>
      </div>
    </div>
  );
}

export default FormatSelector;
