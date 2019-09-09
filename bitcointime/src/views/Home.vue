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
    <p>The current block height is: 
    {{ blockHeight }}</p>
    <p>    
      Block #{{blockHeight - 1}} was found: 
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

import axios from 'axios';
import { differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears, differenceInHours, differenceInMinutes, differenceInSeconds, fromUnixTime, subDays, subHours, subMinutes, subMonths, subYears } from 'date-fns'
var query = {
  v: 3,
  q: { find: {}, limit: 1 }
};
var b64 = btoa(JSON.stringify(query));
var url = process.env.VUE_APP_API_URL + b64;
var config = {
  headers: { 'key' : process.env.VUE_APP_API_KEY }
};
var genesisTime = (1231006505);
var genesisFromUnixTime = fromUnixTime(genesisTime)
// eslint-disable-next-line no-console
console.log('genesisTime is: ', genesisTime);
export default {
  name: 'app',
  data () {
    return {
      info: null,
      time: '',
      blockNumber: ''
    }
  },
  computed: {
    blockTime: function () {
      if (this.info === null) {
        return 
      }
      else {
        let time = this.info;
        return time.t
      }
    },
    blockHeight: function () {
      if (this.info === null) {
        return 
      }
      else {
        let time = this.info;
        return time.i
      }
    },
    timeSinceDiscovered: function () {
        if (this.info === null) {
        return 
      }
      else {
        let time = this.info;
        return time.t
      }
    },
    time2TimeAgo() {
    // This function computes the delta between the
    // provided timestamp and the current time, then test
    // the delta for predefined ranges.
    var d=new Date();  // Gets the current time
    var nowTs = Math.floor(d.getTime()/1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
    var seconds = nowTs-this.timeSinceDiscovered;
    // more that two days
    if (seconds > 2*24*3600) {
       return "a few days ago";
    }
    // a day
    else if (seconds > 24*3600) {
       return "yesterday";
    }
    else if (seconds > 3600) {
       return "a few hours ago";
    }
    else if (seconds > 1800) {
       return "Half an hour ago";
    }
    else if (seconds > 120) {
       return  Math.floor(seconds/60) + " minutes ago";
    }
    else if (seconds > 60) {
       return  Math.floor(seconds/60) + " 1 minute ago";
    }
    else  {
       return seconds + " seconds ago";
    }
},
    timeSinceGenesis() {
    // eslint-disable-next-line no-console
    console.log('genesisFromUnixTime is: ', genesisFromUnixTime);
    var now = new Date();
    var years = differenceInCalendarYears(now, genesisFromUnixTime)
    var timeYearsAgo = subYears(now, years);
    var months = differenceInCalendarMonths(timeYearsAgo, genesisFromUnixTime)
    var timeMonthsAgo = subMonths(timeYearsAgo, months);
    // eslint-disable-next-line no-console
    console.log('timemonthsago is: ', timeMonthsAgo);
    var days = differenceInCalendarDays(timeMonthsAgo, genesisFromUnixTime);
    var timeDaysAgo = subDays(timeMonthsAgo, (days-1));
    // eslint-disable-next-line no-console
    console.log('timeDaysAgo is: ', timeDaysAgo);
    var hours = differenceInHours(timeDaysAgo, genesisFromUnixTime);
    var timeHoursAgo = subHours(timeDaysAgo, hours);
    var minutes = differenceInMinutes(timeHoursAgo, genesisFromUnixTime);
    var timeMinutesAgo = subMinutes(timeHoursAgo, minutes);
    var seconds = differenceInSeconds(timeMinutesAgo, genesisFromUnixTime);
    // var timeSecondsAgo = subSeconds(timeMinutesAgo, seconds);
    return years + ' years, ' + months + ' months, ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds'
},
    formatDateTime: function() {
      var thisDateTime = new Date();
      return thisDateTime.toLocaleString();
    }
  },
  components: {
  },
  mounted () {
    axios
      .get(url, config)
      .then(response => (this.info = response.data.c[0].blk))
  }
 }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
