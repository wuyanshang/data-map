package com.aia.ddms.datadistribution.mapper;

import com.aia.ddms.datadistribution.dto.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DataDistributionMapper {

    /**
     * 按安全分级统计字段数量及关联系统
     */
    List<SecurityDistributionDto> selectSecurityDistribution();

    /**
     * 按业务分类统计字段与表数量及关联系统
     */
    List<BusinessDistributionDto> selectBusinessDistribution();

    /**
     * 按数据属主统计字段与表数量及关联系统
     */
    List<OwnerDistributionDto> selectOwnerDistribution();

    /**
     * 全局搜索：按字段名搜索
     */
    List<GlobalSearchResultDto> searchByField(@Param("keyword") String keyword);

    /**
     * 全局搜索：按表名搜索
     */
    List<GlobalSearchResultDto> searchByTable(@Param("keyword") String keyword);

    /**
     * 查询所有主题
     */
    List<ThemeDto> selectAllThemes();

    /**
     * 某个主题下的字段数量和表数量
     */
    FieldTableStatDto selectFieldAndTableStatByTheme(@Param("themeName") String themeName);

    /**
     * 某个主题下的数据字典（数据分类+数据安全）
     */
    List<DataDictionaryItemDto> selectDataDictionaryByTheme(@Param("themeName") String themeName);
}

