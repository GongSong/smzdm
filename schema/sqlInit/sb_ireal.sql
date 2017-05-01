DROP TABLE IF EXISTS `sbireal_good`;
CREATE TABLE `sbireal_good` (
`id`  bigint NOT NULL AUTO_INCREMENT ,
`item_id`  varchar(20) NOT NULL ,
`title`  varchar(255) NOT NULL ,
`price`  double(10,2) NULL ,
`storage`  double NULL ,
`imgSrc`  varchar(255) NULL ,
`rec_date`  datetime NULL,
PRIMARY KEY (`id`),
INDEX `idx_ireal_goodid` (`item_id`) USING BTREE ,
INDEX `idx_ireal_price` (`price`) USING BTREE ,
INDEX `idx_ireal_inv` (`storage`) USING BTREE ,
INDEX `idx_ireal_good_recdate` (`rec_date`) USING BTREE 
);

DROP TABLE IF EXISTS `sbireal_stock`;
CREATE TABLE `sbireal_stock` (
`id`  bigint NOT NULL AUTO_INCREMENT ,
`item_id`  varchar(20) NOT NULL ,
`sales`  double NULL ,
`storage`  double NULL ,
`freight`  double NULL ,
`rec_date`  datetime NULL ,
PRIMARY KEY (`id`),
INDEX `idx_ireal_stock_goodid` (`item_id`) USING BTREE ,
INDEX `idx_ireal_stock_recdate` (`rec_date`) USING BTREE 
);

DROP TABLE IF EXISTS `sb_ireal_trade`;
CREATE TABLE `sb_ireal_trade` (
`id`  bigint NOT NULL ,
`item_id`  bigint NOT NULL ,
`buyer`  varchar(50) NULL ,
`order_time`  datetime NULL ,
`quantity`  double NULL ,
PRIMARY KEY (`id`),
INDEX `idx_irealtrade_goodid` (`item_id`) USING BTREE 
);