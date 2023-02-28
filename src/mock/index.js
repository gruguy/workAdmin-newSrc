/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-03 14:57:36
 * @LastEditors: gruguy
 * @LastEditTime: 2022-04-15 12:49:49
 */
import Mock from "mockjs";
import userApi from "./userApi";
import sourceInfoApi from "./sourceInfoApi";
import safeApi from "@/mock/safeApi";

//设置延迟
Mock.setup({
  timeout: "200-600"
});

// 首页相关
// 拦截的是 /home/getData
// Mock.mock(/\/home\/getData/, 'get', homeApi.getStatisticalData)

// 用户相关
Mock.mock(/\/user\/login/, "post", userApi.getUserInfo);
// 资源数据
Mock.mock(/\/source\/getData/, "get", sourceInfoApi.getSourceData);
// 不良记录数据
Mock.mock(/\/source\/getBadRecordList/, "get", sourceInfoApi.getBadRecordList);
// 工种数据
Mock.mock(/\/workType\/getData/, "get", sourceInfoApi.getWorkTypeData);
// 打卡数据
Mock.mock(/\/check\/getData/, "get", sourceInfoApi.getCheckData);
// 薪资数据
Mock.mock(/\/pay\/getData/, "get", sourceInfoApi.getPayData);
// 进场离场
Mock.mock(/\/report\/getData/, "get", sourceInfoApi.getReportAppro);
// 安全考核
Mock.mock(/\/safe\/getData/, "get", safeApi.getExamineList);
