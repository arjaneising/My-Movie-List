<?php

class MDB
{
  public function __construct() {
		$this->conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die('Could not connect: ' . mysql_error());
		mysql_select_db(DB_NAME, $this->conn) or die('Could not select database');
		return;
  }
  
  
  private function query($query, $args = array()) {
    $query = str_replace('#__', DB_PREFIX, $query);
    $args = array_map('escape', $args);
    $query = vsprintf($query, $args);
    return mysql_query($query, $this->conn);
  }
  
  
  
  public function getMovies() {
    $result = $this->query('SELECT `#__movies`.*, 
GROUP_CONCAT( DISTINCT `crew_names`.`name` ORDER BY `#__crew`.`order` ASC SEPARATOR ", ") AS `crew_names`,
GROUP_CONCAT( DISTINCT `crew_names`.`id` ORDER BY `#__crew`.`order` ASC SEPARATOR ",") AS `crew_ids`,
GROUP_CONCAT( DISTINCT `cast_names`.`name` ORDER BY `#__cast`.`order` ASC SEPARATOR ", ") AS `cast_names`,
GROUP_CONCAT( DISTINCT `cast_names`.`id` ORDER BY `#__cast`.`order` ASC SEPARATOR ",") AS `cast_ids`
FROM `#__movies`
LEFT JOIN `#__crew` ON `#__crew`.`movie_id` = `#__movies`.`id`
LEFT JOIN `#__cast` ON `#__cast`.`movie_id` = `#__movies`.`id`
LEFT JOIN `#__names` AS `crew_names` ON `crew_names`.`id` = `#__crew`.`name_id`
LEFT JOIN `#__names` AS `cast_names` ON `cast_names`.`id` = `#__cast`.`name_id`
GROUP BY `#__movies`.`id`
ORDER BY `#__movies`.`title`');
    
    if (mysql_num_rows($result) == 0)
			return false;
		else {
			$toreturn = array();
			while ($row = mysql_fetch_array($result))
				$toreturn[] = $row;
			return $toreturn;
		}
  }
  
  
  
  public function getAmountOfNames() {
    $result = $this->query('SELECT COUNT(*) AS `amount` FROM `#__names`');
    return mysql_result($result, 0, 0);
  }
  
  
  
  public function insertCast($movieId, $nameId, $name, $order) {
    if (!is_numeric($movieId) || !is_numeric($nameId) || !is_numeric($order))
      return false;
    
    $this->query('INSERT INTO `#__names` (`id`, `name`) VALUES(%d, %s)', array($nameId, $name));
    $this->query('INSERT INTO `#__cast` (`movie_id`, `name_id`, `order`) VALUES(%d, %d, %d)', array($movieId, $nameId, $order));
  }
  
  
  
  public function insertCrew($movieId, $nameId, $name, $order) {
    if (!is_numeric($movieId) || !is_numeric($nameId) || !is_numeric($order))
      return false;
    
    $this->query('INSERT INTO `#__names` (`id`, `name`) VALUES(%d, %s)', array($nameId, $name));
    $this->query('INSERT INTO `#__crew` (`movie_id`, `name_id`, `order`) VALUES(%d, %d, %d)', array($movieId, $nameId, $order));
  }
  
  
  
  public function insertMovie($id, $title, $englishTitle, $language, $genres, $year, $runtime, $rating) {
    if (!is_numeric($id) || !is_numeric($year) || !is_numeric($runtime) || !is_numeric($rating))
      return false;
    
    $this->query('INSERT INTO `#__movies` (`id`, `title`, `title_english`, `language`, `genre`, `year`, `runtime`, `rating`, `date_added`) VALUES(%d, %s, %s, %s, %s, %d, %d, %d, NOW())', array($id, $title, $englishTitle, $language, $genres, $year, $runtime, $rating));
    
    return mysql_affected_rows($this->conn) == 1;
  }
  
  
  
  public function editMovie($id, $rating) {
    if (!is_numeric($id) || !is_numeric($rating))
      return false;
    
    $this->query('UPDATE `#__movies` SET `rating`=%d WHERE `id`=%d', array($rating, $id));
    
    return mysql_affected_rows($this->conn) == 1;
  }
  
  
  
  public function deleteMovie($id) {
    if (!is_numeric($id))
      return false;
    
    $this->query('DELETE FROM `#__movies` WHERE `id`=%d', array($id));
    $this->query('DELETE FROM `#__crew` WHERE `movie_id`=%d', array($id));
    $this->query('DELETE FROM `#__cast` WHERE `movie_id`=%d', array($id));
    
    $this->query('DELETE `#__names` FROM `#__names`
      LEFT JOIN `#__cast` ON `#__cast`.`name_id` = `#__names`.`id`
      LEFT JOIN `#__crew` ON `#__crew`.`name_id` = `#__names`.`id`
      WHERE `#__cast`.`name_id` IS NULL AND `#__crew`.`name_id` IS NULL');
    
    return true;
  }
  
  
  
  public function editTitles($id, $original, $english) {
    if (!is_numeric($id))
      return false;
    
    $this->query('UPDATE `#__movies` SET `title`=%s, `title_english`=%s WHERE `id`=%d', array($original, $english, $id));
    
    return mysql_affected_rows($this->conn) == 1;
  }
  
  
  
  public function insertImdbIds($ids) {
    $this->query('TRUNCATE TABLE `#__imdbtop250`');
    
    $count = 1;
    
    foreach ($ids as $id) {
      if (!is_numeric($id))
        continue;
      
      $this->query('INSERT INTO `#__imdbtop250` (`id`, `order`) VALUES(%d, %d)', array($id, $count));
      
      $count++;
    }
  }
  
  
  
  public function getImdbIds() {
    $result = $this->query('SELECT `id` FROM `#__imdbtop250` ORDER BY `order`');
    
    if (mysql_num_rows($result) == 0)
			return false;
		else {
			$toreturn = array();
			while ($row = mysql_fetch_array($result))
				$toreturn[] = $row;
			return $toreturn;
		}
  }
}



?>