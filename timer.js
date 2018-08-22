var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null;

var x1 = [];

var trace1 = {
    x: x1,
    type: "histogram",
    opacity: 0.5,
    background: 'black',
    histnorm: "percent"
};
var data = [trace1];
var layout = {barmode: "overlay", paper_bgcolor: "black", plot_bgcolor: "black", font: {color: "white"}, xaxis: {color: "white"}, yaxis: {color: "white"}};

function start() {
    if (timeBegan === null) {
        timeBegan = new Date();
    }

    if (timeStopped !== null) {
        stoppedDuration += (new Date() - timeStopped);
    }
    console.log(stoppedDuration);

    started = setInterval(clockRunning, 10);	
}

function stop() {
    timeStopped = new Date();
    clearInterval(started);
}
 
function reset() {
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    document.getElementById("clock").innerHTML = "00:00:00.000";
}

function next() {
    if(timeBegan) {
        stop()
        timeElapsed = new Date(new Date() - timeBegan - stoppedDuration)
        x1.push(
            (timeElapsed.getUTCHours() * 60 * 60 * 1000) +
            (timeElapsed.getUTCMinutes() * 60 * 1000) +
            (timeElapsed.getUTCSeconds() * 1000) +
            (timeElapsed.getUTCMilliseconds())
        )
        record = document.getElementById("history").innerHTML;
        document.getElementById("history").innerHTML = x1.length + ". " + document.getElementById("clock").innerHTML + "<br/>" + record;
        Plotly.newPlot("histogram", data, layout);
    }
    reset()
    start()
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

