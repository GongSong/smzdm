/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50621
Source Host           : 127.0.0.1:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-03-31 22:06:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for yz_goods
-- ----------------------------
DROP TABLE IF EXISTS `yz_goods`;
CREATE TABLE `yz_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL,
  `goodId` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `price` float(11,0) unsigned zerofill DEFAULT NULL,
  `priceTaobao` float(11,0) unsigned zerofill DEFAULT NULL,
  `imgSrc` varchar(255) DEFAULT NULL,
  `isVirtual` varchar(255) DEFAULT NULL,
  `shopName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `aliax` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for yz_stock
-- ----------------------------
DROP TABLE IF EXISTS `yz_stock`;
CREATE TABLE `yz_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL,
  `goodId` int(11) DEFAULT NULL,
  `sales` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `freight` varchar(255) DEFAULT NULL,
  `rec_date` varchar(255) DEFAULT NULL,
  `shopName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `alias` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for yz_trade_record
-- ----------------------------
DROP TABLE IF EXISTS `yz_trade_record`;
CREATE TABLE `yz_trade_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL,
  `goodId` int(11) DEFAULT NULL,
  `nickname` varchar(15) DEFAULT NULL,
  `item_num` int(11) DEFAULT NULL,
  `item_price` double DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `shopName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `update_time` (`update_time`),
  FULLTEXT KEY `alias` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=7684 DEFAULT CHARSET=utf8;
