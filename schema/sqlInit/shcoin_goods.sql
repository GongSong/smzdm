/*
Navicat MySQL Data Transfer

Source Server         : Mysql_local
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-05-01 17:39:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for shcoin_goods
-- ----------------------------
DROP TABLE IF EXISTS `shcoin_goods`;
CREATE TABLE `shcoin_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL COMMENT '电商系统商品编号',
  `title` varchar(100) DEFAULT NULL COMMENT '商品名',
  `imgSrc` varchar(255) DEFAULT NULL,
  `price` float(11,0) unsigned zerofill DEFAULT NULL COMMENT '商品价格',
  `storage` int(11) DEFAULT NULL COMMENT '库存量',
  `rec_date` datetime DEFAULT NULL COMMENT '记录日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='有赞商品详情';
