// Show status log:
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}



// When popup icon clicked:
document.addEventListener('DOMContentLoaded', function() {
	chrome.sessions.getRecentlyClosed(function(sessions) {
		var i;
		for (i in sessions) {
			// If session is a tab:
			if (sessions[i].tab) {
				var t = sessions[i].tab;
				$('<li><div class="rc rc-t" data-id="' + t.sessionId + '"><img class="favicon" src="' + t.favIconUrl + '" /><span class="title">' + t.title + '</span><span class="url">' + t.url + '</span></div></li>').appendTo( $('#rclist') );
			}
			// If session is a window:
			else if (sessions[i].window) {
				var w = sessions[i].window;
				var ts = w.tabs;
				var tsText = "";
				for (j in ts) {
					var tText = '<li><div class="rc rc-t" data-id="' + ts[j].sessionId + '"><img class="favicon" src="' + ts[j].favIconUrl + '" /><span class="title">' + ts[j].title + '</span><span class="url">' + ts[j].url + '</span></div></li>'
					tsText = tsText + tText;
				}
				$('<li><div class="rc rc-w" data-id="' + w.sessionId + '"><img class="favicon" src="img/tabs.png" /><span class="title">' + ts.length + ' Tabs</span><span class="expand">▼</span></div><ul class="wlist" style="display:none;">' + tsText + '</ul></li>').appendTo( $('#rclist') );
			}
			// Else show error:
			else {
				renderStatus('No Result.');
			}
		}

		// Hover and click function:
		$('.rc, .rc-w>.expand')
			.mouseover(function(){ $(this).addClass("active") })
			.mouseout(function(){ $(this).removeClass("active") });

		$('.rc-t')
			.click(function(){ $(this).addClass("pressed"); chrome.sessions.restore( $(this).attr('data-id') ); });

		$('.rc-w>.title')
			.click(function(){ $(this).parent().addClass("pressed"); chrome.sessions.restore( $(this).parent().attr('data-id') ); });

		$('.rc-w>.expand')
			.click(function(){ $(this).parent().next().toggle(200).parent().toggleClass('expanded'); });

		// Hotkey handler:
		$(document)
			.keydown(function(e){
				if (e.which < 58 && e.which > 48){
					var index = e.which - 49;
					$('.rc').removeClass("active pressed");
					$('#rclist>.rc').eq(index).addClass("pressed");
				}
			})
			.keyup(function(e){
				if (e.which < 58 && e.which > 48){
					var index = e.which - 49;
					chrome.sessions.restore( $('#rclist>.rc').eq(index).attr('data-id') );
				}
			});
	});
});
