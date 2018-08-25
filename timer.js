var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

var x1 = [], x2 = [0], y2 = [0];

var trace1 = {
    name: "Histogram",
    x: x1,
    type: "histogram",
    opacity: 0.5,
    color: 'blue',
    histnorm: "percent"
};
var trace2 = {
    name: "Cumulative over time",
    x: x2,
    y: y2,
    xaxis: 'x2',
    yaxis: 'y2',
    mode: "lines",
};

var data = [trace1, trace2];

var layout = {
    showlegend: false,
    barmode: "overlay", 
    paper_bgcolor: "black", 
    plot_bgcolor: "black", 
    font: {
        color: "white"
    }, 
    xaxis: {
        color: 'rgb(31, 119, 180)',
        title: 'Time taken (buckets)',
        autorange: true
    }, 
    yaxis: {
        color: 'rgb(31, 119, 180)',
        title: 'Occurances %',
        rangemode: 'tozero',
        autorange: true
    },
    xaxis2: {
        overlaying: 'x',
        side: 'top',
        type: 'date',
        tickformat: '%M:%S',
        color: 'orange',
        title: 'Cumulative time elapsed'
    },
    yaxis2: {
        overlaying: 'y',
        side: 'right',
        color: 'orange',
        title: 'Cumulative count',
        rangemode: 'tozero',
        autorange: true
    }
};
Plotly.newPlot("histogram", data, layout);

function start() {
    if (timeBegan === null) {
        timeBegan = new Date();
    }

    if (timeStopped !== null) {
        stoppedDuration += (new Date() - timeStopped);
    }
    started = setInterval(clockRunning, 10);
    timeStopped = null;
    document.getElementById("clock").style.color = "white";
}

function stop() {
    timeStopped = new Date();
    clearInterval(started);
    document.getElementById("clock").style.color = "red";
}
 
function reset() {
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    document.getElementById("clock").innerHTML = "00:00:00.000";
}

function next(event) {
    switch(event.key.toLowerCase()) {
        case "p":
            if (timeStopped === null) {
                stop();
            } else {
                start();
            }
            break;

        case "delete":
            x1.pop();
            x2.pop();
            y2.pop();
            str = document.getElementById("history").innerHTML;
            document.getElementById("history").innerHTML = str.substring(str.indexOf(">")+1);
            reset();
            start();
        case "r":
            Plotly.redraw("histogram");
            break;

        case " ":
            if(timeBegan) {
                stop()
                timeElapsed = new Date(new Date() - timeBegan - stoppedDuration)
                x1.push(
                    (timeElapsed.getUTCHours() * 60 * 60 * 1000) +
                    (timeElapsed.getUTCMinutes() * 60 * 1000) +
                    (timeElapsed.getUTCSeconds() * 1000) +
                    (timeElapsed.getUTCMilliseconds())
                );
                ttime = x1.reduce(function(a,b) {return a+b}, 0);
                tt = new Date(ttime);
                x2.push(tt);
                y2.push(x1.length);
                record = document.getElementById("history").innerHTML;
                document.getElementById("history").innerHTML = x1.length + ". " + document.getElementById("clock").innerHTML + "<br/>" + record;
                Plotly.redraw("histogram");
            }
            reset();
            start();
            break;
    }
}
function clockRunning(){
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();
    document.getElementById("clock").innerHTML = 
        (hour > 9 ? hour : "0" + hour) + ":" + 
        (min > 9 ? min : "0" + min) + ":" + 
        (sec > 9 ? sec : "0" + sec) + "." + 
        (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
};

