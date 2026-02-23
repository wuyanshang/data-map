package com.aia.ddms.datadistribution.controller;

import com.aia.ddms.datadistribution.dto.*;
import com.aia.ddms.datadistribution.service.DataDistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/data-distribution")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DataDistributionController {

    private final DataDistributionService dataDistributionService;

    /**
     * 安全视角：按安全分级统计字段分布
     */
    @GetMapping("/security")
    public List<SecurityDistributionDto> securityView() {
        return dataDistributionService.getSecurityDistribution();
    }

    /**
     * 业务视角：按业务分类统计字段分布
     */
    @GetMapping("/business")
    public List<BusinessDistributionDto> businessView() {
        return dataDistributionService.getBusinessDistribution();
    }

    /**
     * 属主视角：按数据属主统计字段分布
     */
    @GetMapping("/owners")
    public List<OwnerDistributionDto> ownerView() {
        return dataDistributionService.getOwnerDistribution();
    }

    /**
     * 全局搜索
     *
     * @param type    搜索类型：field / table
     * @param keyword 关键字
     */
    @GetMapping("/global-search")
    public List<GlobalSearchResultDto> globalSearch(
            @RequestParam(name = "type", defaultValue = "field") String type,
            @RequestParam("keyword") String keyword) {
        if ("table".equalsIgnoreCase(type)) {
            return dataDistributionService.globalSearchByTable(keyword);
        }
        return dataDistributionService.globalSearchByField(keyword);
    }

    /**
     * 查询所有主题（顶级分类）
     */
    @GetMapping("/themes")
    public List<ThemeDto> listThemes() {
        return dataDistributionService.listAllThemes();
    }

    /**
     * 查询某个主题下的字段数量和表数量
     */
    @GetMapping("/themes/{themeName}/stats")
    public FieldTableStatDto themeStats(@PathVariable("themeName") String themeName) {
        return dataDistributionService.getFieldAndTableStatByTheme(themeName);
    }

    /**
     * 查询某个主题下的数据字典（数据分类+安全分级）
     */
    @GetMapping("/themes/{themeName}/dictionary")
    public List<DataDictionaryItemDto> themeDictionary(@PathVariable("themeName") String themeName) {
        return dataDistributionService.getDataDictionaryByTheme(themeName);
    }
}

