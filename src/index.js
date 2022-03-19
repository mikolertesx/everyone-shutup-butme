const { Client, Intents, Permissions } = require("discord.js");
const strings = require("./strings");

if (process.env.NODE_ENV === "dev") {
	require("dotenv").config();
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

if (process.env.TOKEN === null) {
	throw Error("No Token was provided");
}

client.on("ready", () => {
	console.log(strings.CLIENT_ERROR(client.user.tag));
});

client.on("messageCreate", (message) => {
	if (message.author.bot) {
		return;
	}

	if (
		!message.content.startsWith(strings.MUTE_START) &&
		!message.content.startsWith(strings.UNMUTE_START)
	) {
		return;
	}
	
	if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
		message.reply(strings.PERMISSION_ERROR);
		return;
	}


	if (message.content.startsWith(strings.MUTE_START)) {
		muteEveryone(message);
	}

	if (message.content.startsWith(strings.UNMUTE_START)) {
		unmuteEveryone(message);
	}
});

const muteEveryone = (message) => {
	let timer = null;
	const messageSeconds = +message.content.split(" ")[1];
	if (messageSeconds !== undefined && !isNaN(messageSeconds)) {
		timer = messageSeconds;
	}

	message.member.voice.channel.members.forEach((member) => {
		if (member.id !== message.author.id) {
			member.voice.setMute(true);
		}
	});

	if (timer !== null) {
		setTimeout(() => unmuteEveryone(message), timer * 1000);
	}
};

const unmuteEveryone = (message) => {
	message.member.voice.channel.members.forEach((member) => {
		if (member.id !== message.author.id) {
			member.voice.setMute(false);
		}
	});
};

client.login(process.env.TOKEN);
