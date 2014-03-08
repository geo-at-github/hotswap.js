console.log("main.js called");
function main()
{
    var refreshInterval = setInterval(function()
    {
        //refresh();
    }, 1000);

    hotswap.guiShow();
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