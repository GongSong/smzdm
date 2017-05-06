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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ctf_product`;
CREATE TABLE `ctf_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_tag` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spec_style` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：款式',
  `spec_series` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：系列',
  `spec_material` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：材质',
  `spec_fineness` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：成色',
  `spec_dimension` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参数：尺寸',
  `freight` double DEFAULT NULL,
  `inventory` double DEFAULT NULL,
  `rec_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ctf_productno` (`product_no`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--`ctf_comment`