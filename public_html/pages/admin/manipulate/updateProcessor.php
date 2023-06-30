<?php
require __DIR__ . DIRECTORY_SEPARATOR . './../../../config.php';
require_once __DIR__ . './../../../libs/dbhandler.php';
$dbhandler = new DbHandler();
$fullname = htmlspecialchars($_POST['fullname']);
$group = htmlspecialchars($_POST['group']);
$subgroup = htmlspecialchars($_POST['subgroup']);
$content = htmlspecialchars($_POST['content']);
echo $dbhandler->updateRecord('fullname', $_POST['fullname'], $_POST['group'], $_POST['subgroup'], $_POST['content']);


