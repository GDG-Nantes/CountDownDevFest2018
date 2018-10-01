<template>
    <div class="loader">
        <div class="loader-circle">
            <div>
            <div class="loader moon-loader">
                <div class="loader-circle">
                <div class="loader-moon-size"></div>
                </div>
            </div>
            </div>
        </div>

        <div class="loader-sun"></div>
    </div>
</template>


<script>
export default {
  name: 'Wait'
}
</script>

<style scoped>

.loader {
  position: absolute;
  top: 50%;
  margin-top: -35px;
  left: 50%;
  margin-left: -35px;
  width: 70px;
  height: 70px;
}

.moon-loader {
  margin-top: -17px;
  margin-left: -17px;
  width: 34px;
  height: 34px;
}

.loader-circle {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(254, 254, 254, 0.21);
  animation: rotate 2.1s infinite;
  animation-timing-function: linear;
}
.loader-circle > div {
  position: absolute;
  width: 10px;
  height: 10px;
  margin-left: 5px;
  border-radius: 50%;
  background-color: #fefefe;
}
.loader-circle > div.loader-moon-size {
  width: 5px;
  height: 5px;
  margin-left: 2.5px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.loader-sun {
  position: absolute;
  left: 50%;
  margin-left: -9.5px;
  top: 50%;
  margin-top: -9.5px;
  width: 21px;
  height: 21px;
  background-color: #fefefe;
  border-radius: 50%;
}

</style>