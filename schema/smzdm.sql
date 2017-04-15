/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50621
Source Host           : 127.0.0.1:3306
Source Database       : smzdm

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-04-15 13:06:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ccgold_goods_detail
-- ----------------------------
DROP TABLE IF EXISTS `ccgold_goods_detail`;
CREATE TABLE `ccgold_goods_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_id` int(11) NOT NULL COMMENT '电商系统商品编号',
  `good_name` varchar(255) NOT NULL COMMENT '商品名称',
  `cate_id` smallint(6) DEFAULT NULL COMMENT '商品分类',
  `weight` varchar(20) DEFAULT NULL COMMENT '重量',
  `img_src` varchar(255) DEFAULT NULL COMMENT '图片链接地址',
  `price` double DEFAULT NULL COMMENT '价格',
  `inventory` int(11) DEFAULT NULL COMMENT '库存',
  `sales` int(11) DEFAULT NULL COMMENT '销量',
  `freight` double DEFAULT NULL COMMENT '运费',
  `shop_name` varchar(255) DEFAULT NULL COMMENT '店铺名',
  `rec_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
  PRIMARY KEY (`id`),
  KEY `idx_ccgold_good_recdate_2` (`good_id`,`rec_date`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='某电商商品详情';

-- ----------------------------
-- Table structure for cncoin_answer_nlp
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_answer_nlp`;
CREATE TABLE `cncoin_answer_nlp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `account` varchar(25) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  `postTime` datetime DEFAULT NULL,
  `negative` float unsigned zerofill DEFAULT NULL,
  `positive` float unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_answer_seg
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_answer_seg`;
CREATE TABLE `cncoin_answer_seg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `account` varchar(25) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  `postTime` datetime DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  `wtype` varchar(20) DEFAULT NULL,
  `pos` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_comment_list
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_comment_list`;
CREATE TABLE `cncoin_comment_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `levelId` int(11) DEFAULT NULL,
  `countByNumber` int(11) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `comment_type` varchar(255) DEFAULT NULL,
  `comment_rank` varchar(255) DEFAULT NULL,
  `access_date` datetime DEFAULT NULL,
  `average_points` varchar(255) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `add_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_comment_nlp
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_comment_nlp`;
CREATE TABLE `cncoin_comment_nlp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `negative` float unsigned zerofill DEFAULT NULL,
  `positive` float unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_comment_seg
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_comment_seg`;
CREATE TABLE `cncoin_comment_seg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `word` varchar(40) DEFAULT NULL,
  `wtype` varchar(10) DEFAULT NULL,
  `pos` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_comment_stat
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_comment_stat`;
CREATE TABLE `cncoin_comment_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `allNumber` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `goodNumber` int(11) DEFAULT NULL,
  `pageNo` int(11) DEFAULT NULL,
  `middleNumber` int(11) DEFAULT NULL,
  `imageNumber` int(11) DEFAULT NULL,
  `badNumber` int(11) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_goods
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_goods`;
CREATE TABLE `cncoin_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `good_name` varchar(255) DEFAULT NULL,
  `tips` varchar(255) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_goods_detail
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_goods_detail`;
CREATE TABLE `cncoin_goods_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_question
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_question`;
CREATE TABLE `cncoin_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `content` varchar(400) DEFAULT NULL,
  `levelId` int(11) DEFAULT NULL,
  `account` varchar(20) DEFAULT NULL,
  `replyContent` varchar(400) DEFAULT NULL,
  `contentType` varchar(20) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  `postTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_question_nlp
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_question_nlp`;
CREATE TABLE `cncoin_question_nlp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `account` varchar(25) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  `postTime` datetime DEFAULT NULL,
  `negative` float unsigned zerofill DEFAULT NULL,
  `positive` float unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_question_seg
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_question_seg`;
CREATE TABLE `cncoin_question_seg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `account` varchar(25) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  `postTime` datetime DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  `wtype` varchar(20) DEFAULT NULL,
  `pos` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_storage
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_storage`;
CREATE TABLE `cncoin_storage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `value` int(255) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cncoin_trade
-- ----------------------------
DROP TABLE IF EXISTS `cncoin_trade`;
CREATE TABLE `cncoin_trade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `address` varchar(20) DEFAULT NULL,
  `access_date` datetime DEFAULT NULL,
  `account` varchar(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `handle_status` int(11) DEFAULT NULL,
  `order_type` varchar(20) DEFAULT NULL,
  `areaid` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wfx_comment_list
-- ----------------------------
DROP TABLE IF EXISTS `wfx_comment_list`;
CREATE TABLE `wfx_comment_list` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL COMMENT '商品编号',
  `order_item_id` int(11) NOT NULL COMMENT '订单编号',
  `detail` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `create_time` datetime NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`id`),
  KEY `idx_wfx_comment_item` (`item_id`) USING BTREE,
  KEY `idx_wfx_comment_order` (`order_item_id`) USING BTREE,
  KEY `idx_wfx_comment_date` (`create_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销订单评论';

-- ----------------------------
-- Table structure for wfx_comment_nlp
-- ----------------------------
DROP TABLE IF EXISTS `wfx_comment_nlp`;
CREATE TABLE `wfx_comment_nlp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL COMMENT '商品编号',
  `comment_id` int(11) NOT NULL COMMENT '评论编号',
  `negative` double NOT NULL COMMENT '负面得分',
  `positive` double NOT NULL COMMENT '正面得分',
  PRIMARY KEY (`id`),
  KEY `idx_wfx_commentnlp_item` (`item_id`) USING BTREE,
  KEY `idx_wfx_commentnlp_neg` (`negative`) USING BTREE,
  KEY `idx_wfx_commentnlp_post` (`positive`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销评论自然语言分析';

-- ----------------------------
-- Table structure for wfx_comment_seg
-- ----------------------------
DROP TABLE IF EXISTS `wfx_comment_seg`;
CREATE TABLE `wfx_comment_seg` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL COMMENT '商品编号',
  `comment_id` int(11) NOT NULL COMMENT '评论编号',
  `word` varchar(20) NOT NULL COMMENT '词语',
  `pos` int(11) DEFAULT NULL COMMENT '词语位置',
  PRIMARY KEY (`id`),
  KEY `idx_wfx_commentseg_item` (`item_id`) USING BTREE,
  KEY `idx_wfx_commentseg_comment` (`comment_id`,`pos`) USING BTREE,
  KEY `idx_wfx_commentseg_word` (`word`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销评论分词';

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
  PRIMARY KEY (`id`),
  KEY `idx_wfx_market` (`item_id`,`rec_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销商品营销数据';

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
  KEY `id` (`id`),
  KEY `idx_wfx_stock` (`item_id`,`rec_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微分销商品详情';

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
  KEY `idx_yz_goods_1` (`alias`,`rec_date`) USING BTREE,
  KEY `idx_yz_goods_2` (`goodId`,`rec_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='有赞商品详情';

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
  KEY `idx_yz_stock_1` (`alias`,`rec_date`) USING BTREE,
  KEY `idx_yz_stock_2` (`goodId`,`rec_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='有赞商品库存';

-- ----------------------------
-- Table structure for yz_trade_record
-- ----------------------------
DROP TABLE IF EXISTS `yz_trade_record`;
CREATE TABLE `yz_trade_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(15) DEFAULT NULL COMMENT '电商系统商品编号/代号',
  `goodId` int(11) DEFAULT NULL COMMENT '电商系统商品编号',
  `nickname` varchar(15) DEFAULT NULL COMMENT '昵称',
  `item_num` int(11) DEFAULT NULL COMMENT '成交数量',
  `item_price` double DEFAULT NULL COMMENT '成交单价',
  `update_time` datetime DEFAULT NULL COMMENT '成交时间',
  `shopName` varchar(255) DEFAULT NULL COMMENT '店铺名',
  PRIMARY KEY (`id`),
  KEY `idx_yz_trade` (`alias`,`update_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='有赞店铺交易记录';
