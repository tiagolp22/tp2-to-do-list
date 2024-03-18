import { App } from "./App.js";

export class TrierTaches extends App {
  constructor(el) {
    super();
    this._el = el;
    this._elTaches = document.querySelector("[data-js-taches]");

    this.init();
  }

  /**
   * Initialise les comportements
   */
  init() {
    this._el.addEventListener(
      "click",
      function (e) {
        let ordre = e.target.dataset.jsTrier;
        console.log("Ordre:", ordre);
        this.trieTaches(ordre);
      }.bind(this)
    );
  }

  /**
   * Réordonne le tableau aTaches et appelle la méthode pour injecter les tâches mises à jour
   * @param {String} propriete
   */
  trieTaches(propriete) {
    let data;

    let tache = {
      propriete: propriete,
    };

    if (propriete == "tache") {
      data = {
        action: "tache",
        type: tache,
      };
    } else {
      data = {
        action: "importance",
        type: tache,
      };
    }

    let oOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch("assets/requetes/requetesAsync.php", oOptions)
      .then(function (reponse) {
        if (reponse.ok) return reponse.json();
        else throw new Error("La réponse n'est pas OK");
      })
      .then(
        function (data) {
          if (data.length > 0) {
            this._elTaches.innerHTML = "";

            data.forEach(
              function (tache) {
                this.injecteTache(tache.id, tache.tache, tache.importance);
              }.bind(this)
            );
          } else {
            this._elTaches.innerHTML = "<p>Aucune tâche trouvée</p>";
          }
        }.bind(this)
      )
      .catch(function (erreur) {
        console.log(
          `Il y a eu un problème avec l'opération fetch: ${erreur.message}`
        );
      });
  }
}
