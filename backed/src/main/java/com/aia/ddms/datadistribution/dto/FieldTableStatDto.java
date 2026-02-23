package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class FieldTableStatDto {

    /**
     * 字段数量
     */
    private Long fieldCount;

    /**
     * 表数量
     */
    private Long tableCount;
}

