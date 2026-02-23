package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class SecurityDistributionDto {

    /**
     * 安全分级，例如：核心数据、重要数据等
     */
    private String level;

    /**
     * 对应字段数量
     */
    private Long fieldCount;

    /**
     * 关联系统名称列表，逗号分隔
     */
    private String systems;
}

