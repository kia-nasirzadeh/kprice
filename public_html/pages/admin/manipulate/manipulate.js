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
            $("#imgs").append(`
                <div data-index="${index}" class="col-4 p-1 imgContainer" style="">
                    <div class="btn btn-danger m-1">delete</div>
                    <img class="w-100" src="${pic}" data-fileOrPath="${pic}">
                </div>
            `);
        })
        $("#addNewPhoto").on("click", function () {
            $('#imgupload').trigger('click');
        })
        $("#imgupload").on("change", function (e) {
            var file = e.target.files[0];
            var imageSrc = URL.createObjectURL(file);
            $("#imgs").append(`
                <div data-index="${car.pics.length}" class="col-4 p-1 imgContainer" style="">
                    <div class="text text-danger text-center border rounded m-1 p-1">not uploaded</div>
                    <div class="btn btn-danger m-1 p-1">delete</div>
                    <img src="${imageSrc}" class="w-100" data-fileOrPath="${file}">
                </div>
            `);
            car.addPic(file);
            $("#imgs > div:last-child > div.btn-danger").click(function (ev) {
                let indexToDelete = $(ev.target).closest(".imgContainer").attr("data-index");
                if (car.removePic(indexToDelete))
                    $(ev.target).closest(".imgContainer").remove();
                else alert("error in deleting image-1");
                car.reIndexPics();
            });
        });
        $("#imgs > div > div.btn-danger").click(function (ev) {
            let indexToDelete = $(ev.target).closest(".imgContainer").attr("data-index");
            if (car.removePic(indexToDelete))
                $(ev.target).closest(".imgContainer").remove();
            else alert("error in deleting image-1");
            car.reIndexPics();
        });
        // explanation part:
        $('#summernote').summernote({
            placeholder: 'Hello Bootstrap 4',
            height: 200,
            lang: 'fa-IR',
            toolbar: [
                // [groupName, [list of button]]
                ['para', ['ul', 'ol', 'paragraph']],
                ['color', ['color']],
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
            ]
        });
        $('#summernote').summernote('code', this.explanation)
        $('#summernote').summernote('justifyRight');
        $('#summernote').summernote('outdent');
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
                <span data-index="${index}" class="btn-danger d-inline-block p-2 mb-3 rounded" style="font-weight: 500;font-size: 0.75rem; border: 1px solid #999;cursor: pointer;">
                    حذف
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
                    <th>${col}<span class="delCol btn-sm btn-danger">🗑️</span></th>
                `);
            })
            $("#table-head").append(`
                <th><span id="addCol" class="btn-sm btn-primary">add column + </span></th>
            `);
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
                tds += `<td><span class="delRow btn-sm btn-danger">🗑️</span> <span class="editRow btn-sm btn-primary">✏️</span></td>`;
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
        function assignListeners () {
            $("#addRow").on("keydown", function (ev) {
                if (ev.keyCode == 13) {
                    $(this).trigger("click");
                }
            })
            $("#addRow").click(function () {
                if ($(".addRow").length >= 1) {
                    alert("you should add one row first");
                    return;
                }
                let newRow = ``;
                var presentCols = car.table.getPresentCols();
                presentCols.forEach(col => {
                    newRow += `<td><input data-colName="${col}" type="text"/></td>`;
                });
                newRow += `<td><span tabindex="-1" class="addRow btn-sm btn-success">➕</span></td>`;
                $("#table-body").append(`
                    <tr data-rowindex="${car.table.rows.length}" class="newRowClass bg bg-secondary">
                        ${newRow}     
                    </tr>
                `);
                $("#table-body > tr:last-child > td:first-child input").focus();
                let tdsInARow =  $("#table-body > tr:last-child > td");
                $($(tdsInARow)[tdsInARow.length - 2]).find("input").on("keydown", function (ev) {
                    if (ev.keyCode == 9) {
                        ev.preventDefault();
                        let addRowBtn = $($(tdsInARow)[tdsInARow.length - 1]).find(".btn-sm");
                        $(addRowBtn)[0].focus();
                    }
                });
                $(".addRow").off().click(function () {
                    let thisRowTds = $(this).parents("tr").find("td");
                    let newRowDetails = "";
                    for (let i = 0; i < thisRowTds.length; i++) {
                        if (i != thisRowTds.length - 1) {
                            let td_colName = $(thisRowTds[i]).find("input").attr("data-colname");
                            let td_val = $(thisRowTds[i]).find("input").val();
                            if (i == thisRowTds.length - 2) {
                                newRowDetails += `"${td_colName}":"${td_val}"`;
                            } else {
                                newRowDetails += `"${td_colName}":"${td_val}",`;
                            }
                            $(thisRowTds[i]).html(td_val);
                        } else {
                            $(thisRowTds[i]).html(`<span class="delRow btn-sm btn-danger">🗑️</span>`);
                        }
                    }
                    let newRow = `{${newRowDetails}}`;
                    newRow = JSON.parse(newRow);
                    car.table.addRow(newRow);
                });
                $(".addRow").on("keydown", function (ev) {
                    if (ev.keyCode == 13) {
                        $(this).trigger("click");
                        $("#addRow").focus();
                    }
                });
            });
            $(".delRow").off().click(function () {
                let thisRow = $(this).parents("tr");
                let thisRowIndex = $(thisRow).attr("data-rowindex");
                car.table.removeRow(thisRowIndex);
                thisRow.remove();
                $("#table-body").find("tr").each((index, tr) => {
                    $(tr).attr("data-rowindex", index);
                });
            });
            $("#addCol").click(function () {
                let newColName = prompt("اسم ستون جدید:");
                newColName = newColName.trim();
                if (car.table.columns.includes(newColName) && car.table.deletedCols.includes(newColName)) {
                    car.table.deletedCols.splice(car.table.deletedCols.indexOf(newColName), 1);
                    drawTable();
                    assignListeners();
                } else {
                    car.table.columns.push(newColName);
                    drawTable();
                    assignListeners();
                }
            });
            $(".delCol").off().on("click", function () {
                let containerTh = $(this).parents("th")[0];
                let col = $(containerTh).text();
                col = col.slice(0, col.length - 3);
                car.table.deletedCols.push(col);
                drawTable();
                assignListeners();
            });
            $(".editRow").off().click(function () {
                let thisRow = $(this).parents("tr");
                let thisRowIndex = $(thisRow).attr("data-rowindex");
                car.table.editRow(thisRowIndex);
                drawTable();
                assignListeners();
            })
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