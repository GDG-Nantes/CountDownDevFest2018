'use strict'
import {
    PLAYLIST
} from './playlist.js';

/**
 * Class for playing music
 *
 * We create an insible audio element and we play music on it
 */
export class AudioPlayer {
    constructor() {
        this.indexPlayList = 0;
        this.currentIndex = 0;
        this.audioElt = document.createElement('audio');
        this.audioElt.style.display = 'none';
        document.body.appendChild(this.audioElt);
        window.addEventListener('beforeunload', this._unload.bind(this));
        this._startPlayer();
    }


    _startPlayer() {
        if (localStorage['devfestCountdown-LastSong']) {
            this.indexPlayList = +localStorage['devfestCountdown-LastSong'];
            if (this.indexPlayList >= PLAYLIST.length) {
                this._nextSong();
            } else {
                this._playSound(`./assets/audio/${PLAYLIST[this.indexPlayList]}`);
                this.audioElt.currentTime = +localStorage['devfestCountdown-currentTime'];
            }
        } else {
            this._nextSong();
        }
    }

    _unload() {
        localStorage['devfestCountdown-LastSong'] = `${this.currentIndex}`;
        localStorage['devfestCountdown-currentTime'] = `${this.audioElt.currentTime}`;
    }

    /**
     * Play a song according to the url of song
     */
    _playSound(url) {
        this.audioElt.pause();
        this.audioElt.src = url;
        this.audioElt.play();
        this.audioElt.onended = this._nextSong.bind(this);
    }

    /**
     * Skip to the next song
     */
    _nextSong() {
        try {
            this.currentIndex = this.indexPlayList;
            this.indexPlayList = (this.indexPlayList + 1) % PLAYLIST.length;
            this._playSound(`./assets/audio/${PLAYLIST[this.indexPlayList]}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    }

    /**
     * Update the sound volume of audio element
     */
    manageSoundVolume(delta) {
        if (delta < 10 * 1000) {
            this.audioElt.volume = Math.min(Math.max(0, delta / (10 * 1000)), 0.5);
        }
    }
}