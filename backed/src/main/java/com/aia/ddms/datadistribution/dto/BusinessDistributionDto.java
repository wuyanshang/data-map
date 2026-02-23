package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class BusinessDistributionDto {

    /**
     * 业务分类名称，例如：客户数据、保单数据等
     */
    private String category;

    /**
     * 对应字段数量
     */
    private Long fieldCount;

    /**
     * 涉及表数量
     */
    private Long tableCount;

    /**
     * 关联系统名称列表，逗号分隔
     */
    private String systems;
}

