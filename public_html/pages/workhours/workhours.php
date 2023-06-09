<?php
require_once './../../config.php';
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbName;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if (isset($_GET["car"])) {
      $car = $_GET["car"];
      $sql = "SELECT * FROM cars WHERE FullName='$car'";
      $statement = $conn->query($sql);
      $dbCars = $statement->fetchAll(PDO::FETCH_ASSOC);
      $car = $dbCars[0];
    }
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

$group = $car["group"];
$subgroup = $car["subgroup"];
$fullName = $car["FullName"];
$content = $car["content"];
$content = json_decode($content);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <link href="./../../libs/bootstrap4.1/css/bootstrap.min.css" rel="stylesheet"/>
    <title><?= $fullName ?></title>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <nav class="w-100 navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Afraz Inc.</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-item nav-link ml-1 mb-1 p-1" style="border: 1px solid #999;border-radius:3px" href="./../admin/manworkhours/manworkhours.php?car=<?= $fullName ?>">add work hours</a>
                    <a class="nav-item nav-link ml-1 mb-1 p-1" style="border: 1px solid #999;border-radius:3px" href="./../admin/admin/admin.php">admin panel</a>
                </div>
                </div>
            </nav>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-12 mb-2">
                <div class="text-white text-right bg-dark" style="border: 1px solid #999; border-radius: 5px; padding: 10px;">
                    <span class="bg-dark text-light d-inline-block w-100 p-2 mb-3 rounded" style="font-weight: bold;">
                        جدول ساعات کاری
                    </span>
                </div>
                <div class="p-2 bg-dark text-white">
                    <table id="table" class="table table-bordered table-responsive">

                    </table>
                </div>
            </div>
        </div>
    </div>
    <script src="./../../libs/jquery.js"></script>
    <script src="./../../libs/bootstrap4.1/js/bootstrap.min.js"></script>
    <?php
    $table = $content->table;
    $columns = $table->columns;
    $pics = $content->pics;
    $explanation = $content->explanation;
    $kasebItems = $content->kasebiItems;
    $deletedCols = $table->deletedCols;
    $rows = $table->rows;

    if ($pics != "" && $pics != []) {
        $picsArray = "[";
        foreach ($pics as $key => $pic) {
            if ($key === array_key_last($pics)) {
                $picsArray .= '"' . $pic . '"]';
            } else {
                $picsArray .= '"' . $pic . '",';
            }
        }
    } else {
        $picsArray = "[]";
    }

    $kasebItemsArray;
    if ($kasebItems != "" && $kasebItems != []) {
        $kasebItemsArray = '[';
        foreach ($kasebItems as $key => $kasebItem) {
            if ($key === array_key_last($kasebItems)) {
                $kasebItemsArray .= '"' . $kasebItem . '"]';
            } else {
                $kasebItemsArray .= '"' . $kasebItem . '",';
            }
        }
    } else {
        $kasebItemsArray = "[]";
    }

    $columnsArray;
    if ($columns != "") {
        $columnsArray = '[';
        foreach ($columns as $key => $col) {
            if ($key === array_key_last($columns)) {
                $columnsArray .= '"' . $col . '"]';
            } else {
                $columnsArray .= '"' . $col . '",';
            }
        }
    } else {
        $columnsArray = "[]";
    }

    $deletedColsArray;
    if (count($deletedCols) != 0) {
        $deletedColsArray = '[';
        foreach ($deletedCols as $key => $deletedCol) {
            if ($key === array_key_last($deletedCols)) {
                $deletedColsArray .= '"' . $deletedCol . '"]';
            } else {
                $deletedColsArray .= '"' . $deletedCol . '",';
            }
        }
    } else {
        $deletedColsArray = "[]";
    }

    $rowsArray;
    if ($rows != "") {
        $rowsArray = '[';
        foreach ($rows as $key => $row) {
            $stringifiedRow = json_encode($row);
            if ($key === array_key_last($rows)) {
                $rowsArray .= '' . $stringifiedRow . ']';
            } else {
                $rowsArray .= '' . $stringifiedRow . ',';
            }
        }
    } else {
        $rowsArray = "[]";
    }
    ?>
    <script>
        var car1 = {
            carName: "<?= $fullName ?>",
            pics: <?= $picsArray ?>,
            explanation: `<?= $explanation ?>`,
            kasebiItems: <?= $kasebItemsArray ?>,
            table: {
                columns: <?= $columnsArray ?>,
                deletedCols: <?= $deletedColsArray ?>,
                rows: <?= $rowsArray ?>
            }
        };
    </script>
    <script src="./workhours.js"></script>
    <script>
      car.initPage();
    </script>
</body>
</html>