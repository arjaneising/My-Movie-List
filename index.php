<?php

require_once('_includes/main.php');

$db = new MDB();

$movies = $db->getMovies();
$amountOfNames = $db->getAmountOfNames();

$tpl = new Template(DOCUMENT_ROOT . '_templates/index.tpl');
$tpl->set('movies', $movies);
$tpl->set('languages', $modernLanguages);
$tpl->set('amountOfNames', $amountOfNames);

if (isset($_GET['message']))
  $tpl->set('message', $_GET['message']);

echo $tpl->fetch();

?>