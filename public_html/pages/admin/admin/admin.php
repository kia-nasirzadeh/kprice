<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>kprice-admin</title>
        <link rel="stylesheet" href="./../../../libs/bootstrap4.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="./admin.css">
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
                <div class="col-6 col-md-4 col-lg-3 p-1">
                    <a href="./../addcar/addcar.php" class="border w-100 text-center rounded px-1 py-3 btn btn-primary" id="add-car">
                        add new car
                    </a>
                </div>
                <div class="col-6 col-md-4 col-lg-3 p-1">
                    <button href="./../../search/search.php" class="border w-100 text-center rounded px-1 py-3 btn btn-primary" id="add-car" disabled>
                        manipulate a car
                    </button>
                </div>
                <div class="col-6 col-md-4 col-lg-3 p-1">
                    <button class="border w-100 text-center rounded px-1 py-3 btn btn-primary" id="changePass" disabled>
                        change password
                    </button>
                </div>
            </div>
            <div class="row d-none justify-content-center bg-warning" id="passChangerContainer">
                <div class="col-9 p-1">
                    <div style="display: flex; flex-direction: column;">
                        <span>old password:</span>
                        <input type="text" id="oldpass">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <span>new password:</span>
                        <input type="text" id="newpass">
                    </div>
                    <div class="btn btn-primary mt-1 w-100">change pass</div>
                </div>
            </div>
        </div>
        <script src="./../../../libs/jquery.js"></script>
        <script src="./../../../libs/bootstrap4.1/js/bootstrap.min.js"></script>
        <script src="./admin.js"></script>
    </body>
</html>