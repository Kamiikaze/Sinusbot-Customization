registerPlugin({
    name: 'Auto Channel Creator',
    version: '0.6.0',
    backends: ['ts3'],
    engine: '>= 0.13.37',
    description: 'Created automatically when channels needed',
    author: 'Filtik <filtik@gmx.net>',
    vars: [{
		name: 'ShowLog',
		indent: 1,
		title: 'Show Logs?',
		type: 'select',
		options: [
			'NO',
			'YES'
		]
	}, {
		name: "Channels",
		title: 'Channels',
		type: 'array',
		vars: [{
			name: 'GroupChannel',
			indent: 1,
			title: 'Group channel',
			type: 'channel'
		}, {
			name: 'ChannelPrefixArray',
			indent: 1,
			title: 'Prefix with count or array names?',
			type: 'select',
			options: [
				'Prefix with count',
				'Array names'
			]
		}, {
			name: 'ChannelPrefix',
			indent: 2,
			title: 'Prefix for channel',
			type: 'string',
			conditions: [
				{ field: 'ChannelPrefixArray', value: 0 }
			]
		}, {
			name: 'ChannelNameArray',
			indent: 2,
			title: 'Array names (Can only create as many channels as indicated)',
			type: 'array',
			conditions: [
				{ field: 'ChannelPrefixArray', value: 1 }
			],
			vars: [ {
					name: 'ChannelName',
					indent: 3,
					type: 'string'
				}]
		}, {
			name: 'ChannelMinChannels',
			indent: 1,
			title: 'Minimum number of existing channels (Works only by normal channel)',
			type: 'number'
		}, {
			name: 'ChannelMaxClients',
			indent: 1,
			title: 'Maximum number of clients per channel (Minimal 2)',
			type: 'number'
		}, {
			name: 'ChannelCodec',
			indent: 1,
			title: 'Channel Codec',
			type: 'select',
			options: [
				'Speex Schmalband',
				'Speex Breitband',
				'Speex Ultra-Breitband',
				'CELT Mono',
				'Opus Voice',
				'Opus Music'
			]
		}, {
			name: 'ChannelQuality',
			indent: 1,
			title: 'Channel Quality',
			type: 'select',
			options: [
				1,2,3,4,5,6,7,8,9,10
			]
		}, {
			name: 'ChannelDescription',
			indent: 1,
			title: 'Description for the Channels',
			type: 'multiline'
		}, {
			name: 'ChannelJoinPower',
			indent: 1,
			title: 'Join Power for the Channels',
			type: 'number'
		}, {
			name: 'ChannelTalkPower',
			indent: 1,
			title: 'Talk Power for the Channels',
			type: 'number'
		}, {
			name: 'ChannelPassSet',
			indent: 1,
			title: 'Set Channel Password',
			type: 'select',
			options: [
				'No',
				'Yes'
			]
		}, {
			name: 'ChannelPassword',
			indent: 2,
			title: 'Password for all Channels (if empty, generate automaticlly separately password for all Channels)',
			type: 'string',
			conditions: [
				{ field: 'ChannelPassSet', value: 1 }
			]
		}, {
			name: 'ChannelPwMsg',
			indent: 2,
			title: 'Password Message (%CPw = Channel Password)',
			type: 'string',
			placeholder: 'Welcome in a Privat Channel\nYour password for this Channel is:\n%CPw',
			conditions: [
				{ field: 'ChannelPassSet', value: 1 }
			]
		}, {
			name: 'ChannelPwChangeableSet',
			indent: 2,
			title: 'Password Changeable',
			type: 'select',
			options: [
				'No',
				'Yes'
			],
			conditions: [
				{ field: 'ChannelPassSet', value: 1 }
			]
		}, {
			name: 'ChannelPwChangeCMD',
			indent: 3,
			title: 'Command for Password change',
			type: 'string',
			placeholder: '!ppw',
			conditions: [
				{ field: 'ChannelPassSet', value: 1 },
				{ field: 'ChannelPwChangeableSet', value: 1 }
			]
		}, {
			name: 'ChannelPwChange',
			indent: 3,
			title: 'Password changed message (%CPw = Channel Password)',
			type: 'string',
			placeholder: 'Password changed in: %CPw',
			conditions: [
				{ field: 'ChannelPassSet', value: 1 },
				{ field: 'ChannelPwChangeableSet', value: 1 }
			]
		}, {
			name: 'ChannelPwChangeFail',
			indent: 3,
			title: 'Error message for password change when not channel owner',
			type: 'string',
			placeholder: 'You not the channel owner!',
			conditions: [
				{ field: 'ChannelPassSet', value: 1 },
				{ field: 'ChannelPwChangeableSet', value: 1 }
			]
		}]
	}]
}, function(sinusbot, config) {
	var engine = require('engine');
	var backend = require('backend');
	var event = require('event');
	
	var ShowLog = config.ShowLog;
    var idleChannel = 0;
	var SubChannels = 0;
	var SubChannelsClients = 0;
	var SubChannelDeleteID = 0;
	var DelSubChannels = [];
	var SubChannelsPasswordSended = [];

	if (typeof ShowLog == "undefined" || ShowLog == '') {
		ShowLog = false;
	}
	
	var init = config.Channels;

	if (init === undefined) {
		engine.log('Not definated - beark loading');
		return;
	}

	for (var a = 0; a < init.length; a++) {
		if (typeof config.Channels[a].GroupChannel == 'undefined' || config.Channels[a].GroupChannel == '' || (!config.Channels[a].GroupChannel)) {
			engine.log("Channel not defined - not loaded");
			return;
		}
		if (typeof config.Channels[a].ChannelPrefixArray == 'undefined' || config.Channels[a].ChannelPrefixArray == '') {
			engine.log("No selected if Perfix or Array Channel - not loaded");
			return;
		}
		if (config.Channels[a].ChannelPrefixArray == 0) {
			if (typeof config.Channels[a].ChannelPrefix == 'undefined' || config.Channels[a].ChannelPrefix == '') {
				engine.log("No Channel Prefix defined - not loaded");
				return;
			}
		}
		if (config.Channels[a].ChannelPrefixArray == 1) {
			if (Array.isArray(config.Channels[a].ChannelNameArray) == false) {
				engine.log("No Channel Array Names defined - not loaded");
				return;
			}
			else { 
				if (config.Channels[a].ChannelNameArray[0].ChannelName == '') {
					engine.log("No Channel Array Names defined - not loaded");
					return;
				}
			}
		}
	}

	function code_generate()
	{
		var characters = "abcdefghijklmopqrstuvwxyz1234567890ABCDEFHIJKLMNOPQRSTUSVWXYZ";
		var CodeIs = '';
		for (var p = 0; p < 12; p++) {
		   CodeIs = CodeIs + characters[(Math.floor((Math.random() * characters.length)))];
		}
		return CodeIs;
	}
	
    event.on('clientMove', function(ev) {
		DelSubChannels = [];
		var Client = ev.client;
		
		for (var j = 0; j < config.Channels.length; j++) {
			var channelsdel = backend.getChannels();
			var c = 0;
			var GroupChannel = config.Channels[j].GroupChannel;
			var sortChannel = GroupChannel;
			var NumberSplit;
			var NumberSplitCheck;
			var ChannelPrefix = config.Channels[j].ChannelPrefix;
			var ChannelPrefixArray = config.Channels[j].ChannelPrefixArray;
			var ChannelMinChannels = config.Channels[j].ChannelMinChannels;
			var ChannelMaxClients = config.Channels[j].ChannelMaxClients;
			var ChannelCodec = config.Channels[j].ChannelCodec;
			var ChannelQuality = config.Channels[j].ChannelQuality;
			var ChannelDescription = config.Channels[j].ChannelDescription;
			var ChannelPassSet = config.Channels[j].ChannelPassSet;
			var ChannelPassword = config.Channels[j].ChannelPassword;
			var ChannelPwMsg = config.Channels[j].ChannelPwMsg;
			SubChannels = 0;
			SubChannelsClients = 0;
			SubChannelDeleteID = 0;

			if (SubChannelsPasswordSended.length < config.Channels.length) {
				SubChannelsPasswordSended[j] = new Array();
			}
			
			var ChannelJoinPower = config.Channels[j].ChannelJoinPower;
			var ChannelTalkPower = config.Channels[j].ChannelTalkPower;
			
			if (typeof ChannelJoinPower == "undefined" || ChannelJoinPower == '') {
				ChannelJoinPower = 0;
			}
			if (typeof ChannelTalkPower == "undefined" || ChannelTalkPower == '') {
				ChannelTalkPower = 0;
			}
			
			if (typeof ChannelMinChannels == "undefined" || ChannelMinChannels == '' || ChannelMinChannels < 1) {
				ChannelMinChannels = 1;
			}
			if (typeof ChannelMaxClients == "undefined" || ChannelMaxClients == '') {
				ChannelMaxClients = -1;
			}
			if (typeof ChannelCodec == "undefined" || ChannelCodec == '') {
				ChannelCodec = 4;
			}
			if (typeof ChannelQuality == "undefined" || ChannelQuality == '') {
				ChannelQuality = 5;
			}
			if (typeof ChannelDescription == "undefined" || ChannelDescription == '') {
				ChannelDescription = '';
			}
			if (typeof ChannelPassSet == "undefined" || ChannelPassSet == '') {
				ChannelPassSet = 0;
			}
			if (typeof ChannelPassword == "undefined" || ChannelPassword == '' || ChannelPassSet == 0) {
				ChannelPassword = '';
			}
			if ((typeof ChannelPassword == "undefined" || ChannelPassword == '') && ChannelPassSet == 1) {
				ChannelPassword = code_generate();
			}
			if (typeof ChannelPwMsg == "undefined" || ChannelPwMsg == '') {
				ChannelPwMsg = 'Welcome in a Privat Channel\nYour password for this Channel is:\n%CPw';
			}
			if ((ChannelMaxClients < 2) && (ChannelMaxClients != -1)) {
				ChannelMaxClients = 2;
			}
			
			backend.getChannels().forEach(function(channel) {
				var CH = backend.getChannelByID(channel.id());
				var CHclients = CH.getClientCount();
				var CHparent = CH.parent();
				var CHpassworded = CH.isPassworded();
				if (CHparent) {
					if (CHparent.id() == GroupChannel) {
						if (CHclients > 0) {
							if ((ChannelPassSet == 1) && (ev.toChannel.id() == CH.id()) && (CHclients == 1)) {
								Client.chat(ChannelPwMsg.replace('%CPw', ChannelPassword));
								SubChannelsPasswordSended[j][SubChannelsClients] = (CH.id() + ':' + ev.client.databaseID());
								CH.update({password: ChannelPassword});
							}
							SubChannelsClients++;
						}
						if ((CHclients == 0) && (ChannelPassSet == 1) && (CHpassworded == 1)) {
							delete SubChannelsPasswordSended[j][SubChannelsClients];
							CH.update({password: ''});
						}
						SubChannels++;
					}
				}
			});
			
			if ((SubChannelsClients < ChannelMinChannels) && (ChannelPassSet == 0)) {
				SubChannelsClients = ChannelMinChannels-1;
			}
			
			var ChannelCreateCheck = 1;
			
			if (SubChannels <= SubChannelsClients) {
				var c = 0;
				
				function convert(num) {

					var result = '';
					var rom = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
					var ara = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
					for (var x = 0; x < rom.length; x++) {
						while (num >= ara[x]) {
							result += rom[x];
							num -= ara[x];
						}
					}
					return result;
				}
				
				for (c = 0; c <= SubChannels; c++) {
					if (ChannelPrefixArray == 0) {
						var ChanNum = c+1;
						var ChanName = ChannelPrefix + ' ' + convert(ChanNum);
					}
					if (ChannelPrefixArray == 1) {
						if (c >= config.Channels[j].ChannelNameArray.length-1) {
							engine.log('No more channelnames in array - No more channels createable');
							ChannelCreateCheck = 0;
							break;
						}
						var ChanName = config.Channels[j].ChannelNameArray[c].ChannelName;
					}
					var ifCH = backend.getChannelByName(ChanName);
					if (!ifCH) {
						break;
					}
					else {
						var ifCHparent = ifCH.parent();
						if (ifCHparent) {
							if ((ifCHparent.id() != GroupChannel) || (typeof ifCHparent.id() == "undefined")) {
								break;
							}
						}
						else {
							break;
						}
					}
				}
				var ChannelNameFinish = ChanName;
				
				if (ChannelCreateCheck == 1) {
					var create = backend.createChannel({ name: ChannelNameFinish, parent: GroupChannel, permanent: true, codec: parseInt(ChannelCodec), codecQuality: parseInt(parseInt(ChannelQuality) + 1), maxClients: parseInt(ChannelMaxClients), description: ChannelDescription ,neededTalkPower: parseInt(ChannelTalkPower)});
					if (ShowLog) { engine.log('Channel Create: name: ' + ChannelNameFinish + ', parent: ' + GroupChannel + ', codec: ' + Number(ChannelCodec) + ', codecQuality: ' + parseInt(parseInt(ChannelQuality) + 1) + ', description: ' + ChannelDescription + ', maxClients: ' + parseInt(ChannelMaxClients) + ', neededJoinPower: ' + parseInt(ChannelJoinPower) + ', neededTalkPower: ' + parseInt(ChannelTalkPower)); }
				}
			}
			else if (SubChannels > SubChannelsClients+1) {
				var existnamesdeltemp = 0;
				var existnamesdel = 0;
				DelSubChannels = [];
				
				var channels = backend.getChannels();
				
				for (var i = channels.length-1; i > 0; i--) {
					channel = channels[i];
					var CH = backend.getChannelByID(channel.id());
					var CHclients = CH.getClientCount();
					var CHparent = CH.parent();
					if (CHparent) {
						if (CHparent.id() == GroupChannel) {
							if (CHclients == 0) {
								if (ChannelPassSet == 1) {
									CH.update({password: ''});
								}
								SubChannelDeleteID = CH;
								break;
							}
						}
					}
				}
				
				for (var i = channels.length-1; i > 0; i--) {
					channel = channels[i];
					var CH = backend.getChannelByID(channel.id());
					var CHclients = CH.getClientCount();
					var CHparent = CH.parent();
					if (CHparent) {
						if (CHparent.id() == GroupChannel) {
							if (CHclients == 0) {
								if (ChannelPassSet == 1) {
									CH.update({password: ''});
								}
								DelSubChannels.push(CH.Name());
							}
						}
					}
				}
				
				if (ChannelPrefixArray == 0) {
					DelSubChannels.sort();
				}
				
				SubChannelDeleteID = backend.getChannelByName(DelSubChannels[DelSubChannels.length-1]);
				
				if (SubChannelDeleteID != 0) {
					SubChannelDeleteID.delete();
				}
			}
		}
	});
	
    event.on('chat', function(ev) {
		var IsChannelOwner = false;
		var InGroupChannel = false;
		var cmd = ev.text.split(' ');
		var client = ev.client.databaseID();
		
		for (var j = 0; j < config.Channels.length; j++) {
			var ChannelPassSet = config.Channels[j].ChannelPassSet;
			var ChannelPwChangeableSet = config.Channels[j].ChannelPwChangeableSet;
			var ChannelPwChangeCMD = config.Channels[j].ChannelPwChangeCMD;
			var ChannelPwChange = config.Channels[j].ChannelPwChange;
			var ChannelPwChangeFail = config.Channels[j].ChannelPwChangeFail;
			
			if (typeof ChannelPassSet == "undefined" || ChannelPassSet == '') {
				ChannelPassSet = 0;
			}
			if (typeof ChannelPwChangeableSet == "undefined" || ChannelPwChangeableSet == '') {
				ChannelPwChangeableSet = 0;
			}
			if (typeof ChannelPwChangeCMD == "undefined" || ChannelPwChangeCMD == '') {
				ChannelPwChangeCMD = '!ppw';
			}
			if (typeof ChannelPwChange == "undefined" || ChannelPwChange == '') {
				ChannelPwChange = 'Password changed in: %CPw';
			}
			if (typeof ChannelPwChangeFail == "undefined" || ChannelPwChangeFail == '') {
				ChannelPwChangeFail = 'You not the channel owner!';
			}
			
			if (cmd[0] == ChannelPwChangeCMD) {
				if (typeof SubChannelsPasswordSended[j].length !== 'undefined') {
					for (var i = 0; i < SubChannelsPasswordSended[j].length; i++) {
						if (SubChannelsPasswordSended[j][i] == null) {
							SubChannelsPasswordSended[j][i] = '0:0';
						}
						var ChannelOwner = SubChannelsPasswordSended[j][i].split(':');
						if (ev.channel.id() == ChannelOwner[0]) {
							InGroupChannel = true;
							if (client == ChannelOwner[1]) {
								IsChannelOwner = true;
								break;
							}
						}
					}
				}
			}
		}
		
		if ((cmd[0] == ChannelPwChangeCMD) && (ChannelPwChangeableSet == 1)) {
			if (IsChannelOwner == true) {
				ev.channel.update({password: cmd[1]});
				ev.client.chat(ChannelPwChange.replace('%CPw', cmd[1]));
			}
			else if (IsChannelOwner == false) {
				ev.client.chat(ChannelPwChangeFail);
			}
		}
    });
	
    event.on('channelCreate', function(ev) {
		var CH = backend.getChannelByID(ev.id());
		var CHparent = CH.parent();
		
		for (var i = 0; i < config.Channels.length; i++) {
			
			var GroupChannel = config.Channels[i].GroupChannel;
			if (CHparent) {
				if (CHparent.id() == GroupChannel) {
					var ChannelJoinPower = config.Channels[i].ChannelJoinPower;
					var ChannelTalkPower = config.Channels[i].ChannelTalkPower;
					
					if (typeof ChannelJoinPower == "undefined" || ChannelJoinPower == '') {
						ChannelJoinPower = 0;
					}
					if (typeof ChannelTalkPower == "undefined" || ChannelTalkPower == '') {
						ChannelTalkPower = 0;
					}
					
					//var perm = CH.addPermission('i_channel_needed_join_power'); // JoinPower
					//perm.setValue(parseInt(ChannelJoinPower));
					//perm.save();
					//engine.log("CHPerm: " + perm.value())
					
					//perm = CH.addPermission('i_client_needed_talk_power'); // Talkpower
					//perm.setValue(parseInt(ChannelTalkPower));
					//perm.save();
				}
			}
		}
    });
}); 
