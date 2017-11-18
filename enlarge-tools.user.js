// ==UserScript==
// @id             iitc-plugin-enlarge-tools@eccenux
// @name           IITC plugin: Enlarge tools
// @category       Misc
// @version        0.0.3
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [0.0.3] This plugin aims to give you a better experience when using desktop mode on Firefox Mobile. Why use desktop mode? Beacause you can see more portals on the same zoom! Only problem is that you might find it very hard to push buttons. This plugin is here to help ;-).
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @updateURL      https://github.com/Eccenux/iitc-plugin-enlarge-tools/raw/master/enlarge-tools.meta.js
// @downloadURL    https://github.com/Eccenux/iitc-plugin-enlarge-tools/raw/master/enlarge-tools.user.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


//PLUGIN START ////////////////////////////////////////////////////////

//use own namespace for plugin
window.plugin.enlargeTools = function() {};

/**
 * Very simple logger.
 */
function LOG() {
	var args = Array.prototype.slice.call(arguments); // Make real array from arguments
	args.unshift("[enlargeTools] ");
	console.log.apply(console, args);
}
function LOGwarn() {
	var args = Array.prototype.slice.call(arguments); // Make real array from arguments
	args.unshift("[enlargeTools] ");
	console.warn.apply(console, args);
}

/**
 * Create CSS for given parameters.
 * 
 * @param {Number} enlargeFactor
 * @returns {String} CSS rules string.
 */
window.plugin.enlargeTools.createCssText = function(enlargeFactor) {
	// leaflet bar buttons dimmensions
	var baseDimmension = 30;	// w/h for .leaflet-touch .leaflet-bar a (I could probably get this onload later on)
	var dimmension = Math.round(enlargeFactor * baseDimmension);
	
	var cssText = `
		.leaflet-bar a,
		.leaflet-bar a:hover {
			width: ${dimmension}px !important;
			height: ${dimmension}px !important;
			line-height: ${dimmension}px !important;
			font-size: ${enlargeFactor * 100}% !important;
		}
		
		#sidebartoggle {
			padding: ${enlargeFactor * 15}px ${enlargeFactor * 15}px !important;
		}
		
		#chatcontrols {
			height: ${enlargeFactor * 26}px;
		}
		#chatcontrols a {
			height: ${enlargeFactor * 24}px;
			line-height: ${enlargeFactor * 24}px;
		}
		#chatcontrols a:first-child {
			padding-top: ${enlargeFactor * 8}px;
		}
		#chat.expand {
			top: ${enlargeFactor * 25}px;
		}
`;
	return cssText;
};
//window.plugin.enlargeTools.enlargeElements()

window.plugin.enlargeTools._cssElement = null;

window.plugin.enlargeTools.addCssElement = function() {
	var el = document.createElement('style');
	document.getElementsByTagName('head')[0].appendChild(el);
	return el;
};

/**
 * Enlarge leaflet bar and other important buttons.
 */
window.plugin.enlargeTools.enlargeElements = function() {
	var enlargeFactor = 2;		// maybe introdcue a parameter later (and possibly use +/-)

	if (this._cssElement === null) {
		this._cssElement = this.addCssElement();
	}
	var cssText = this.createCssText(enlargeFactor);
	this._cssElement.innerHTML = cssText;
};

/**
 * Clear all size changes.
 */
window.plugin.enlargeTools.revertToNormalSize = function() {
	if (this._cssElement === null) {
		return;
	}
	this._cssElement.innerHTML = '';
};

/**
 * Setup always visible content.
 */
window.plugin.enlargeTools.setupContent = function() {
	// leaflet (sidebar buttons)
	$('.leaflet-control-container .leaflet-top.leaflet-left .leaflet-control-zoom').after(`
		<div class="leaflet-control-enlargeTools leaflet-bar leaflet-control">
			<a href="#" onclick="plugin.enlargeTools.enlargeElements(); return false">XL</a>
		</div>
		<div class="leaflet-control-enlargeTools leaflet-bar leaflet-control">
			<a href="#" onclick="plugin.enlargeTools.revertToNormalSize(); return false">N</a>
		</div>
	`);
};

/**
 * Setup size automatically.
 */
window.plugin.enlargeTools.autoSetupSize = function() {
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var largeEdgeSize = Math.max(w, h);

	LOG('largeEdgeSize: ', largeEdgeSize);
	
	// Threshold determined experimentally
	// for MOTO G5 (which is 1080 x 1920) `largeEdgeSize` is 1394 in desktop mode and 512 in mobile mode
	var largeEdgeThreshold = 1000;

	if (largeEdgeSize > largeEdgeThreshold) {
		this.enlargeElements();
	} else {
		this.revertToNormalSize();
	}
};

var setup = function() {
	//window.plugin.enlargeTools.setupContent();
	window.plugin.enlargeTools.autoSetupSize();
};

//PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


