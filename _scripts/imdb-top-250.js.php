<?php

header("Content-type: text/javascript");

require_once('../_includes/main.php');


$db = new MDB();
$imdbIds = $db->getImdbIds();

echo 'Movies.config.imdbIds = "|';

if (isset($imdbIds) && !empty($imdbIds)) {
  foreach ($imdbIds as $id)
    echo str_pad($id['id'], 7, '0', STR_PAD_LEFT) . '|';
}


echo '";';

?>