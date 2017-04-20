DROP TABLE IF EXISTS `jd_goods`;
CREATE TABLE `jd_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopId` int(11) DEFAULT NULL,
  `wareId` varchar(30) DEFAULT NULL,
  `wname` varchar(255) DEFAULT NULL,
  `imageurl` varchar(255) DEFAULT NULL,
  `jdPrice` float DEFAULT NULL,
  `good` varchar(20) DEFAULT NULL,
  `flashSale` varchar(255) DEFAULT NULL,
  `totalCount` int(11) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `jd_comment`;
CREATE TABLE `jd_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wareId` varchar(40) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `commentData` varchar(400) DEFAULT NULL,
  `commentDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
