<?php
/*
	Copyright original code 2003 by Brian Lozier
	http://www.massassi.com/php/articles/template_engines/
*/

class Template {
  var $vars; // Holds all the template variables

  /**
   * Constructor
   *
   * @param $file string the file name you want to load
   */
  function __construct($file = null) {
    $this->file = $file;
  }

  /**
   * Set a template variable.
   */
  function set($name, $value) {
    $this->vars[$name] = is_object($value) ? $value->fetch() : $value;
  }

  /**
   * Open, parse, and return the template file.
   *
   * @param $file string the template file name
   */
  function fetch($file = null) {
    if (!$file)
      $file = $this->file;

    if (!empty($this->vars))
      extract($this->vars);
    
    ob_start();
    include($file);
    $contents = ob_get_contents();
    ob_end_clean();
    return $contents;
  }
}
?>