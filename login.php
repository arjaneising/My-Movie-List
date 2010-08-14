<?php

require_once('_includes/main.php');



switch (STEP) {
  case 1:
  default:
    Login::Step1();
    break;
  case 2:
    Login::Step2($users);
    break;
}



class Login
{
  public function Step1($message = false) {
    if (isset($_GET['requestURI']))
      $_SESSION['requestURI'] = $_GET['requestURI'];
    
    $tpl = new Template(DOCUMENT_ROOT . '_templates/login.tpl');
    
    if (isset($message) && $message)
      $tpl->set('message', $message);
    
    echo $tpl->fetch();
  }
  
  
  public function Step2($users) {
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
      Login::Step1('invalid-request');
      exit();
    }
    
    if (isset($users[$_POST['username']]) && $users[$_POST['username']] == $_POST['password']) {
      $_SESSION['LOGGEDIN'] = true;
      
      if (isset($_SESSION['requestURI']))
        header('Location: ' . $_SESSION['requestURI']);
      else
        header('Location: add-movie.php');
    }
    else
      Login::Step1('wrong-password');
  }
}


?>