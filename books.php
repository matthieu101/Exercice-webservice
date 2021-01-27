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
        getBooks($id);
      }
      else
      {
        // Récupérer tous les produits
        getBooks();
      }
      break;
    case 'POST':
      // Ajouter un produit
      AddBook();
      break;
    default:
      // Requête invalide
      header("HTTP/1.0 405 Method Not Allowed");
      break;
  }

  function getBooks($id=0)
  {
    global $conn;
    $query = "SELECT * FROM book";
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

  function AddBook()
  {
    global $conn;
    $name = $_POST["name"];
    $author = $_POST["author"];
    $publication_date = $_POST["publication_date"];
    echo $query="INSERT INTO book(name, author, publication_date) VALUES('".$name."', '".$author."', '".$publication_date."')";
    if(mysqli_query($conn, $query))
    {
      $response=array(
        'status' => 1,
        'status_message' =>'Livre ajoute avec succes.'
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

?>