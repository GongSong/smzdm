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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `cncoin_comment_nlp`;
CREATE TABLE `cncoin_comment_nlp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `negative` float unsigned zerofill DEFAULT NULL,
  `positive` float unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `cncoin_comment_seg`;
CREATE TABLE `cncoin_comment_seg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `word` varchar(80) DEFAULT NULL,
  `wtype` varchar(10) DEFAULT NULL,
  `pos` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cncoin_goods`;
CREATE TABLE `cncoin_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `good_name` varchar(255) DEFAULT NULL,
  `tips` varchar(255) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cncoin_goods_detail`;
CREATE TABLE `cncoin_goods_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cncoin_storage`;
CREATE TABLE `cncoin_storage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `value` int(255) DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;