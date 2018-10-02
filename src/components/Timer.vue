<template>
	<div class="timer">
		<span> {{minutes}} : {{seconds}}</span>
	</div>
</template>

<script>
import Timer from '../utils/time/timer'

export default {
  name: 'Timer',
  props: {
  },
  data() {
	  return {
		  minutes: '00',
		  seconds: '00',
		  lastMinute: false
	  }
  },
  methods: {
		callBackTimer: function(event) {
			switch(event.type){
				case'endCountDown':
				break;
				case 'time':
					this.minutes = event.value.minutes;
					this.seconds = event.value.seconds;
					this.lastMinute = event.value.lastMinute;
				break;
			}
		}
	},
	mounted() {

		new Timer(this.callBackTimer.bind(this));
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.timer {
	position: absolute;
	width: 100%;
	top: 0;
	left: 0;
	height: 200px;
}
.timer span{
	color: white;
	font-size: 40pt;
}
</style>
