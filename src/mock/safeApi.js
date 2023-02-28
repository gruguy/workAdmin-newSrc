/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-03 15:00:48
 * @LastEditors: gruguy
 * @LastEditTime: 2022-04-15 12:50:44
 */
import Mock from "mockjs";

export default {
  getExamineList() {
    Mock.Random.extend({
      phone: function() {
        let prefixs = ["132", "135", "189", "180"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
      }
    });
    let rows = [];
    for (let i = 0; i < 10; i++) {
      let temp = Mock.mock({
        "qId|+1": 1,
        "sgender|1": ["男", "女"],
        sName: Mock.Random.cname(),
        sId: Mock.mock(/\d{18}/),
        sTel: Mock.Random.phone(),
        "qscore|50-98": 50
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
