# OFTech SIGAT

OFTech SIGAT est une application web interactive permettant de **télécharger** et **visualiser** des données géographiques issues de l'API [geo.api.gouv.fr](https://geo.api.gouv.fr).  
Elle offre la possibilité de rechercher et de sélectionner des entités administratives (communes, EPCI, IRIS) pour les afficher sur une carte interactive et les exporter sous forme de fichier GeoJSON.

## Fonctionnalités

- **Recherche et sélection**  
  - Recherchez des communes, EPCI ou IRIS via un champ de recherche (avec suggestions en temps réel, limitées à 4 résultats et boostées par la population).
  - Sélection multiple d'entités pour les visualiser ensemble.

- **Visualisation SIG**  
  - Affichage des entités sélectionnées sur une carte interactive (Leaflet).
  - Zoom automatique pour voir l'ensemble des entités.

- **Téléchargement de données**  
  - Combinez toutes les entités sélectionnées en un unique fichier GeoJSON.
  - Téléchargez facilement ce fichier pour l'utiliser dans d'autres outils SIG.

- **Gestion de la sélection**  
  - Un compteur affiche le nombre d'entités sélectionnées.
  - Une modal « Voir la sélection » permet de consulter et de retirer des éléments de la sélection.

- **Drag & Drop (fonctionnalité en cours de développement)**  
  - Déposez un fichier GeoJSON dans la zone dédiée.
  - (Idée future) Conversion du GeoJSON en un fichier ZIP contenant les shapefiles correspondants.

## Comment ça fonctionne ?

1. **Sélectionnez le type d'entité** (Communes, EPCI ou IRIS) en cliquant sur l'un des trois boutons.
2. **Recherchez** votre entité en tapant dans le champ de recherche.
3. **Sélectionnez** une entité parmi les suggestions qui s'affichent.
4. **Visualisez** l'entité (ou les entités sélectionnées) sur la carte.
5. **Téléchargez** le GeoJSON combiné en cliquant sur le bouton "télécharger".
6. (Optionnel) Déposez un fichier GeoJSON via la zone Drag & Drop pour une transformation ultérieure.

## Technologies utilisées

- **React** pour l'interface utilisateur.
- **Leaflet** pour l'affichage de la carte.
- **HTML5 & CSS3** pour la mise en page responsive et moderne.
- **API geo.api.gouv.fr** pour l'accès aux données géographiques.
- **(Optionnel) shp-write** (pour une future conversion GeoJSON → ZIP shapefile).

## Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/SIGATNguyen/OFTech.git
   cd OFTech
