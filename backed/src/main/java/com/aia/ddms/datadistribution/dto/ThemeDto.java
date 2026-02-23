package com.aia.ddms.datadistribution.dto;

import lombok.Data;

@Data
public class ThemeDto {

    /**
     * 主题名称（顶级分类 category_level = 1 的 category_name）
     */
    private String themeName;
}

