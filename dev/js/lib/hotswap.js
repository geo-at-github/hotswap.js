/**
 *
 * Licensed under MIT.
 *
 * Copyright (C) 2014 Georg Kamptner geo@geoathome.at
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


(function() {

    // Setup
    // --------------------

    // Establish the root object, "window" in the browser.
    var root = this;

    // Save the previous value of the "hotswap" variable.
    var previousHotswap = root.hotswap;

    // Create Hotswap singleton constructor.
    var hotswap = function()
    {
        if (!(this instanceof hotswap))
        {
            return new hotswap();
        }
        else
        {
            return this;
        }
    };

    // Export the hotswap object
    root.hotswap = hotswap();

    // Current version (Semantic Versioning: http://semver.org)
    hotswap.prototype.VERSION = '0.1.0';

    // The random parameter name which is added to urls to prevent caching
    hotswap.prototype.RND_PARAM_NAME = 'hs982345jkasg89zqnsl';

    // This is the delay in Milliseconds after which the recreated css <link> tags are removed.
    // We assume that the developer is on a local host or LAN, thus 400 MS should suffice.
    hotswap.prototype.FILE_REMOVAL_DELAY = 400;

    // This prefix is applied to all GUI css classes and GUI html tag id attributes to avoid collisions.
    hotswap.prototype.CSS_HTML_PREFIX = 'hs982345jkasg89zqnsl';

    // If it is defined then it will be appended to all refreshed file urls.
    hotswap.prototype._prefix = false;
    hotswap.prototype._prefixCache = [];

    // used to store data about selected files in the gui
    hotswap.prototype._guiCache = {};
    hotswap.prototype._guiGuiRefreshInterval = null;

    // I know this is ugly but it works and is cross browser compatible and standard compliant.
    hotswap.prototype._guiHtml = '' +
    '<style type="text/css">'+
    '    #PREFIX'+
    '    {'+
    '        display: block;'+
    '        position: fixed;'+
    '        top: 20%;/*distance from top*/'+
    '        right: 0;'+
    '        z-index: 99999;'+
    '        width: 20em;'+
    '        height: 32.8em;'+
    '        color: black;'+
    '        background-color: #666666;'+
    '        font-family: Verdana, sans-serif;'+
    '        font-size: 0.8em;'+
    '        -webkit-box-shadow: 0 0px 0.3em 0.1em #999999;'+
    '        -moz-box-shadow: 0 0px 0.3em 0.1em #999999;'+
    '        box-shadow: 0 0px 0.3em 0.1em #999999;'+
    '    }'+
    '    #PREFIX.mini'+
    '    {'+
    '        width: 2.9em;'+
    '        height: 2.9em;'+
    '        overflow:hidden;'+
    '    }'+
    '    #PREFIX.mini .PREFIX-header input, #PREFIX.mini .PREFIX-list, #PREFIX.mini .PREFIX-footer'+
    '    {'+
    '        display:none;'+
    '    }'+
    '        #PREFIX.mini .PREFIX-header div'+
    '    {'+
    '        display: block;'+
    '        width: 100%;'+
    '        height: 100%;'+
    '    }'+
    '    #PREFIX input'+
    '    {'+
    '        font-size: 1.0em;'+
    '        border: 0.1em solid #999999;'+
    '        border-radius: 0.2em;'+
    '        padding: 0.2em 0.1em;'+
    '        }'+
    '    #PREFIX .PREFIX-header'+
    '    {'+
    '        height: 2.4em;'+
    '        overflow:hidden;'+
    '        padding: 0.4em;'+
    '        color: white;'+
    '        background-color: black;'+
    '        }'+
    '    #PREFIX .PREFIX-header input'+
    '    {'+
    '        width: 83.5%;'+
    '        height: 1.6em;'+
    '    }'+
    '    #PREFIX .PREFIX-header div'+
    '    {'+
    '        position: absolute;'+
    '        top:0;'+
    '        right:0;'+
    '        width: 14.5%;'+
    '        height: 1.6em;'+
    '        line-height: 1.4em;'+
    '        text-align: center;'+
    '        font-size: 2em;'+
    '        font-weight: bold;'+
    '        cursor: pointer;'+
    '    }'+
    '    #PREFIX .PREFIX-header div:hover'+
    '    {'+
    '        background-color: #444444;'+
    '    }'+
    '    #PREFIX .PREFIX-list'+
    '    {'+
    '        width: 100%;'+
    '        height: 20em;'+
    '        overflow: auto;'+
    '        }'+
    '    #PREFIX ul'+
    '    {'+
    '        list-style-type: none;'+
    '        list-style-position: inside;'+
    '        padding: 0;'+
    '        margin: 0.5em 0.5em 1.2em 0.5em;'+
    '        }'+
    '    #PREFIX ul li'+
    '    {'+
    '        margin: 0.3em;'+
    '        padding: 0.5em 0.5em;'+
    '        color: white;'+
    '        background-color: #717171;'+
    '        font-size: 0.9em;'+
    '        line-height: 1.5em;'+
    '        cursor: pointer;'+
    '        }'+
    '    #PREFIX ul li:hover'+
    '    {'+
    '        background-color: #797979;'+
    '        }'+
    '    #PREFIX ul li.template'+
    '    {'+
    '        display: none;'+
    '        }'+
    '    #PREFIX ul li.active'+
    '    {'+
    '        background-color: black;'+
    '        }'+
    '    #PREFIX ul li.PREFIX-headline'+
    '    {'+
    '        color: white;'+
    '        background-color: transparent;'+
    '        text-align: center;'+
    '        font-weight: bold;'+
    '        }'+
    '    #PREFIX .PREFIX-footer'+
    '    {'+
    '        padding: 0;'+
    '        margin:0;'+
    '        background-color: #444444;'+
    '        }'+
    '    #PREFIX .PREFIX-footer ul'+
    '    {'+
    '        margin: 0;'+
    '        padding: 0.5em;'+
    '        }'+
    '    #PREFIX .PREFIX-footer ul li'+
    '    {'+
    '        color: white;'+
    '        background-color: black;'+
    '        font-size: 1.0em;'+
    '        border-radius: 0.5em;'+
    '        text-align: center;'+
    '        }'+
    '    #PREFIX .PREFIX-footer ul li input.PREFIX-seconds'+
    '    {'+
    '        text-align: center;'+
    '        width: 2em;'+
    '        }'+
    '    #PREFIX .PREFIX-footer ul li:hover'+
    '    {'+
    '        background-color: #222222;'+
    '        }'+
    '    #PREFIX .PREFIX-footer ul li.inactive'+
    '    {'+
    '        background-color: #666666;'+
    '        cursor: default;'+
    '        }'+
    '    </style>'+
    '    <div id="PREFIX" class="mini">'+
    '        <div class="PREFIX-header">'+
    '            <input id="PREFIX-prefix" placeholder="prefix" type="text" name="" />'+
    '            <div id="PREFIX-toggle">H</div>'+
    '        </div>'+
    '        <div class="PREFIX-list">'+
    '            <ul id="PREFIX-css">'+
    '                <li class="PREFIX-headline">CSS</li>'+
    '                <li class="template"></li>'+
    '            </ul>'+
    '            <ul id="PREFIX-js">'+
    '                <li class="PREFIX-headline">JS</li>'+
    '                <li class="template"></li>'+
    '            </ul>'+
    '            <ul id="PREFIX-img">'+
    '                <li class="PREFIX-headline">IMG</li>'+
    '                <li class="template"></li>'+
    '            </ul>'+
    '        </div>'+
    '        <div class="PREFIX-footer">'+
    '            <ul>'+
    '                <li id="PREFIX-submit-selected">refresh selected</li>'+
    '                <li id="PREFIX-submit-start">refresh every <input  class="PREFIX-seconds" type="text" value="1" /> sec.</li>'+
    '                <li id="PREFIX-submit-stop" class="inactive">stop refreshing</li>'+
    '            </ul>'+
    '        </div>'+
    '    </div>';

    // All native (cross) browser function implementations that we are using are declared here.
    var
        xGetElementById       = function(sId){ return document.getElementById(sId) },
        xGetElementsByTagName = function(sTags){ return document.getElementsByTagName(sTags) },
        xAppendChild          = function(parent, child){ return parent.appendChild(child) },
        xCloneNode            = function(node){ return document.cloneNode(node) },
        xCreateElement        = function(sTag){ return document.createElement(sTag) },
        xCloneNode            = function(ele, deep){ return ele.cloneNode(deep) },
        xRemove = function(ele)
        {
            if( typeof ele.parentNode != "undefined" && ele.parentNode )
            {
                ele.parentNode.removeChild( ele );
            }
        },
        xAddEventListener = function(ele, sEvent, fn, bCaptureOrBubble)
        {
            if( xIsEmpty(bCaptureOrBubble) )
            {
                bCaptureOrBubble = false;
            }
            if (ele.addEventListener)
            {
                ele.addEventListener(sEvent, fn, bCaptureOrBubble);
                return true;
            }
            else if (ele.attachEvent)
            {
                return ele.attachEvent('on' + sEvent, fn);
            }
            else
            {
                ele['on' + sEvent] = fn;
            }
        },
        xStopPropagation = function(evt)
        {
            if (evt && evt.stopPropogation)
            {
                evt.stopPropogation();
            }
            else if (window.event && window.event.cancelBubble)
            {
                window.event.cancelBubble = true;
            }
        },
        xPreventDefault = function(evt)
        {
            if (evt && evt.preventDefault)
            {
                evt.preventDefault();
            }
            else if (window.event && window.event.returnValue)
            {
                window.eventReturnValue = false;
            }
        },
        xContains = function(sHaystack, sNeedle)
        {
            return sHaystack.indexOf(sNeedle) >= 0
        },
        xStartsWith = function(sHaystack, sNeedle)
        {
            return sHaystack.indexOf(sNeedle) === 0
        },
        xReplace = function(sHaystack, sNeedle, sReplacement)
        {
            if( xIsEmpty(sReplacement) )
            {
                sReplacement = "";
            }
            return sHaystack.split(sNeedle).join(sReplacement);
        },
        xGetAttribute = function(ele, sAttr)
        {
            var result = (ele.getAttribute && ele.getAttribute(sAttr)) || null;
            if( !result ) {
                result = ele[sAttr];
            }
            if( !result ) {
                var attrs = ele.attributes;
                var length = attrs.length;
                for(var i = 0; i < length; i++)
                    if(attrs[i].nodeName === sAttr)
                        result = attrs[i].nodeValue;
            }
            return result;
        },
        xSetAttribute = function(ele, sAttr, value)
        {
            if(ele.setAttribute)
            {
                ele.setAttribute(sAttr, value)
            }
            else
            {
                ele[sAttr] = value;
            }
        },
        xGetParent = function(ele)
        {
            return ele.parentNode || ele.parentElement;
        },
        xInsertAfter = function( refEle, newEle )
        {
            return xGetParent(refEle).insertBefore(newEle, refEle.nextSibling);
        },
        xBind = function(func, context)
        {
            if (Function.prototype.bind && func.bind === Function.prototype.bind)
            {
                return func.bind(context);
            }
            else
            {
                return function() {
                    if( arguments.length > 2 )
                    {
                        return func.apply(context, arguments.slice(2));
                    }
                    else
                    {
                        return func.apply(context);
                    }
                };
            }
        },
        xIsEmpty = function(value)
        {
            var ret = true;
            if( value instanceof Object )
            {
                for(var i in value){ if(value.hasOwnProperty(i)){return false}}
                return true;
            }
            ret = typeof value === "undefined" || value === undefined || value === null || value === "";
            return ret;
        },
        xAddClass = function(ele, sClass)
        {
            var clazz = xGetAttribute( ele, "class" );
            if( !xHasClass(ele, sClass) )
            {
                xSetAttribute( ele, "class", clazz + " " + sClass );
            }
        },
        xRemoveClass = function(ele, sClass)
        {
            var clazz = xGetAttribute( ele, "class" );
            if( xHasClass(ele, sClass) )
            {
                xSetAttribute( ele, "class", xReplace( clazz, sClass, "" ) );
            }
        },
        xHasClass = function(ele, sClass)
        {
            var clazz = xGetAttribute( ele, "class" );
            return !xIsEmpty(clazz) && xContains( clazz, sClass );
        };

    // Functions
    // --------------------

    /**
     *
     * @param type {String} - either "css", "js" or "img"
     * @param xcludedFiles {Array} - (in/ex)cluded files
     * @param xcludeComparator {Boolean} - true = include, false = exclude
     * @param nDeleteDelay {Number} - time to wait until to delete the original source in milliseconds.
     * @param bForceRecreation {Boolean} - true = real recreation, false = recreation by node cloning
     */
    hotswap.prototype._recreate = function( type, xcludedFiles, xcludeComparator, nDeleteDelay, bForceRecreation )
    {
        if( typeof nDeleteDelay == "undefined")
        {
            nDeleteDelay = 0;
        }

        if( typeof bForceRecreation == "undefined")
        {
            bForceRecreation = false;
        }

        var tags = this._getFilesByType(type, xcludedFiles, xcludeComparator);
        var newTags = [];
        var removeTags = [];
        var i, src, detected, node, srcAttributeName;
        for(i=0; i<tags.length; i++)
        {
            // clone the old node (shallow copy)
            node = tags[i].node;
            srcAttributeName = tags[i].srcAttributeName;
            var newNode = {
                node: null,
                oldNode: node,
                parent: xGetParent(node)
            };
            if( bForceRecreation )
            {
                // "<script>" tags need to be recreated from scratch to force a refresh in all browsers
                newNode.node = xCreateElement("script");
            }
            else
            {
                // most other tags can be cloned for "recreation"
                newNode.node = xCloneNode(node, false);
            }

            // copy all properties
            for (var p in node) {
                if (node.hasOwnProperty(p)) {
                    newNode.node.p = node.p;
                }
            }

            // update the src property
            src = xGetAttribute( node, srcAttributeName );
            xSetAttribute( newNode.node, srcAttributeName, this._updatedUrl(src) );

            // schedule tags to be removed and recreated.
            newTags.push(newNode);
            removeTags.push(node);
        }

        // Add clones first ...
        for(var i=0; i < newTags.length; i++) {
            xInsertAfter(newTags[i].oldNode, newTags[i].node);
        }

        // ... and remove the original nodes later. This should avoid a time gap without any definitions (useful for css).
        if( nDeleteDelay > 0 )
        {
            // mark nodes for deletion
            for(var i=0; i < removeTags.length; i++) {
                xSetAttribute(removeTags[i], "data-hotswap-deleted", "1");
            }

            setTimeout( function() {
                for(var i=0; i < removeTags.length; i++) {
                    xRemove(removeTags[i]);
                }
            }, nDeleteDelay);
        }
        else
        {
            for(var i=0; i < removeTags.length; i++) {
                xRemove(removeTags[i]);
            }
        }
    };

    /**
     *
     * @param type {String} - either "css", "js" or "img"
     * @param xcludedFiles {Array} - (in/ex)cluded files
     * @param xcludeComparator {Boolean} - true = include, false = exclude
     */
    hotswap.prototype._reload = function( type, xcludedFiles, xcludeComparator )
    {
        var tags = this._getFilesByType(type, xcludedFiles, xcludeComparator);
        var i, src, node, srcAttributeName;
        for(i=0; i<tags.length; i++)
        {
            node = tags[i].node;
            srcAttributeName = tags[i].srcAttributeName;
            // update the src property
            src = xGetAttribute( node, srcAttributeName );
            xSetAttribute( node, srcAttributeName, this._updatedUrl(src) );
        }
    };

    /**
     * Returns a list of files based on the type.
     * @param type {String} - either "css", "js" or "img"
     * @param xcludedFiles {Array} - (in/ex)cluded files
     * @param xcludeComparator {Boolean} - true = include, false = exclude
     * @returns {Array}
     */
    hotswap.prototype._getFilesByType = function( type, xcludedFiles, xcludeComparator )
    {
        var files;
        switch(type)
        {
            case "css":
                files = this._getFiles(
                    "css",
                    "link",
                    function(ele)
                    {
                        return (xGetAttribute(ele, "rel") == "stylesheet" || xGetAttribute(ele, "type") == "text/css");
                    },
                    "href",
                    xcludedFiles,
                    xcludeComparator
                )
                break;

            case "js":
                files = this._getFiles(
                    "js",
                    "script",
                    function(ele)
                    {
                        return true; // type="text/javascript" is not required in html5, thus we assume it´s always a js script
                    },
                    "src",
                    xcludedFiles,
                    xcludeComparator
                )
                break;

            case "img":
                files = this._getFiles(
                    "img",
                    "img",
                    function(ele)
                    {
                        return (xGetAttribute(ele, "src") != "");
                    },
                    "src",
                    xcludedFiles,
                    xcludeComparator
                )
                break;
        }

        return files;
    }

    /**
     * Searches in the dom an returns an array of found nodes.
     * @param type {String} - either "css", "js" or "img"
     * @param tagName {String} - usually "script" or "link" (consider this a prefilter to the "tagFilterFunc" function)
     * @param tagFilterFunc {Function} - a function which returns either true or false / function(ele){return true/false}
     * @param srcAttributeName {String} - usually "src" or "href"
     * @param xcludedFiles {Array} - (in/ex)cluded files
     * @param xcludeComparator {Boolean} - true = include, false = exclude (default is false)
     * @return {Array} - list of dom nodes (usually <link>,<script> or <img>)
     */
    hotswap.prototype._getFiles = function( type, tagName, tagFilterFunc, srcAttributeName, xcludedFiles, xcludeComparator )
    {
        if( typeof xcludedFiles == "undefined" || !xcludedFiles)
        {
            xcludedFiles = [];
        }

        if( typeof xcludeComparator == "undefined" || !xcludeComparator)
        {
            xcludeComparator = false;
        }

        var fileNodes = [];
        var tags = xGetElementsByTagName(tagName);
        var src, detected, node;
        for(var i=0; i<tags.length; i++) {
            node = tags[i];
            src = xGetAttribute(node,[srcAttributeName]);
            // check if tag is already marked as deleted by hotswap
            if( xIsEmpty( xGetAttribute(node, "data-hotswap-deleted") ) )
            {
                if(src && tagFilterFunc(node))
                {
                    detected = false;
                    for(var j=0; j<xcludedFiles.length; j++) {
                        if( xContains(src,xcludedFiles[j]) )
                        {
                            detected = true;
                            break;
                        }
                    }
                    if( detected == xcludeComparator )
                    {
                        // add the found file to the list
                        fileNodes.push({
                            type: type,
                            node : node,
                            tagName : tagName,
                            srcAttributeName : srcAttributeName
                        });
                    }
                }
            }
        }

        return fileNodes;
    };

    /**
     *
     * @param url {String} - a valid url (local or web)
     * @param getCleanUrl {Boolean} - if set to true all prefixes and randomization query parameters are removed. (default is false)
     * @returns {String} - the updated url with appended cache invalidation parameter.
     */
    hotswap.prototype._updatedUrl = function( url, getCleanUrl )
    {
        var cleanUrl;
        if( typeof getCleanUrl == "undefined")
        {
            getCleanUrl = false;
        }

        // remove random (cache prevention) query parameter
        url = cleanUrl = url.replace(new RegExp("(\\?|&)"+this.RND_PARAM_NAME+"=[0-9.]*","g"), "");

        // create qurey string by adding a random query parameter to prevent caching
        var queryString = "", randomizedQueryString = "";
        if( xContains(url, "?") )
        {
            if(xContains(url, "&" + this.RND_PARAM_NAME))
            {
                queryString = url.split("&" + this.RND_PARAM_NAME).slice(1,-1).join("");
            }
            // add cache prevention random parameter
            randomizedQueryString = queryString + "&" + this.RND_PARAM_NAME + "=" + Math.random() * 99999999;
        }
        else
        {
            if(xContains(url, "?" + this.RND_PARAM_NAME))
            {
                queryString = url.split("?" + this.RND_PARAM_NAME).slice(1,-1).join("");
            }
            // add cache prevention random parameter
            randomizedQueryString = queryString + "?" + this.RND_PARAM_NAME + "=" + Math.random() * 99999999;
        }

        // remove prefix
        var foundAt = -1;
        if( !xIsEmpty( this._prefixCache ) )
        {
            for(var i=0; i<this._prefixCache.length; ++i)
            {
                /**
                 * Each entry is a history of past prefixed urls of one file e.g.:
                 * ["demo.css", "http://192.168.0.1/htdocs/demo.css"]
                 */
                //
                if( !xIsEmpty(this._prefixCache[i]) && foundAt < 0 )
                {
                    for(var h=0; h<this._prefixCache[i].length; ++h)
                    {
                        if( this._prefixCache[i][h] == cleanUrl + queryString )
                        {
                            // reset cleanUrl to a version without any prefix
                            cleanUrl = this._prefixCache[i][0];
                            // mark as found (foundAt > -1)
                            foundAt = i;
                            break;
                        }
                    }
                }
            }
        }

        var prefixHistory = [cleanUrl + queryString];

        // Apply prefix only if the original url does not already contain a prefix
        // (e.g.: "file://", "http://", "ftp://", ...).
        var applyPrefix = true;
        if( prefixHistory[0].match( new RegExp('^[A-Za-z0-9-_]+://') ) )
        {
            applyPrefix = false;
        }

        // Remove all prefixes which are stored in the prefix history
        var prefix = this._prefix;
        if( !xIsEmpty(this._prefix) && this._prefix )
        {
            // save in history
            prefixHistory.push( this._prefix + cleanUrl + queryString );
            if(foundAt >= 0)
            {
                // reset
                this._prefixCache[foundAt] = prefixHistory;
            }
            else
            {
                // create new
                this._prefixCache.push( prefixHistory );
            }
        }
        else
        {
            prefix = "";
        }

        // build url (apply prefix and add query string)
        if( !applyPrefix )
        {
            prefix = "";
        }
        url = prefix + cleanUrl + randomizedQueryString;

        return (getCleanUrl) ? (cleanUrl + queryString) : url;
    }

    /**
     * Refreshes all .js files on the page except "hotswap.js" and the files listed in excludedFiles.
     * @param excludedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshAllJs = function( excludedFiles )
    {
        if( typeof excludedFiles == "undefined" || !excludedFiles)
        {
            excludedFiles = []
        }
        excludedFiles.push("hotswap.js"); // always ignore hotswap.js itself

        this._recreate( "js", excludedFiles, false, 0, true );
    };

    /**
     * Refreshes only the .js files listed in includedFiles.
     * @param includedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshJs = function( includedFiles )
    {
        this._recreate( "js", includedFiles, true, 0, true );
    };

    /**
     * Refreshes all .css files on the page except the files listed in excludedFiles.
     * @param excludedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshAllCss = function( excludedFiles )
    {
        this._recreate( "css", excludedFiles, false, this.FILE_REMOVAL_DELAY );
    };

    /**
     * Refreshes only the .css files listed in includedFiles.
     * @param includedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshCss = function( includedFiles )
    {
        this._recreate( "css", includedFiles, true, this.FILE_REMOVAL_DELAY );
    };

    /**
     * Refreshes all image files (<img>) on the page except the files listed in excludedFiles.
     * @param excludedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshAllImg = function( excludedFiles )
    {
        this._reload( "img", excludedFiles, false );
    };

    /**
     * Refreshes only the image files (<img>) listed in includedFiles.
     * @param includedFiles {Array} - A list of file names.
     */
    hotswap.prototype.refreshImg = function( includedFiles )
    {
        this._reload( "img", includedFiles, true );
    };

    /**
     * If prefix is not false, null or "" then it will be appended to all refreshed file urls.
     * This is useful to force files to be loaded from a remote source without changing the html code.
     * To turn off prefixing just reset it to false, null or "".
     * @param prefix {String} - the prefix as string (e.g.: http://192.168.0.100/htdocs/)
     */
    hotswap.prototype.setPrefix = function( prefix )
    {
        this._previousPrefix = this._prefix;
        this._prefix = prefix;
    }

    /**
     * Returns the currently saved prefix.
     * @returns {Boolean|String}
     */
    hotswap.prototype.getPrefix = function()
    {
        return this._prefix;
    }

    /**
     * Creates and displays a (position fixed) gui for hotswap.
     * Useful for testing in environments without a debug console.
     * @param nDistanceFromTopInPercent {Number} - Defines the distance to the top of the page in percent (default is 20).
     */
    hotswap.prototype.createGui = function( nDistanceFromTopInPercent )
    {
        if( xIsEmpty(nDistanceFromTopInPercent) )
        {
            nDistanceFromTopInPercent = 20;
        }

        var gui = xGetElementById(this.CSS_HTML_PREFIX + "_wrapper");

        // remove if already existing
        if( gui )
        {
            xRemove(xGetElementById(this.CSS_HTML_PREFIX + "_wrapper"));
        }
        gui = xCreateElement("div");
        xSetAttribute( gui, "id", this.CSS_HTML_PREFIX + "_wrapper" );
        var guiHtml = xReplace( this._guiHtml, "PREFIX", this.CSS_HTML_PREFIX );
        guiHtml = xReplace( guiHtml, '20%;/*distance from top*/', nDistanceFromTopInPercent+'%;/*distance from top*/' );
        gui.innerHTML = guiHtml;
        xAppendChild( xGetElementsByTagName("body")[0], gui );

        // clear gui cache if not empty
        if( !xIsEmpty(this._guiCache) )
        {
            this._guiCache = {};
        }
        this._guiCache.files = [];
        this._guiCache.activeFiles = {
            "css" : [],
            "js" : [],
            "img" : []
        };

        var self = this;
        var createFilesList = function(list, files)
        {
            var i, j, clone, template, file, fileName;
            // find the template
            for(j=0; j<list.children.length; ++j)
            {
                if( xHasClass( list.children[j], "template" ) )
                {
                    template = list.children[j];
                }
            }
            // create clones (fill the <ul> lists)
            for(i=0; i<files.length; ++i)
            {
                file = files[i];
                clone = xCloneNode( template );
                // remove template css class from template
                xRemoveClass( clone, "template" );
                // insert filename
                fileName = self._updatedUrl( xGetAttribute( file.node, file.srcAttributeName ), true );
                if( !xContains(self._guiCache.files,fileName) )
                {
                    self._guiCache.files.push(fileName);
                    clone.innerHTML = fileName;
                    // append to list
                    xAppendChild( list, clone );
                    // add event listener
                    xAddEventListener( clone, "click", (function(type, fileName){
                        return function(evt){
                            xStopPropagation(evt);
                            xPreventDefault(evt);
                            self._guiClickedFile(evt.target, type, fileName);
                        };
                    })(file.type, fileName)
                    );
                }
            }
        }

        createFilesList( xGetElementById(this.CSS_HTML_PREFIX+"-css"), this._getFilesByType("css") );
        createFilesList( xGetElementById(this.CSS_HTML_PREFIX+"-js"), this._getFilesByType("js", ["hotswap.js"]) );
        createFilesList( xGetElementById(this.CSS_HTML_PREFIX+"-img"), this._getFilesByType("img") );

        // add Event Listeners

        // show hide guid
        xAddEventListener( xGetElementById(this.CSS_HTML_PREFIX+"-toggle"), "click", function(evt)
        {
            var gui = xGetElementById(self.CSS_HTML_PREFIX);
            if( xHasClass(gui, "mini") )
            {
                xRemoveClass( gui, "mini" );
            }
            else
            {
                xAddClass( gui, "mini" );
            }
        });

        // prefix
        xAddEventListener( xGetElementById(this.CSS_HTML_PREFIX+"-prefix"), "blur", function(evt)
        {
            self._guiPrefixChanged(evt.target);
        });

        // refresh selected btn
        xAddEventListener( xGetElementById(this.CSS_HTML_PREFIX+"-submit-selected"), "click", function(evt)
        {
            self._guiRefreshSelected()
        });

        // refresh every # sec.
        xAddEventListener( xGetElementById(this.CSS_HTML_PREFIX+"-submit-start"), "click", function(evt)
        {
            if( xGetAttribute(evt.target, "class") != this.CSS_HTML_PREFIX+"-seconds" )
            {
                var input, nSeconds = 1;
                var children = evt.target.children;
                for(var i=0; i<children.length; ++i)
                {
                    if( xGetAttribute(children[i], "class") == this.CSS_HTML_PREFIX+"-seconds" )
                    {
                        nSeconds = children[i].value;
                    }
                }

                self._guiRefreshSelected();
                self._guiRefreshStart( nSeconds );
            }
        });

        // stop refreshing
        xAddEventListener( xGetElementById(this.CSS_HTML_PREFIX+"-submit-stop"), "click", function(evt)
        {
            self._guiRefreshStop();
        });
    }

    /**
     * Hides and deletes the gui if it exists.
     */
    hotswap.prototype.deleteGui = function()
    {
        var gui = xGetElementById(this.CSS_HTML_PREFIX + "_wrapper");

        // remove if already existing
        if( gui )
        {
            xRemove(xGetElementById(this.CSS_HTML_PREFIX + "_wrapper"));
        }
    }

    /**
     * Updates the prefix based on the "#PREFIX input" input fields value.
     */
    hotswap.prototype._guiPrefixChanged = function(ele)
    {
        if( ele )
        {
            this.setPrefix(ele.value);
        }
    },

    hotswap.prototype._guiClickedFile = function( ele, sType, sFileName )
    {
        // search
        var activeFiles = this._guiCache.activeFiles[sType];
        if( xContains( activeFiles, sFileName ) )
        {
            // deselect
            xRemoveClass(ele, "active");
            activeFiles.splice( activeFiles.indexOf(sFileName), 1 )
        }
        else
        {
            // select
            xAddClass(ele, "active");
            activeFiles.push( sFileName );
        }
    },

    hotswap.prototype._guiRefreshSelected = function()
    {
        var activeFiles = this._guiCache.activeFiles;
        if( activeFiles['css'].length > 0 )
        {
            this.refreshCss( activeFiles['css'] );
        }
        if( activeFiles['js'].length > 0 )
        {
            this.refreshJs( activeFiles['js'] );
        }
        if( activeFiles['img'].length > 0 )
        {
            this.refreshImg( activeFiles['img'] );
        }
    },

    hotswap.prototype._guiRefreshStart = function( nSeconds )
    {
        // stop autop refresh if running
        if( this._guiGuiRefreshInterval !== null )
        {
            this._guiRefreshStop();
        }

        // start auto refreshing
        var self = this;
        this._guiGuiRefreshInterval = setInterval( xBind(this._guiRefreshSelected, this), nSeconds * 1000 );

        // update gui indicators
        xAddClass( xGetElementById(this.CSS_HTML_PREFIX+"-submit-start"), "inactive" );
        xRemoveClass( xGetElementById(this.CSS_HTML_PREFIX+"-submit-stop"), "inactive" );
    },

    hotswap.prototype._guiRefreshStop = function()
    {
        if( this._guiGuiRefreshInterval !== null )
        {
            clearInterval(this._guiGuiRefreshInterval);
        }
        this._guiGuiRefreshInterval = null;

        // update gui indicators
        xRemoveClass( xGetElementById(this.CSS_HTML_PREFIX+"-submit-start"), "inactive" );
        xAddClass( xGetElementById(this.CSS_HTML_PREFIX+"-submit-stop"), "inactive" );
    }

}).call(this);