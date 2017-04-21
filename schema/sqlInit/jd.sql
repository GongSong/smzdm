/*
Navicat MySQL Data Transfer

Source Server         : Mysql_local
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-04-22 00:53:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for jd_comment
-- ----------------------------
DROP TABLE IF EXISTS `jd_comment`;
CREATE TABLE `jd_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wareId` varchar(40) DEFAULT NULL,
  `commentId` varchar(40) DEFAULT NULL,
  `commentData` varchar(400) CHARACTER SET utf8mb4 DEFAULT NULL,
  `commentDate` datetime DEFAULT NULL,
  `commentScore` int(11) DEFAULT NULL,
  `commentShareUrl` varchar(255) DEFAULT NULL,
  `commentType` int(11) DEFAULT NULL,
  `orderDate` datetime DEFAULT NULL,
  `userImgURL` varchar(255) DEFAULT NULL,
  `userLevel` int(11) DEFAULT NULL,
  `userNickName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for jd_goods
-- ----------------------------
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
  `saleLevel` int(11) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for jd_shop
-- ----------------------------
DROP TABLE IF EXISTS `jd_shop`;
CREATE TABLE `jd_shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venderId` int(11) DEFAULT NULL,
  `shopId` int(11) DEFAULT NULL,
  `shopName` varchar(255) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `shopDate` datetime DEFAULT NULL,
  `commentScore` float DEFAULT NULL,
  `serviceScore` float DEFAULT NULL,
  `expressScore` float DEFAULT NULL,
  `followCount` int(11) DEFAULT NULL,
  `logoUrl` varchar(255) DEFAULT NULL,
  `shareLink` varchar(255) DEFAULT NULL,
  `totalNum` int(11) DEFAULT NULL,
  `detailUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for jd_shop_category
-- ----------------------------
DROP TABLE IF EXISTS `jd_shop_category`;
CREATE TABLE `jd_shop_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopId` int(11) DEFAULT NULL,
  `cateId` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
