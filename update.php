<?php


require_once('_includes/main.php');

$conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die('Could not connect: ' . mysql_error());
mysql_select_db(DB_NAME, $conn) or die('Could not select database');

mysql_query("ALTER TABLE `" . DB_PREFIX . "cast` ADD INDEX ( `name_id` )", $conn);
mysql_query("ALTER TABLE `" . DB_PREFIX . "crew` ADD INDEX ( `name_id` )", $conn);
mysql_query("ALTER TABLE `" . DB_PREFIX . "imdbtop250` ADD UNIQUE `my_order` ( `order` , `id` )", $conn);
mysql_query("ALTER TABLE `" . DB_PREFIX . "movies` ADD `date_added` DATETIME NOT NULL", $conn);
mysql_query("UPDATE " . DB_PREFIX . "movies SET `date_added` =  NOW( )", $conn);








header('Location: ./?message=update-success');


?>