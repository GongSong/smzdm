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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT '微分销商品详情';

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
  `title` varchar(100) DEFAULT NULL COMMENT '商品名',
  `price` float(11,0) unsigned zerofill DEFAULT NULL COMMENT '商品价格',
  `priceTaobao` float(11,0) unsigned zerofill DEFAULT NULL COMMENT '淘宝对应商品价格',
  `imgSrc` varchar(255) DEFAULT NULL COMMENT '商品图片地址',
  `isVirtual` varchar(255) DEFAULT NULL COMMENT '是否虚拟商品',
  `shopName` varchar(255) DEFAULT NULL COMMENT '店铺名称',
  `rec_date` datetime DEFAULT NULL COMMENT '记录日期',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `aliax` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8 COMMENT '有赞商品详情';

-- ----------------------------
-- Table structure for yz_stock
-- ----------------------------
DROP TABLE IF EXISTS `yz_stock`;
CREATE TABLE `yz_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL COMMENT '电商系统商品编号/代号',
  `goodId` int(11) DEFAULT NULL COMMENT '电商系统商品编号',
  `sales` int(11) DEFAULT NULL COMMENT '销售量',
  `stock` int(11) DEFAULT NULL COMMENT '库存',
  `freight` varchar(255) DEFAULT NULL COMMENT '运费',
  `rec_date` datetime DEFAULT NULL COMMENT '记录日期',
  `shopName` varchar(255) DEFAULT NULL COMMENT '店铺名称',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `alias` (`alias`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8 COMMENT '有赞商品库存';

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

-- ----------------------------
-- Table structure for ccgold_goods
-- ----------------------------
DROP TABLE IF EXISTS `ccgold_goods`;
CREATE TABLE `smzdm`.`ccgold_goods` (
	`id` int NOT NULL AUTO_INCREMENT,
	`good_id` int NOT NULL COMMENT '电商系统商品编号',
	`good_name` varchar(255) COMMENT '商品名称',
	`good_cate` smallint COMMENT '商品分类',
	`img_src` varchar(255),
	`shop_name` varchar(255),
	`rec_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
	PRIMARY KEY (`id`)
) ENGINE=`InnoDB` DEFAULT CHARACTER SET utf8 COMMENT='某电商商品列表';

-- ----------------------------
-- Table structure for ccgold_goods_detail
-- ----------------------------
DROP TABLE IF EXISTS `ccgold_goods_detail`;
CREATE TABLE `smzdm`.`ccgold_goods_detail` (
	`id` int NOT NULL AUTO_INCREMENT,
	`good_id` int NOT NULL COMMENT '电商系统商品编号',
	`good_name` varchar(255) NOT NULL COMMENT '商品名称',
	`good_cate` smallint COMMENT '商品分类',
	`weight` double COMMENT '重量',
	`price` double COMMENT '价格',
	`inventory` int COMMENT '库存',
	`sales` int COMMENT '销量',
	`freight` double COMMENT '运费',
	`shop_name` varchar(255) COMMENT '店铺名',
	`rec_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
	PRIMARY KEY (`id`)
) ENGINE=`InnoDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT='某电商商品详情';