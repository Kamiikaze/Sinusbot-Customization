registerPlugin({
	name: 'RSS Feed',
	version: '0.9.0',
	description: 'RSS Feed to channel description',
	author: 'Reworked by Kamikaze <admin@xKamikaze.de> | Created by Filtik <filtik@gmx.de>',
	vars: {
		Language: {
			name: 'Language',
			indent: 0,
			title: 'Select your Language | Wähle deine Sprache',
			type: 'select',
			options: [
				'English',
				'Deutsch'
			]
		},
		e1_TimeInt: {
			indent: 1,
			title: 'Time intervall for update check in x minutes ( 1 is default )',
			type: 'number',
			placeholder: '1',
			conditions: [
				{ field: 'Language', value: 0 }
			]
		},
		d1_TimeInt: {
			indent: 1,
			title: 'Zeitintervall der Aktuallisierung in X Minuten ( 1 ist Standard )',
			type: 'number',
			placeholder: '1',
			conditions: [
				{ field: 'Language', value: 1 }
			]
		},
		e2_rssarray: {
			indent: 2,
			title: 'Config',
			type: 'array',
			vars: [
				{
					name: 'feedadress',
					indent: 1,
					title: 'RSS Feed adress:',
					type: 'string',
					placeholder: ''
				},
				{
					name: 'channel',
					indent: 1,
					title: 'Feed to Channel:',
					type: 'channel',
					placeholder: ''
				},
				{
					name: 'maxFeeds',
					indent: 1,
					title: 'Max Feeds: ( 0 = All feeds )',
					type: 'number',
					placeholder: ''
				},
				{
					name: 'HeaderText',
					indent: 1,
					title: 'Header Text befor RSS Feed: ( [center][b][u][size=+4]NEWS[/size][/u][/b] )',
					type: 'multiline',
					placeholder: '[center][b][u][size=+4]NEWS[/size][/u][/b]'
				},
				{
					name: 'ShortDescLength',
					indent: 1,
					title: 'Limit the Characters that are displayed in short description. ( Default is 100 )',
					type: 'number',
					placeholder: '250'
				},
				{
					name: 'FeedArray',
					indent: 1,
					title: 'Feed array output: ( %FeedURL = URL, %FeedTitle = Title, %FeedCreator = Creator, %Feedmonth = month, %Feedday = day, %Feedyear = year, %FeedTime = time, %FeedCategory = Category, %FeedShortDesc = Short Description )',
					type: 'multiline',
					placeholder: '[size=+2][url=%FeedURL]%FeedTitle[/url][/size]\nby %FeedCreator\nfrom %Feedmonth.%Feedday.%Feedyear'
				},
				{
					name: 'unescapeText',
					indent: 1,
					title: 'Unescape text ( activate if text is not correctly displayed )',
					type: 'select',
					options: [
						'No',
						'Yes'
					]
				},
				{
					name: 'LastFeedasChannelName',
					indent: 1,
					title: 'Last feed as channelname?',
					type: 'select',
					options: [
						'No',
						'Yes'
					]
				},
				{
					name: 'ascspacer',
					indent: 2,
					title: 'As [cspacer]?',
					type: 'select',
					options: [
						'No',
						'Yes'
					],
					conditions: [
						{ field: 'LastFeedasChannelName', value: 1 }
					]
				},
			],
			conditions: [
				{ field: 'Language', value: 0 }
			]
		},
		d2_rssarray: {
			indent: 2,
			title: 'Config',
			type: 'array',
			vars: [
				{
					name: 'feedadress',
					indent: 1,
					title: 'RSS Feed URL:',
					type: 'string',
					placeholder: ''
				},
				{
					name: 'channel',
					indent: 1,
					title: 'Feed in Channel:',
					type: 'channel',
					placeholder: ''
				},
				{
					name: 'maxFeeds',
					indent: 1,
					title: 'Max Feeds: ( 0 = Alle feeds )',
					type: 'number',
					placeholder: ''
				},
				{
					name: 'HeaderText',
					indent: 1,
					title: 'Überschrift vor dem RSS Feed: ( [center][b][u][size=+4]NEWS[/size][/u][/b] )',
					type: 'multiline',
					placeholder: '[center][b][u][size=+4]NEWS[/size][/u][/b]'
				},
				{
					name: 'ShortDescLength',
					indent: 1,
					title: 'Limitiere die Zeichen die angezeigt werden sollen in der Kurzbeschreibung. ( Standard ist 100 )',
					type: 'number',
					placeholder: '100'
				},
				{
					name: 'FeedArray',
					indent: 1,
					title: 'Feed Ausgabe: ( %FeedURL = URL, %FeedTitle = Title, %FeedCreator = Author, %Feedmonth = Monat, %Feedday = Tag, %Feedyear = Jahr, %FeedTime = Uhrzeit, %FeedCategory = Kategorie, %FeedShortDesc = Kurz Beschreibung )',
					type: 'multiline',
					placeholder: '[size=+2][url=%FeedURL]%FeedTitle[/url][/size] von %FeedCreator vom %Feedday.%Feedmonth.%Feedyear'
				},
				{
					name: 'unescapeText',
					indent: 1,
					title: 'Text dekodieren ( Aktivieren wenn der Titel nicht richtig dargestellt wird )',
					type: 'select',
					options: [
						'Nein',
						'Ja'
					]
				},
				{
					name: 'LastFeedasChannelName',
					indent: 1,
					title: 'Letzter Feed als Channelname?',
					type: 'select',
					options: [
						'Nein',
						'Ja'
					]
				},
				{
					name: 'ascspacer',
					indent: 2,
					title: 'Als [cspacer]?',
					type: 'select',
					options: [
						'Nein',
						'Ja'
					],
					conditions: [
						{ field: 'LastFeedasChannelName', value: 1 }
					]
				},
			],
			conditions: [
				{ field: 'Language', value: 1 }
			]
		},
		zchangelog: {
			indent: 0,
			title: 'Changelog',
			type: 'multiline',
		    placeholder: '############## \n\
### Changelog  \n\
############## \n\
# \n\
############## \n\
## Legend \n\
############## \n\
# \n\
# !  Info \n\
# *  Bug fix \n\
# +  Added a feature \n\
# -  Removed a feature \n\
# \n\
############## \n\
## Version 0.3 \n\
## 2016-09-15 \n\
############## \n\
# \n\
# ! Original Script by Filtik \n\
# \n\
############## \n\
## Version 0.4 \n\
## 2018-02-20 \n\
############## \n\
# \n\
# * Reworked for current Version \n\
# \n\
############## \n\
## Version 0.5 \n\
## 2018-02-21 \n\
############## \n\
# \n\
# + Added config for german and english \n\
# \n\
############## \n\
## Version 0.6 \n\
## 2018-02-21 \n\
############## \n\
# \n\
# + Added placeholder "%FeedTime" to display time of feed \n\
# + Added placeholder "%FeedCategory" to display category (example: rss from boards or forums) \n\
# + Added placeholder "%FeedShortDesc" to display a part of the content of the feed \n\
# + Added textbox to display changelog of script \n\
# \n\
# \n\
############## \n\
## Version 0.7 \n\
## 2018-02-22 \n\
############## \n\
# \n\
# + Added link formatting in short description \n\
# + Output of short description do not contain html-tags anymore \n\
# + Added option to configure the length of the short description \n\
# \n\
############## \n\
## Version 0.8 \n\
## 2018-02-22 \n\
############## \n\
# \n\
# + Added support for "rdf"-Feeds\n\
# + Added support for "Atom"-Feeds\n\
# \n\
############## \n\
## Version 0.8.1 \n\
## 2018-03-15 \n\
############## \n\
# \n\
# * Fixed Bug where "mShortDesc" was not defined. \n\
# \n\
############## \n\
## Version 0.9.0 \n\
## 2018-08-16 \n\
############## \n\
# \n\
# + Added timestamp to see when the feed was updated last \n\
# \n\
# \n\
# \n\
############## \n\
			'
		}
	}
},  function(sinusbot, config, info) {
	
	var engine = require('engine');
	var status;
	var oldstatus = '';
	var desOutTextIS;
	var des2OutTextIS = [];
	var language = config.Language; // 0 = English | 1 = Deutsch
	var SearchMaintenance = '';
	config.zchangelog = '';
	
	// Language Switching
	if (language == 1) {
		config.TimeInt = config.d1_TimeInt;
		rssarray = config.d2_rssarray;
	} else {
		config.TimeInt = config.e1_TimeInt;
		rssarray = config.e2_rssarray;
	}
	
	if ((typeof config.TimeInt === 'undefined') || (config.TimeInt == '') || (config.TimeInt < 1)) {
		config.TimeInt = 1;
		config.d1_TimeInt = 1;
		config.e1_TimeInt = 1;
	}	

	var Run = function() {
		for (var x = 0; x < rssarray.length; x++) {
			if ((typeof rssarray[x].feedadress === 'undefined') || (rssarray[x].feedadress == '') || (typeof rssarray[x].channel === 'undefined') || (rssarray[x].channel == '')) {
				engine.log('ERROR: RSS Feed adress or Channel from number ' + (x+1) + ' is undefined!');
			}
			else
			{
				if (typeof rssarray[x].HeaderText == 'undefined' || rssarray[x].HeaderText == '') {
					rssarray[x].HeaderText = '[center][b][u][size=+4]NEWS[/size][/u][/b]';
				}
				if (typeof rssarray[x].FeedArray == 'undefined' || rssarray[x].FeedArray == '') {
					rssarray[x].FeedArray = '[size=+2][url=%FeedURL]%FeedTitle[/url][/size]\nby %FeedCreator\nfrom %Feedmonth.%Feedday.%Feedyear';
				}
				if (typeof rssarray[x].LastFeedasChannelName == 'undefined' || rssarray[x].LastFeedasChannelName == '') {
					rssarray[x].LastFeedasChannelName = 0;
				}
				if (typeof rssarray[x].maxFeeds == 'undefined' || rssarray[x].maxFeeds == '') {
					rssarray[x].maxFeeds = 0;
				}
				if (typeof rssarray[x].ascspacer == 'undefined' || rssarray[x].ascspacer == '') {
					rssarray[x].ascspacer = 0;
				}
				if (typeof rssarray[x].unescapeText == 'undefined' || rssarray[x].unescapeText == '') {
					rssarray[x].unescapeText = 0;
				}
				
				ServerFeedCheck(x);
			}
		}
	}
	
	setInterval(Run, config.TimeInt * 60000);
	Run();
	
	function ServerFeedCheck(x) {
		var x = x;
		var backend = require('backend');
		var URL = rssarray[x].feedadress;
		var Channel = rssarray[x].channel;
		Channel = backend.getChannelByID(Channel);
		var HeaderText = rssarray[x].HeaderText;
		var FeedArray = rssarray[x].FeedArray;
		var LastFeedasChannelName = rssarray[x].LastFeedasChannelName;
		var maxFeeds = rssarray[x].maxFeeds;
		var ascspacer = rssarray[x].ascspacer;
		var unescape = rssarray[x].unescapeText;
		var ShortDescLength = rssarray[x].ShortDescLength;
		if (ShortDescLength === parseInt(ShortDescLength)) {
			ShortDescLength = rssarray[x].ShortDescLength;
		} else {
			ShortDescLength = 100;
		}
		
		sinusbot.http({
			method: "GET", 
			url: URL, 
			timeout: 60000, 
			headers: [{"Content-Type": "text/plain; charset=UTF-8"}]
		}, function (error, response) {
			var data = response.data;
			data = data.replace(/<!\[CDATA\[/gi, '').replace(/]]>/gi, '');
			//engine.log(data);
			
			if (URL.match('.rdf')) {
				var feedSource = data.split('<link>')[1].split('</link>')[0];
				feedSource = '[/center][right][url=' + feedSource + '][Source][/url][/right]';
			data = data.split('</description>').slice(1).join('</description>');
			} else if (data.match('<channel>')) {
				var feedSource = data.split('<channel>').pop().split('</channel>').shift().split('<link>')[1].split('</link>')[0];
				feedSource = '[/center][right][url=' + feedSource + '][Source][/url][/right]';
			data = data.split('</description>').slice(1).join('</description>');
			} else {
				var feedSource = data.split('<link')[1].split('application/')[1].split('+')[0];
				feedSource = '[/center][right][url=' + feedSource + '][Source][/url][/right]';
			}
			
			//engine.log(data);
			
			if ((data.indexOf('<item>') > 0) || (data.indexOf('<entry>') > 0)) {
				var des2OutText = HeaderText+'\n\n';
				
				var FeedArrayURL = [];
				var FeedArrayTITLE = [];
				var FeedArrayDATE = [];
				var FeedArrayCREATOR = [];
				var FeedArrayCATEGORY = [];
				var FeedArraySHORTDESC = [];
				
				var forSearch, matchSearch, eforSearch, sTitle, cTitle, sDate, cDate, sLink, mLink, eLink, sCreator, eCreator;
				
				if (data.search('<item>') > 0) {
					matchSearch = /<item>/g;
					forSearch = '<item>';
					eforSearch = '</item>';
					sTitle = '<title';
					mTitle = '>';
					eTitle = '</title>';
					sDate = '<pubDate>';
					eDate = '</pubDate>';
					sLink = '<link';
					mLink = '>';
					eLink = '</link>';
					sCreator = 'creator>';
					eCreator = '</dc:creator>';
					sCategory = '<category>';
					eCategory = '</category>';
					sShortDesc = '<description';
					mShortDesc = '>';
					eShortDesc = '</description>';
				} else if (data.search('<entry>') > 0) {
					matchSearch = /<entry>/g;
					forSearch = '<entry>';
					eforSearch = '</entry>';
					sTitle = '<title';
					mTitle = '>';
					eTitle = '</title>';
					sDate = '<published>';
					eDate = '</published>';
					sLink = '<id';
					mLink = '>';
					eLink = '</id>';
					sCreator = 'name>';
					eCreator = '</name>';
					sCategory = '<category>';
					eCategory = '</category>';
					sShortDesc = '<summary';
					mShortDesc = '>';
					eShortDesc = '</summary>';
				}
				var findEnd = data.search(forSearch)+forSearch.length;
				
				for (var j = 0; j < data.match(matchSearch).length; j++) {
					var findtitle = data.indexOf(sTitle, findEnd);
					var findtitlemiddle = data.indexOf(mTitle, findtitle)+mTitle.length;
					var findtitleend = data.indexOf(eTitle, findtitlemiddle);
					var findDate = data.indexOf(sDate, findEnd)+sDate.length;
					var findDateend = data.indexOf(eDate, findDate);
					var findLink = data.indexOf(sLink, findEnd);
					var findLinkmiddle = data.indexOf(mLink, findLink)+mLink.length;
					var findLinkend = data.indexOf(eLink, findLinkmiddle);
					var findCreator = data.indexOf(sCreator, findEnd)+sCreator.length;
					var findCreatorend = data.indexOf(eCreator, findCreator);
					var findCategory = data.indexOf(sCategory, findCategory)+sCategory.length;
					var findCategoryend = data.indexOf(eCategory, findCategory);
					var findShortDesc = data.indexOf(sShortDesc, findEnd);
					var findShortDescmiddle = data.indexOf(mShortDesc, findShortDesc)+mShortDesc.length;
					var findShortDescend = data.indexOf(eShortDesc, findShortDescmiddle);
					
					var SearchFeedURL = data.substr(findLinkmiddle, findLinkend - findLinkmiddle);
					var SearchFeedTITLE = data.substr(findtitlemiddle, findtitleend - findtitlemiddle);
					var SearchFeedDATE = data.substr(findDate, findDateend - findDate);
					var SearchFeedCREATOR = data.substr(findCreator, findCreatorend - findCreator);
					var SearchFeedCATEGORY = data.substr(findCategory, findCategoryend - findCategory);
					var SearchFeedSHORTDESC = data.substr(findShortDesc, findShortDescend - findShortDesc);
					SearchFeedSHORTDESC = SearchFeedSHORTDESC.replace(/(<([^>]+)>)/ig,"").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '>').replace(/\n\s*\n/g, '\n');
					if (SearchFeedSHORTDESC.length > ShortDescLength) {
						SearchFeedSHORTDESC = SearchFeedSHORTDESC.substring(0, ShortDescLength) + '...';
					}
					
					findEnd = data.indexOf(eforSearch, findEnd)+eforSearch.length;
					
					var countLinks = SearchFeedSHORTDESC.split(/http/g).length -1;
					var oldindex = 0;
					for (var u = 0; u < countLinks; u++) {
						linkIndex = SearchFeedSHORTDESC.indexOf('http', oldindex);
						match = SearchFeedSHORTDESC.substring(linkIndex);
						getlink = match.split(' ')[0];
						convlink = getlink.replace(getlink, '[url=' + getlink + '][Link*][/url]').replace(/(?:\r\n|\r|\n)/g, '');
						SearchFeedSHORTDESC = SearchFeedSHORTDESC.replace(getlink, convlink);
						oldindex = linkIndex+6;
					}
					
					FeedArrayURL.push(SearchFeedURL);
					FeedArrayTITLE.push(SearchFeedTITLE);
					FeedArrayDATE.push(SearchFeedDATE);
					FeedArrayCREATOR.push(SearchFeedCREATOR);
					FeedArrayCATEGORY.push(SearchFeedCATEGORY);
					FeedArraySHORTDESC.push(SearchFeedSHORTDESC);
					
					if (maxFeeds != 0) {
						if (j+1 == maxFeeds) {
							break;
						}
					}
				}
				
				var dateshow = '';
				
				for (var i = 0; i < FeedArrayURL.length; i++) {
					if (unescape == 1) {
						FeedArrayTITLE[i] = decodeURI(FeedArrayTITLE[i]);
					}
					
					if (typeof FeedArrayTITLE[i].match(/&#/gi) !== 'undefined') {
						var editVar = '';
						var findeEnd = 0;
						for (var z = 0; z < FeedArrayTITLE[i].match(/&#/gi).length; z++) {
							var findedit = FeedArrayTITLE[i].indexOf('&#', findeEnd);
							var findeditend = FeedArrayTITLE[i].indexOf(';', findedit)+1;
							
							editVar = editVar + FeedArrayTITLE[i].substr(findeEnd, findedit - findeEnd);
							
							var umlautis = FeedArrayTITLE[i].substr(findedit, findeditend - findedit);
							
							if (umlautis == "&#xC4;") { editVar = editVar + "Ä"; }
							if (umlautis == "&#xE4;") { editVar = editVar + "ä"; }
							if (umlautis == "&#xD7;") { editVar = editVar + "Ö"; }
							if (umlautis == "&#xF6;") { editVar = editVar + "ö"; }
							if (umlautis == "&#xDC;") { editVar = editVar + "Ü"; }
							if (umlautis == "&#xFC;") { editVar = editVar + "ü"; }
							if (umlautis == "&#xDF;") { editVar = editVar + "ß"; }
							
							findeEnd = findeditend;
						}
						FeedArrayTITLE[i] = editVar;
					}
					if (data.search('<item>') > 0) {
						dateshow = FeedArrayDATE[i].replace(',','').split(' ');
						var Fday = dateshow[1];
						var Fmonth = dateshow[2];
						var Fyear = dateshow[3];
						var Ftime = dateshow[4];
					} else if (data.search('<entry>') > 0) {
						dateshow = FeedArrayDATE[i].split('T');
						dateshow = dateshow[0].split('-');
						var Fday = dateshow[2];
						var Fmonth = dateshow[1];
						var Fyear = dateshow[0];
					}
					var refreshedAt = '[center][i][Refreshed: ' + new Date()  + '][/i][/center]';
										
					des2OutText = des2OutText + FeedArray.replace('%FeedURL', FeedArrayURL[i]).replace('%FeedTitle', FeedArrayTITLE[i]).replace('%FeedCreator', '[b]' + FeedArrayCREATOR[i] + '[/b]').replace('%FeedTime', Ftime).replace('%FeedCategory', FeedArrayCATEGORY[i]).replace('%FeedShortDesc', FeedArraySHORTDESC[i]);
					des2OutText = des2OutText.replace('%Feedmonth', Fmonth).replace('%Feedday', Fday).replace('%Feedyear', Fyear);
					des2OutText = des2OutText + '\n\n';
				}
				
				var channelName = '';
				if (LastFeedasChannelName == 0) {
					Channel.setDescription(des2OutText + feedSource);
				}
				if (LastFeedasChannelName == 1) {
					if (ascspacer == 1) {
						channelName = '[cspacer]';
					}
					channelName = channelName + FeedArrayTITLE[0];
					if (channelName.length >= 40) {
						channelName = channelName.substring(0,37)+'...';
					}
				
				var event = require('event');
				event.on('clientMove', function (ev) {
					var msg = 'Test';
					msg = msg.replace(/%n/g, ev.client.name());
					if (ev.fromChannel == undefined) {
						if (config.type == 0) {
							//ev.client.chat(msg);
						} else {
							//ev.client.poke(msg);
						}
						return;
					}
				});
				
				if (des2OutText != des2OutTextIS[x]) {
					Channel.setDescription(des2OutText + feedSource + refreshedAt);
					Channel.setName(channelName);
					des2OutTextIS[x] = des2OutText;
				}
			} else {
				engine.log('ERROR: Feed ' + (x+1) + ' has no results!');
			}
		});
	}
});