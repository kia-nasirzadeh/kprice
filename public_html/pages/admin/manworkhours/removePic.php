<?php
require __DIR__ . DIRECTORY_SEPARATOR . './../../../config.php';
require_once __DIR__ . './../../../libs/dbhandler.php';
$picsToRemove = [];
foreach ($_FILES as $img) {
    // $targetFile = $targetDir . DIRECTORY_SEPARATOR . $name;
    // $tagetDir = $picsPath . DirectoryIterator;
    $picsToRemove[] = [$picsPath, basename($img['name']), $_POST['name']];
}
$dbhandler = new DbHandler();
echo $dbhandler->delPics($picsToRemove);