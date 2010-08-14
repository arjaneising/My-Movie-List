<?php

require_once('_includes/main.php');



if (!LOGGEDIN) {
  header('Location: login.php');
  exit();
}





switch (TASK) {
  case 'edit':
    EditMovie::Edit($_POST);
    break;
  
  case 'delete':
    EditMovie::Delete($_GET);
    break;
}




class EditMovie
{
  public function Edit($post) {
    if (isset($post['id']) && is_numeric($post['id']) && isset($post['rating']) && is_numeric($post['rating'])) {
      $db = new MDB();
      $result = $db->editMovie($post['id'], $post['rating']);
      
      if ($result)
        header('Location: ./?message=edit-success');
      else
        header('Location: ./?message=edit-error');
      exit();
    }
    else {
      header('Location: ./?message=request-error');
      exit();
    }
  }
  
  
  
  public function Delete($get) {
    if (isset($get['id']) && is_numeric($get['id'])) {
      $db = new MDB();
      $result = $db->deleteMovie($get['id']);
      
      if ($result)
        header('Location: ./?message=delete-success');
      else
        header('Location: ./?message=delete-error');
      exit();
    }
    else {
      header('Location: ./?message=request-error');
      exit();
    }
  }
}




?>