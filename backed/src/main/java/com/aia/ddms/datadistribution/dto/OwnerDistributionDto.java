package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class OwnerDistributionDto {

    /**
     * 数据属主，例如：营运部、客户管理部等
     */
    private String owner;

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

