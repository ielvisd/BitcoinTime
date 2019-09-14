<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <h1>Bitcoin Time</h1>
    <p>
      It's been
      <strong>{{ timeSinceGenesis }}</strong>
      since the Genesis Block
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
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  fromUnixTime,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears
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
  components: {},
  data() {
    return {
      info: null,
      time: "",
      blockNumber: ""
    };
  },
  computed: {
    blockTime: function() {
      if (this.info === null) {
        return;
      } else {
        let time = this.info;
        return time.t;
      }
    },
    blockHeight: function() {
      if (this.info === null) {
        return;
      } else {
        let time = this.info;
        return time.i;
      }
    },
    timeSinceDiscovered: function() {
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
      } else if (seconds > 1800) {
        return "Half an hour ago";
      } else if (seconds > 120) {
        return Math.floor(seconds / 60) + " minutes ago";
      } else if (seconds > 60) {
        return Math.floor(seconds / 60) + " 1 minute ago";
      } else {
        return seconds + " seconds ago";
      }
    },
    timeSinceGenesis() {
      console.log(
        `the Bitcoin Genesis Block was mined on: ${genesisFromUnixTime}`
      );
      var now = new Date();
      console.log("The date/time is: ", now);
      var years = differenceInCalendarYears(now, genesisFromUnixTime);
      console.log(
        `It's been at least ${years} years since the Bitcoin Genesis Block"`
      );
      var timeYearsAgo = subYears(now, years);
      console.log(`The time after ${years} years ago is ${timeYearsAgo}`);

      var months = differenceInCalendarMonths(
        timeYearsAgo,
        genesisFromUnixTime
      );

      console.log(
        `The number of months between ${years} years ago and when the Bitcoin Genesis Block was mined is at least: ${months}
      `
      );

      var timeMonthsAgo = subMonths(timeYearsAgo, months);
      console.log(
        "The time after " +
          years +
          " years " +
          months +
          " months ago is " +
          timeMonthsAgo
      );

      var days = differenceInCalendarDays(timeMonthsAgo, genesisFromUnixTime);

      console.log(
        `The number of days between ${years} years, ${months} months ago and when the Bitcoin Genesis Block was mined is at least: ${days}.`
      );

      var timeDaysAgo = subDays(timeMonthsAgo, days);

      console.log(
        `The time after ${years} years, ${months} months & ${days} days and when the Bitcoin Genesis Block was mined is: ${timeDaysAgo}.`
      );

      var hours = differenceInHours(timeDaysAgo, genesisFromUnixTime);

      console.log(
        `The number of hours between ${years} years, ${months} months and ${days} days ago and when the Bitcoin Genesis Block was mined is at least: ${hours}.`
      );

      var timeHoursAgo = subHours(timeDaysAgo, hours);

      console.log(
        `The time after ${years} years, ${months} months, ${days} days & ${hours} hours and when the Bitcoin Genesis Block was mined is: ${timeHoursAgo}.`
      );

      var minutes = differenceInMinutes(timeHoursAgo, genesisFromUnixTime);

      console.log(
        `The number of minutes between ${years} years, ${months} months, & ${days} days ago and when the Bitcoin Genesis Block was mined is at least: ${minutes}.`
      );

      var timeMinutesAgo = subMinutes(timeHoursAgo, minutes);

      console.log(
        `The time after ${years} years, ${months} months, ${days} days ${hours} hours & ${minutes} minutes and when the Bitcoin Genesis Block was mined is: ${timeMinutesAgo}.`
      );

      var seconds = differenceInSeconds(timeMinutesAgo, genesisFromUnixTime);

      console.log(
        `The number of seconds between ${years} years, ${months} months, ${days} days ago & ${minutes} ago and when the Bitcoin Genesis Block was mined is at least: ${seconds}.`
      );

      return `${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    },
    formatDateTime: function() {
      var thisDateTime = new Date();
      return thisDateTime.toLocaleString();
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
