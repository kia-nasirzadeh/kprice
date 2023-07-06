<?php
require __DIR__ . DIRECTORY_SEPARATOR . './../../../config.php';
require_once __DIR__ . './../../../libs/dbhandler.php';
$dbhandler = new DbHandler();
echo $dbhandler->updateRecord('fullname', $_POST['fullname'], $_POST['group'], $_POST['subgroup'], $_POST['content']);