DROP TABLE IF EXISTS `ctf_goods`;
CREATE TABLE `ctf_goods` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `goods_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goods_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double DEFAULT NULL,
  `sold_monthly` double DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctf_goodsno` (`goods_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='周大福商品列表';
DROP TABLE IF EXISTS `ctf_goods_detail`;
CREATE TABLE `ctf_goods_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `goods_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spec_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：类型',
  `spec_style` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：款式',
  `spec_material` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：材质',
  `spec_series` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：系列',
  `spec_proc` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：镶法',
  `spec_fineness` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：成色',
  `spec_engrave` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：刻字',
  `spec_applicable` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：人群',
  `spec_dimension` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：尺寸',
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctf_goods_detailno` (`goods_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='周大福商品详情';
DROP TABLE IF EXISTS `ctf_product`;
CREATE TABLE `ctf_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` double DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `rel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inventory` double DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctf_productno` (`product_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='周大福商品详情';
