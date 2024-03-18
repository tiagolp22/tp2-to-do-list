export class Tache {
  #_el;
  #_index;
  #_tache;
  #_importance;
  #_elActions;
  _elTaches;
  #_elTacheDetail;

  constructor(el) {
    this.#_el = el;
    this.#_index = this.#_el.dataset.jsTache;
    this.#_tache = this.#_el.querySelector("span:first-child").innerText.trim();
    this.#_importance = this.#_el
      .querySelector("span:nth-child(2)")
      .innerText.trim();
    this.#_elActions = this.#_el.querySelector("[data-js-actions]");
    this._elTaches = this.#_el.closest("[data-js-taches]");
    this.#_elTacheDetail = document.querySelector("[data-js-tache-detail]");

    this.init();
  }

  init() {
    this.#_elActions.addEventListener(
      "click",
      function (e) {
        if (e.target.dataset.jsAction == "afficher") {
          this.afficheDetail();
        } else if (e.target.dataset.jsAction == "supprimer") {
          this.supprimeTache();
        }
      }.bind(this)
    );
  }

  afficheDetail() {
    let data = {
      action: "afficheDetail",
      id: this.#_index,
      tache: this.#_tache,
      importance: this.#_importance,
    };

    let oOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("assets/requetes/requetesAsync.php", oOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Erro ao carregar detalhes da tarefa");
        }
        return response.json();
      })
      .then(
        function (data) {
          let elDetailDom = `<div class="detail__info">
                                        <p><small>Tâche : </small>${
                                          data.tache
                                        }</p>
                                        <p><small>Description : </small>${
                                          data.description
                                            ? data.description
                                            : "Aucune description disponible."
                                        }</p>
                                        <p><small>Importance : </small>${
                                          data.importance
                                        }</p>
                                    </div>`;
          this.#_elTacheDetail.innerHTML = elDetailDom;
        }.bind(this)
      )
      .catch(
        function (error) {
          console.error("Erro:", error);
        }.bind(this)
      );
  }

  supprimeTache() {
    let data = {
      action: "supprimeTache",
      id: this.#_index,
    };

    let oOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("assets/requetes/requetesAsync.php", oOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("La réponse n'est pas OK");
        }
        return response.json();
      })
      .then(
        function (data) {
          if (data) {
            this.#_el.remove();
            this.#_elTacheDetail.remove();
          } else {
            console.log("error");
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(
            `Il y a eu un problème avec l'opération fetch: ${error.message}`
          );
        }.bind(this)
      );
  }
}
