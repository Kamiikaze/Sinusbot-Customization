registerPlugin({
    name: 'LookForGroup Notifications',
    version: '1.0.0',
    description: 'Notifies Players that someone is looking for mates to play with.',
    author: 'Kamikaze <admin@xKamikaze.de>',
    vars: {
		SpielerSucheArray: {
			indent: 0,
			title: 'Config',
			type: 'array',
			vars: [
				{
					name: 'warteCh',
					indent: 1,
					title: 'LookForGroup Channel',
					type: 'channel'
				},
				{
					name: 'gameCh',
					indent: 1,
					title: 'Game Channel-Id (Must be a Head-Channel, so all Sub-Channels getting a message)',
					type: 'strings'
				},
				{
					name: 'msg',
					indent: 1,
					title: 'Message (%user% - Username of waiting Player, %channel% - In which Channel the User is waiting.',
					type: 'multiline'
				}
			]
	}
	}
}, function(sinusbot, config) {
	
	var engine = require('engine');
	var event = require('event');
	var backend = require('backend');
	
	function log(msg) {
		var logging = engine.log(msg)
		return logging
	}
	
	config.SpielerSucheArray.forEach(function(ssa) {
		var warteCh = ssa.warteCh
		var gameCh = ssa.gameCh
		var msg = ssa.msg
		
		event.on("clientMove", function(ev) {
			
			function MsgPlaceholder(msg) {
				var rplUsername = ev.client.name()
				rplUsername = "[URL=client://" + ev.client.id() + "/" + ev.client.uid() + "~" + encodeURI(rplUsername) + "]" + rplUsername + "[/URL]"
				msg = msg	.replace(/%user%/g, rplUsername)
									.replace(/%channel%/g, ev.toChannel.name())
				return msg
			}
			
			if ( ev.toChannel.id() == warteCh ) {
				var Clients = backend.getClients()
				Clients.forEach(function(client) {
					clChannel = client.getChannels()
					clChannel.forEach(function(pch) {
						if (pch.parent()) {
							pch = pch.parent().id()	
							gameCh.forEach(function(gCh) {
								if (pch == gCh) {
									client.chat(MsgPlaceholder(msg))
								}
							})
						}
						
					})
				})
			}
		})
	})
})