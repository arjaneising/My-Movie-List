<?php

// Fetches the IMDb top 250 from the IMDb site and inserts the ids into the database

require_once('_includes/main.php');



$ch = curl_init('http://www.imdb.com/chart/top');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$htmlString = curl_exec($ch);
curl_close($ch);

if (isset($htmlString)) {
  $html = new DOMDocument();
  @ $html->loadHTML($htmlString);

  $ids = array();

  foreach ($html->getElementsByTagName('a') as $link) {
    $url = $link->getAttribute('href');
    if (strstr($url, '/title/tt'))
      $ids[] = substr($url, 9, 7);
  } 

  $db = new MDB();
  $db->insertImdbIds($ids);

  header('Location: ./?message=update-imdb-success');
}
else
  header('Location: ./?message=update-imdb-error');

exit();


?>