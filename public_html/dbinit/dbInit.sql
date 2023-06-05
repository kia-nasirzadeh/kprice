-- create database;
DROP DATABASE IF EXISTS kprice;
CREATE DATABASE IF NOT EXISTS kprice
CHARACTER SET utf8
COLLATE utf8_general_ci;

-- create cars table:
use kprice;
drop table if exists cars;
create table if not exists cars (
	`id` bigint PRIMARY KEY not null auto_increment,
    `group` varchar(250) not null,
    `subgroup` varchar(250) not null,
    `content` text,
    FullName varchar(500) AS (concat(`group`,'-',`subgroup`))
) character set utf8 collate utf8_general_ci;

insert into cars (`group`,`subgroup`,`content`) values (N'قلی', "2010-2014", N'{"carName":"c200-2014-2016","pics":["file:///C:/Users/kia-nasirzadeh/Desktop/kia/4-%20kprice/assets/pics/2.jpg","file:///C:/Users/kia-nasirzadeh/Desktop/kia/4-%20kprice/assets/pics/3.jpg"],"explanation":"این یک توضیح اختیاری برای ماشین است","kasebiItems":["خرید در 10 دلار در 20 سنت","خرید بی رنگش در 100 دلار یعنی 1.5میلیارد تومن"],"table":{"columns":["gheymat","badane","rang","karkard"],"deletedCols":["rang"],"rows":[{"gheymat":"1.45","badane":"biRang","rang":"sefid","karkard":"22000"},{"gheymat":"1.7","badane":"biRang","rang":"meshki","karkard":"32000"},{"gheymat":"1.2","badane":"gelgir-aghab-stock","rang":"abi","karkard":"12000"}]}}');
insert into cars (`group`,`subgroup`,`content`) values ("c200", "2010-2014", '{"carName":"c200-2014-2016"}');
