<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <h1 class="title">BitcoinSV Time</h1>

    <div class="units">
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.years }}</span>
        <span class="unit">years</span>
      </div>
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.months }}</span>
        <span class="unit">months</span>
      </div>
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.days }}</span>
        <span class="unit">days</span>
      </div>
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.hours }}</span>
        <span class="unit">hours</span>
      </div>
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.minutes }}</span>
        <span class="unit">minutes</span>
      </div>
      <div class="unit-and-value">
        <span class="cu-unit">{{ timeSinceGenesis.seconds }}</span>
        <span class="unit">seconds</span>
      </div>
      <p class="sinceWhen">since the Bitcoin Genesis Block</p>
    </div>

    <p>
      The current block height is:
      <span class="computed-unit">{{ blockHeight }}</span>
    </p>
    <p>
      Block #
      <span class="computed-unit">{{ blockHeight - 1 }}</span>
      was found:
      <span class="computed-unit">{{ time2TimeAgo }}</span>
    </p>
    <p>
      Current date/time is:
      <span class="computed-unit">{{ formatDateTime }}</span>
    </p>
    <div class="money-button-container">
      <MoneyButton
        class="money-button"
        to="9338"
        amount="0.5"
        currency="USD"
        label="Pizza"
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
      var nowTs = Math.floor(d.getTime() / 1000);
      // getTime() returns milliseconds, and we need seconds, hence the
      // Math.floor and division by 1000
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
    minutesAfterDaysMonthsAndYearsSinceGenesis() {
      let minutes = differenceInMinutes(
        this.currentTime,
        this.timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis
      );
      console.log("minutesAfterDaysMonthsAndYearsSinceGenesis are: ", minutes);
      return minutes;
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

      console.log("hours are: ", hours);

      // if the hours are negative or zero then we have to check the minutes
      // because hours between -1 and 1 return -0 or 0,
      if (hours <= 0) {
        // Check the minutes here
        minutes = this.minutesAfterDaysMonthsAndYearsSinceGenesis;

        // if minutes are negative the calendarDay calculation went too far
        // in the future so adjust everything by a day
        if (minutes < 0) {
          console.log("1 Day off Adjustment");
          // subtract 1 day
          days -= 1;

          // get a new time for DaysAgo
          let timeDaysAgo = subDays(
            this.timeAtCalendarDaysAfterMonthsAndYearsSinceGenesis,
            1
          );
          console.log("Adjusted timeDaysAgo is: ", timeDaysAgo);

          // Adjust hours based on this new Time
          hours = differenceInHours(this.currentTime, timeDaysAgo);
          console.log("Adjusted hours are: ", hours);

          // Get new timeHoursAgo, add hours to new timeDaysAgo
          let timeHoursAgo = addHours(timeDaysAgo, hours);
          console.log("Adjusted timeHoursAgo is: ", timeHoursAgo);

          minutes = differenceInMinutes(this.currentTime, timeHoursAgo);
          console.log("Adjusted minutes are: ", minutes);

          let timeMinutesAgo = addMinutes(timeHoursAgo, minutes);
          console.log("Adjusted timeMinutesAgo is: ", timeMinutesAgo);

          seconds = differenceInSeconds(this.currentTime, timeMinutesAgo);
          console.log("Adjusted minutes are: ", seconds);

          let bitcoinTime = {
            years: years,
            months: months,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          };

          return bitcoinTime;
        }
      }

      let bitcoinTime = {
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };

      return bitcoinTime;
    },

    formatDateTime: function() {
      var thisDateTime = new Date();
      return thisDateTime.toLocaleString();
    },
    handlePayment() {
      console.log("Test");
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
  background: #1d1919;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  width: 100%;
  height: 100vh;
}

.title,
.computed-unit {
  color: #ee75ad;
  font-weight: bold;
  /* padding-top: 60px; */
}

.calculated-units,
.units {
  display: flex;
  justify-content: center;
}

.units {
  display: flex;
  flex-wrap: wrap;

  @media min-width:768px {
    border: 1px solid red;
  }
}

.unit-and-value {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 30%;
  margin-bottom: 16px;
}

.cu-unit {
  color: #ee75ad;
  font-weight: bold;
  margin-right: 4px;
}

.sinceWhen {
  margin: 0 auto;
  margin-bottom: 16px;
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
