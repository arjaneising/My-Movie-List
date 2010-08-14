<?php
if (count($results) > 0) :
?>

          <ul>
<?php
  foreach ($results as $result):
?>
            <li><a href="add-movie.php?step=3&amp;id=<?php echo $result->imdbid(); ?>"><?php echo $result->title(); ?></a> (<?php echo $result->year(); ?>)</li>
<?php
  endforeach;
?>
          </ul>

<?php
else:
?>

          <p>No results found. <a href="./add-movie.php">Try again?</a></p>

<?php
endif;
?>