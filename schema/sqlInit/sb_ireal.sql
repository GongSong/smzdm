DROP TABLE IF EXISTS `sbireal_good`;
CREATE TABLE `sbireal_good` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` double(10,2) DEFAULT NULL,
  `storage` double DEFAULT NULL,
  `imgSrc` varchar(255) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ireal_goodid` (`item_id`) USING BTREE,
  KEY `idx_ireal_price` (`price`) USING BTREE,
  KEY `idx_ireal_inv` (`storage`) USING BTREE,
  KEY `idx_ireal_good_recdate` (`rec_date`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
DROP TABLE IF EXISTS `sbireal_trade`;
CREATE TABLE `sbireal_trade` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` bigint(20) NOT NULL,
  `buyer` varchar(50) DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_irealtrade_goodid` (`item_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
