package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class GlobalSearchResultDto {

    /**
     * 字段英文名
     */
    private String name;

    /**
     * 表英文名
     */
    private String tableName;

    /**
     * 系统名称
     */
    private String system;

    /**
     * 安全分级
     */
    private String securityLevel;

    /**
     * 业务分类（使用个人金融信息二级分类等字段）
     */
    private String businessCategory;

    /**
     * 数据属主
     */
    private String owner;
}

