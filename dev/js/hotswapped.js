function test()
{
    var msg = "test"; // change this message to see .js hotswapping in action!
    if(console) console.log(msg);
    document.getElementById("js-output").value = msg;
}