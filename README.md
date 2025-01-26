# **SIGAT OFTech**

SIGAT OFTech est une application web permettant d’accéder aux données géographiques administratives en France. Elle offre un outil simple pour **rechercher**, **visualiser** et **télécharger** des contours géographiques au format GeoJSON, utilisables dans des logiciels SIG comme QGIS.

---

## **Fonctionnalités principales**

- **Recherche intuitive :** Recherchez des communes, EPCI, etc., avec tri priorisant les grandes villes (ex. : Bordeaux avant Boz).
- **Carte interactive :** Visualisez les limites administratives sélectionnées avec un fond de carte **Positron Retina**.
- **Téléchargement des données :** Téléchargez les contours GeoJSON et prévisualisez les données brutes avant téléchargement.

⚠ **Limitation :** Les contours des départements et régions ne sont pas encore disponibles.

---

## **Technologies utilisées**

- **React.js** : Interface utilisateur.
- **Leaflet.js** : Cartographie interactive.
- **GeoAPI Gouv** : Source des données géographiques.
- **CARTO (Positron Retina)** : Fond de carte.
- **CSS** : Design.
- **Vercel** : Hébergement.

---

## **Sources**

- [Documentation API Geo Gouv](https://geo.api.gouv.fr/decoupage-administratif)  
- [GitHub du projet](https://github.com/SIGATNguyen/OFTech)

