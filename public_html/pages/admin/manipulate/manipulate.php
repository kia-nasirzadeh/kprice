<?php
require_once './../../../config.php';
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbName;charset=utf8mb4;", $username, $password);
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
$table = $content->table;
$columns = $table->columns;
$pics = $content->pics;
$explanation = $content->explanation;
$kasebItems = $content->kasebiItems;
$deletedCols = $table->deletedCols;
$rows = $table->rows;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="./../../../libs/jquery.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./../../../libs/summernote/summernote-bs4.min.css">
    <script src="./../../../libs/summernote/summernote-bs4.min.js"></script>
    <link href="./../../../libs/bootstrap4.1/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="./manipulate.css" rel="stylesheet"/>
    <script src="./../../../libs/summernote/summernote.js"></script>
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
                    <a class="nav-item nav-link" href="./../../search/search.php">search</a>
                    <a class="nav-item nav-link" href="<?php echo $root . "pages/car/car.php?car=" . $fullName ?>">go to this car</a>
                  </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <h2 id="carName" class="w-100 bg-dark text-center text-info p-2">car name</h2>
        </div>
        <div class="row d-flex justify-content-center">
            <div id="imgs" class="row w-100 px-5 py-2" style="justify-content: space-around;">
    
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div id="addNewPhoto" class="btn btn-primary mb-2">add new photo</div>
            <input type="file" id="imgupload" style="display:none"/>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-12 mb-2">
                <div id="summernote"></div>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-12 p-0">
                <p id="kasebiItemsContainer" class="text-white text-right bg-dark" style="border: 1px solid #999; border-radius: 5px; padding: 10px;">
                    <span id="kasebiItems" class="bg-dark text-light d-inline-block w-100 p-2 mb-3 rounded" style="font-weight: bold;">
                        موارد خرید کاسبی
                    </span>

                    <span id="addKasebItem" class="btn btn-primary d-inline-block w-100 p-2 mb-3 rounded" style="font-weight: bold;">
                        اضافه کردن مورد
                    </span>
                    <textarea id="newKasebItemtextarea" class="w-100 text-right p-1"></textarea>
                </p>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-12 mb-2 p-0">
                <div class="text-white text-right bg-dark" style="border: 1px solid #999; border-radius: 5px; padding: 10px;">
                    <span class="bg-dark text-light d-inline-block w-100 p-2 mb-3 rounded" style="font-weight: bold;">
                        جدول موارد بازدید شده
                    </span>
                    <span tabindex="-1" id="addRow" class="btn-sm btn-primary ">اضافه کردن سطر</span>
                    <span id="moverow" class="btn-sm btn-secondary" style="cursor: pointer">جابجایی سطر ها</span>
                    <span id="highlight" class="btn-sm btn-secondary" style="cursor: pointer">مقایسه سطر ها</span>
                </div>
                <div class="p-2 bg-dark text-white">
                    <table id="table" class="table table-bordered table-responsive">

                    </table>
                </div>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-12 px-3">
                <div id="saveBtn" class="w-100 btn btn-primary mb-3">save</div> 
                <!-- lets check pics of car object
                upload pics
                update whole record -->
            </div>
        </div>
    </div>
    <div id="addRowContainer" class="d-none container rounded" style="margin:auto;left: 0;right: 0;top:0;bottom: 0; position: absolute; width: 100%; height: 90%;top: 0;left: 0; background-color: rgba(0, 0, 0, 0.641);">
        <div class="row">
            <div class="p-2 col-12 d-flex justify-content-center" style="flex-direction: column;align-items: center;">
                <input placeholder="car name" type="text" class="my-1 p-1" style="width: 90%;">
                <input placeholder="car name" type="text" class="my-1 p-1" style="width: 90%;">
                <input placeholder="car name" type="text" class="my-1 p-1" style="width: 90%;">
                <input placeholder="car name" type="text" class="my-1 p-1" style="width: 90%;">
                <div class="my-1 p-1 btn btn-primary" style="width: 90%;">add</div>
            </div>
        </div>
    </div>
    <div id="editRowsContainer" class="d-none container rounded" style="margin:auto;left: 0;right: 0;top:0;bottom: 0; position: absolute; width: 100%; height: 90%;top: 0;left: 0; background-color: rgba(0, 0, 0, 0.641);">
        <div class="row">
            <div class="p-2 col-12 d-flex justify-content-center" style="flex-direction: column;align-items: center;">
                <div class="p-1" style="width: 95%;">
                    <div class="my-1 p-1 rounded d-inline-block bg-dark text-white" style="width: 75%;">car name</div>
                    <div class="my-1 p-1 btn btn-danger d-inline-block" style="width: 20%;">delete</div>
                </div>
                <div class="p-1" style="width: 95%;">
                    <div class="my-1 p-1 rounded d-inline-block bg-dark text-white" style="width: 75%;">car name</div>
                    <div class="my-1 p-1 btn btn-danger d-inline-block" style="width: 20%;">delete</div>
                </div>
            </div>
            <div class="p-2 col-12 d-flex justify-content-center" style="flex-direction: column;align-items: center;">
                <div class="my-1 p-1" style="width: 95%;">
                    <input type="text" class="my-1 p-1 rounded d-inline-block" style="width: 75%;"/>
                    <div class="my-1 p-1 btn btn-primary d-inline-block" style="width: 20%;">add</div>
                </div>
            </div>
        </div>
    </div>
    <div id="editSingleRowContainer" class="d-none container rounded" style="margin:auto;left: 0;right: 0;top:0;bottom: 0; position: absolute; width: 100%; height: 90%;top: 0;left: 0; background-color: rgba(0, 0, 0, 0.641);">
        <div class="row">
            <div class="p-2 col-12 d-flex justify-content-center" style="flex-direction: column;align-items: center;">
                <div class="my-1 p-1" style="width: 95%;">
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <input type="text" class="w-100 my-1 p-1 rounded d-inline-block"/>
                    <div class="btn btn-primary my-2 w-100">savexxx</div>
                </div>
            </div>
        </div>
    </div>
    <script src="./../../../libs/bootstrap4.1/js/bootstrap.min.js"></script>
    <?php


    $picsArray = "[";
    if ($pics != "" && $pics != []) {
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
        let kasebItemsArrayToGoInCar1 = `<?= $kasebItemsArray ?>`;
        kasebItemsArrayToGoInCar1 = kasebItemsArrayToGoInCar1.replace(/\s+/g, '');
        
        var car1 = {
            carName: "<?= $fullName ?>",
            pics: <?= $picsArray ?>,
            explanation: `<?= $explanation ?>`,
            kasebiItems: JSON.parse(kasebItemsArrayToGoInCar1),
            table: {
                columns: <?= $columnsArray ?>,
                deletedCols: <?= $deletedColsArray ?>,
                rows: <?= $rowsArray ?>
            }
        };
        var root = "<?= $root ?>"
    </script>
    <script src="./manipulate.js"></script>
    <script>
        car.initPage();
        car.group = "<?= $group ?>";
        car.subgroup = "<?= $subgroup ?>";
        let update = new Update(car);
        // $('#saveBtn')[0].click();
        document.addEventListener('DOMContentLoaded', function() {
            let explanationInPlace = $("#summernote").summernote('code')
            var selectText = document.getElementsByClassName("note-editable");
            var range = document.createRange();
            range.selectNode(selectText[0]);
            window.getSelection().addRange(range);
            if (explanationInPlace == '<div style="text-align: right;"><br></div>') { //it's empty and ready to rtl it
                // let rtlButton = $('.note-btn-group.btn-group.note-insert').find(".fa.fa-paragraph").parent().get(0);
                // $(".note-editable.card-block").click();

                // console.log(rtlButton);;
                // rtlButton.click();
            }
        }, false);
    </script>
</body>
</html>