
--
-- 表的结构 `rustdesk_peers`
--

CREATE TABLE `rustdesk_peers` (
  `deviceid` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `uid` int UNSIGNED NOT NULL COMMENT '用户ID',
  `id` char(16) NOT NULL DEFAULT '' COMMENT '设备ID',
  `username` varchar(128) NULL DEFAULT '' COMMENT '操作系统用户名',
  `hostname` varchar(128) NULL DEFAULT '' COMMENT '操作系统名',
  `alias` char(20) NULL DEFAULT '' COMMENT '别名',
  `platform` char(20) NULL DEFAULT '' COMMENT '平台',
  `tags` varchar(256) NULL DEFAULT '' COMMENT '标签',
  `hash` varchar(128) NULL DEFAULT '' COMMENT '设备连接密码',
  PRIMARY KEY (`deviceid`),
  UNIQUE KEY `uuid` (`id`,`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='远程设备表';




--
-- 表的结构 `rustdesk_tags`
--
CREATE TABLE `rustdesk_tags` (
  `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'tagID',
  `uid` int UNSIGNED NOT NULL COMMENT '用户ID',
  `tag` char(20) NOT NULL DEFAULT '' COMMENT 'tag名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag` (`tag`,`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='tags表';



--
-- 表的结构 `rustdesk_token`
--

CREATE TABLE `rustdesk_token` (
  `username` char(16) NOT NULL COMMENT '用户名',
  `uid` int UNSIGNED NOT NULL COMMENT '用户ID',
  `id` char(16) NOT NULL COMMENT '设备码',
  `uuid` char(64) NOT NULL COMMENT '设备ID',
  `access_token` varchar(128) NOT NULL DEFAULT '' COMMENT '登录token',
  `login_time` int UNSIGNED NOT NULL DEFAULT '0' COMMENT '登录时间',
  `expire_time` int DEFAULT '0' COMMENT '过期时间',
  PRIMARY KEY (`access_token`),
  UNIQUE KEY `login_token` (`username`,`id`,`uuid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='登录Token表';


--
-- 表的结构 `rustdesk_users`
--

CREATE TABLE `rustdesk_users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` char(16) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL COMMENT '密码',
  `create_time` int UNSIGNED NOT NULL DEFAULT '0' COMMENT '添加时间',
  `delete_time` int UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

