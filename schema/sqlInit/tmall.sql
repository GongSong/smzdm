/*
Navicat MySQL Data Transfer

Source Server         : Mysql_local
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-04-22 17:48:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tmall_comments
-- ----------------------------
DROP TABLE IF EXISTS `tmall_comments`;
CREATE TABLE `tmall_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `auctionSku` varchar(255) DEFAULT NULL,
  `cmsSource` varchar(255) DEFAULT NULL,
  `displayUserNick` varchar(255) DEFAULT NULL,
  `fromMall` int(11) DEFAULT NULL,
  `gmtCreateTime` datetime DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `rateContent` varchar(400) DEFAULT NULL,
  `reply` varchar(400) DEFAULT NULL,
  `rateDate` datetime DEFAULT NULL,
  `sellerId` int(11) DEFAULT NULL,
  `tmallSweetLevel` int(11) DEFAULT NULL,
  `tmallSweetPic` varchar(255) DEFAULT NULL,
  `tradeEndTime` datetime DEFAULT NULL,
  `userful` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for tmall_goods
-- ----------------------------
DROP TABLE IF EXISTS `tmall_goods`;
CREATE TABLE `tmall_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) DEFAULT NULL,
  `item_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `sold` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `totalSoldQuantity` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for tmall_shop
-- ----------------------------
DROP TABLE IF EXISTS `tmall_shop`;
CREATE TABLE `tmall_shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shop_title` varchar(255) DEFAULT NULL,
  `shop_Url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
