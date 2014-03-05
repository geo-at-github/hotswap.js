function demo()
{
    var refreshInterval = setInterval(function()
    {
        refresh();
    }, 1000);
}

function refresh()
{
    if(console) console.log("refreshing");

    // refresh one specific image
    hotswap.refreshImg(["html5.png"]);

    // refresh alls css files
    hotswap.refreshAllCss();

    // refresh all but demo.js
    hotswap.refreshAllJs(["demo.js"]);

    // test js hotswap
    test();
}