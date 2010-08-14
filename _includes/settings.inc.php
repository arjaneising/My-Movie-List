<?php

/* Set the title of the page in introline here */
define('TITLE', 'Movies');
define('INTROLINE', 'This is where I keep track of the movies I have seen.');


/* The database settings */
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'movies');
define('DB_PREFIX', 'm_');

/* The users in an array. Format 'username' => 'password' */
$users = array(
  'admin' => 'password'
);

/* Maximum amount of names per movie */
define('MAXNAMES', 20);

/* Define the paths to the directory */
define('WEB_ROOT', 'http://domain.tld/path/');

?>