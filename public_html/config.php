<?php
if ($_SERVER['SERVER_NAME'] == 'park-wash.ir') {
    $servername = "localhost";
    $username = "umwganki_root";
    $password = "@!A1a9s1s9";
    $dbName = "umwganki_kprice";
    $picsPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/pics";
    $searchApi = "http://park-wash.ir/pages/search/processor.php";
} elseif ($_SERVER['SERVER_NAME'] == 'localhost') {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbName = "kprice";
    $picsPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/pics";
    $searchApi = "http://localhost/dashboard/kprice/public_html/pages/search/processor.php";
}