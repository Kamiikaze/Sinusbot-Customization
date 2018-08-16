registerPlugin({
    name: 'TwitchStatus Advanced (Custom Overview)',
    version: '1.0.0',
    description: 'Twitch Status Plugin with advanced Streamer-Overview.',
    author: 'Kamikaze <admin@xKamikaze.de>',
    vars: {
		a_StreamerOverviewActive: {
			title: 'Activate Streamer Overview?',
			name: 'StreamerOverviewActive',
			indent: 0,
			type: 'select',
			options: [
				'Ja',
				'Nein'
			]
		},
		b_StreamerOverviewChannel: {
			title: 'Select Channel for Streamer Overview:',
			name: 'StreamerOverviewActive',
			indent: 1,
			type: 'channel',
			conditions: [
				{ field: 'StreamerOverviewActive', value: 0 }
			]
		},
		c_OverviewHeader: {
			title: 'Header of the Overview ( Use Ts formatting. "\\n" for a line-break )',
			name: 'SuffixOrPrefix',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][u][size=+4][COLOR=#00aa00]List of Streamers[/COLOR][/size][/u][/b][/center]\\n\\n',
			conditions: [
				{ field: 'StreamerOverviewActive', value: 0 }
			]
		},
		d_OnlineFormat: {
			title: 'Online Text of Streamer ( %user% Username, %game% Game Playing, %viewer% Viewer Count, %title% Stream Title, %follower% Follower Count, %url% Twitch Profil Link )',
			name: 'OnlineFormat',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n[center][size=10][url=%url%]%title%[/url][/size] \n[COLOR=#ff5500]Playing [b]%game%[/b] \n[b]Viewer:[/b] %viewer% | [b]Follower:[/b] %follower%[/COLOR][/center] \n\n\n',
			conditions: [
				{ field: 'StreamerOverviewActive', value: 0 }
			]
		},
		e_OfflineFormat: {
			title: 'Offline Text of Streamer ( %user% Username, %game% Game Playing, %viewer% Viewer Count, %title% Stream Title, %follower% Follower Count, %url% Twitch Profil Link )',
			name: 'OfflineFormat',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n[center]Stream is currently offline! \n[url=%url%]>> Go to Channel[/url][/center] \\n\\n\\n',
			conditions: [
				{ field: 'StreamerOverviewActive', value: 0 }
			]
		},
		f_SuffixOrPrefix: {
			title: 'Showing Status Behind(Suffix) or Before(Prefix) Channelname? ! If Prefix, you need to add [cspacer] !',
			name: 'SuffixOrPrefix',
			indent: 0,
			type: 'select',
			options: [
				'Suffix',
				'Prefix'
			]
		},
		g_StatusFormatOffline: {
			title: 'How the Status should be displayed when Offline?',
			name: 'StatusFormatOffline',
			indent: 0,
			type: 'string'
		},
		h_StatusFormatOnline: {
			title: 'How the Status should be displayed when Online?',
			name: 'StatusFormatOnline',
			indent: 0,
			type: 'string'
		},
		x_TwitchArrays: {
			title: "Twitch Users",
			type: "array",
			vars: [
				{
					name: "TwitchUser",
					title: "Twitch Username",
					type: "string"
				},
				{
					name: "Channel",
					title: "Select the Channel",
					type: "channel"
				},
				{
					name: "ChannelName",
					title: "Default Name of the Channel",
					type: "string"
				}
			]
		},
		y_RefreshOverview: {
			title: 'Time (in Minutes) to refresh Overview',
			name: 'RefreshOverview',
			indent: 0,
			type: 'number'
		},
		z_RefreshStatus: {
			title: 'Time (in Minutes) to refresh Channel-Status',
			name: 'RefreshStatus',
			indent: 0,
			type: 'number'
		},
		
	}
}, function(sinusbot, config) {
	var engine = require('engine')
	var event = require('event')
	var backend = require('backend')
	
	var SOactive = config.a_StreamerOverviewActive
	var SOchannel = config.b_StreamerOverviewChannel
	var Channel = backend.getChannelByID(SOchannel)
	var TwitchArray = config.x_TwitchArrays
	var callbacks = 0
	var msg = ""
	
	var DescHeader = config.c_OverviewHeader;
	var OnlineText = config.d_OnlineFormat;
	var OfflineText = config.e_OfflineFormat;
	
	if (!DescHeader) {
		DescHeader =	"[center][b][u][size=+4][COLOR=#00aa00]Unsere Streamer[/COLOR][/size][/u][/b][/center]\n\n";
	} else {
		DescHeader = config.c_OverviewHeader;
	}
	if (!OnlineText) {
		OnlineText = 	"[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n" +
						"[center][size=10][url=%url%]%title%[/url][/size] \n\n" +
						"[COLOR=#ff5500]Playing [b]%game%[/b] \n" +
						"[b]Viewer:[/b] %viewer% | " +
						"[b]Follower:[/b] %follower%[/COLOR][/center] \n\n\n";
	} else {
		OnlineText = config.d_OnlineFormat;
	}
	if (!OfflineText) {
		OfflineText =	"[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n" + 
						"[center]Stream is currently offline! \n" +
						"[url=%url%]>> Go to Channel[/url][/center] \n\n\n";
	} else {
		OfflineText = config.e_OfflineFormat;
	}
	
	function refreshOverview() {
		if (SOactive == 0) {
			engine.log("refreshOverview() starting..")
			TwitchArray.forEach(function (Twitch) {
				var twitchUser = Twitch.TwitchUser;
				//engine.log(TwitchUser)
		 
				sinusbot.http({
					method: "GET",
					url: "https://api.twitch.tv/kraken/streams/" + twitchUser + "?stream_type=live",
					timeout: 60000,
					headers: { "Client-ID": "09yqfi2m1ggvcumavhvql1j7mcadql" }
				}, function (error, response) {
					
					var data = JSON.parse(response.data);
					var twitchGame = "",
						twitchViewer = "",
						twitchTitel = "",
						twitchFollower = "",
						twitchUrl = "";
					
					if (!data.stream) {
						
						twitchUrl = "https://www.twitch.tv/" + twitchUser
						msg += OfflineText;
						
					} else {
						
						msg += OnlineText;
						
						twitchUser = data.stream.channel.display_name;
						twitchGame = data.stream.game;
						twitchViewer = data.stream.viewers;
						twitchTitel = data.stream.channel.status;
						twitchFollower = data.stream.channel.followers;
						twitchUrl = data.stream.channel.url;

					}
					msg = msg.replace("%user%", twitchUser.toUpperCase())
						.replace("%game%", twitchGame)
						.replace("%viewer%", twitchViewer)
						.replace("%title%", twitchTitel)
						.replace("%follower%", twitchFollower)
						.replace("%url%", twitchUrl);
						
					callbacks++
					
					if (callbacks == TwitchArray.length) {
						//engine.log("Ready");
						Channel.setDescription(DescHeader + msg);
					}
				});
			});
		}
	}

	function refreshStatus() {
		engine.log("refreshStatus() starting..")
		TwitchArray.forEach(function(Twitch1) {
			
			var TwitchUser = Twitch1.TwitchUser
			var Channel = Twitch1.Channel;
			Channel = backend.getChannelByID(Channel);
			var ChannelName = Twitch1.ChannelName;
			
			var URL = "https://api.twitch.tv/kraken/streams/" + TwitchUser + "?stream_type=live"
			
			//engine.log("Getting Data for " + TwitchUser)
			
			sinusbot.http({
					method: "GET", 
					url: URL, 
					timeout: 60000, 
					headers: {"Client-ID": "09yqfi2m1ggvcumavhvql1j7mcadql"}
				}, function (error, response) {
					
					var data = response.data
					data = JSON.parse(data)
						engine.log(config.f_SuffixOrPrefix)
					if (!data.stream) {
						//engine.log(TwitchUser + "Status is Offline")
						if (config.f_SuffixOrPrefix == 0) {
							Channel.setName(ChannelName + config.g_StatusFormatOffline)
						} else {
							ChannelName = ChannelName.split("]");
							Channel.setName(ChannelName[0] + "]" + config.g_StatusFormatOffline + ChannelName[1])
						}
						
					} else {
						//engine.log(TwitchUser + "Status is Online")
						if (config.f_SuffixOrPrefix == 0) {
							Channel.setName(ChannelName + config.h_StatusFormatOnline)
						} else {
							ChannelName = ChannelName.split("]");
							Channel.setName(ChannelName[0] + "]" + config.h_StatusFormatOnline + ChannelName[1])
						}
					}
				}
			)
		})
	}
	
	refreshOverview();
	refreshStatus();
	setInterval(refreshStatus, config.z_RefreshStatus * 60000); // 1 min.
	setInterval(refreshOverview, config.y_RefreshOverview * 60000); // 5 min
	
})