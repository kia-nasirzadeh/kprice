<?php
if ($_SERVER['SERVER_NAME'] == 'park-wash.ir') {
    echo 'in server';
    $servername = "localhost";
    $username = "umwganki_root";
    $password = "@!A1a9s1s9";
    $dbName = "umwganki_kprice";
} elseif ($_SERVER['SERVER_NAME'] == 'localhost') {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbName = "kprice";
}
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "SELECT * FROM cars";

    $statement = $conn->query($sql);
    $dbCars = $statement->fetchAll(PDO::FETCH_ASSOC);
    $carsToShow = [];
    foreach ($dbCars as $car) {
        $carsToShow[$car["group"]][] = $car["subgroup"];
        // if (!array_key_exists($car["group"], $carsToShow)) {
        // }
    }
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./../../libs/bootstrap-3.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="./../../libs/bootstrap-5.0.2-dist/css/bootstrap-grid.min.css" rel="stylesheet"/>
    <link href="./search.css" rel="stylesheet">
    <title>kprice-search</title>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 px-4 py-3 bg-info">
                <a href="./../admin/admin/admin.php" class="btn btn-primary w-100">go to admin panele</a>
            </div>
        </div>
        <div class="row">
            <div class="col m-2">
                <input id="searchInput" type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>
        </div>
        <div class="row">
            <div class="col m-2">
                    <div class="list-group list-group-root well">
                        <?php
                        foreach ($carsToShow as $carName => $carTypesArray) {
                        ?>
                            <a href="#<?= $carName ?>" class="list-group-item" data-toggle="collapse">
                                <i class="glyphicon glyphicon-chevron-right"></i><?= $carName ?>
                            </a>
                            <div class="list-group collapse" id="<?= $carName ?>">
                                <?php
                                foreach ($carTypesArray as $carType) {
                                ?>
                                    <a href="./../car/car.php?car=<?= $carName . '-' . $carType ?>" class="list-group-item"><?= $carType ?></a>
                                <?php
                                }
                                ?>
                            </div>
                        <?php
                        }
                        ?>
                        <!-- <a href="#item-2" class="list-group-item" data-toggle="collapse">
                            <i class="glyphicon glyphicon-chevron-right"></i>clk
                        </a>
                        <div class="list-group collapse" id="item-2">
                            <a href="#" class="list-group-item">c200-2008-2009</a>
                        </div> -->
                    </div>
            </div>
        </div>
    </div>
    <script src="./../../libs/jquery.js"></script>
    <script src="./../../libs/bootstrap-3.3.5/dist/js/bootstrap.min.js"></script>
    <script src="./search.js"></script>
</body>
</html>