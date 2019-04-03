<?php
/**
 * this script acts as the controller for the email participant MyProjects 
 * interface 
 */
 
do {
  $app = $tmp1;
  $tmp1 = basename(getcwd());
  chdir('..');
} while(basename(getcwd()) != 'sierra');
require_once(getcwd() . '/lib/core/SRA_Controller.php');
SRA_Controller::init($app, TRUE);

// TODO

?>
