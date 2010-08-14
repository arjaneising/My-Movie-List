<?php

require_once('_includes/main.php');



if (!LOGGEDIN) {
  header('Location: login.php');
  exit();
}



switch (STEP) {
  case 1:
  default:
    EditTitle::Step1();
    break;
  
  case 2:
    EditTitle::Step2();
    break;
  
  case 3:
    EditTitle::Step3();
}





class EditTitle
{
  /*
    Display the title ID field
  */
  function Step1() {
    $tpl = new Template(DOCUMENT_ROOT . '_templates/edit-titles.tpl');
    
    $tpl->set('id', isset($_GET['id']) ? $_GET['id'] : '');
    
    echo $tpl->fetch();
  }
  
  
  /*
    Calls database to edit titles
  */
  function Step2() {
    if (isset($_POST['movie-id']) && is_numeric($_POST['movie-id']) && isset($_POST['original-title']) && strlen($_POST['original-title']) > 1 && isset($_POST['english-title'])) {
      $db = new MDB();
      $success = $db->editTitles($_POST['movie-id'], $_POST['original-title'], $_POST['english-title']);
      
      if ($success)
        header('Location: ' . WEB_ROOT . '?message=edit-titles-success');
      else
        header('Location: ' . WEB_ROOT . '?message=edit-titles-error');
      exit();
    }
    else {
      header('Location: ' . WEB_ROOT . '?message=edit-titles-error');
      exit();
    }
  }
}



?>