<?php
require_once './../../../config.php';
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "SELECT * FROM cars";

    $statement = $conn->query($sql);
    $dbCars = $statement->fetchAll(PDO::FETCH_ASSOC);
    $carsToShow = [];
    foreach ($dbCars as $car) {
        $carsToShow[$car["group"]][] = $car["subgroup"];
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
    <link rel="stylesheet" href="./../../../libs/bootstrap4.1/css/bootstrap.min.css">
    <link href="./../../../libs/bootstrap-3.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="./../../../libs/bootstrap-5.0.2-dist/css/bootstrap-grid.min.css" rel="stylesheet"/>
    <link href="./addcar.css" rel="stylesheet">
    <title>kprice-add car</title>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-100">
                <a href="#" class="navbar-brand">kPrice-Admin</a>
                <span class="text-warning mr-2">hi kia/hossein</span>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainnav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse" id="mainnav">
                    <div class="navbar-nav">
                        <a href="./../../search/search.php" class="nav-item nav-link">search</a>
                        <a href="#" class="nav-itm nav-link" onclick="javascript:alert('لاگ سیستم هنوز درست نشده')">log-out</a>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col-12 px-3 pb-3 mt-0 mb-3 bg-light">
                <a href="./../admin/admin.php" class="btn btn-primary w-100">go to admin panel</a>
            </div>
        </div>
        <div class="row">
            <div class="col-12 px-4">
                <div class="row bg-dark py-2">
                    <div class="col-12 col-lg-4 py-1 px-4 d-flex justify-content-center align-items-center">
                        <input class="w-100 p-1" type="text" name="" id="groupInput" placeholder="group">
                    </div>
                    <div class="col-12 col-lg-4 py-1 px-4 d-flex justify-content-center align-items-center">
                        <input class="w-100 p-1" type="text" name="" id="subGroupInput" placeholder="sub group">
                    </div>
                    <div class="col-12 col-lg-4 py-1 px-4 d-flex justify-content-center align-items-center">
                        <div class="btn btn-primary w-100" id="addNew" tabindex="-1">add new group</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 my-1">
                <input type="text" class="w-100 form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="searchInput">
            </div>
        </div>
        <div class="row">
            <div class="col-12 my-1">
                <div id="mainListDiv" class="list-group list-group-root well">
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
                                <a href="<?= $root ?>pages/car/car.php?car=<?= $carName . '-' . $carType ?>" class="list-group-item"><?= $carType ?></a>
                            <?php
                            }
                            ?>
                        </div>
                    <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
    <script src="./../../../libs/jquery.js"></script>
    <script src="./../../../libs/bootstrap-3.3.5/dist/js/bootstrap.min.js"></script>
    <script>
        var searchAPI = "<?= $searchApi ?>";
        var root = "<?= $root ?>";
        var oldresults = $('#mainListDiv').html();
    </script>
    <script src="./addcar.js"></script>
</body>
</html>