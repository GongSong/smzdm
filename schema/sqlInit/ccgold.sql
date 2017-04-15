DROP TABLE IF EXISTS `ccgold_goods_detail`;
CREATE TABLE `ccgold_goods_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_id` int(11) NOT NULL COMMENT '电商系统商品编号',
  `good_name` varchar(255) NOT NULL COMMENT '商品名称',
  `cate_id` smallint(6) DEFAULT NULL COMMENT '商品分类',
  `weight` double DEFAULT NULL COMMENT '重量',
  `img_src` varchar(255) DEFAULT NULL COMMENT '图片链接地址',
  `price` double DEFAULT NULL COMMENT '价格',
  `inventory` int(11) DEFAULT NULL COMMENT '库存',
  `sales` int(11) DEFAULT NULL COMMENT '销量',
  `freight` double DEFAULT NULL COMMENT '运费',
  `shop_name` varchar(255) DEFAULT NULL COMMENT '店铺名',
  `rec_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
  PRIMARY KEY (`id`),
  KEY `idx_ccgold_good_recdate_2` (`good_id`,`rec_date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='某电商商品详情';
