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
                    <th>${col}<br><span class="sortCol btn-sm btn-danger w-50 text-center my-1">⬇️</span><span class="sortColDesc btn-sm btn-danger w-50 text-center my-1">⬆️</span></th>
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
        function assignListeners () {
            $(".sortCol").off().on("click", function () {
                let containerTh = $(this).parents("th")[0];
                let col = $(containerTh).text();
                col = col.slice(0, col.length - 4);
                sortCol(col);
            });
            $(".sortColDesc").off().on("click", function () {
                let containerTh = $(this).parents("th")[0];
                let col = $(containerTh).text();
                col = col.slice(0, col.length - 4);
                sortColDesc(col);
            });
            function sortCol (col) {
                car.table.rows = car.table.rows.sort((a,b) => {
                    if (a[col] > b[col]) return 1
                    else return -1;
                });
                drawTable();
                assignListeners();
            }
            function sortColDesc (col) {
                car.table.rows = car.table.rows.sort((a,b) => {
                    if (a[col] > b[col]) return -1
                    else return 1;
                });
                drawTable();
                assignListeners();
            }
            $('#highlight').click(function () {
                $(this).removeClass('btn-secondary');
                $(this).addClass('btn-warning');
                $('#moverow').removeClass('btn-warning');
                $('#moverow').addClass('btn-secondary');
                window.trTmp1 = undefined;
                window.trTmp2 = undefined;
                $("#table-body > tr").off("click");
                window.rowsfunc = 'highlight';
                assignHighlight();
            });
            $('#moverow').click(function () {
                $(this).removeClass('btn-secondary');
                $(this).addClass('btn-warning');
                $('#highlight').removeClass('btn-warning');
                $('#highlight').addClass('btn-secondary');
                window.trTmp1 = undefined;
                window.trTmp2 = undefined;
                $("#table-body > tr").off("click");
                window.rowsfunc = 'moverow';
                assignSwapFunctionToTable();
            });
            function assignHighlight () {
                if (window.rowsfunc != 'highlight') return;
                $("#table-body > tr").click(function (ev) {
                    let thisTr = this;
                    if (window.trTmp1 == undefined) {
                        window.trTmp1 = thisTr;
                    } else {
                        window.trTmp2 = thisTr;
                        highlight(trTmp1, trTmp2, 'table-head');
                        window.trTmp1 = undefined;
                        window.trTmp2 = undefined;
                    }
                })
                function highlight (trTmp1, trTmp2, tableHeadTrId) {
                    let newTableInner = "";
                    $(`#${tableHeadTrId}`).children().each((i, td) => {
                        if ($(`#${tableHeadTrId}`).children().length - 1 == i) return;
                        let headTdText = $(td).text().replace('🗑️', '');
                        let td1 = $(trTmp1).children().get(i).outerHTML;
                        let td2 = $(trTmp2).children().get(i).outerHTML;
                        let equal = false;
                        if (td1 == td2) equal = true;
                        if (!equal) {
                            td1 = td1.replace('<td>', '<td style="text-align:right">');
                            td2 = td2.replace('<td>', '<td style="font-weight: bold">');
                            newTableInner += `<tr><td style="background-color: #ffc107;color:black;text-align:right">${headTdText}</td>${td1}${td2}</tr>`;
                        } else {
                            td1 = td1.replace('<td>', '<td style="background-color: #FFFFFF99">');
                            td2 = td2.replace('<td>', '<td style="background-color: #FFFFFF99">');
                            newTableInner += `<tr><td style="background-color: #ffc107;color:black;text-align:right">${headTdText}</td>${td1}${td2}</tr>`;
                        }
                    });
                    let highlightTable = 
                    `
                    <style>
                    .highlightTable {
                        border-collapse: collapse;
                    }
                    .highlightTable td {
                        border: 1px solid white;
                        padding: 3px;
                    }
                    </style>
                    <div id="highlightC" style="width: 90vw;height:90vh;background-color:#000000dd;position:absolute !important;margin:auto;left:0;right:0;top:0;bottom:0;border-radius: 5px;box-shadow: 0px 0px 5px black;display:flex;justify-content:center;align-items:center">
                    <table class="highlightTable" style="color: white;border:1px solid #FFFFFF99;border-radius:5px">
                    ${newTableInner}
                    </table>
                    </div>
                    `
                    $('body').append(highlightTable);
                    window.scrollTo(0, 0);
                    $('#highlightC').click(function () {
                        $(this).empty();
                        $(this).remove();
                    })
                }
            }
            
            function assignSwapFunctionToTable () {
                if (window.rowsfunc != 'moverow') return;
                $("#table-body > tr").click(function (ev) {
                    let thisTr = this;
                    if (window.trTmp1 == undefined) {
                        window.trTmp1 = thisTr;
                    } else {
                        window.trTmp2 = thisTr;
                        swapTr(trTmp1, trTmp2, 'table-body');
                        window.trTmp1 = undefined;
                        window.trTmp2 = undefined;
                        assignSwapFunctionToTable();
                    }
                })
                function swapTr (tr1, tr2, tableBodyId) {
                    let allTrs = $(`#${tableBodyId}`).children('tr');
                    $(`#${tableBodyId}`).html("");
                    allTrs.each((i, tr) => {
                        if (tr != tr1 && tr != tr2) $(`#${tableBodyId}`).append(tr);
                        else if (tr == tr1 && tr != tr2) $(`#${tableBodyId}`).append(tr2);
                        else if (tr != tr1 && tr == tr2) $(`#${tableBodyId}`).append(tr1);
                    })
                }
            }
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