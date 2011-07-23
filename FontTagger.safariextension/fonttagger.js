/**
source from http://userscripts.org/scripts/review/103745
Author : thantthetkz
**/
var SUC_script_num=103745;try
{function updateCheck(forced)
{if((forced)||(parseInt(GM_getValue('FT_last_update','0'))+86400000<=(new Date().getTime())))
{try
{GM_xmlhttpRequest({method:'GET',url:'http://userscripts.org/scripts/source/'+SUC_script_num+'.meta.js?'+new Date().getTime(),headers:{'Cache-Control':'no-cache'},onload:function(resp)
{var local_version,remote_version,rt,script_name;rt=resp.responseText;GM_setValue('FT_last_update',new Date().getTime()+'');remote_version=parseInt(/@uso:version\s*(.*?)\s*$/m.exec(rt)[1]);local_version=parseInt(GM_getValue('FT_current_version','-1'));if(local_version!=-1)
{script_name=(/@name\s*(.*?)\s*$/m.exec(rt))[1];GM_setValue('FT_target_script_name',script_name);if(remote_version>local_version)
{if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?'))
{GM_openInTab('http://userscripts.org/scripts/show/'+SUC_script_num);GM_setValue('FT_current_version',remote_version);}}
else if(forced)
alert('No update is available for "'+script_name+'."');}
else
GM_setValue('FT_current_version',remote_version+'');}});}
catch(err)
{if(forced)
alert('An error occurred while checking for updates:\n'+err);}}}
GM_registerMenuCommand(GM_getValue('FT_target_script_name','MyanmarFontTagger')+' - Manual Update Check',function()
{updateCheck(true);});updateCheck(false);}
catch(err)
{}

var regexMM = new RegExp("[က-အ]+");
var regexUni = new RegExp("[ဃငဆဇဈဉညဋဌဍဎဏဒဓနဘရဝဟဠအ]်|ျ[က-အ]ါ|ျ[ါ-း]|[^\1031]စ်|\u103e|\u103f|\u1031[^\u1000-\u1021\u103b\u1040\u106a\u106b\u107e-\u1084\u108f\u1090]|\u1031$|\u1031[က-အ]\u1032|\u1025\u102f|\u103c\u103d[\u1000-\u1001]|ည်း|ျင်း|င်|န်း|ျာ");
var timerID = undefined;
var mmFonts = new RegExp("Zawgyi-One|Masterpiece Uni Sans|Myanmar3|Yunghkio|Parabaik|WinUni Innwa|Win Uni Innwa|Padauk|MyMyanmar|Panglong");
var unicodeFonts = "'Masterpiece Uni Sans', 'Myanmar MN', 'Myanmar Sangam MN', Myanmar3, Yunghkio, Parabaik, 'WinUni Innwa','Win Uni Innwa', Padauk, Panglong, 'MyMyanmar Unicode'";

var tagPage = function () 
{
	var el = document.getElementsByTagName('*');
	for (var i = 0; i < el.length; i++)
	{
		var childs = el[i].childNodes;
		for (var j = 0; j < childs.length; j++)
		{
			var thisNode = childs[j];
			if (thisNode.nodeType == 3) {

				var prNode = thisNode.parentNode;
				var text = thisNode.textContent;
				
				if (!regexMM.test(text)) {
					continue;
				}
				
				var computedStyles = document.defaultView.getComputedStyle(prNode, null);
				
				if (computedStyles.fontFamily != unicodeFonts && mmFonts.test(computedStyles.fontFamily)) {
					continue;
				}
				
				if (regexUni.test(text)) {
					prNode.style.fontFamily = unicodeFonts;
				} else {
				    prNode.style.fontFamily = "Zawgyi-One";
			    }

				while (thisNode.nextSibling) {
				    thisNode = thisNode.nextSibling;
    				if (regexUni.test(text)) {
    					prNode.style.fontFamily = unicodeFonts;
    				} else {
					    prNode.style.fontFamily = "Zawgyi-One";
				    }
			    }
			}
		}
	}
}

tagPage();

document.body.addEventListener("DOMNodeInserted", function () {
	if (timerID) {
		clearTimeout(timerID);
	}
	timerID = window.setTimeout(tagPage, 500);
}, false);