<?php
$errcode = "";
if (!isset($_GET['errcode'])) {
    $errcode = 'notSpecified';
} else {
    $errcode = $_GET['errcode'];
}
echo $errcode;