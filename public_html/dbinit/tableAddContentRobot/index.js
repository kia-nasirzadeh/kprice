const fs = require("fs");
function fileExists (path) {
    try {
        fs.statSync(path);
        return true;
    } catch (error) {
        return false;
    }
}
function makeSqlFile (sqlFilePath) {
    if (fileExists(sqlFilePath)) return;
    fs.writeFileSync(sqlFilePath, `
        -- create database;
        DROP DATABASE IF EXISTS kprice;
        CREATE DATABASE IF NOT EXISTS kprice
        CHARACTER SET utf8
        COLLATE utf8_general_ci;

        -- create cars table:
        use kprice;
        drop table if exists cars;
        create table if not exists cars (
            \`id\` bigint PRIMARY KEY not null auto_increment,
            \`group\` varchar(250) not null,
            \`subgroup\` varchar(250) not null,
            \`content\` text,
            \`FullName\` varchar(500) AS (concat(\`group\`,'-',\`subgroup\`))
        ) character set utf8 collate utf8_general_ci;
    `);
    let insertingData = insertingDataMaker();
    insertingData.forEach(car => {
        let insertStatement = `\ninsert into cars (\`group\`,\`subgroup\`,\`content\`) values ("${car.group}", "${car.subgroup}", N'${car.content}');`
        fs.appendFileSync(sqlFilePath, insertStatement);
    })
}
function insertingDataMaker () {
    const carsObj = require('./carsCopy.json');
    let insertingData = [];
    for (car in carsObj) {
        let group = car.slice(0, car.indexOf('-'));
        let subgroup = car.slice(car.indexOf('-'));
        if (subgroup.length > 0) {
            subgroup = subgroup.slice(1);
        }
        let fullName = group + '-' + subgroup;
        let firstRow = carsObj[car][0];
        let columns = [];
        for (column in firstRow) {
            columns.push(column);
        };
        let rows = carsObj[car];

        let content = {
            "carName": car,
            "pics": getPics('C:/xampp/htdocs/dashboard/kprice/public_html/assets/pics', fullName),
            "explanation": "",
            "kasebiItems": "",
            "table": {
                "columns": columns,
                "deletedCols": [],
                "rows": rows
            }
        }
        insertingData.push({
            "group": group,
            "subgroup": subgroup,
            "content": JSON.stringify(content)
        });
    }
    return insertingData;
}
function getPics (baseDir, carName) {
    let wholeDir = fs.readdirSync(baseDir);
    let pics = [];
    wholeDir.forEach(pic => {
        let isThisCar = pic.search(carName)
        if (isThisCar == 0) pics.push("http://127.0.0.1/dashboard/kprice/public_html/assets/pics" + '/' + pic);
    })
    return pics;
}
makeSqlFile('./sql1.sql');