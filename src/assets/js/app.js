'use strict';
import videojs from 'video.js';
import './lib/charlie.js';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;


window.HELP_IMPROVE_VIDEOJS = false;
var vPlayer, video, textAnimationBlock;

class VideoPlayer {
    constructor() {
        var videoElem = document.createElement('VIDEO');
        videoElem.setAttribute('src', 'https://storage.googleapis.com/dynamic-video-hdfc/hdfc_yaris_final.mp4');
        videoElem.setAttribute('class', 'video-js vjs-fluid');
        videoElem.setAttribute('webkit-playsinline', '');
        videoElem.setAttribute('playsinline', '');
        videoElem.setAttribute('id', 'js--video-player');
        videoElem.setAttribute("poster", "assets/img/fon.png");
        this.video = videoElem;
        console.log(videoElem);
    }
    fetchData (uri, callback) {
        var self = this;
        fetch(uri)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                self.data = myJson;
                callback();
            });
    }
    init () {
        var self = this;
        var video = self.video;
        this.fetchData('assets/data.json', function callback () {
            $('.js-name').text(self.data.text1);
            $('.js-month').text(self.data.text2);
            $('#animate3 .animate3__line2').append(self.data.text3);
            $('#animate4 .animate4__line2').text(self.data.text4line2);
            $('#animate4 .animate4__line3').text(self.data.text4line3);
            $('#animate4 .animate4__line4').text(self.data.text4line4);
            $('#animate6').text(self.data.special);
            // retargeting video element
            video = document.getElementsByClassName('vjs-tech')[0];
            CHARLIE.setup(video);
            return;
        });
        $('#videoPlayerWrapper').append(video);
        self.myPlayer = videojs('js--video-player', {
            controls: true,
            autoplay: false,
            preload: false,
        });
        self.myPlayer.el_.addEventListener('webkitfullscreenchange', function () {
            self.handleFullScreen.call(this, event);
        });
        var currentTime = 0;
        //This example allows users to seek backwards but not forwards.
        //To disable all seeking replace the if statements from the next
        //two functions with myPlayer.currentTime(currentTime);
        self.myPlayer.on('seeking', function (event) {
            if (currentTime < self.myPlayer.currentTime()) {
                self.myPlayer.currentTime(currentTime);
            }
        });
        self.myPlayer.on('seeked', function (event) {
            if (currentTime < self.myPlayer.currentTime()) {
                self.myPlayer.currentTime(currentTime);
            }
        });
        self.myPlayer.on('ended', function () {
            $(".button").addClass("button-opacity");
            self.myPlayer.posterImage.show();
            $(this.posterImage.contentEl()).show();
            $(this.bigPlayButton.contentEl()).show();
            self.myPlayer.currentTime(0);
            self.myPlayer.controlBar.hide();
            self.myPlayer.bigPlayButton.show();
            self.myPlayer.cancelFullScreen();
        });
        self.myPlayer.on('play', function () {
            $(".button").removeClass('button-opacity');
            self.myPlayer.posterImage.hide();
            self.myPlayer.controlBar.show();
            self.myPlayer.bigPlayButton.hide();
        });
    }
    handleFullScreen (event) {
        var self = this;
        console.log('handleFullScreen', event);
        /* Fullscreen */
        lockScreenInLandscape();
        function requestFullscreenVideo () {
            if (videoPlayerWrapper.requestFullscreen) {
                videoPlayerWrapper.requestFullscreen();
            }
            else {
                video.webkitEnterFullscreen();
            }
        }
        if ('orientation' in screen) {
            screen.orientation.addEventListener('change', function () {
                // Let's automatically request fullscreen if user switches device in landscape mode.
                if (screen.orientation.type.startsWith('landscape')) {
                    // Note: It may silently fail in browsers that don't allow requesting
                    // fullscreen from the orientation change event.
                    // https://github.com/whatwg/fullscreen/commit/e5e96a9da944babf0e246980559cd80a46a300ca
                    requestFullscreenVideo();
                }
                else if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            });
        }
        function lockScreenInLandscape () {
            if (!('orientation' in screen)) {
                return;
            }
            // Let's force landscape mode only if device is in portrait mode and can be held in one hand.
            if (matchMedia('(orientation: portrait) and (max-device-width: 768px)')
                .matches) {
                screen.orientation.lock('landscape').then(function () {
                    // When screen is locked in landscape while user holds device in
                    // portrait, let's use the Device Orientation API to unlock screen only
                    // when it is appropriate to create a perfect and seamless experience.
                    listenToDeviceOrientationChanges();
                });
            }
        }
        function listenToDeviceOrientationChanges () {
            if (!('DeviceOrientationEvent' in window)) {
                return;
            }
            var previousDeviceOrientation, currentDeviceOrientation;
            window.addEventListener('deviceorientation', function onDeviceOrientationChange (event) {
                // event.beta represents a front to back motion of the device and
                // event.gamma a left to right motion.
                if (Math.abs(event.gamma) > 10 || Math.abs(event.beta) < 10) {
                    previousDeviceOrientation = currentDeviceOrientation;
                    currentDeviceOrientation = 'landscape';
                    return;
                }
                if (Math.abs(event.gamma) < 10 || Math.abs(event.beta) > 10) {
                    previousDeviceOrientation = currentDeviceOrientation;
                    // When device is rotated back to portrait, let's unlock screen orientation.
                    if (previousDeviceOrientation == 'landscape') {
                        screen.orientation.unlock();
                        window.removeEventListener('deviceorientation', onDeviceOrientationChange);
                    }
                }
            });
        }
    }
}

