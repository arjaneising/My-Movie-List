<?php

if (isset($movies) && !empty($movies)) :
?>
var OtherMovies = [];
<?php
  foreach ($movies as $movie) :
?>
OtherMovies[<?php echo $movie['id']; ?>] = ['<?php echo addslashes($movie['title']); ?>', <?php echo $movie['rating']; ?>];
<?php
  endforeach;
?>
Compare.compare(OtherMovies);
<?php
else:
?>
Compare.error();
<?php
endif;
?>