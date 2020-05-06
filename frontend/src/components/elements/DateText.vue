<template>
  <!-- This needs to be on one line -->
  <h1 class="text-xl font-semibold cursor-pointer" @click="gotoGoogleCalendar">
    {{ day }}
    <sup>{{ nth }}</sup>
    {{ monthYear }}
  </h1>
</template>

<script>
export default {
  name: "DateText",
  props: {
    d: Date
  },
  computed: {
    day: function() {
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      return `${days[this.d.getDay()]}, ${this.d.getDate()}`;
    },
    nth: function() {
      var d = this.d.getDate();
      if (d.get > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    monthYear: function() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return `${months[this.d.getMonth()]} ${this.d.getFullYear()}`;
    }
  },
  methods: {
    gotoGoogleCalendar: function() {
      window.location = "https://calendar.google.com/calendar/r";
    }
  }
};
</script>