'use strict'
import {
    PLAYLIST,
    LASTS_SONGS_PLAYLIST
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
        this.currentPlaylist = PLAYLIST;
        document.body.appendChild(this.audioElt);
        window.addEventListener('beforeunload', this._unload.bind(this));
        this._startPlayer();
    }


    _startPlayer() {
        if (localStorage['devfestCountdown-LastSong']) {
            this.indexPlayList = +localStorage['devfestCountdown-LastSong'];
            if (this.indexPlayList >= this.currentPlaylist.length) {
                this._nextSong();
            } else {
                this._playSound(`./assets/audio/${this.currentPlaylist[this.indexPlayList]}`);
                this.audioElt.currentTime = +localStorage['devfestCountdown-currentTime'];
            }
        } else {
            this.indexPlayList = -1;
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
            this.currentIndex = Math.max(this.indexPlayList, 0);
            this.indexPlayList = (this.indexPlayList + 1) % this.currentPlaylist.length;
            this._playSound(`./assets/audio/${this.currentPlaylist[this.indexPlayList]}`);
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
            this.audioElt.volume = Math.min(Math.max(0, delta / (10 * 1000)), 0.7);
        }
    }

    manageVolumeFromPercent(percent) {

        if (percent > 0){
            this.audioElt.volume = Math.min(percent, 1);
        }
    }

    switchToLastsSongPlaylist(){
        this.audioElt.volume = 1;
        this.indexPlayList = 0;
        this.currentPlaylist = LASTS_SONGS_PLAYLIST;
        this._nextSong();
    }
}