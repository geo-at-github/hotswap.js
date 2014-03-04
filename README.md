hotswap.js
==========

A web developer JS lib to reload .js and .css files in a running web application without a page reload.



Why?
----

This is targeted primarily at mobile and single page web application developers. Both app types usually have some internal state which is tedious to restore after a page reload.

Usually a full page reload is required to update .css or .js files. Some IDEs solve this by supporting refreshing whenever they change. Unfortunately most of them don´t work on mobile and often don´t work when files are preprocessed (closure compiler, LESS, SASS, ...).

This leads us to the hotswap.js "solution" which makes the browser pull the changes from the final files instead of waiting for an IDE to push changes. Doing it this way we don´t have to worry about how the file came to existence and application state is preserved too.

I personally consider this a workaround until something better comes along. Please let me know if there is a working cross browser, cross platform solution out there. I would love to ditch this project in favour of a better solution ;-)

Installation
------------

Simply download `hotswap.js` from the `/lib` directory and include it in your webpage.



Experiment with hotswap.js
--------------------------

Check out the `/demo` directory. Start `demo.html` and play around with `css/demo.css` and `js/hotswapped.js`.



Usage
-----

`hotswap.js` is not intended for production use. You should remove it once you are done with active development.

### Browsers

```html
<!-- HTML5 -->
<script src="https://raw.github.com/geo-at-github/hotswap.js/master/lib/hotswap.js"></script>

<!-- Note that in the mime type for Javascript is now officially 'application/javascript'. But if you
set the type to application/javascript in IE browsers, your Javscript will fail. -->

<!-- For HTML4/IE -->
<script type="text/javascript" src="https://raw.github.com/geo-at-github/hotswap.js/master/lib/hotswap.js"></script>
```

A global variable `window.hotswap` or simply `hotswap` is created.

### Browser Compatiblity

`hotswap.js` has been designed to be compatible with IE7+, Firefox 23+, Safari 5+, Chrome 29+. Please report any browser issues here: https://github.com/geo-at-github/hotswap.js/issues



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
<br />@param excludedFiles Array of file names.

Example:

```javascript
// Refresh all .js files except "dont-refresh-me.js"
hotswap.refreshAllJs( ["dont-refresh-me.js"] );
```

### hotswap.refreshJs(includedFiles) ###

Refreshes only the .js files put listed includedFiles.
<br />@param includedFiles Array of file names.

Example:

```javascript
hotswap.refreshJs = function( ["refresh-me.js","refresh-me-too.js"] ){}
```

### hotswap.refreshAllCss(excludedFiles) ###

Refreshes all .css files on the page except the files listed in excludedFiles.
<br />@param excludedFiles Array of file names.

Example:

```javascript
hotswap.refreshAllCss( ["dont-refresh-me.css"] ){}
```

### hotswap.refreshCss(includedFiles) ###

Refreshes only the .css files listed in includedFiles.
<br />@param includedFiles Array of file names.

Example:
```javascript
hotswap.refreshCss( ["refresh-me.css","refresh-me-too.css"] );
```