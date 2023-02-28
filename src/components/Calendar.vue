<template>
  <vue-cal
    selected-date=""
    :time-from="9 * 60"
    :hideViewSelector="true"
    :disable-views="['years', 'year', 'week', 'day']"
    default-view="month"
    @view-change="viewChangeF"
    :events-on-month-view="['short']"
    :events="events"
    :locale="locale"
    style="height: 650px"
  >
  </vue-cal>
</template>
<script>
import VueCal from "vue-cal";
import "vue-cal/dist/i18n/zh-cn.js";
import "vue-cal/dist/vuecal.css";

export default {
  props: ["month"],
  components: { VueCal },
  data: () => ({
    locale: "zh-cn",
    events: [],
    currentMonth: "",
    calendarData: [],
    personId: "",
  }),
  mounted() {
    this.currentMonth = this.month;
    // this.getCalendarEvents(this.currentMonth);
  },
  methods: {
    loadData(id) {
      this.personId = id;
      this.getCalendarEvents(this.currentMonth, id);
    },
    formatCanData(data) {
      let type = { 1: "sport", 2: "leisure", 3: "health" };
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          start: data[i].clockTime + " " + data[i].clockDateStart,
          end: data[i].clockTime + " " + data[i].clockDateEnd,
          title: `工时：${data[i].longTime}` || "暂无主题信息",
          content: `薪资：${data[i].countPrice}`,
          class: type[data[i].empWorkType],
        });
      }
      this.events = arr;
      console.log(this.events);
    },

    getCalendarEvents(month, id) {
      console.log(month);
      this.$axios
        .get("/clockRecordController/priceCount", {
          params: { searchMonth: month, personalId: id },
        })
        .then((res) => {
          if (res.code === 1) {
            console.log(res.data);
            this.calendarData = res.value;
            this.formatCanData(this.calendarData);
          }
        });
    },
    viewChangeF($event) {
      let yearMonth = $event.startDate;
      let year = yearMonth.getFullYear();
      let month = yearMonth.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      this.currentMonth = year + "-" + month;
      this.getCalendarEvents(this.currentMonth, this.personId);
      console.log(this.currentMonth);
    },
  },
};
</script>
<style>
.vuecal__event {
  background-color: rgba(164, 230, 210, 0.9);
  border: 1px solid #90d2be;
  margin-bottom: 5px;
}
.vuecal__event.sport {
  background-color: hsla(0, 100%, 70%, 0.85);
  border: 1px solid #eb5252;
  color: #fff;
}
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.85);
  border: 1px solid #e9882e;
  color: #fff;
}
.vuecal__title-bar {
  background-color: #3377ca;
  color: #fff;
  height: 50px;
}
.vuecal--month-view .vuecal__cell {
  height: auto !important;
}
</style>
