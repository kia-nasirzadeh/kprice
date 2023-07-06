<?php
require __DIR__ . DIRECTORY_SEPARATOR . './../../../config.php';
require_once __DIR__ . './../../../libs/dbhandler.php';
$dbhandler = new DbHandler();
echo $dbhandler->addPics($_FILES, $picsPath, $_POST['name'], json_decode($_POST['delPics'], 1));