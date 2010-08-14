<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <title>Login &mdash; <?php echo TITLE; ?></title>
    <link rel="icon" type="image/ico" href="./favicon.ico">
    <link rel="stylesheet" type="text/css" href="./_styles/screen.css">
  </head>
  <body>
    <h1>Login</h1>
    
<?php

if (isset($message)) :
  switch($message) :
    case 'invalid-request':
?>
    <p class="message">Invalid request.</p>
<?php
      break;
    case 'wrong-password':
?>
    <p class="message">The username and password combination is wrong. Please try again:</p>
<?php
      break;
  endswitch;
endif;

?>

    <div id="login" class="panel">
      <div class="header">
        <h2>Login</h2>
      </div>
      <div class="body">
        <div>
          <form action="login.php" method="post">
            <p>
              <label for="username">Username</label>
              <input type="text" class="text" name="username" id="username">
            </p>
            <p>
              <label for="password">Password</label>
              <input type="password" class="text" name="password" id="password">
            </p>
            <p>
              <input type="submit" class="submit" value="Login&hellip;">
              <input type="hidden" name="step" value="2">
            </p>
          </form>
        </div>
      </div>
    </div>
     
    <div id="actions"><a href="./">Back to the list&hellip;</a></div>
  </body>
</html>