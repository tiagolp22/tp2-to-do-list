<?php
// Effectue la connexion à la base de données
$connexion = connexionDB();

/**
 * Fonction pour établir une connexion à la base de données
 */
function connexionDB()
{
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    // define('DB_PASSWORD', 'root');         // Pour MAC
    define('DB_PASSWORD', '');               // Pour Windows

    $connexion = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD);

    if (!$connexion) {
        // La connexion n'a pas fonctionné
        die('Erreur de connexion à la base de données. ' . mysqli_connect_error());
    }

    $db = mysqli_select_db($connexion, 'to-do-list');

    if (!$db) {
        die('La base de données n\'existe pas.');
    }

    mysqli_query($connexion, 'SET NAMES "utf8"');
    return $connexion;
}

/**
 * Exécute une requête SQL
 * Si $insert est vrai, retourne l'ID de la ressource ajoutée à la base de données
 */
function executeRequete($requete, $insert = false)
{
    global $connexion;
    if ($insert) {
        mysqli_query($connexion, $requete);
        $resultat = $connexion->insert_id;
    } else {
        $resultat = mysqli_query($connexion, $requete);
    }
    return $resultat;
}

// Fonction pour ajouter une nouvelle tâche
function ajouterTache($tache, $description, $importance)
{
    $query = "INSERT INTO taches (tache, description, importance) 
              VALUES ('" . $tache . "','" . $description . "','" . $importance . "')";
    return executeRequete($query, true);
}

// Fonction pour supprimer une tâche par id
function supprimeTache($id)
{
    $query = "DELETE FROM taches WHERE id=" . $id;
    return executeRequete($query);
}

// Fonction pour sélectionner toutes les tâches
function selectionnerToutesTaches()
{
    $query = "SELECT * FROM taches";
    return executeRequete($query);
}

// Fonction pour filtrer les tâches par nom de tâche
function filtrerTachesPartache()
{
    $query = executeRequete("SELECT * FROM taches ORDER BY tache ASC");
    $tache = array();
    while ($row = $query->fetch_assoc()) {
        $tache[] = $row;
    }
    return json_encode($tache, JSON_UNESCAPED_SLASHES);
}

// Fonction pour filtrer les tâches par importance
function filtrerTachesParImportance()
{
    $query = executeRequete("SELECT * FROM taches ORDER BY importance ASC");
    $tache = array();
    while ($row = $query->fetch_assoc()) {
        $tache[] = $row;
    }
    return json_encode($tache, JSON_UNESCAPED_SLASHES);
}

// Fonction pour filtrer les tâches par description
function filtrerTachesPardescription($idDescription)
{
    $idDescription = intval($idDescription);
    $query = "SELECT tache, description, importance FROM taches WHERE id = $idDescription";
    $result = executeRequete($query);

    // Vérifie si la requête a renvoyé des résultats
    if ($result && $result->num_rows > 0) {
        // Obtient les données de la tâche sous forme de tableau associatif
        $row = $result->fetch_assoc();
        return $row;
    } else {
        return null; // Renvoie null s'il n'y a pas de résultats
    }
}
