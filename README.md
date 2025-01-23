SIGAT OFTech
Description du projet
SIGAT OFTech est un projet visant à fournir un outil simple et efficace pour accéder aux données géographiques administratives en France. Grâce à une interface intuitive, les utilisateurs peuvent :

Rechercher des Départements, Communes ou EPCI par leur nom.
Télécharger les contours géographiques correspondants au format GeoJSON pour une utilisation directe dans des outils de SIG (Systèmes d'Information Géographique) tels que QGIS.
⚠ Limitation : Les contours géographiques pour les départements ne sont pas disponibles via l'API utilisée. Cette fonctionnalité est donc indisponible pour les départements.

Fonctionnalités principales
Interface intuitive :

Choisissez une limite administrative parmi :
Départements
Communes
EPCI (Établissements Publics de Coopération Intercommunale)
Saisissez un nom pour rechercher facilement dans la base des données disponibles.
Téléchargement des données :

Obtenez un fichier GeoJSON contenant les contours géographiques des Communes ou des EPCI sélectionnés.
Les fichiers téléchargés sont prêts à être utilisés dans des outils comme QGIS.
Lien vers le projet GitHub :

Consultez ou contribuez au projet en accédant directement à la page GitHub.

Limites actuelles
Contours des Départements indisponibles :
L'API utilisée (API Géo du gouvernement) ne fournit pas les données géographiques des contours des départements. Une mise à jour future pourrait permettre d'ajouter cette fonctionnalité si elle devient disponible.

Technologies utilisées
React.js : pour la construction de l'interface utilisateur.
API Géo du gouvernement : pour l'accès aux données géographiques.
CSS : pour le design et la mise en page.
