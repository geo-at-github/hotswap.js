function demo()
{
    var refreshInterval = setInterval(function()
    {
        console.log("refreshing");

        hotswap.refreshAllCss();
        hotswap.refreshAllJs(["demo.js"]);

        // test js hotswap
        test();

    }, 1000);
}