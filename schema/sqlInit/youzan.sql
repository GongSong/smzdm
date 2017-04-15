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