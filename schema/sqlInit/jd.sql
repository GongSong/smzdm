SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `jd_goods`;
CREATE TABLE `jd_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopId` int(11) DEFAULT NULL,
  `wareId` int(11) DEFAULT NULL,
  `wname` varchar(255) DEFAULT NULL,
  `imageurl` varchar(255) DEFAULT NULL,
  `jdPrice` float DEFAULT NULL,
  `good` varchar(20) DEFAULT NULL,
  `flashSale` varchar(255) DEFAULT NULL,
  `totalCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
