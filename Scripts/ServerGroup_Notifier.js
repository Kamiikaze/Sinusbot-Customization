registerPlugin({
    name: 'ServerGroup Notifications',
    version: '1.0',
    description: 'Script will send a custom message/poke to a Usersin configured ServerGroups.',
    author: 'Kamikaze <admin@xKamikaze.de>',
    vars: {
		a_ActiveGuestSupport: {
			indent: 0,
			title: "Activate Guest Support",
			type: "select",
			options: ["Yes", "No"]
		},
		aaa_GuestSupportArray: {
			title: "Guest / Support Notifications",
			type: "array",
			conditions: [
				{ field: 'a_ActiveGuestSupport', value: 0 }
			]
			vars: [
				{
					name: "GuestChannel",
					title: "Channel where Users getting a message",
					indent: 2,
					type: "channel"
				},
				{
					name: "guestGroupID",
					title: "Guest GroupID",
					indent: 2,
					type: "strings"
				},
				{
					name: "guestMessage",
					title: "Guest Message ( %user% = Username | %firstConnect% = Date of first connection | %clientsOnline% = Amount of Users online | %joinedChannel% = Channel where the Client joined )",
					indent: 2,
					type: "multiline"
				},
				{
					name: "supportGroupID",
					title: "Supporter GroupID",
					indent: 2,
					type: "strings"
				},
				{
					name: "supportMessage",
					title: "Supporter Message ( %user% = Username | %firstConnect% = Date of first connection | %clientsOnline% = Amount of Users online | %joinedChannel% = Channel where the Client joined )",
					indent: 2,
					type: "multiline"
				}
			]
		},
		z_notifys: {
			title: "Notifications",
			type: "array",
			vars: [
				{
					name: "Channel",
					title: "Channel for notify",
					indent: 2,
					type: "channel"
				},
				{
					name: "groupID",
					title: "The Server Group ID ( 'all' for every user )",
					indent: 2,
					type: "string"
				},
				{
					name: "msgtype",
					title: "Message Type",
					indent: 2,
					type: "select"
					options: ["Poke", "Private"]
				},
				{
					name: "msg",
					title: "Message ( %user% = Username | %firstConnect% = Date of first connection | %clientsOnline% = Amount of Users online | %joinedChannel% = Channel where the Client joined )",
					indent: 2,
					type: "multiline"
				}
			]
		}
	}
}, function(sinusbot, config) {
	var engine = require('engine');
	var event = require('event');
	var backend = require('backend');
	var format = require('format');
	
	var gsarray = config.aaa_GuestSupportArray;
	var notifyarray = config.z_notifys;
	var clientsOnline = backend.getClients().length;
	
	if (notifyarray == undefined) {
		notifyarray = 0
	}
	
	event.on('clientMove', function(ev) {
		
		var rplUsername = ev.client.name()
		rplUsername = "[URL=client://" + ev.client.id() + "/" + ev.client.uid() + "]" + rplUsername + "[/URL]"
		var rplCreatedAt = new Date(ev.client.getCreationTime())
		monthNames = [
			"01", "02", "03",
			"04", "05", "06", "07",
			"08", "09", "10",
			"11", "12"];
		day = rplCreatedAt.getDate();
		monthIndex = rplCreatedAt.getMonth();
		year = rplCreatedAt.getFullYear();
		rplCreatedAt = ("0" + day).slice(-2) + "." + monthNames[monthIndex] + '.' + year + " - " + ("0" + rplCreatedAt.getHours()).slice(-2) + ":" + ("0" + rplCreatedAt.getMinutes()).slice(-2) + ":" + ("0" + rplCreatedAt.getSeconds()).slice(-2)
		if (ev.toChannel !== undefined) {
			var rplJoinedChannel = ev.toChannel.name();
		}
		
		function MsgPlaceholder(msg) {
			msg = msg	.replace('%user%', rplUsername)
						.replace('%firstConnect%', rplCreatedAt)
						.replace('%clientsOnline%', clientsOnline)
						.replace("%joinedChannel%", rplJoinedChannel)
			return msg
		}
		
		
		for (var x = 0; x < notifyarray.length; x++) {
			
			var Channel = notifyarray[x].Channel;
			Channel = backend.getChannelByID(Channel);
			var ServerGroup = notifyarray[x].groupID;
			var Msg = notifyarray[x].msg;
			var MsgType = notifyarray[x].msgtype;
			var Client = ''
			var ClientId = ''
					
			for (var i = 0; i < Channel.getClients().length; i++) {
				Client = Channel.getClients()[i]
				clUID = Client.uid()
				clServerGroups = Client.getServerGroups()

				Msg = "\n" + MsgPlaceholder(Msg)
				
				for (var a = 0; a < clServerGroups.length; a++) {
					if (clServerGroups[a].id() == ServerGroup && Client.name() == ev.client.name()) {
						if (MsgType == 0) {
							ev.client.poke(Msg);
						} else {
							ev.client.chat(Msg);
						}
					}
				}
			} //end-for getClients
			
			if (ServerGroup == 'all' && Channel.id() == ev.toChannel.id() ) {
				//engine.log('da')
				if (MsgType == 0) {
					ev.client.poke(Msg);
				} else {
					ev.client.chat(Msg);
				}
			}
		} //end-for notifyarray-loop
		
		for (var z = 0; z < gsarray.length; z++) {

			var ActiveGuestSupport = config.a_ActiveGuestSupport // 0|yes ; 1|no
			var guestGroupID = gsarray[z].guestGroupID
			var guestMsg = gsarray[z].guestMessage
			var supportGroupID = gsarray[z].supportGroupID
			var supportMsg = gsarray[z].supportMessage
			var GuestChannel = gsarray[z].GuestChannel
			GuestChannel = backend.getChannelByID(GuestChannel)
			var clients = backend.getClients()
			
			function getClientsWithGroup(clients, groupId) {
				// filter clients
				return clients.filter(function(client) {
					// check if clients has matching group
					return client.getServerGroups().some(function(clGroup) {
						return clGroup.id() == groupId
					})
				})
			}
					
			if (ev.toChannel !== undefined) {
				//engine.log('1') 
				//engine.log('GuestChannel: ' + GuestChannel.id())
				//engine.log('ev.toChannel: ' + ev.toChannel.id())
				if (ev.toChannel.id() == GuestChannel.id()) {
					if (ActiveGuestSupport == 0) {
						// Get ServerGroupId of moved user
						ev.client.getServerGroups().forEach(function(svg) {
							svgid = svg.id()
							guestGroupID.forEach(function(gugID) {
								// If moved user is in guestGroups send msg
								if (svgid == gugID) {
									ev.client.chat(MsgPlaceholder(guestMsg))
									//Notify Support Group
									supportGroupID.forEach(function(sugID) {
										var clientsWithGroup = getClientsWithGroup(clients, sugID)
										clientsWithGroup.forEach(function(clWG) {
											clWG.chat("\n" + MsgPlaceholder(supportMsg))
										})
									})
								}
							})
						})
					}
				}
			}
		}

		
	}); //end clientMove-event
	
}); //end plugin




