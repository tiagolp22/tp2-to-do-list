<?php
require_once('fonctionsDB.php');

// Récupération des données de la requête POST
$request_payload = file_get_contents('php://input');
$data_requete = json_decode($request_payload, true);

// Définition de $data_reponse par défaut à null
$data_reponse = null;

// Vérification si la clé 'action' est présente dans les données de la requête
if (isset($data_requete['action'])) {

    $action = $data_requete['action'];

    // Ajout d'une tâche
    if ($action === 'ajouterTache') {
        if (isset($data_requete['tache'], $data_requete['tache']['tache'], $data_requete['tache']['description'], $data_requete['tache']['importance'])) {

            $tache = htmlspecialchars($data_requete['tache']['tache']);
            $description = htmlspecialchars($data_requete['tache']['description']);
            $importance = htmlspecialchars($data_requete['tache']['importance']);

            // Appel de la fonction pour ajouter une nouvelle tâche à la base de données
            $resultat = ajouterTache($tache, $description, $importance);

            if ($resultat) {
                $data_reponse = array(
                    'id' => $resultat, // ID de la tâche insérée
                    'tache' => $tache, // Nom de la tâche
                    'description' => $description, // Nom de la description
                    'importance' => $importance // Importance de la tâche

                );
                echo json_encode($data_reponse);
            } else {
                $data_reponse = false;
                echo json_encode($data_reponse);
            }
        } else {
            $data_reponse = 'Erreur dans les paramètres de la requête.';
            echo json_encode($data_reponse);
        }
    }
    // Affichage des détails d'une tâche
    elseif ($action === 'afficheDetail') {
        if (isset($data_requete['id'])) {
            $id = htmlspecialchars($data_requete['id']);

            // Appel de la fonction pour obtenir les détails d'une tâche
            $tache_detail = filtrerTachesPardescription($id);

            if ($tache_detail) {
                $data_reponse = $tache_detail;
                echo json_encode($data_reponse);
            } else {
                $data_reponse = 'Erreur lors de la récupération des détails de la tâche.';
                echo json_encode($data_reponse);
            }
        } else {
            $data_reponse = 'Erreur dans les paramètres de la requête.';
            echo json_encode($data_reponse);
        }
    }
    // Manipulation des tâches par leur nom
    elseif ($action === 'tache') {
        if (isset($data_requete['type'])) {


            // Appel de la fonction pour trier les tâches par nom de la tâche
            echo filtrerTachesPartache();
        } else {
            $data_reponse = 'Erreur dans les paramètres de la requête.';
            echo json_encode($data_reponse);
        }
    }
    // Manipulation des tâches par leur importance
    elseif ($action === 'importance') {
        if (isset($data_requete['type']['propriete'])) {

            // Appel de la fonction pour trier les tâches par importance


            echo filtrerTachesParImportance();
        } else {
            $data_reponse = 'Erreur dans les paramètres de la requête.';
            echo json_encode($data_reponse);
        }
    }
    // Suppression d'une tâche
    elseif ($action === 'supprimeTache') {
        if (isset($data_requete['id'])) {
            $id = htmlspecialchars($data_requete['id']);

            // Appel de la fonction pour supprimer une tâche existante
            $resultat = supprimeTache($id);

            if ($resultat) {
                $data_reponse = true;
                echo json_encode($data_reponse);
            } else {
                $data_reponse = false;
            }
        } else {
            $data_reponse = 'Erreur dans les paramètres de la requête.';
            echo json_encode($data_reponse);
        }
    } else {
        $data_reponse = 'Erreur action';
        echo json_encode($data_reponse);
    }
} else {
    $data_reponse = 'Erreur action';
    echo json_encode($data_reponse);
}

header('Content-type: application/json; charset=utf-8');
