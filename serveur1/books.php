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
    case 'DELETE':
      // Supprimer un produit
      $id = intval($_GET["id"]);
      deleteBook($id);
      break;
    case 'PUT':
      // Modifier un produit
      $id = intval($_GET["id"]);
      updateBook($id);
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
    $prix = $_POST["prix"];
    $stock = $_POST["stock"];
    echo $query="INSERT INTO book(name, author_id, publication_date, prix, stock) VALUES('".$name."',(SELECT id from author WHERE name='".$author."') , '".$publication_date."', '".$prix."', '".$stock."')";
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

  function deleteBook($id)
  {
    global $conn;
    $query = "DELETE FROM book WHERE id=".$id;
    if(mysqli_query($conn, $query))
    {
      $response=array(
        'status' => 1,
        'status_message' =>'Livre supprime avec succes.'
      );
    }
    else
    {
      $response=array(
        'status' => 0,
        'status_message' =>'La suppression du livre a echoue. '. mysqli_error($conn)
      );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
  }

  function updateBook($id)
  {
    global $conn;
    $_PUT = array(); //tableau qui va contenir les données reçues
    parse_str(file_get_contents('php://input'), $_PUT);
    //$name = $_PUT["name"];
    //$author = $_PUT["author"];
    //$publication_date = $_PUT["publication_date"];
    //$prix = $_PUT["prix"];
    $stock = $_PUT["stock"];
    $query = "UPDATE book SET stock='".$stock."' WHERE id=".$id;
    if(mysqli_query($conn, $query))
    {
      $response=array(
        'status' => 1,
        'status_message' =>'Livre mis à jour avec succes.'
      );
    }
    else
    {
      $response=array(
        'status' => 0,
        'status_message' =>'La mise à jour du produit a echoue. '. mysqli_error($conn)
      );
    }
    header('Content-Type: application/json');
    echo json_encode($response);
  }

?>