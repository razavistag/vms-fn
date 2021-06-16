<template>
  <div id="Dashboard">
    <!-- Layout -->
    <DashboardLayout />
    <v-row class="pt-10">
      <!-- Dashboard Title -->
      <v-col md="12" sm="12" cols="12" class="text-uppercase text-center">
        <h2>WELCOME TO VISTA GLOBAL CONSULT</h2>
        <p>
          THIS DASHBOARD SHOWS VISTA GLOBAL CONSULT'S OPEN STATEMENT UP TO
          MONDAY 14TH OF JUNE 2021 06:53:45 PM STATEMENT
        </p>
      </v-col>
    </v-row>

    <!-- CARDS -->
    <v-row>
      <v-col md="12" sm="12" cols="12" class="orderCardContainer">
        <div class="cardWrapper" v-for="(item, index) in cardList" :key="index">
          <div class="wrapper">
            <div class="title">{{ item.title }}</div>
            <div class="icon">
              <v-icon size="45" :color="item.color">{{ item.icon }}</v-icon>
            </div>
            <div class="mainCount">
              <span :class="item.color + '--text'">{{
                parseInt(item.release) + parseInt(item.bulk)
              }}</span>
            </div>
          </div>
          <div class="subCount">
            <div class="el_1">
              Release <br />
              {{ item.release }}
            </div>
            <div class="el_1">
              Bulk <br />
              {{ item.bulk }}
            </div>
            <div class="el_1">
              Disribution <br />
              {{ item.distribution }}
              <v-icon size="10" color="#62cb31">mdi-escalator-up</v-icon>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- ORDER ENTERY CHART -->
    <v-row class="ma-10">
      <v-col md="12" sm="12" cols="12" class="white ">
        <apexchart
          width="100%"
          height="200"
          type="line"
          :options="OE_ChartOptions"
          :series="OE_Series"
        ></apexchart>
      </v-col>
    </v-row>

    <!-- SALES ORDER CHART -->
    <v-row class="ma-10">
      <v-col md="12" sm="12" cols="12" class="white ">
        <apexchart
          width="100%"
          height="200"
          type="line"
          :options="SO_ChartOptions"
          :series="SO_Series"
        ></apexchart>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";

export default {
  name: "Dashboard", //ORDER DASHBOARD
  components: {
    DashboardLayout,
  },
  data() {
    return {
      OE_ChartOptions: {
        title: {
          text: "ORDER ENTRY (in number of styles)",
          align: "center",
          margin: 10,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          symbolRadius: 0,
        },

        chart: {
          id: "VMS-ORDER-ENTRY",
        },
        xaxis: {
          categories: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
        },
      },

      OE_Series: [
        {
          name: "Shiyam",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 26, 14, 80, 45],
        },
        {
          name: "Rizkan",
          data: [10, 60, 20, 25, 56, 40, 30, 50, 15, 71, 69, 84],
        },
        {
          name: "Imaam",
          data: [20, 40, 35, 72, 52, 17, 72, 25, 80, 43, 79, 80],
        },
      ],

      SO_ChartOptions: {
        title: {
          text: "SALES ORDER (in number of styles)",
          align: "center",
          margin: 10,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          symbolRadius: 0,
        },

        chart: {
          id: "VMS-SALES-ORDER",
        },
        xaxis: {
          categories: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
        },
      },

      SO_Series: [
        {
          name: "Shiyam",
          data: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
        },
        {
          name: "Rizkan",
          data: [60, 55, 70, 45, 40, 35, 30, 25, 20, 15, 10, 5],
        },
        {
          name: "Imaam",
          // data: [20, 40, 35, 72, 52, 17, 72, 25, 80, 43, 79, 80],
          data: [5, 10, 20, 30, 40, 30, 35, 70, 80, 30, 100, 110],
        },
      ],
      cardList: [
        {
          title: "RECEIVED",
          icon: "mdi-script-text-outline",
          color: "green",
          release: "40",
          bulk: "7",
          distribution: "0",
        },
        {
          title: "WORKING",
          icon: "mdi-database",
          color: "orange",
          release: "7",
          bulk: "3",
          distribution: "0",
        },
        {
          title: "COMPLETED",
          icon: "mdi-cash-multiple",
          color: "blue",
          release: "21",
          bulk: "7",
          distribution: "0",
        },
        {
          title: "RE-OPEND",
          icon: "mdi-alert-octagon-outline",
          color: "orange",
          release: "0",
          bulk: "0",
          distribution: "0",
        },
        {
          title: "PENDING",
          icon: "mdi-alert-outline",
          color: "red",
          release: "6",
          bulk: "45",
          distribution: "0",
        },
        {
          title: "NEED REVISED",
          icon: "mdi-bookmark-minus-outline",
          color: "green",
          release: "0",
          bulk: "0",
          distribution: "0",
        },
      ],
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {},
};
</script>

<style lang="scss">
#Dashboard {
  background: #f1f3f6;
  height: 100%;
}
.orderCardContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.cardWrapper {
  margin: 10px;
  border: 1px solid #eaeaea;
  background: #fff;
  padding: 10px;
  // margin-left: 40px;
  min-width: 210px;
  min-height: 120px;
}
.cardWrapper .wrapper {
  display: flex;
  justify-content: space-between;
}
.cardWrapper .wrapper .title {
  font-size: 12px;
  position: relative;
}
.cardWrapper .wrapper .icon {
  position: relative;
  margin-top: 5px;
  margin-right: 5px;
}
.cardWrapper .wrapper .mainCount {
  position: absolute;
  margin-top: 27px;
  // color: #62cb31;
  font-size: 25px;
}

.cardWrapper .subCount {
  // background: red;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.cardWrapper .subCount .el_1 {
  font-size: 10px;
}
.eventCalanderWrapper {
  min-width: 1200px;
}
.eventSheet {
  margin-left: 40px;
}
</style>
