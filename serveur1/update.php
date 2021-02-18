<?php
  $url = 'http://127.0.0.1/Exercice-webservice/books/3';
  $data = array('name' => 'book8', 'author' => 'Jean', 'publication_date' => '2012-06-02', 'prix' => '20', 'stock' => '1000');
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($data));
$response = curl_exec($ch);
var_dump($response);
if (!$response) 
{
    return false;
}
?>ump($result);
?>