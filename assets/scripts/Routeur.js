import { accueil } from "./Accueil.js";
import { erreur404 } from "./erreur404.js";
//import { App } from "./App.js";
// import { Detail } from "./Detail.js";
//import { Formulaire } from "./Formulaire.js";
// import { Tache } from "./Tache.js";
// import { TrierTaches } from "./TrierTaches.js";

export default class Router {
  #_el;
  #_elSelectTache;
  #_routes;
  #_elH1;
  #_elBouton;

  constructor(el) {
    this.#_el = el;
    this.#_elH1 = this.#_el.querySelector("header h1");
    this.#_routes = [
      ["", accueil],
      ["/taches/:id", ajouterTache],
    ];
    this.#init();
  }

  #init() {
    /*Au chargement de la page
     */

    let id = this.gereHashbang();
    this.#optionSelectionnee(id);

    this.#_elBouton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("click");
      let id = e.target.value;
      if (id && id != 0) location = `#!/taches/${id}`;
    });

    //gestion du click H1

    this.#_elH1.addEventListener("click", function () {
      location = "#!";
    });

    window.addEventListener(
      "hashchange",
      function () {
        let id = this.gereHashbang();
        this.#optionSelectionnee(id);
      }.bind(this)
    );
  }

  /**
   * Gestion du fragment d'url suite à au #! pour appeler le comportement de la route correspondante.
   */
  gereHashbang() {
    // console.log('danss gereHashbang');
    let hash = location.hash.slice(2);
    let isRoute = false;

    //location : objet du window qui permet de traiter l'url.
    // console.log(hash);
    if (hash.endsWith("/")) {
      hash = hash.slice(0, -1);
    }

    /** Pour chaque route, est-ce qu'il y a une correspondance avec le hash courant */
    for (let i = 0; i < this.#_routes.length; i++) {
      let route = this.#_routes[i][0],
        isId = false,
        hashSansId;

      //   console.log(route);
      if (route.indexOf(":") > -1) {
        route = route.slice(0, route.indexOf("/:"));
        hashSansId = hash.slice(0, hash.lastIndexOf("/"));
        isId = true;
      }

      if (route == hash || route == hashSansId) {
        let hashInArray = hash.split(route);
        // console.log(hashInArray);
        if (hashInArray[1]) {
          if (isId) {
            //console.log("test");
            let id = hashInArray[1].slice(1); //enlever la barre /
            this.#_routes[i][1](id);
            isRoute = true;
            return id;
          }
        } else {
          if (hash == this.#_routes[i][0]) {
            console.log("pas id");
            this.#_routes[i][1]();
            isRoute = true;
          }
        }
      }
    }

    if (!isRoute) {
      erreur404();
    }
  }

  //gestion de option selectionee
  #optionSelectionnee(id = null) {
    if (id && this.#_elSelectTache.querySelector(`option[value="${id}"]`)) {
      this.#_elSelectTache.querySelector(
        `option[value="${id}"]`
      ).selected = true;
    } else {
      this.#_elSelectTache.querySelector(`option[value="0"]`).selected = true;
    }
  }
}
