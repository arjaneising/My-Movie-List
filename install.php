<?php


require_once('_includes/main.php');

$conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die('Could not connect: ' . mysql_error());
mysql_select_db(DB_NAME, $conn) or die('Could not select database');



mysql_query("CREATE TABLE `" . DB_PREFIX . "cast` (
  `movie_id` int(7) NOT NULL,
  `name_id` int(7) NOT NULL,
  `order` int(3) NOT NULL,
  PRIMARY KEY  (`movie_id`,`name_id`),
  KEY `name_id` (`name_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8", $conn);



mysql_query("CREATE TABLE `" . DB_PREFIX . "crew` (
  `movie_id` int(7) NOT NULL,
  `name_id` int(7) NOT NULL,
  `order` int(3) NOT NULL,
  PRIMARY KEY  (`movie_id`,`name_id`),
  KEY `name_id` (`name_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8", $conn);



mysql_query("CREATE TABLE `" . DB_PREFIX . "imdbtop250` (
  `id` int(7) NOT NULL,
  `order` int(3) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `order` (`order`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8", $conn);



mysql_query("CREATE TABLE `" . DB_PREFIX . "movies` (
  `id` int(7) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_english` varchar(255) NOT NULL,
  `language` varchar(2) NOT NULL,
  `genre` set('Action','Adventure','Animation','Biography','Comedy','Crime','Documentary','Drama','Family','History','Horror','Music','Musical','Mystery','Sci-Fi','Short','Sport','Talk Show','Thriller','War','Western') NOT NULL,
  `year` int(4) NOT NULL,
  `runtime` int(3) NOT NULL,
  `rating` tinyint(2) NOT NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8", $conn);


mysql_query("CREATE TABLE `" . DB_PREFIX . "names` (
  `id` int(7) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8", $conn);







header('Location: ./?message=install-success');


?>