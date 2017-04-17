DROP TABLE IF EXISTS `crawler_list`;
CREATE TABLE `crawler_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tbl_name` varchar(255) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
