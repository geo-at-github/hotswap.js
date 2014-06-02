if( typeof hotswapGuiExists == "undefined" )
{
    // create the gui just once
    hotswap.createGui();
    var hotswapGuiExists = true;
}

if( typeof interval == "undefined" )
{
    var interval = null;
}

function main()
{
    hotswap.createGui();
    window.requestAnimationFrame(update);

    function update() // Attention: this not updated automatically !
    {
        document.getElementById('js-output').innerHTML = "time: " + Date.now();
    }

    // simulate an exclusive looping event
    if( interval )
    {
        clearInterval(interval);
    }
    interval = setInterval(update, 1000); // func 'update' is copied
}

main(); // removing this will break it (function 'update' will not be updated)