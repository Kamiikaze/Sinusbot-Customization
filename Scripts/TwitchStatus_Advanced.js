registerPlugin({
	name: 'TwitchStatus Advanced (Custom Overview)',
	version: '2',
	description: 'Twitch Status Plugin with advanced Streamer-Overview.',
	author: 'Kamikaze <admin@xKamikaze.de> and ariaieboy <smr.seddighy@gmail.com>',
	requiredModules: ['http'],
	vars: {
		a_TwitchClientID: {
			title: 'First you need to create a ClientID. Register an App here >> https://dev.twitch.tv/dashboard/apps/create',
			name: 'TwitchClientID',
			indent: 0,
			type: 'string'
		},
		aa_StreamerOverviewActive: {
			title: 'Activate Streamer Overview?',
			name: 'StreamerOverviewActive',
			indent: 0,
			type: 'select',
			options: [
				'Yes',
				'No'
			]
		},
		b_StreamerOverviewChannel: {
			title: 'Select Channel for Streamer Overview:',
			name: 'StreamerOverviewChannel',
			indent: 1,
			type: 'channel',
			conditions: [{
				field: 'aa_StreamerOverviewActive',
				value: 0
			}]
		},
		c_OverviewHeader: {
			title: 'Header of the Overview ( Use Ts formatting. "\\n" for a line-break )',
			name: 'SuffixOrPrefix',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][u][size=+4][COLOR=#00aa00]List of Streamers[/COLOR][/size][/u][/b][/center]\\n\\n',
			conditions: [{
				field: 'aa_StreamerOverviewActive',
				value: 0
			}]
		},
		d_OnlineFormat: {
			title: 'Online Text of Streamer ( %user% Username, %game% Game Playing, %viewer% Viewer Count, %title% Stream Title, %follower% Follower Count, %url% Twitch Profil Link )',
			name: 'OnlineFormat',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n[center][size=10][url=%url%]%title%[/url][/size] \n[COLOR=#ff5500]Playing [b]%game%[/b] \n[b]Viewer:[/b] %viewer% | [b]Follower:[/b] %follower%[/COLOR][/center] \n\n\n',
			conditions: [{
				field: 'aa_StreamerOverviewActive',
				value: 0
			}]
		},
		e_OfflineFormat: {
			title: 'Offline Text of Streamer ( %user% Username, %game% Game Playing, %viewer% Viewer Count, %title% Stream Title, %follower% Follower Count, %url% Twitch Profil Link )',
			name: 'OfflineFormat',
			indent: 1,
			type: 'multiline',
			placeholder: '[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n[center]Stream is currently offline! \n[url=%url%]>> Go to Channel[/url][/center] \\n\\n\\n',
			conditions: [{
				field: 'aa_StreamerOverviewActive',
				value: 0
			}]
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
		m_TwitchArrays: {
			title: "Twitch Users",
			type: "array",
			vars: [{
					name: "TwitchUser",
					title: "Twitch Username",
					type: "string"
				},
				{
					name: "TsUser",
					title: "Teamspeak User UID (Example: gqfsRLZ7doaEsv35pdufFB/dkAM=)",
					type: "string"
				},
				{
					name: "TwitchUID",
					title: "Twitch User ID ",
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
		x_StreamerGroup: {
			title: 'Twitch Streamer "Server Group ID" (Assigned when Live and removed when offline)',
			name: 'StreamerGroup',
			indent: 0,
			type: 'number'
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
		zzz_debugLogging: {
			title: 'Enables more detailed Logging (Only use it if you run into problems, performance intensive)',
			name: 'debugLogging',
			indent: 0,
			type: 'select',
			options: [
				'No',
				'Yes'
			]
		},

	}
}, function (_, config, meta) {
	console.log("TwitchStatus Advanced started..");
	var engine = require('engine');
	var event = require('event');
	var backend = require('backend');
	const http = require('http');

	var SOactive = config.aa_StreamerOverviewActive;
	var SOchannel = config.b_StreamerOverviewChannel;
	var Channel = backend.getChannelByID(SOchannel);
	var TwitchArray = config.m_TwitchArrays;
	var TwitchClientID = config.a_TwitchClientID;
	var callbacks = 0;
	var msg = "";
	var debugLogging = config.zzz_debugLogging;

	var StreamerGroup = backend.getServerGroupByID(config.x_StreamerGroup);
	var DescHeader = config.c_OverviewHeader;
	var OnlineText = config.d_OnlineFormat;
	var OfflineText = config.e_OfflineFormat;

	if (!debugLogging || debugLogging == 0) {
		debugLogging = 0;
		console.log("Debug-Logging Disabled");
	}

	if (!DescHeader) {
		DescHeader = "[center][b][u][size=+4][COLOR=#00aa00]List of Streamers[/COLOR][/size][/u][/b][/center]\n\n";
	} else {
		DescHeader = config.c_OverviewHeader;
	}

	if (!OnlineText) {
		OnlineText = "[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n" +
			"[center][size=10][url=%url%]%title%[/url][/size] \n\n" +
			"[COLOR=#ff5500]Playing [b]%game%[/b] \n" +
			"[b]Viewer:[/b] %viewer% | " +
			"[b]Follower:[/b] %follower%[/COLOR][/center] \n\n\n";
	} else {
		OnlineText = config.d_OnlineFormat;
	}

	if (!OfflineText) {
		OfflineText = "[center][b][size=+2][COLOR=#00ff00]%user%[/COLOR][/size][/b][/center] \n" +
			"[center]Stream is currently offline! \n" +
			"[url=%url%]>> Go to Channel[/url][/center] \n\n\n";
	} else {
		OfflineText = config.e_OfflineFormat;
	}

	function debugLog(msg) {
		if (debugLogging = 1) {
			engine.log("DEBUG: " + msg);
		}
	}

	function refreshOverview() {
		if (SOactive == 0) {
			engine.log("refreshOverview() starting..");
			TwitchArray.forEach(function (Twitch) {
				var twitchid = Twitch.TwitchUID;
				var twitchUser = Twitch.TwitchUser;
				debugLog("Getting Data for User: " + twitchUser);

				http.simpleRequest({
					method: "GET",
					url: "https://api.twitch.tv/kraken/streams/" + twitchid + "?stream_type=live",
					timeout: 60000,
					headers: {
						"Accept": "application/vnd.twitchtv.v5+json",
						"Client-ID": TwitchClientID
					}
				}, function (error, response) {

					var data = JSON.parse(response.data);
					var twitchGame = "",
						twitchViewer = "",
						twitchTitel = "",
						twitchFollower = "",
						twitchUrl = "";

					if (!data.stream) {
						debugLog("No Data returned: " + data.stream)
						twitchUrl = "https://www.twitch.tv/" + twitchUser
						msg += OfflineText;

					} else {
						debugLog("Data returned for: " + data.stream.channel.display_name)
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

					callbacks++;
					debugLog("callback" + callbacks);
					debugLog("lenght" + TwitchArray.length);
					if (callbacks == TwitchArray.length) {
						debugLog("Setting Description..");
						Channel.setDescription(DescHeader + msg);
					}
				});
			});
			callbacks = 0;
			msg = "";
		}
	}

	function refreshStatus() {
		engine.log("refreshStatus() starting..");
		TwitchArray.forEach(function (Twitch1) {

			var TwitchUser = Twitch1.TwitchUser;
			var TwitchID = Twitch1.TwitchUID;
			var TsUser = Twitch1.TsUser;
			var Channel = Twitch1.Channel;
			Channel = backend.getChannelByID(Channel);
			var ChannelName = Twitch1.ChannelName;
			var URL = "https://api.twitch.tv/kraken/streams/" + TwitchID + "?stream_type=live";

			if (TsUser.includes("=")) { // UID
				TsClient = backend.getClientByUID(TsUser);
			} else {
				engine.log("UID not found");
				return;
			}

			debugLog("Getting Data for " + TwitchUser);

			http.simpleRequest({
				method: "GET",
				url: URL,
				timeout: 60000,
				headers: {
					"Client-ID": TwitchClientID,
					"Accept": "application/vnd.twitchtv.v5+json"
				}
			}, function (error, response) {

				var data = response.data
				data = JSON.parse(data)
				if (!data.stream) {
					debugLog(TwitchUser + " Status is Offline")
					if (config.f_SuffixOrPrefix == 0) {
						Channel.setName(ChannelName + config.g_StatusFormatOffline)
					} else {
						ChannelName = ChannelName.split("]");
						Channel.setName(ChannelName[0] + "]" + config.g_StatusFormatOffline + ChannelName[1])
					}
					TsClient.removeFromServerGroup(StreamerGroup.id());
					//TODO: Check if Client online

				} else {
					debugLog(TwitchUser + " Status is Online")
					if (config.f_SuffixOrPrefix == 0) {
						Channel.setName(ChannelName + config.h_StatusFormatOnline)
					} else {
						ChannelName = ChannelName.split("]");
						Channel.setName(ChannelName[0] + "]" + config.h_StatusFormatOnline + ChannelName[1])
					}
					StreamerGroup.addClientByDatabaseId(TsClient);
					//TODO: Check if Client online
				}
			})
		})
	}

	refreshOverview();
	refreshStatus();
	setInterval(refreshStatus, config.z_RefreshStatus * 60000); // 1 min.
	setInterval(refreshOverview, config.y_RefreshOverview * 60000); // 5 min

});
