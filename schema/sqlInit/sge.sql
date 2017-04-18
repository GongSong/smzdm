DROP TABLE IF EXISTS `sge_trends`;
CREATE TABLE `sge_trends` (
  `history_date` date NOT NULL COMMENT '历史日期',
  `zp` double NOT NULL COMMENT '早盘价',
  `wp` double NOT NULL COMMENT '晚盘价',
  PRIMARY KEY (`history_date`),
  KEY `history_date` (`history_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='上海金每日基准价趋势';