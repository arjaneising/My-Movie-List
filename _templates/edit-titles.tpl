<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <title>Edit title &mdash; <?php echo TITLE; ?></title>
    <link rel="icon" type="image/ico" href="./favicon.ico">
    <link rel="stylesheet" type="text/css" href="./_styles/screen.css">
  </head>
  <body>
    <h1>Edit title</h1>
    
    <div id="edit-titles" class="panel">
      <div class="header">
        <h2>Edit title</h2>
      </div>
      <div class="body">
        <div>
          <form action="edit-titles.php" method="post">
            <p>
              <label for="movie-id">Movie ID</label>
              <input class="text" id="movie-id" name="movie-id" value="<?php echo $id; ?>">
            </p>
            <p>
              <label for="original-title">Original title</label>
              <input class="text" id="original-title" name="original-title">
            </p>
            <p>
              <label for="english-title">English title</label>
              <input class="text" id="english-title" name="english-title">
            </p>
            <p class="buttons">
              <input type="hidden" name="step" value="2">
              <input type="submit" class="submit" value="Edit titles&hellip;">
            </p>
          </form>
        </div>
      </div>
    </div>
    
    <div id="actions"><a href="./">Back to the list&hellip;</a></div>
  </body>
</html>