VideoPlayer.prototype.animationStart = (function(el) {
    var animations = {
        animation: 'animationstart',
        OAnimation: 'oAnimationStart',
        MozAnimation: 'mozAnimationStart',
        WebkitAnimation: 'webkitAnimationStart',
    };

    for (var t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('div'));

VideoPlayer.prototype.animationEnd = (function(el) {
    var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
    };
    for (var t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
    animateFinish();
})(document.createElement('div'));




$(document).ready(function() {
    $('#pictorpv').append(`<div id="videoPlayerWrapper" class="b-video-player-wrapper">
    <div id="textAnimationBlock" class="b-text-animation">
        <div class="charlie js-name" data-animations="textAnimate1" data-times="1.3" id="textAnimate1"></div>
        <div class="charlie js-month" data-animations="textAnimate2" data-times="34.4" id="textAnimate2"></div>

        <div class="charlie" data-animations="textAnimate3" data-times="45" id="animate3">
            <div class="animate3__line0">Your Pre-approved</div>
            <div class="animate3__line1">Auto Loan Amount :</div>
            <div class="animate3__line2"></div>
        </div>

        <div class="charlie" data-animations="animate4" data-times="52.5" id="animate4">
            <div class="animate4__line1">Avail Exclusive STEP EMI Offer:</div>
            <div class="animate4__line2"></div>
            <div class="animate4__line3"></div>
            <div class="animate4__line4"></div>
        </div>

        <div class="animate5">
            <div class="charlie line1 button button__right" data-animations="animate5__line1" data-times="61"><a href="https://www.hdfcbank.com/personal/products/loans/car-loans/new-car-loans" target="_blank">Apply here</a></div>
            <div class="charlie line2 button button__left" data-animations="animate5__line2" data-times="61"><a href="https://www.youtube.com/watch?v=fL6mdFHArgY&t=18s" target="_blank">Know More</a></div>
        </div>
        <a href="https://www.hdfcbank.com/personal/products/loans/car-loans/new-car-loans" target="_blank" class="charlie js-text6" data-animations="animate6" data-times="5" id="animate6"></a>
        <div id="animate_finish"></div>
    </div>
</div>`);
    vPlayer = new VideoPlayer(),
        video = vPlayer.video,
        textAnimationBlock = document.getElementById('textAnimationBlock');

    vPlayer.init();
    $('.vjs-fluid').append(textAnimationBlock);
    textAnimationBlock.classList.add('is-ready');


    // detect iOS full screen
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    if (iOS) {
        $('.vjs-fullscreen-control').hide();
    }

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
        $('.vjs-fullscreen-control').hide();
    }

    // iOS special treatment
    var vidEl = document.getElementsByClassName('vjs-tech')[0];
    vidEl.addEventListener('pause', function() {

        if (iOS) {
            $('.charlie').each(function() {
                if ($(this).hasClass('animated')) {
                    $(this).css('-webkit-transform', $(this).css('-webkit-transform'))
                }
            })
        }
    })

    //controlbar at bottom
    function controlbarAtBottom() {
        var height = $('.vjs-control-bar').height();
        $('.vjs-control-bar').css('bottom', '-' + height + 'px');
    }
    controlbarAtBottom();
    window.addEventListener('resize', controlbarAtBottom);
    window.addEventListener('orientationchange', controlbarAtBottom);
});