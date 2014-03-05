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

    hotswap.refreshImg(["html5"]);
    hotswap.refreshAllCss();
    hotswap.refreshAllJs(["demo.js"]);

    // test js hotswap
    test();
}