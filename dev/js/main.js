function main()
{
    var refreshInterval = setInterval(function()
    {
        // this will refresh the pages resources automatically every second.
        refresh();
    }, 1000);

    // Creating a gui is optional but very handy for testing in environments without a debug console.
    hotswap.createGui();
}

function refresh()
{
    if(console) console.log("refreshing");

    // refresh one specific image
    hotswap.refreshImg(["html5.png"]);

    // refresh alls css files
    hotswap.refreshAllCss();

    // refresh all but demo.js
    hotswap.refreshAllJs(["main.js"]);

    // test js hotswap
    test();
}