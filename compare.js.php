<?php

header("Content-type: text/javascript;charset=utf-8\n");

require_once('_includes/main.php');

$db = new MDB();

$movies = $db->getMovies();

$tpl = new Template(DOCUMENT_ROOT . '_templates/compare.tpl');
$tpl->set('movies', $movies);

echo $tpl->fetch();

?>