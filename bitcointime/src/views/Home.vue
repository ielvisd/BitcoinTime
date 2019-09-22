<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <h1>Bitcoin Time</h1>
    <p>
      <strong>{{ timeSinceGenesis }}</strong>
      <br />since the Bitcoin Genesis Block
    </p>
    <p>The current block height is: {{ blockHeight }}</p>
    <p>
      Block #{{ blockHeight - 1 }} was found:
      {{ time2TimeAgo }}
    </p>
    <p>
      Current date/time is:
      {{ formatDateTime }}
    </p>
    <div class="money-button-container">
      <MoneyButton
        class="money-button"
        to="9338"
        amount="0.5"
        currency="USD"
        label="Coffee & Dog Treats"
        client-identifier="7abb533316d7a3c5804aa83201a3e29b"
        button-id="1568596625967"
        button-data="{}"
        type="tip"
        editable="true"
        @payment="handlePayment"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";
import MoneyButton from "vue-money-button";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  fromUnixTime,
  subDays,
  addYears,
  addDays,
  addMinutes,
  addMonths,
  addHours,
  addSeconds
} from "date-fns";
var query = {
  v: 3,
  q: { find: {}, limit: 1 }
};
var b64 = btoa(JSON.stringify(query));
var url = process.env.VUE_APP_API_URL + b64;
var config = {
  headers: { key: process.env.VUE_APP_API_KEY }
};
var genesisTime = 1231006505;
var genesisFromUnixTime = fromUnixTime(genesisTime);
console.log("genesisTime is: ", genesisTime);
export default {
  name: "App",
  components: { MoneyButton },
  data() {
    return {
      info: null,
      time: "",
      blockNumber: "",
      currentTime: new Date()
    };
  },
  computed: {
    blockTime() {
      if (this.info === null) {
        return;
      } else {
        let time = this.info;
        return time.t;
      }
    },
    blockHeight() {
      if (this.info === null) {
        return;
      } else {
        let time = this.info;
        return time.i;
      }
    },
    timeSinceDiscovered() {
      if (this.info === null) {
        return;
      } else {
        let time = this.info;
        return time.t;
      }
    },
    time2TimeAgo() {
      // This function computes the delta between the
      // provided timestamp and the current time, then test
      // the delta for predefined ranges.
      var d = new Date(); // Gets the current time
      var nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
      var seconds = nowTs - this.timeSinceDiscovered;
      // more that two days
      if (seconds > 2 * 24 * 3600) {
        return "a few days ago";
      }
      // a day
      else if (seconds > 24 * 3600) {
        return "yesterday";
      } else if (seconds > 3600) {
        return "a few hours ago";
      } else if (seconds > 120) {
        return Math.floor(seconds / 60) + " minutes ago";
      } else if (seconds > 60) {
        return Math.floor(seconds / 60) + " minute ago";
      } else {
        return seconds + " seconds ago";
      }
    },
    calendarYearsSinceGenesis() {
      console.log("the currentTime is: ", this.currentTime);

      let years = differenceInCalendarYears(
        this.currentTime,
        genesisFromUnixTime
      );
      console.log("calendarYearsSinceGenesis are: ", years);
      return years;
    },
    timeAtCalendarYearsSinceGenesis() {
      let timeYearsAgo = addYears(
        genesisFromUnixTime,
        this.calendarYearsSinceGenesis
      );
      console.log(`timeAtCalendarYearsSinceGenesis was: ${timeYearsAgo}`);
      return timeYearsAgo;
    },
    calendarMonthsAfterYearsSinceGenesis() {
      let months = differenceInCalendarMonths(
        this.currentTime,
        this.timeAtCalendarYearsSinceGenesis
      );
      console.log("calendarMonthsAfterYearsSinceGenesis are: ", months);
      return months;
    },
    timeAtCalendarMonthsPlusYearsSinceGenesis() {
      let timeMonthsAgo = addMonths(
        this.timeAtCalendarYearsSinceGenesis,
        this.calendarMonthsAfterYearsSinceGenesis
      );
      console.log(
        `timeAtCalendarMonthsPlusYearsSinceGenesis was: ${timeMonthsAgo}`
      );
      return timeMonthsAgo;
    },
    calendarDaysAfterMonthsAndYearsSinceGenesis() {
      let days = differenceInCalendarDays(
        this.currentTime,
        this.timeAtCalendarMonthsPlusYearsSinceGenesis
      );
      console.log("calendarDaysAfterMonthsAndYearsSinceGenesis are: ", days);
      return days;
    },
    timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis() {
      let timeDaysAgo = addDays(
        this.timeAtCalendarMonthsPlusYearsSinceGenesis,
        this.calendarDaysAfterMonthsAndYearsSinceGenesis
      );
      console.log(
        `timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis was: ${timeDaysAgo}`
      );
      return timeDaysAgo;
    },
    hoursAfterDaysMonthsAndYearsSinceGenesis() {
      let hours = differenceInHours(
        this.currentTime,
        this.timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis
      );
      console.log("hoursAfterDaysMonthsAndYearsSinceGenesis are: ", hours);
      return hours;
    },
    timeAtHoursAfterDaysMonthsAndYearsSinceGenesis() {
      let timeHoursAgo = addHours(
        this.timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis,
        this.hoursAfterDaysMonthsAndYearsSinceGenesis
      );
      console.log(
        `timeAtHoursAfterDaysMonthsAndYearsSinceGenesis was: ${timeHoursAgo}`
      );
      return timeHoursAgo;
    },
    minutesAfterHoursDaysMonthsAndYearsSinceGenesis() {
      let minutes = differenceInMinutes(
        this.currentTime,
        this.timeAtHoursAfterDaysMonthsAndYearsSinceGenesis
      );
      console.log(
        "minutesAfterHoursDaysMonthsAndYearsSinceGenesis are: ",
        minutes
      );
      return minutes;
    },
    timeAtMinutesAfterHoursDaysMonthsAndYearsSinceGenesis() {
      let timeMinutesAgo = addMinutes(
        this.timeAtHoursAfterDaysMonthsAndYearsSinceGenesis,
        this.minutesAfterHoursDaysMonthsAndYearsSinceGenesis
      );
      console.log(
        `timeAtMinutesAfterHoursDaysMonthsAndYearsSinceGenesis was: ${timeMinutesAgo}`
      );
      return timeMinutesAgo;
    },
    secondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis() {
      let seconds = differenceInSeconds(
        this.currentTime,
        this.timeAtMinutesAfterHoursDaysMonthsAndYearsSinceGenesis
      );
      console.log(
        "secondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis are: ",
        seconds
      );
      return seconds;
    },
    timeAtSecondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis() {
      let timeSecondsAgo = addSeconds(
        this.timeAtMinutesAfterHoursDaysMonthsAndYearsSinceGenesis,
        this.secondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis
      );
      console.log(
        `timeAtSecondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis was: ${timeSecondsAgo}`
      );
      return timeSecondsAgo;
    },

    timeSinceGenesis() {
      console.log(
        `the Bitcoin Genesis Block was mined on: ${genesisFromUnixTime}`
      );

      let years = this.calendarYearsSinceGenesis;

      let months = this.calendarMonthsAfterYearsSinceGenesis;

      let days = this.calendarDaysAfterMonthsAndYearsSinceGenesis;

      let hours = this.hoursAfterDaysMonthsAndYearsSinceGenesis;

      let minutes = this.minutesAfterHoursDaysMonthsAndYearsSinceGenesis;

      let seconds = this.secondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis;

      // Should be the same as currentTime
      let finalTime = this
        .timeAtSecondsAfterMinutesHoursDaysMonthsAndYearsSinceGenesis;

      console.log("finalTime is: ", finalTime);

      // if the hours are negative, then adjust everything from days down
      if (hours < 0) {
        console.log("1 Day off Adjustment");
        // subtract 1 day
        days -= 1;

        // get a new time for DaysAgo
        let timeDaysAgo = subDays(
          this.timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis,
          1
        );
        console.log("timeDaysAgo is: ", timeDaysAgo);

        // Adjust hours based on this new Time
        hours = differenceInHours(this.currentTime, timeDaysAgo);
        console.log("hours are: ", hours);

        // Get new timeHoursAgo, add hours to new timeDaysAgo
        let timeHoursAgo = addHours(timeDaysAgo, hours);
        console.log("timeHoursAgo is: ", timeHoursAgo);

        minutes = differenceInMinutes(this.currentTime, timeHoursAgo);
        console.log("minutes are: ", minutes);

        let timeMinutesAgo = addMinutes(timeHoursAgo, minutes);
        console.log("timeMinutesAgo is: ", timeMinutesAgo);

        seconds = differenceInSeconds(this.currentTime, timeMinutesAgo);
        console.log("minutes are: ", seconds);
      }

      return `${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    },
    formatDateTime: function() {
      var thisDateTime = new Date();
      return thisDateTime.toLocaleString();
    },
    handlePayment() {
      console.log("Paid!");
      return true;
    }
  },

  mounted() {
    axios
      .get(url, config)
      .then(response => (this.info = response.data.c[0].blk));
  }
};
</script>

<style>
#app {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  margin-top: 60px;
  text-align: center;
  width: 100%;
}

.money-button-container {
  margin: 0 auto;
  max-width: 150px;
}

.money-button {
  max-width: 100px;
  margin-left: -54px;
}
</style>
