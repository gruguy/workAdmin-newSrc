/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-03 15:00:48
 * @LastEditors: gruguy
 * @LastEditTime: 2022-04-13 17:04:58
 */
import Mock from "mockjs";

export default {
  getSourceData() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        "sgender|1": ["男", "女"],
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sWorkType|1": ["棉农", "果农"],
        sreport: Mock.Random.image("400X200", "#ccc", `体检报告${i + 1}`)
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  },
  getWorkTypeData() {
    let rows = [];
    for (let i = 0; i < 4; i++) {
      let temp = Mock.mock({
        "sTypeId|+1": 1,
        "sWorkType|1": ["棉农", "果农", "浇水", "施肥"]
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };
    return data;
  },

  getCheckData() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sDept|1": ["部门1", "部门2", "部门3", "部门4"],
        "sWorkType|1": ["棉农", "果农"],
        checkDate: "@now(yyyy-MM-dd)",
        "AMCheckTime|+1": "@now(HH:mm:ss)",
        "PMCheckTime|+1": "@now(HH:mm:ss)"
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  },

  getPayData() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sDept|1": ["部门1", "部门2", "部门3", "部门4"],
        "sWorkType|1": ["棉农", "果农"],
        "shouldPay|5000-8000": 5000,
        "offdays|0-5": 0,
        "checkOffTimes|0-6": 0,
        "checkOffPrice|0-200": 0,
        "realPay|4800-8000": 5000,
        "isPayed|1": ["是", "否"],
        paytime: "@now(yyyy-MM-dd HH:mm:ss)"
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  },
  getPayHistoryData() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sDept|1": ["部门1", "部门2", "部门3", "部门4"],
        "sWorkType|1": ["棉农", "果农"],
        "shouldPay|5000-8000": 5000,
        "offdays|0-5": 0,
        "checkOffTimes|0-6": 0,
        "checkOffPrice|0-200": 0,
        "realPay|4800-8000": 5000,
        "isPayed|1": ["是", "否"],
        paytime: "@now(yyyy-MM-dd)"
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  },
  getReportAppro() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sgender|1": ["男", "女"],
        "sDept|1": ["部门1", "部门2", "部门3", "部门4"],
        "sWorkType|1": ["棉农", "果农"],
        "sage|25-60": 40,
        aprotime: "@now(yyyy-MM-dd)",
        "shouldPay|5000-8000": 5000,
        "offdays|0-5": 0,
        "checkOffTimes|0-6": 0,
        "checkOffPrice|0-200": 0,
        "realPay|4800-8000": 5000,
        "isPayed|1": ["是", "否"],
        paytime: "@now(yyyy-MM-dd)"
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  },
  getBadRecordList() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "sId|+1": 1,
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "sgender|1": ["男", "女"],
        "sDept|1": ["部门1", "部门2", "部门3", "部门4"],
        "sWorkType|1": ["棉农", "果农"],
        "sage|25-60": 40,
        aprotime: "@now(yyyy-MM-dd)",
        "shouldPay|5000-8000": 5000,
        "offdays|0-5": 0,
        "checkOffTimes|0-6": 0,
        "checkOffPrice|0-200": 0,
        "realPay|4800-8000": 5000,
        "badType|1": ["在岗履职差", "身体状态不佳", "存在违法违纪行为"],
        badtime: "@now(yyyy-MM-dd)"
      });
      rows.push(temp);
    }
    let data = {
      code: 1,
      value: {
        page: 1,
        total: 10,
        rows: rows
      }
    };

    return data;
  }
};
