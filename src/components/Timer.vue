<template>
	<div class="timer" v-bind:class="{'last-minute': lastMinute}">
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
					this.$emit('end-count-down');
				break;
				case 'time':
					this.minutes = event.value.minutes;
					this.seconds = event.value.seconds;
					this.lastMinute = event.value.lastMinute;
					this.$emit('timer-update',{
						diff: event.value.diff
					});
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


.last-minute {
    color: red;
    animation: blink 1s linear infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

</style>
