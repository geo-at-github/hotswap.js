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
        xContains = function(sHaystack, sNeedle)
        {
            return sHaystack.indexOf(sNeedle) >= 0
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
        };

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
    hotswap.prototype.VERSION = '0.0.1';

    // The random parameter name which is added to urls to prevent caching
    hotswap.prototype.RND_PARAM_NAME = 'hs982345jkasg89zqnsl';

    // Functions
    // --------------------

    /**
     *
     * @param tagName {string} usually "script" or "link" (consider this a prefilter to the "tagFilterFunc" function)
     * @param tagFilterFunc {function} - a function which returns either true or false / function(ele){return true/false}
     * @param srcAttributeName {string} - usually "src" or "href"
     * @param xcludedFiles {array} - (in/ex)cluded files
     * @param xcludeComparator {bool} - true = include, false = exclude
     * @param nDeleteDelay {numer} - time to wait until to delete the original source in milliseconds.
     */
    hotswap.prototype._recreate = function( tagName, tagFilterFunc, srcAttributeName, xcludedFiles, xcludeComparator, nDeleteDelay )
    {
        if( typeof xcludedFiles == "undefined" || !xcludedFiles)
        {
            xcludedFiles = [];
        }

        if( typeof nDeleteDelay == "undefined")
        {
            nDeleteDelay = 0;
        }

        var tags = xGetElementsByTagName(tagName);
        var newTags = [];
        var removeTags = [];
        var src, detected;
        for(var i=0; i<tags.length; i++) {
            src = xGetAttribute(tags[i],[srcAttributeName]);
            if(src && tagFilterFunc(tags[i]))
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
                    // clone the old tag (shallow copy)
                    var newTag = {
                        node: null,
                        oldNode: tags[i],
                        parent: xGetParent(tags[i])
                    };
                    if( tagName == "script" )
                    {
                        // script tags need to be recreated to force a refresh in all browsers
                        newTag.node = xCreateElement("script");
                    }
                    else
                    {
                        // we assume that all other tags can be cloned
                        newTag.node = xCloneNode(tags[i], false);
                    }
                    // copy all properties
                    for (var p in tags[i]) {
                        if (tags[i].hasOwnProperty(p)) {
                            newTag.node.p = tags[i].p;
                        }
                    }

                    // update the src property
                    xSetAttribute( newTag.node, srcAttributeName, this._updatedUrl(src) );

                    // schedule tags to be removed and recreated.
                    newTags.push(newTag);
                    removeTags.push(tags[i]);
                }
            }
        }

        // Add clones first ...
        for(var i=0; i < newTags.length; i++) {
            xInsertAfter(newTags[i].oldNode, newTags[i].node);
        }

        // ... and remove the original nodes later. This should avoid a time gap without any definitions (useful for css).
        if( nDeleteDelay > 0 )
        {
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
     * @param tagName {string} usually "script" or "link" (consider this a prefilter to the "tagFilterFunc" function)
     * @param tagFilterFunc {function} - a function which returns either true or false / function(ele){return true/false}
     * @param srcAttributeName {string} - usually "src" or "href"
     * @param xcludedFiles {array} - (in/ex)cluded files
     * @param xcludeComparator {bool} - true = include, false = exclude
     */
    hotswap.prototype._reload = function( tagName, tagFilterFunc, srcAttributeName, xcludedFiles, xcludeComparator )
    {
        if( typeof xcludedFiles == "undefined" || !xcludedFiles)
        {
            xcludedFiles = [];
        }
        var tags = xGetElementsByTagName(tagName);
        var newTags = [];
        var removeTags = [];
        var src, detected, node;
        for(var i=0; i<tags.length; i++) {
            node = tags[i];
            src = xGetAttribute(node,[srcAttributeName]);
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
                    // update the src property
                    xSetAttribute( node, srcAttributeName, this._updatedUrl(src) );
                }
            }
        }
    };

    /**
     *
     * @param url {string} - a valid url (local or web)
     * @returns {string} - the updated url with appended cache invalidation parameter.
     */
    hotswap.prototype._updatedUrl = function( url )
    {
        url = url.replace(new RegExp("(\\?|&)"+this.RND_PARAM_NAME+"=[0-9.]*","g"), "");
        if( xContains(url, "?") )
        {
            if(xContains(url, "&" + this.RND_PARAM_NAME))
            {
                url = url.split("&" + this.RND_PARAM_NAME).slice(0,-1).join("");
            }
            url = url + "&" + this.RND_PARAM_NAME + "=" + Math.random() * 99999999;
        }
        else
        {
            if(xContains(url, "?" + this.RND_PARAM_NAME))
            {
                url = url.split("?" + this.RND_PARAM_NAME).slice(0,-1).join("");
            }
            url = url + "?" + this.RND_PARAM_NAME + "=" + Math.random() * 99999999;
        }
        return url;
    }

    /**
     * Refreshes all .js files on the page except "hotswap.js" and the files listed in excludedFiles.
     * @param excludedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshAllJs = function( excludedFiles )
    {
        if( typeof excludedFiles == "undefined" || !excludedFiles)
        {
            excludedFiles = []
        }
        excludedFiles.push("hotswap.js"); // always ignore hotswap.js itself

        this._recreate(
            "script",
            function(ele)
            {
                return true; // type="text/javascript" is not required in html5, thus we assume it´s always a js script
            },
            "src",
            excludedFiles,
            false
        );
    };

    /**
     * Refreshes only the .js files listed in includedFiles.
     * @param includedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshJs = function( includedFiles )
    {
        this._recreate(
            "script",
            function(ele)
            {
                return true; // type="text/javascript" is not required in html5, thus we assume it´s always a js script
            },
            "src",
            includedFiles,
            true
        );
    };

    /**
     * Refreshes all .css files on the page except the files listed in excludedFiles.
     * @param excludedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshAllCss = function( excludedFiles )
    {
        this._recreate(
            "link",
            function(ele)
            {
                return (xGetAttribute(ele, "rel") == "stylesheet" || xGetAttribute(ele, "type") == "text/css");
            },
            "href",
            excludedFiles,
            false,
            200 // we assume that the developer is on a local host, thus 200 MS for loading a .css file should suffice.
        );
    };

    /**
     * Refreshes only the .css files listed in includedFiles.
     * @param includedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshCss = function( includedFiles )
    {
        this._recreate(
            "link",
            function(ele)
            {
                return (xGetAttribute(ele, "rel") == "stylesheet" || xGetAttribute(ele, "type") == "text/css");
            },
            "href",
            includedFiles,
            true,
            200 // we assume that the developer is on a local host, thus 200 MS for loading a .css file should suffice.
        );
    };

    /**
     * Refreshes all image files (<img>) on the page except the files listed in excludedFiles.
     * @param excludedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshAllImg = function( excludedFiles )
    {
        this._reload(
            "img",
            function(ele)
            {
                return (xGetAttribute(ele, "src") != "");
            },
            "src",
            excludedFiles,
            false
        );
    };

    /**
     * Refreshes only the image files (<img>) listed in includedFiles.
     * @param includedFiles {array} - A list of file names.
     */
    hotswap.prototype.refreshImg = function( includedFiles )
    {
        this._reload(
            "img",
            function(ele)
            {
                return (xGetAttribute(ele, "src") != "");
            },
            "src",
            includedFiles,
            true
        );
    };

}).call(this);