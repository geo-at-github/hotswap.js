hotswap.js
==========

A web developer JS lib to reload .js and .css files in a running web application without a page reload.



Why?
----

This is targeted primarily at mobile and single page web application developers. Both app types usually have some internal state which is labor-intensive to restore for testing. This is tedious, especially if the change is just a simple update of a css, javascript or image file.

Some IDEs try to ease this process by supporting refreshing the page whenever a resource file changes. Unfortunately most of them don´t support mobile and often don´t work when files are preprocessed (closure compiler, LESS, SASS, ...).

This leads us to the hotswap.js "solution" which makes the browser pull the changes from the final files instead of waiting for an IDE to push changes. Doing it this way we don´t have to worry about how the file came to existence and application state is preserved too.

I consider this a workaround until something better comes along.

Installation
------------

Simply download `hotswap.js` from the `/lib` directory and include it in your webpage.



Experiment with hotswap.js
--------------------------

Check out the `/demo` directory. Start `demo.html` and play around with `css/demo.css` and `js/demo.js`.



Usage
-----

`hotswap.js` is not intended for production use. You should remove it once you are done with active development.

1) Include `hotswap.js` in your page.

```html
<!-- HTML5 -->
<script src="https://raw.github.com/geo-at-github/hotswap.js/master/lib/hotswap.js"></script>

<!-- Note that in the mime type for Javascript is now officially 'application/javascript'. But if you
set the type to application/javascript in IE browsers, your Javscript will fail. -->

<!-- For HTML4/IE -->
<script type="text/javascript" src="https://raw.github.com/geo-at-github/hotswap.js/master/lib/hotswap.js"></script>
```

A global variable `window.hotswap` or simply `hotswap` will be created.


2) You can reload your included .css, .js or image (img tag) files by executing the corresponding "hotswap" command.

```javascript
// refresh all .js files
hotswap.refreshAllJs();

// refresh main.css only
hotswap.refreshCss( ["main.js"] );

// refresh all images (img tags) except "dont-refreh-me.png".
hotswap.refreshAllImg( ["dont-refreh-me.png"] );

// show a gui (this is optional and not required for hotswap to work) (Click on the "H").
hotswap.createGui();
```

### Browser Compatibility

Since `hotswap.js` is a library for developers and not consumers browser compatibility is not in the focus of development.
`hotswap.js` has been designed to be compatible with IE9+, Firefox 23+, Safari 5+, Chrome 29+. Please report any browser issues here: https://github.com/geo-at-github/hotswap.js/issues



Methods / API
-------------

Square brackets means "optional parameter".


### window.hotswap or hotswap ###

This returns the `hotswap.js` object (singleton).

Example:

```javascript
// I like it short
var h = window.hotswap;
```


### hotswap.refreshAllJs([excludedFiles]) ###

Refreshes all .js files on the page except "hotswap.js" and the files listed in excludedFiles.
<br />@param excludedFiles {array} - Array of file names.

Example:

```javascript
// Refresh all .js files except "dont-refresh-me.js"
hotswap.refreshAllJs( ["dont-refresh-me.js"] );
```


### hotswap.refreshJs([includedFiles]) ###

Refreshes only the .js files listed in includedFiles.
<br />@param includedFiles {array} - Array of file names.

Example:

```javascript
hotswap.refreshJs = function( ["refresh-me.js","refresh-me-too.js"] ){}
```


### hotswap.refreshAllCss([excludedFiles]) ###

Refreshes all .css files on the page except the files listed in excludedFiles.
<br />@param excludedFiles {array} - Array of file names.

Example:

```javascript
hotswap.refreshAllCss( ["dont-refresh-me.css"] ){}
```


### hotswap.refreshCss([includedFiles]) ###

Refreshes only the .css files listed in includedFiles.
<br />@param includedFiles {array} - Array of file names.

Example:
```javascript
hotswap.refreshCss( ["refresh-me.css","refresh-me-too.css"] );
```


### hotswap.refreshAllImg([excludedFiles]) ###

Refreshes all image files (img tags) on the page except the files listed in excludedFiles.
<br />@param excludedFiles {array} - Array of file names.

Example:

```javascript
hotswap.refreshAllImg( ["dont-refresh-me.png"] ){}
```


### hotswap.refreshImg([includedFiles]) ###

Refreshes only the image files (img tags) listed in includedFiles.
<br />@param includedFiles {array} - Array of file names.

Example:
```javascript
hotswap.refreshImg( ["refresh-me.png","refresh-me-too.png"] );
```


### hotswap.setPrefix(prefix) ###

If prefix is not false, null or "" then it will be appended to all refreshed file urls.
<br />This is useful to force files to be loaded from a remote source without changing the html code.
<br />To turn off prefixing just reset it to false, null or "".
<br />@param prefix {Boolean|String} - the prefix as string (e.g.: http://192.168.0.100/htdocs/)

Example:

```javascript
// Load sources from a local network.
hotswap.setPrefix("http://192.168.0.100/htdocs/");
```


### hotswap.getPrefix() ###

Returns the currently saved prefix.
<br />@returns {Boolean|String} - the currently saved prefix

Example:
```javascript
var currentPrefix = hotswap.getPrefix();
```


### hotswap.createGui([nDistanceFromTopInPercent]) ###

Creates and displays a (position fixed) gui for hotswap.
Useful for testing in environments without a debug console.
<br />@param nDistanceFromTopInPercent {Number} - Defines the distance to the top of the page in percent (default is 20).
<br />@returns {Boolean} - false if the gui could not be created, true otherwise.

Example:
```javascript
hotswap.createGui();
```


### hotswap.deleteGui() ###

Hides and deletes the gui if it exists.

Example:
```javascript
hotswap.deleteGui();
```


### hotswap.guiRefreshFilesList() ###

Refreshes the files listed in the gui.<br />
Attention: This will remove all previous selections!

Example:
```javascript
hotswap.guiRefreshFilesList();
```