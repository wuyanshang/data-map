package com.aia.ddms.datadistribution.service;

import com.aia.ddms.datadistribution.dto.*;

import java.util.List;

public interface DataDistributionService {

    List<SecurityDistributionDto> getSecurityDistribution();

    List<BusinessDistributionDto> getBusinessDistribution();

    List<OwnerDistributionDto> getOwnerDistribution();

    List<GlobalSearchResultDto> globalSearchByField(String keyword);

    List<GlobalSearchResultDto> globalSearchByTable(String keyword);

    List<ThemeDto> listAllThemes();

    FieldTableStatDto getFieldAndTableStatByTheme(String themeName);

    List<DataDictionaryItemDto> getDataDictionaryByTheme(String themeName);
}

