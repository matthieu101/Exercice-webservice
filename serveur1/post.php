<?php
  $url = 'http://127.0.0.1/Exercice-webservice/books';
  $data = array('name' => 'book32', 'author' => 'Jean', 'publication_date' => '2012-06-02', 'prix' => '20', 'stock' => '1000');
  $options = array(
    'http' => array(
      'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
      'method'  => 'POST',
      'content' => http_build_query($data)
    )
  );
  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  if ($result === FALSE) { /* Handle error */ }
  var_dump($result);
?>