<?php
  // Se connecter à la base de données
  include("db_connect.php");
  $request_method = $_SERVER["REQUEST_METHOD"];

  switch($request_method)
  {
    case 'GET':
      if(!empty($_GET["id"]))
      {
        // Récupérer un seul produit
        $id = intval($_GET["id"]);
        getAuthors($id);
      }
      else
      {
        // Récupérer tous les produits
        getAuthors();
      }
      break;
    case 'POST':
      // Ajouter un produit
      AddAuthor();
      break;
    case 'PUT':
      // Supprimer un produit
      $id = intval($_GET["id"]);
      deleteAuthor($id);
      break;
    default:
      // Requête invalide
      header("HTTP/1.0 405 Method Not Allowed");
      break;
  }

  function getAuthors($id=0)
  {
    global $conn;
    $query = "SELECT * FROM author";
    if($id != 0)
    {
      $query .= " WHERE id=".$id." LIMIT 1";
    }
    $response = array();
    $result = mysqli_query($conn, $query);
    while($row = mysqli_fetch_array($result))
    {
      $response[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
  }

  function AddAuthor()
  {
    global $conn;
    $name = $_POST["name"];
    $city = $_POST["city"];
    echo $query="INSERT INTO author(name, city,) VALUES('".$name."', '".$city."')";
    if(mysqli_query($conn, $query))
    {
      $response=array(
        'status' => 1,
        'status_message' =>'Auteur ajoute avec succes.'
      );
    }
    else
    {
      $response=array(
        'status' => 0,
        'status_message' =>'ERREUR!.'. mysqli_error($conn)
      );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
  }

  function deleteAuthor($id)
  {
    global $conn;
    $query = "DELETE FROM author WHERE id=".$id;
    if(mysqli_query($conn, $query))
    {
      $response=array(
        'status' => 1,
        'status_message' =>'Auteur supprime avec succes.'
      );
    }
    else
    {
      $response=array(
        'status' => 0,
        'status_message' =>"La suppression de l'auteur a echoue. ". mysqli_error($conn)
      );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
  }

?>