<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '/../../libs/dbhandler.php';
$dbhandler = new DbHandler();
if (isset($_POST['needle'])) {
    $searchResults = $dbhandler->search($_POST['needle']);
    echo json_encode($searchResults, JSON_UNESCAPED_UNICODE);
}