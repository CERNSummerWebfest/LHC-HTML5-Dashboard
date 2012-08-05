// LHC HTML5 Dashboard video tutorial
// Copyright (C) 2012 Daniel Lombraña González 
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


var pop = Popcorn("#video");

if ( (!Modernizr.svg) || (!Modernizr.svg) ) {
    $(".skeleton").hide();
    $("footer").hide();
    $("#chart").hide();
    $("#legend").hide();
    $("#warning").show();
}
else {
    $("#warning").hide();
    createChart();
    setupVideo();
    setWidth();
}

setWidth();

function setupVideo(){

    // Enable preload
    pop.preload("auto");

        //$("#tutorial").show();

        pop.footnote({
            start: 0,
            end: 5,
            text: "Francesca Day from University of Cambridge",
            target: "attrib"
        });

        pop.footnote({
            start: 6,
            end: 17,
            text: "CERN Summer Webfest #cernwebfest #mozparty",
            target: "attrib"
        });

        pop.footnote({
            start: 18,
            end: 23,
            text: "Integrated Luminosity and Luminosity",
            target: "attrib"
        });



        pop.controls(false);
}

function setWidth() {
    aspect_ratio = ($(window).width()/$(window).height());
    //w = (($(window).width() * 45) / 100);
    h = (($(window).height() * 70) / 100);

    // Video tutorial width and height based on figures size 
    w = (($(window).width() * 35) / 100);
    h = w / 1.7;
    $("#video-container").css('width', w);
    $("#video-container").css('width', h);

    // Position for the video tutorial
    p = $(window).width() - w + (w/3);
    $("#video-container").css('left', p);

    $("#exit").css('position', 'absolute');
    $("#exit").css('left', p);
    p = $("#video-container").offset();
    $("#exit").css('top', p.top + 30);
}

setWidth();

function startVideo(){
    $("#tutorial").show();
    $("#attrib").show();
    pop.currentTime(0).play();

}

function restartVideo() {
    pop.play();
}

function pauseVideo() {
    pop.pause();
    $("#play").removeClass("active");
}

function stopVideo() {
    pop.pause();
    $("#tutorial").hide();
    $("#attrib").hide();
}
