package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class DataDictionaryItemDto {

    private String assetName;

    /**
     * 数据资产项（资产分类名称）
     */
    private String assetItem;

    /**
     * 三级分类
     */
    private String level3Category;

    /**
     * 二级分类
     */
    private String level2Category;

    /**
     * 主题
     */
    private String theme;

    /**
     * 系统名
     */
    private String systemName;

    /**
     * 表中文名
     */
    private String tableName;

    /**
     * 字段中文名
     */
    private String columnName;

    /**
     * 安全分级细分
     */
    private String firstLevelSubclass;

    private String secondLevelSubclass;

    private String thirdLevelSubclass;

    private String fourthLevelSubclass;

    /**
     * 安全定级
     */
    private String safetyClassification;

    /**
     * 安全定级（人行）
     */
    private String safetyClassificationPbc;
}

