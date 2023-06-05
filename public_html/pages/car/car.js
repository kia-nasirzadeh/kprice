var stringifiedCar1 = JSON.stringify(car1);
var car = {
    car: {},
    carName: "",
    pics: [],
    explanation: "",
    kasebiItems: [],
    initCar (stringifiedCar) {
        this.car = JSON.parse(stringifiedCar);
        this.carName = this.car.carName;
        this.pics = this.car.pics;
        this.explanation = this.car.explanation;
        this.kasebiItems = this.car.kasebiItems;
        this.table.columns = this.car.table.columns;
        this.table.deletedCols = this.car.table.deletedCols;
        this.table.rows = this.car.table.rows;
        return true;
    },
    initPage () {
        this.initCar(stringifiedCar1);
        // car name part:
        $("#carName").html(this.carName);
        // pics part:
        $("#imgs").html("");
        this.pics.forEach((pic, index) => {
            let activeForFirstPic = '';
            if (index == 0) activeForFirstPic = 'active';
            $("#imgs").append(`
                <div data-index="${index}" class="carousel-item ${activeForFirstPic}">
                    <img class="d-block w-100" src="${pic}" alt="Second slide" data-fileOrPath="${pic}">
                </div>
            `);
        });
        // explanation part:
        $('#explanation').html(this.explanation);
        // kasebItems Part:
        var kesebItemsSpansCount = $("#kasebiItemsContainer").find("span").length;
        $("#kasebiItemsContainer").find("span").each((i, span) => {
            if (i != kesebItemsSpansCount - 1 && i != 0) {
                span.remove();
            }
        })
        this.kasebiItems.forEach((ki, index) => {
            $("#kasebiItems").after(`
                <span class="bg-primary d-inline-block w-75 p-2 mb-3 rounded" style="font-weight: 500;font-size: 0.75rem;">
                    ${ki}
                </span>
            `)
        });
        $("#kasebiItemsContainer").find(".btn-danger").click(function () {
            let explanationSpan = $(this).prev();
            let deleteBtn = $(this);
            let indexToDelete = $(this).attr("data-index");
            explanationSpan.remove();
            deleteBtn.remove();
            car.removeKasebItem(indexToDelete);
            car.reIndexKasebItems();
        });
        $("#addKasebItem").click(function () {
            let newKasebItemExplanation = $("#newKasebItemtextarea").val();
            let today = new Date().toLocaleDateString('fa-IR');
            let fullExplanation = newKasebItemExplanation + "(" + today + ")";
            $("#kasebiItems").after(`
                <span class="bg-primary d-inline-block w-75 p-2 mb-3 rounded" style="font-weight: 500;font-size: 0.75rem;">
                    ${fullExplanation}
                </span>
                <span data-index="${car.kasebiItems.length}" class="btn-danger d-inline-block p-2 mb-3 rounded" style="font-weight: 500;font-size: 0.75rem; border: 1px solid #999;cursor: pointer;">
                    حذف
                </span>
            `)
            car.addKasebItem(fullExplanation);
            $($("#kasebiItemsContainer").find(".btn-danger")[0]).click(function () {
                let explanationSpan = $(this).prev();
                let deleteBtn = $(this);
                let indexToDelete = $(this).attr("data-index");
                explanationSpan.remove();
                deleteBtn.remove();
                car.removeKasebItem(indexToDelete);
                car.reIndexKasebItems();
            });
            $("#newKasebItemtextarea").val("");
        });
        // table part:
        function drawTable () {
            $("#table").html("");
            $("#table").append(`
                <thead>
                    <tr id="table-head" class="bg-warning text-dark">
                    </tr>
                </thead>
            `);
            var presentCols = car.table.getPresentCols();
            presentCols.forEach(col => {
                $("#table-head").append(`
                    <th>${col}</th>
                `);
            })
            $("#table").append(`
                <tbody id="table-body">
                </tbody>
            `);
            var rowColor = "black";
            car.table.rows.forEach((row, index) => {
                var tds = ``;
                presentCols.forEach(presentCol => {
                    tds += "<td>" + row[presentCol] + "</td>";
                })
                if (rowColor == "black") {
                    $("#table-body").append(`
                        <tr data-rowindex="${index}" style="background-color: black;">
                            ${tds}
                        </tr>
                    `);
                    rowColor = "info";
                } else {
                    $("#table-body").append(`
                        <tr data-rowindex="${index}" class="bg bg-info">
                            ${tds}
                        </tr>
                    `);
                    rowColor = "black";
                }
            });
        }
        drawTable();
        assignListeners();
    },
    addPic (imgFile) {
        if (!this.pics.includes(imgFile)) {
            this.pics.push(imgFile);
            return true;
        }
        else return false;
    },
    removePic (indexToDelete) {
        if (car.pics.length - 1 < indexToDelete) return false;
        else {
            this.pics.splice(indexToDelete, 1);
            return true;
        }
    },
    reIndexPics () {
        $("#imgs > div").each((i, el) => {
            $(el).attr("data-index", i);    
        });
    },
    addExplanation (txt) {
        if (this.explanation != txt) {
            this.explanation = txt;
            return true;
        }
        else return false;
    },
    addKasebItem (ItemExplanation) {
        var txt = ItemExplanation;
        this.kasebiItems.push(txt);
        return true;
    },
    removeKasebItem (index) {
        if (index < this.kasebiItems.length) {
            this.kasebiItems.splice(index, 1);
            return true;
        }
        else return false;
    },
    reIndexKasebItems () {
        let allDangerBtns = $("#kasebiItemsContainer").find(".btn-danger");
        allDangerBtns.each((index, dangerBtn) => {
            $(dangerBtn).attr("data-index", allDangerBtns.length - 1 - index);
        })
    },
    table: {
        columns: [],
        deletedCols: [],
        rows: [],
        getPresentCols () {
            var presentCols = JSON.parse(JSON.stringify(this.columns));
            for (deletedCol of this.deletedCols) {
                presentCols.splice(presentCols.indexOf(deletedCol), 1);
            }
            return presentCols;
        },
        addRow (row) {
            // var cols = this.getPresentCols();
            // var row = {};
            // for (column of cols) {
            //     row[column] = prompt(column);
            // }
            // just test
            this.rows.push(row);
            return true;
        },
        removeRow (index) {
            this.rows.splice(index, 1);
        },
        editRow (index) {
            let row = car.table.rows[index];
            for (col in row) {
                if (car.table.getPresentCols().includes(col)) {
                    row[col] = prompt(col + " : " + row[col]);
                } else {
                    row[col] = "-";
                }
            }
            this.rows.splice(index, 1);
            this.rows.splice(index, 0, row);
            return true;
        }
    }
};
var commonFuncs = {
    numberToText (number) {
        return number.toLocaleString('en-US');
    }
}