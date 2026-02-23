package com.aia.ddms.datadistribution.service.impl;

import com.aia.ddms.datadistribution.dto.*;
import com.aia.ddms.datadistribution.mapper.DataDistributionMapper;
import com.aia.ddms.datadistribution.service.DataDistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataDistributionServiceImpl implements DataDistributionService {

    private final DataDistributionMapper dataDistributionMapper;

    @Override
    public List<SecurityDistributionDto> getSecurityDistribution() {
        return dataDistributionMapper.selectSecurityDistribution();
    }

    @Override
    public List<BusinessDistributionDto> getBusinessDistribution() {
        return dataDistributionMapper.selectBusinessDistribution();
    }

    @Override
    public List<OwnerDistributionDto> getOwnerDistribution() {
        return dataDistributionMapper.selectOwnerDistribution();
    }

    @Override
    public List<GlobalSearchResultDto> globalSearchByField(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return Collections.emptyList();
        }
        return dataDistributionMapper.searchByField(keyword);
    }

    @Override
    public List<GlobalSearchResultDto> globalSearchByTable(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return Collections.emptyList();
        }
        return dataDistributionMapper.searchByTable(keyword);
    }

    @Override
    public List<ThemeDto> listAllThemes() {
        return dataDistributionMapper.selectAllThemes();
    }

    @Override
    public FieldTableStatDto getFieldAndTableStatByTheme(String themeName) {
        if (!StringUtils.hasText(themeName)) {
            return null;
        }
        return dataDistributionMapper.selectFieldAndTableStatByTheme(themeName);
    }

    @Override
    public List<DataDictionaryItemDto> getDataDictionaryByTheme(String themeName) {
        if (!StringUtils.hasText(themeName)) {
            return Collections.emptyList();
        }
        return dataDistributionMapper.selectDataDictionaryByTheme(themeName);
    }
}

