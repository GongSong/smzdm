/*
Navicat MySQL Data Transfer

Source Server         : Mysql_local
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-04-06 21:49:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for wfx_stock
-- ----------------------------
DROP TABLE IF EXISTS `wfx_stock`;
CREATE TABLE `wfx_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL COMMENT '分类编号',
  `item_id` int(11) DEFAULT NULL COMMENT '电商系统商品编号',
  `title` varchar(255) DEFAULT NULL COMMENT '商品名',
  `status` int(255) DEFAULT NULL COMMENT '商品状态',
  `num` int(11) DEFAULT NULL COMMENT '库存',
  `original_price` double DEFAULT NULL COMMENT '原价',
  `price` double DEFAULT NULL COMMENT '价格',
  `sales_volume` int(255) DEFAULT NULL COMMENT '销售量',
  `pic_url` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `link_item` varchar(255) DEFAULT NULL COMMENT '商品详情地址',
  `rec_date` datetime DEFAULT NULL COMMENT '爬取日期',
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wfx_item_marketing
-- ----------------------------
DROP TABLE IF EXISTS `wfx_item_marketing`;
CREATE TABLE `wfx_item_marketing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL COMMENT '电商系统商品编号',
  `rec_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '爬取日期',
  `like_sum` int(11) DEFAULT NULL COMMENT '点赞数',
  `points` int(11) DEFAULT NULL COMMENT '赠送积分',
  `postage` int(11) DEFAULT NULL COMMENT '邮资',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销商品营销数据'

-- ----------------------------
-- Table structure for yz_goods
-- ----------------------------
DROP TABLE IF EXISTS `yz_goods`;
CREATE TABLE `yz_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL COMMENT '电商系统商品编号/代号',
  `goodId` int(11) DEFAULT NULL COMMENT '电商系统商品编号',
  `title` varchar(100) DEFAULT NULL ,
  `price` float(11,0) unsigned zerofill DEFAULT NULL,
  `priceTaobao` float(11,0) unsigned zerofill DEFAULT NULL,
  `imgSrc` varchar(255) DEFAULT NULL,
  `isVirtual` varchar(255) DEFAULT NULL,
  `shopName` varchar(255) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `aliax` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8;

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
  `rec_date` datetime DEFAULT NULL,
  `shopName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `alias` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=15367 DEFAULT CHARSET=utf8;
