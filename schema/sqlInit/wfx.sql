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