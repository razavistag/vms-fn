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

    <!-- EVENT CALANDER -->
    <v-row>
      <v-col md="8" sm="8" cols="12">
        <v-sheet height="64" class="eventSheet">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600" class="eventSheet">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-card-text>
                <span v-html="selectedEvent.name"></span>
              </v-card-text>
            </v-card>
          </v-menu> </v-sheet
      ></v-col>
      <v-col md="3" sm="3" cols="12" class="activituWrapper">
        <v-card color="white" min-width="350px" flat>
          <v-card-text>
            ACTIVITIES
          </v-card-text>
        </v-card>
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

      // EVENT CALANDER

      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
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
.eventSheet{
  margin-left: 40px;
}
</style>
