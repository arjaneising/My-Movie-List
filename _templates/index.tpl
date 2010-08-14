<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <title><?php echo TITLE; ?></title>
    <link rel="icon" type="image/ico" href="./favicon.ico">
    <link rel="stylesheet" type="text/css" href="./_styles/screen.css">
    <link rel="search" type="application/opensearchdescription+xml" href="./opensearch.php" title="<?php echo TITLE; ?>">
    <meta name="amount-of-names" content="<?php echo $amountOfNames; ?>">
    <!--[if IE]><link rel="stylesheet" type="text/css" href="./_styles/screen-ie.css"><![endif]-->
  </head>
  <body>
    <h1><?php echo TITLE; ?></h1>
    <p><?php echo INTROLINE; ?></p>

<!--[if lt IE 8]>
    <p class="upgrade">You're using an out-dated browser. Please upgrade to the latest version of <a href="http://www.microsoft.com/netherlands/windows/internet-explorer/">Internet Explorer</a>, or try <a href="http://www.mozilla.com/firefox/">Firefox</a>, <a href="http://www.opera.com/download/">Opera</a> or <a href="http://www.google.com/chrome">Chrome</a>.</p>
<![endif]-->

<?php
if (isset($message)) :
  switch ($message) :
    case 'add-success' :
?>
    <p class="message">Movie successfully added. <a href="./add-movie.php">Add another movie&hellip;</a></p>
<?php
      break;
    case 'add-error' :
?>
    <p class="message error">Movie not added. <a href="./add-movie.php">Try again&hellip;</a></p>
<?php
      break;
    case 'update-imdb-success' :
?>
    <p class="message">IMDb Top 250 successfully refreshed.</p>
<?php
      break;
    case 'install-success' :
?>
    <p class="message">My Movie List successfully installed :) Now delete <code>install.php</code> and <a href="./add-movie.php">add your first movie</a>.</p>
<?php
      break;
    case 'request-error' :
?>
    <p class="message error">Invalid request.</p>
<?php
      break;
    case 'edit-success' :
?>
    <p class="message">Movie successfully edited.</p>
<?php
      break;
    case 'delete-success' :
?>
    <p class="message">Movie successfully deleted.</p>
<?php
      break;
    case 'edit-titles-success' :
?>
    <p class="message">Movie titles successfully edited.</p>
<?php
      break;
    case 'edit-error' :
    case 'delete-error' :
    case 'update-imdb-error' :
    case 'edit-titles-error' :
?>
    <p class="message error">Something went wrong, please try again.</p>
<?php
      break;
  endswitch;
endif;
?>


<?php if ($movies) : ?>
    <table id="main" cellspacing="0">
      <thead>
        <tr>
          <th scope="col" class="sort-alpha">Title</th>
          <th scope="col">Crew</th>
          <th scope="col">Cast</th>
          <th scope="col">Genre</th>
          <th scope="col" class="sort-num">Year</th>
          <th scope="col" class="sort-num">Runtime</th>
          <th scope="col" class="sort-num">Rating</th>
        </tr>
      </thead>

<?php
foreach ($movies as $movie) :
?>
      <tr>
<?php
  if ($movie['language'] != 'en' && strlen($movie['title_english']) > 0) :
?>
        <td><a href="http://www.imdb.com/title/tt<?php echo str_pad($movie['id'], 7, '0', STR_PAD_LEFT); ?>/" lang="<?php echo $movie['language']; ?>"><?php echo htmlspecialchars($movie['title']); ?></a> <span><?php echo $languages[$movie['language']] . ' "' . htmlspecialchars($movie['title_english']); ?>"</span></td>
<?php
  elseif ($movie['language'] != 'en') :
?>
        <td><a href="http://www.imdb.com/title/tt<?php echo str_pad($movie['id'], 7, '0', STR_PAD_LEFT); ?>/" lang="<?php echo $movie['language']; ?>"><?php echo htmlspecialchars($movie['title']); ?></a> <span><?php echo $languages[$movie['language']]; ?></span></td>
<?php
  else :
?>
        <td><a href="http://www.imdb.com/title/tt<?php echo str_pad($movie['id'], 7, '0', STR_PAD_LEFT); ?>/"><?php echo htmlspecialchars($movie['title']); ?></a></td>
<?php
  endif;
?>
        <td><?php echo htmlspecialchars($movie['crew_names']); ?></td>
        <td><?php echo htmlspecialchars($movie['cast_names']); ?></td>
        <td><?php echo str_replace(',', ', ', $movie['genre']); ?></td>
        <td><?php echo $movie['year']; ?></td>
        <td><?php echo $movie['runtime']; ?>m</td>
        <td><?php echo $movie['rating']; ?></td>
      </tr>
<?php
endforeach;
?>
    </table>
<?php else: ?>
    <p class="message">Currently, there are no movies on this list. <a href="./add-movie.php">Add a movie&hellip;</a></p>
<?php endif; ?>

    <p id="footer">Created with <a href="http://mymovielist.arjaneising.nl">My Movie List</a>.</p>

<?php if (LOGGEDIN) : ?>
    <div id="actions"><a href="add-movie.php">Add a movie</a></div>
<?php else : ?>
    <div id="actions"><a href="login.php">Login</a></div>
<?php endif; ?>
<!--[if gte IE 8]>
    <script type="text/javascript" src="./_scripts/dlite-1.0.js"></script>
    <script type="text/javascript" src="./_scripts/movies.js"></script>
    <script type="text/javascript" src="./_scripts/imdb-top-250.js.php"></script>
<?php if (LOGGEDIN) : ?>
    <script type="text/javascript" src="./_scripts/edit.js"></script>
<?php endif; ?>
    <script type="text/javascript" src="./_scripts/stats.js"></script>
    <script type="text/javascript" src="./_scripts/slider.class.js"></script>
    <script type="text/javascript" src="./_scripts/search.js"></script>
    <script type="text/javascript" src="./_scripts/sort.js"></script>
    <script type="text/javascript" src="./_scripts/compare.js"></script>
<![endif]-->
<!--[if !IE]><!-->
    <script type="text/javascript" src="./_scripts/dlite-1.0.js"></script>
    <script type="text/javascript" src="./_scripts/movies.js"></script>
    <script type="text/javascript" src="./_scripts/imdb-top-250.js.php"></script>
<?php if (LOGGEDIN) : ?>
    <script type="text/javascript" src="./_scripts/edit.js"></script>
<?php endif; ?>
    <script type="text/javascript" src="./_scripts/stats.js"></script>
    <script type="text/javascript" src="./_scripts/slider.class.js"></script>
    <script type="text/javascript" src="./_scripts/search.js"></script>
    <script type="text/javascript" src="./_scripts/sort.js"></script>
    <script type="text/javascript" src="./_scripts/compare.js"></script>
<!--<![endif]-->

    <script type="text/javascript">
      var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
      document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script type="text/javascript">
      try {
        var pageTracker = _gat._getTracker("UA-6956489-1");
        pageTracker._trackPageview();
      }
      catch(err) {}
    </script>
  </body>
</html>