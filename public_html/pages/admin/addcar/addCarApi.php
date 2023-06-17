<?php
if (!isset($_POST['group']) || !isset($_POST['sub'])) die();
require __DIR__ . DIRECTORY_SEPARATOR . './../../../config.php';
require_once __DIR__ . './../../../libs/dbhandler.php';



$dbhandler = new DbHandler();
$result = $dbhandler->addRecord($_POST['group'], $_POST['sub'], '{"carName":"","pics":[],"explanation":"","kasebiItems":"","table":{"columns":["$"],"deletedCols":[],"rows":[{"$":"test"}]}}');
$manipulateCarHref = $root . "pages/admin/manipulate/manipulate.php?car=" . $_POST['group'] . '-' . $_POST['sub'];
if ($result) echo json_encode(['ok' => true, 'urlToGo' => $manipulateCarHref]);
else echo json_encode(['ok' => false]);