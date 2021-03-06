'use strict';

export default class Timer {
    constructor(callback){
        // Target Time : '2018-10-18T09:00:00'
        this.targetDate = new Date('2018-10-18T09:15:00');
        this.callback = callback;
        this.checkTime();
    }

    checkTime() {
        const now = Date.now();
        if (now > this.targetDate.getTime()){
            this.callback({
                type: 'endCountDown',
                value: true
            });
            return;
        }

        let diff = this.targetDate.getTime() - now;
        const minutes = new Intl.NumberFormat("fr", {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            .format(Math.floor(diff / (60 * 1000)));
        const seconds = new Intl.NumberFormat("fr", {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            .format(Math.floor(diff % (60 * 1000) / 1000));
        const lastMinute = diff < 60 * 1000;
        this.callback({
            type: 'time',
            value: {
                minutes,
                seconds,
                lastMinute,
                diff
            }
        });

        window.requestAnimationFrame(this.checkTime.bind(this));
    }
}