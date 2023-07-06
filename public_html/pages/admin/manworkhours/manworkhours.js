var stringifiedCar1 = JSON.stringify(car1);
// edit row => 175 => temperary 201
// del row => 180
// del col => 152
// sort col => 152
// add col => 156
var car = {
    car: {},
    carName: "",
    pics: [],
    picsToDel: [],
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
        if (!this.table.columns.includes('date') && !this.table.deletedCols.includes('date')) {
            this.table.columns.push('date');
        }
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
                ['insert',['ltr','rtl']],
                ['view', ['fullscreen', 'codeview']]
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
            today = commonFuncs.textNumToEng(today);
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
                // $("#table-head").append(`
                //     <th>${col}<span class="delCol btn-sm btn-danger d-block text-center my-1">🗑️</span><span class="sortCol btn-sm btn-danger w-50 text-center my-1">⬇️</span><span class="sortColDesc btn-sm btn-danger w-50 text-center my-1">⬆️</span></th>
                // `); // add column
                $("#table-head").append(`
                    <th>${col}</th>
                `);
            })
            // $("#table-head").append(`
            //     <th><span id="addCol" class="d-block btn-sm btn-primary">add column + </span></th>
            // `);
            $("#table-head").append(`
                <th></th>
            `);
            $("#table").append(`
                <tbody id="table-body">
                </tbody>
            `);
            var rowColor = "black";
            var headPartToRepeat = `<tr class="hinttr bg-warning text-dark">`;
            presentCols.forEach(col => {
                headPartToRepeat += `<th>${col}</th>`;
            })
            headPartToRepeat += `<th></th></tr>`;

            car.table.rows.forEach((row, index) => {
                if (index != 0 && index % 4 == 0) $("#table-body").append(headPartToRepeat);
                var tds = ``;
                presentCols.forEach(presentCol => {
                    tds += "<td>" + row[presentCol] + "</td>";
                })
                // tds += `<td><span class="delRow btn-sm btn-danger">🗑️</span> <span class="editRow btn-sm btn-primary">✏️</span></td>`; // del,edit row
                tds += `<td></td>`;
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
            });
            $("#addRow").off("click").on("click", function () {
                if ($(".addRow").length >= 1) {
                    alert("you should add one row firstdd");
                    return;
                }
                let newRow = ``;
                var presentCols = car.table.getPresentCols();
                presentCols.forEach(col => {
                    if (col == 'date') {
                        let today = new Date().toLocaleDateString('fa-IR');
                        today = commonFuncs.textNumToEng(today);
                        today = today.replaceAll('/', '-');
                        newRow += `<td><input data-colName="${col}" value="${today}" type="text" disabled/></td>`;
                    } else if (col == 'hours') {
                        let hours = 0;
                        newRow += `<td><input data-colName="${col}" value="${hours}" type="text" disabled/></td>`;
                    } else if (col == 'money') {
                        let money = '0';
                        newRow += `<td><input data-colName="${col}" value="${money}" type="text" disabled/></td>`;
                    } else {
                        newRow += `<td><input data-colName="${col}" type="text"/></td>`;
                    }
                });
                newRow += `<td><span tabindex="-1" class="addRow btn-sm btn-success">➕</span></td>`;
                $("#table-body").prepend(`
                    <tr data-rowindex="${car.table.rows.length}" class="newRowClass bg bg-secondary">
                        ${newRow}     
                    </tr>
                `);
                let ii = 0;
                $("#table-body tr").each((i, tr) => {
                    if ($(tr).hasClass('hinttr')) {
                        ii++;
                        return
                    };
                    $(tr).attr("data-rowindex", i - ii)
                })
                $("#table-body > tr:first-child > td:first-child input").focus();
                let tdsInARow =  $("#table-body > tr:first-child > td");
                $($(tdsInARow)[tdsInARow.length - 2]).find("input").on("keydown", function (ev) {
                    if (ev.keyCode == 9) {
                        ev.preventDefault();
                        let addRowBtn = $($(tdsInARow)[tdsInARow.length - 1]).find(".btn-sm");
                        $(addRowBtn)[0].focus();
                    }
                });
                $(".addRow").off().click(function () {
                    let thisRowTds = $(this).parents("tr").find("td");
                    let alltrs = $(this).parents("table").find("tr");
                    let newRowDetails = "";
                    let dayStart = 0;
                    let dayEnd = 0;
                    for (let i = 0; i < thisRowTds.length; i++) {
                        if (i != thisRowTds.length - 1) {
                            let td_colName = $(thisRowTds[i]).find("input").attr("data-colname");
                            let td_val = $(thisRowTds[i]).find("input").val();
                            if (td_colName == "start") dayStart = td_val;
                            if (td_colName == 'end') dayEnd = td_val;
                            if (td_colName == 'hours') {
                                let hours = Number(dayEnd) - Number(dayStart);
                            }
                            if (i == thisRowTds.length - 2) {
                                // newRowDetails += `"${td_colName}":"${td_val}"`;
                                
                                newRowDetails += `"${td_colName}":"${td_val}"`;
                                $(thisRowTds[i]).html(td_val);
                            } else {
                                if (td_colName == 'money') {
                                    let hours = Math.floor(Number(dayEnd) - Number(dayStart));
                                    let moneyInHour = 43750;
                                    let money = Math.floor(Number(hours) * moneyInHour);
                                    newRowDetails += `"${td_colName}":"${money}",`;
                                    $(thisRowTds[i]).html(money);
                                } else if (td_colName == 'hours') {
                                    let hours = Math.floor(Number(dayEnd) - Number(dayStart));
                                    newRowDetails += `"${td_colName}":"${hours}",`;
                                    $(thisRowTds[i]).html(hours);
                                }
                                else {
                                    newRowDetails += `"${td_colName}":"${td_val}",`;
                                    $(thisRowTds[i]).html(td_val);
                                }
                            }
                        } else {
                            $(thisRowTds[i]).html(`<span class="delRow btn-sm btn-danger">🗑️</span>`);
                        }
                    }
                    let newRow = `{${newRowDetails}}`;
                    newRow = JSON.parse(newRow);
                    car.table.addRow(newRow);
                    $(".delRow").off().click(function () {
                        let thisRow = $(this).parents("tr");
                        let thisRowIndex = $(thisRow).attr("data-rowindex");
                        car.table.removeRow(thisRowIndex);
                        thisRow.remove();
                        $("#table-body").find("tr").each((index, tr) => {
                            $(tr).attr("data-rowindex", index);
                        });
                    });
                    $(".editRow").off().click(function () {
                        let thisRow = $(this).parents("tr");
                        let thisRowIndex = $(thisRow).attr("data-rowindex");
                        car.table.editRow(thisRowIndex);
                        drawTable();
                        assignListeners();
                    });
                    let totalmoney = 0;
                    $(alltrs).each(function (i, tr) {
                        if (i == 0) return;
                        let rowsMoney = Number($(tr).find("td")[4].innerHTML)
                        totalmoney += rowsMoney;
                    });
                    totalmoney = totalmoney.toLocaleString('en-US');
                    $("#totalmoney").removeClass("d-none");
                    $("#totalmoney").html(`
                    کل حقوق تا اینجا شده ${totalmoney}
                    تومان
                    `);
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
                if (!newColName) return;
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
                col = col.slice(0, col.length - 7);
                car.table.deletedCols.push(col);
                drawTable();
                assignListeners();
            });
            $(".sortCol").off().on("click", function () {
                let containerTh = $(this).parents("th")[0];
                let col = $(containerTh).text();
                col = col.slice(0, col.length - 7);
                sortCol(col);
            });
            $(".sortColDesc").off().on("click", function () {
                let containerTh = $(this).parents("th")[0];
                let col = $(containerTh).text();
                col = col.slice(0, col.length - 7);
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
            $(".editRow").off().click(function () {
                let thisRow = $(this).parents("tr");
                let thisRowIndex = $(thisRow).attr("data-rowindex");
                car.table.editRow(thisRowIndex);
                drawTable();
                assignListeners();
            });
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
            let toDeleteimg = this.pics.splice(indexToDelete, 1);
            this.picsToDel.push(toDeleteimg[0]);
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
            this.rows.unshift(row);
            return true;
        },
        removeRow (index) {
            this.rows.splice(index, 1);
        },
        editRow (index) {
            let row = car.table.rows[index];
            for (col in row) {
                if (car.table.getPresentCols().includes(col)) {
                    let userInput = prompt(col + " : " + row[col]);
                    if (!userInput && userInput.trim() != "") return;
                    if (userInput.trim() != "") row[col] = userInput;
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
    },
    perToEng (perChar) {
        switch (perChar)
        {
            case '۰': return '0'; break;
            case '۱': return '1'; break;
            case '۲': return '2'; break;
            case '۳': return '3'; break;
            case '۴': return '4'; break;
            case '۵': return '5'; break;
            case '۶': return '6'; break;
            case '۷': return '7'; break;
            case '۸': return '8'; break;
            case '۹': return '9'; break;
            default: return perChar; break
        }
    },
    textNumToEng (txt) {
        txt = txt.split('');
        txt = txt.map(char =>  this.perToEng(char))
        return txt.toString().replaceAll(",", "");
    }
}

class Update
{
    car;
    constructor (car) {
        this.car = car;
        this.addEventListeners();
    }
    addEventListeners () {
        $('#saveBtn').on('click', this.updateToDb.bind(this));
    }
    updateToDb () {
        this.car.addExplanation($('#summernote').summernote('code'));
        car1.explanation = this.car.explanation;
        car1.kasebiItems = this.car.kasebiItems;
        car1.table.columns = this.car.table.columns;
        car1.table.deletedCols = this.car.table.deletedCols;
        car1.table.rows = this.car.table.rows;
        $("#saveBtn").css('display', 'none');
        let car = this.car;
        this.uploadPics(car.pics);
    }
    uploadPics (pics) {
        pics = this.distinguishRealPicsForUpload(pics);
        let delPics = this.car.picsToDel;
        delPics = this.distinguishRealPicsForRemove(delPics);
        pics['delPics'] = delPics;
        let xhr = new XHR();
        xhr.send(pics, car.carName, this);
    }
    updateDb () {
        let xhr = new XHR();
        xhr.send2(this.car.carName, car.group, car.subgroup, JSON.stringify(car1), this);
    }
    removeUploadedPics () {
        let pics = this.car.pics;
        pics = this.distinguishRealPicsForUpload(pics);
        let delPics = this.car.picsToDel;
        delPics = this.distinguishRealPicsForRemove(delPics);
        pics['delPics'] = delPics;
        let xhr = new XHR();
        xhr.send3(pics, car.carName)
    }
    distinguishRealPicsForUpload (pics) {
        let realPics = [];
        for (let pic of pics) {
            if (typeof pic != 'string') realPics.push(pic);
        }
        return realPics;
    }
    distinguishRealPicsForRemove (pics) {
        let realPics = [];
        for (let pic of pics) {
            if (typeof pic == 'string') realPics.push(pic.slice(pic.lastIndexOf('/', ) + 1));
        }
        return realPics;
    }
}
class XHR
{
    getApiUrl () {
        if (document.location.href.search('localhost') != -1) return "http://localhost/dashboard/kprice/public_html"
        else return "http://park-wash.ir"
    }
    send (imgs, carName, updateClass) {
        globalMsgs.addMsg('• فرایند اپلود و حذف عکس ها شروع شد');
        let formdata = new FormData();
        for (let img in imgs) {
            if (img == 'delPics') {
                formdata.append('delPics', JSON.stringify(imgs.delPics));
            } else {
                img = imgs[0];
                let picName = img.name;
                formdata.append(picName, img);
            }
        }
        formdata.append('name', carName);
        let xhr = new XMLHttpRequest();
        xhr.open('post', `${this.getApiUrl()}/pages/admin/manipulate/uploadProcessor.php`);
        xhr.responseType = 'json';
        xhr.onloadend = this.loadEnd.bind(xhr, updateClass);
        xhr.onprogress = this.progress.bind(xhr);
        xhr.upload.onprogress = this.uploadProgress.bind(xhr);
        xhr.onerror = this.error;
        xhr.send(formdata);
    }
    send2 (fullname, group, subgroup, content, updateClass) {
        globalMsgs.addMsg('• فرایند اپدیت دیتابیس شروع شد');
        let formdata = new FormData();
        formdata.append('fullname', fullname);
        formdata.append('group', group);
        formdata.append('subgroup', subgroup);
        formdata.append('content', content);
        let xhr = new XMLHttpRequest();
        xhr.open('post', `${this.getApiUrl()}/pages/admin/manipulate/updateProcessor.php`);
        xhr.responseType = 'json';
        xhr.onloadend = this.loadEnd2.bind(xhr, updateClass);
        xhr.onprogress = this.progress.bind(xhr);
        xhr.upload.onprogress = this.uploadProgress.bind(xhr);
        xhr.onerror = this.error2;
        xhr.send(formdata);
    }
    send3 (imgs, carName) {
        globalMsgs.addMsg("شروع فرایند برداشتن عکس های آپلود شده");
        let formdata = new FormData();
        for (let img in imgs) {
            if (img == 'delPics') {
                formdata.append('delPics', JSON.stringify(imgs.delPics));
            } else {
                img = imgs[0];
                let picName = img.name;
                formdata.append(picName, img);
            }
        }
        formdata.append('name', carName);
        let xhr = new XMLHttpRequest();
        xhr.open('post', `${this.getApiUrl()}/pages/admin/manipulate/removePic.php`);
        xhr.responseType = 'json';
        xhr.onloadend = this.loadEnd3.bind(xhr);
        xhr.onprogress = this.progress3.bind(xhr);
        xhr.upload.onprogress = this.uploadProgress3.bind(xhr);
        xhr.onerror = this.error3;
        xhr.send(formdata);
    }
    error () {
        globalMsgs.addMsg("تو ارور 1");
    }
    error2 () {
        globalMsgs.addMsg("تو ارور 2");
    }
    error3 () {
        globalMsgs.addMsg("تو ارور 3");
    }
    loadEnd (updateClass) {
        let xhr = this;
        if (xhr.response == null) {
            globalMsgs.addMsg("❌مثل اینکه آفلاینی یا مشکلی هست!");
            globalMsgs.addMsg("❌فرایند اپلود عکس ها شکست خورد");
            globalMsgs.badEnd();
            return;
        }
        if (xhr.response.ok) {
            globalMsgs.addMsg("✅اگر عکسی برای اپلود وجود داشته با موفقیت انجام شد");
            updateClass.updateDb();
        }
        else {
            let errors = 'خطا های زیر رخ داده است<br>';
            for (let message of xhr.response) {
                errors += message + '<br>';
            }
            errors += 'فرایند آپلود عکس موفقیت آمیز نبوده';
            globalMsgs.addMsg(errors);
            globalMsgs.addMsg("❌فرایند اپدیت دیتابیس هم انجام نمیشه دیگه");
            globalMsgs.badEnd();
        }
    }
    loadEnd2 (updateClass) {
        let xhr = this;
        console.log('this is xhr in loadend 2:');
        console.log(xhr);
        if (xhr.response == null) {
            globalMsgs.addMsg("❌مثل اینکه آفلاینی یا مشکلی هست!");
            globalMsgs.addMsg("❌فرایند اپدیت دیتابیس شکست خورد");
            globalMsgs.addMsg("سعی میکنیم عکسی اگر اپلود شده هم برش داریم");
            updateClass.removeUploadedPics();
            return;
        }
        if (xhr.response.ok) {
            globalMsgs.addMsg("✅آپدیت دیتابیس با موفقیت انجام شد");
            globalMsgs.addMsg("✅✅✅✅همه چیز با موفقیت انجام شد، میتونی بری دیگه :)");
            globalMsgs.goodEnd();
        }
        else {
            console.log('this is xhr.response');
            console.log(xhr.response);
            let errors = 'خطا های زیر رخ داده است<br>';
            for (let message of xhr.response) {
                errors += message + '<br>';
            }
            errors += 'فرایند آپلود عکس موفقیت آمیز نبوده';
            globalMsgs.addMsg("❌مشکلی در اپدیت دیتابیس به وجود آمده است");
            globalMsgs.addMsg("❌عکس اپلود شده هم برداشته شد");
            globalMsgs.addMsg("❌❌❌هیچ اتفاق موفقیت امیزی انجام نشد و باید از اول کلا تلاش کنی :(");
            $("#saveBtn").css('display', 'none');
        }
    }
    loadEnd3 () {
        let xhr = this;
        if (xhr.response == null) {
            globalMsgs.addMsg("❌مثل اینکه آفلاینی یا مشکلی هست!");
            globalMsgs.addMsg("❌اگر عکسی رو دیلیت کردی دیگه دیلیت شده و کاری نمیشه کرد");
            globalMsgs.addMsg("❌فرایند برداشتن عکس اپلود شده به مشکل خورد");
            globalMsgs.addMsg("ببین عکسی که اپلود کردی دیگه رفت و هیچ کاری از دست ما برنمیاد باید دستی بگی بردارن!");
            return;
        }
        if (xhr.response.ok) {
            globalMsgs.addMsg("✅عکسی که اپلود کردی رو با  موفقیت برداشتیم");
            globalMsgs.addMsg("❌اگر عکسی رو دیلیت کردی دیگه دیلیت شده و کاری نمیشه کرد");
            globalMsgs.addMsg("نتیجه ی نهایی:");
            globalMsgs.addMsg("1- اگر عکسی آپلود شده برداشته شد و باید دوباره آپلود شود");
            globalMsgs.addMsg("2- اگر عکسی دیلیت شده دیگه برای همیشه دیلیت شده")
            globalMsgs.addMsg("3- در مورد دیتابیس به مشکل خوردیم و کلا هیچ تغییری در موراد این ماشین ایجاد نکردیم")
            globalMsgs.addMsg("الان نتتو چک کن و دوباره امتحان کن، دکمه سیو برای تلاش دوباره فعال شد")
            globalMsgs.badEnd();
        }
        else {
            let errors = 'خطا های زیر رخ داده است<br>';
            for (let message of xhr.response) {
                errors += message + '<br>';
            }
            errors += '';
            globalMsgs.addMsg("❌فرایند برداشتن عکس های آپلود شده موفقیت آمیز نبوده");
            globalMsgs.addMsg("❌نه تنها دیتابیس به مشکل خورد بلکه عکسی که اپلود شد هم نتونستیم دوباره دیلیت کنیم و دیگه اپلود شد!");
            globalMsgs.addMsg("❌حالا اگر یه عکس دیگه بعدا اضافه یا کم کنی اون عکس اپلود شده ی قبلی دوباره میاد");
            $("#saveBtn").css('display', 'none');
        }
    }
    progress (ev) {
        if (ev.lengthComputable) {
            globalMsgs.updateProgress1(ev.loaded +'/'+ ev.total)
        } else {
            globalMsgs.updateProgress1('نمیشه پراگرس رو نشون بدیم');
        }
    }
    progress3 (ev) {
        if (ev.lengthComputable) {
            globalMsgs.updateProgress1(ev.loaded +'/'+ ev.total)
        } else {
            globalMsgs.updateProgress1('نمیشه پراگرس رو نشون بدیم');
        }
    }
    uploadProgress (ev) {
        if (ev.lengthComputable) {
            globalMsgs.updateProgress2(ev.loaded +'/'+ ev.total);
        } else {
            globalMsgs.updateProgress2('نمیتونیم پراگرس رو نشون بدیم');
        }
    }
    uploadProgress3 (ev) {
        if (ev.lengthComputable) {
            globalMsgs.updateProgress2(ev.loaded +'/'+ ev.total);
        } else {
            globalMsgs.updateProgress2('نمیتونیم پراگرس رو نشون بدیم');
        }
    }
}
class PageMessages
{
    span1 = $(`<span></span>`);
    span2 = $(`<span></span>`);
    constructor () {
        $('#messagesRow').remove();
        if (!document.querySelector('#messagesRow')) this.buildMessageBox('');
        $('#messagesContainer').append(this.span2);
        $('#messagesContainer').append(this.span1);
        $("#messagesContainer").append(`______پیام ها:______<br>`);
    }
    buildMessageBox (msg) {
        let div = $(`
        <div id="messagesContainer">
            مانیتور:<br>
        </div>`);
        div.css({
            'background-color': '#007fb9',
            'padding': '4px',
            'direction': 'rtl',
            'text-align': 'right',
            'color': 'white',
            'margin': '0 0 10px 0',
            'box-shadow': '1px 1px 10px black',
            'border-radius': '4px'
        })
        $('#saveBtn').before(`<div class="w-100" id="messagesRow"></div>`);
        $('#messagesRow').append(`<div class="col-lg-12 p-0" id="messagesLg12"></div>`);
        $('#messagesLg12').append(div);
        $(div).prepend('<div style="cursor:pointer;position:relative;top:0;right:0;border:1px solid white;border-radius:3px;display:inline;margin:2px 2px 2px 4px;padding:5px;background-color:white" id="crossMessagesBtn">❌</div>');
        $('#crossMessagesBtn').click(() => {
            $("#messagesRow").css('display', 'none');
        });
    }
    addMsg (msg) {
        $("#messagesContainer").append(`${msg}<br>`);
        window.scrollTo(0, document.body.scrollHeight);
    }
    updateProgress1 (progress) {
        $(this.span1).html('فرایند دانلود جواب: ' + progress + '<br>');
        window.scrollTo(0, document.body.scrollHeight);
    }
    updateProgress2 (progress) {
        $(this.span2).html('فرایند آپلود: ' + progress + '<br>');
        window.scrollTo(0, document.body.scrollHeight);
    }
    goodEnd () {
        $("#messagesContainer").append($(`<div class='btn-warning btn-sm p-1 mb-1 rounded text-center' onclick="javascript:window.location.reload()">reload</div>`));
        $("#messagesContainer").append($(`<a class='d-block btn-warning btn-sm p-1 rounded text-center' href="${root}pages/car/car.php?car=${car.carName}">go to this car</a>`));
        window.scrollTo(0, document.body.scrollHeight);
    }
    badEnd () {
        $("#saveBtn").css('display', 'block');
        window.scrollTo(0, document.body.scrollHeight);
    }
}
var globalMsgs = new PageMessages;