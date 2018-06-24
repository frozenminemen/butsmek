const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const moment = require("moment");
let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}


bot.on('ready', () => {
  console.log("Logged in as " + bot.user.username + ", " + bot.user.id)
  bot.user.setActivity(`HypeLand`, {
    type: "Listening"
  });
});

bot.on('guildCreate', guild => {
  console.log("Am intrat intr-un guild random plm");
});

bot.on('guildMemberAdd', member => {
  member.guild.channels.get('460159450611843082').setName(`🌐 Total Membrii: ${member.guild.memberCount}`)
  let humans = member.guild.members.filter(m => !m.user.bot).size;
  member.guild.channels.get('460159451165491222').setName(`👤 Oameni: ${humans}`)
  let bots = member.guild.members.filter(m => m.user.bot).size;
  member.guild.channels.get('460159452079718400').setName(`🤖 Roboti: ${bots}`)

  member.guild.channels.get('460415125216690176').setName(`👤 Newest: ${member.user.username}`)

  member.guild.channels.get('460415446747971596').setName(`⭐ Goal: ${member.guild.memberCount}/100`)

    let canal = member.guild.channels.find('name', 'welcome');
    canal.send("[**+**] " + member.user.tag + " bine ai venit! <a:tadah:460400354731884564>");
});

bot.on('guildMemberRemove', member => {
    member.guild.channels.get('460159450611843082').setName(`🌐 Total Membrii: ${member.guild.memberCount}`)
    let humans = member.guild.members.filter(m => !m.user.bot).size;
    member.guild.channels.get('460159451165491222').setName(`👤 Oameni: ${humans}`)
    let bots = member.guild.members.filter(m => m.user.bot).size;
    member.guild.channels.get('460159452079718400').setName(`🤖 Roboti: ${bots}`)

    member.guild.channels.get('460415446747971596').setName(`⭐ Goal: ${member.guild.memberCount}/100`)

    let canal = member.guild.channels.find('name', 'welcome');
    canal.send("[**-**] " + member.user.tag + " a plecat! <a:tadah:460400354731884564>");
});

bot.on('message', msg => {
  let messageArray = msg.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


  if(msg.content.startsWith("h!say")) {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("Nu ai permisiunea necesara.");
    msg.channel.send(args.join(" ")).then(msg => {
      msg.react("✔");
    });
  }

  if(msg.content.startsWith("h!serverinfo")) {
    msg.channel.send(`Server: ${msg.guild.name}\nID: ${msg.guild.id}\nMembers: ${msg.guild.memberCount}\nRegion: ${msg.guild.region}\nChannels: ${msg.guild.channels.size}\nOwner: ${msg.guild.owner.user.username}\nCreated: ${msg.guild.createdAt}\nIcon: ${msg.guild.iconURL}\nRoles: ${msg.guild.roles.map(oof => oof.name).join(", ")}`,
    {code: "json"});
  }

  if(msg.content.startsWith("h!daily")) {
    let sender = msg.author;
    if (!userData[sender.id + msg.guild.id]) userData[sender.id + msg.guild.id] = {}
if (!userData[sender.id + msg.guild.id].money) userData[sender.id + msg.guild.id].money = 1000;
if (!userData[sender.id + msg.guild.id].lastDaily) userData[sender.id + msg.guild.id].lastDaily = 'Not Collected';
if (userData[sender.id + msg.guild.id].lastDaily != moment().format('L')) {
userData[sender.id + msg.guild.id].lastDaily = moment().format('L')
userData[sender.id + msg.guild.id].money += 500;
const embed = new Discord.RichEmbed()
.setTitle('Plata zilnica')
.setColor(msg.guild.members.get(bot.user.id).displayHexColor)
.setDescription('500$ au fost adaugati in contul tau.')
msg.channel.send(embed)
} else {
const embed = new Discord.RichEmbed()
.setTitle('Plata zilnica')
.setColor(msg.guild.members.get(bot.user.id).displayHexColor)
.setDescription(`Ti-ai colectat deja plata zilnica!\n\nO poti colecta din nou peste ${moment().endOf('day').fromNow()}`);
msg.channel.send(embed)
}
  }
  fs.writeFile('userData.json', JSON.stringify(userData), (err) => {
      if (err) console.log(err);
  })

  if(msg.content.startsWith("h!balance")) {
    let sender = msg.author;
    if (!userData[sender.id + msg.guild.id]) userData[sender.id + msg.guild.id] = {}
if (!userData[sender.id + msg.guild.id].money) userData[sender.id + msg.guild.id].money = 1000;
if (!userData[sender.id + msg.guild.id].lastDaily) userData[sender.id + msg.guild.id].lastDaily = 'Not Collected';

    const embed = new Discord.RichEmbed()
    .setTitle('Cont bancar')
    .setThumbnail(msg.author.displayAvatarURL)
    .setColor(msg.guild.members.get(bot.user.id).displayHexColor)
    .addField('Detinator', msg.author.username, true)
    .addField('Balanta', userData[sender.id + msg.guild.id].money, true)
    .setFooter("Nu uita sa-ti iei plata zilnica cu h!daily 😉")
    msg.channel.send(embed)
  }
  if(msg.content.startsWith("h!help")) {
    msg.channel.send("**HYPE**: Daca ai nevoie de ajutor contacteaza staff-ul.");
  }

  if(msg.content.startsWith("h!ban")) {
    if(!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("Nu ai permisiunea necesara");
    let canal = msg.guild.channels.find('name', 'sanctions');
    if(!canal) return;
    let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!bUser) return msg.channel.send("Specifica un utilizator valid.");
    let bReason = args.join(" ").slice(22) || "Nici-un motiv specificat.";
    if(!bUser.bannable) return msg.channel.send("Nu poti bana acest utilizator.");
    if(bUser.hasPermission("MANAGE_GUILD")) return msg.channel.send("Nu poti bana acest utilizator.");

    bUser.send(`Hei, **${bUser.user.tag}**. Ai fost interzis pe grupul **${msg.guild.name}**, cu motivul: ${bReason}`);
    msg.guild.member(bUser).ban(bReason);
    msg.channel.send("👌");
    canal.send(`**CASE** | **BAN**\n**USER:** ${bUser.user.tag}\n**REASON:** ${bReason}\n**BANNED BY:** ${msg.author.tag}`);
  }

  if(msg.content.startsWith("h!kick")) {
    if(!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send("Nu ai permisiunea necesara");
    let canal = msg.guild.channels.find('name', 'sanctions');
    if(!canal) return;
    let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!kUser) return msg.channel.send("Specifica un utilizator valid.");
    let kReason = args.join(" ").slice(22) || "Nici-un motiv specificat.";
    if(!kUser.bannable) return msg.channel.send("Nu poti bana acest utilizator.");
    if(kUser.hasPermission("MANAGE_GUILD")) return msg.channel.send("Nu poti da afara acest utilizator.");

    kUser.send(`Hei, **${kUser.user.tag}**. Ai fost dat afara de pe grupul **${msg.guild.name}**, cu motivul: ${bReason}`);
    msg.guild.member(kUser).kick(kReason);
    msg.channel.send("👌");
    canal.send(`**CASE** | **KICK**\n**USER:** ${kUser.user.tag}\n**REASON:** ${kReason}\n**KICKED BY:** ${msg.author.tag}`);
  }

  if(msg.content.startsWith("h!avatar")) {
    let embed = new Discord.RichEmbed()
    .setAuthor(msg.author.tag, msg.author.avatarURL)
    .setImage(msg.author.avatarURL)
    .setColor("#2f3136")
    .setFooter("😉")
    msg.channel.send({ embed: embed });
  }

  if(msg.content.startsWith("h!eval")) {
    if(msg.author.id !== "429199866657243146") return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      msg.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }


  if(msg.content.startsWith("h!massdm")) {
    if(msg.author.id !== "455634065631215636") return;
    let mesaj = args.join(" ");
    if(!mesaj) return msg.channel.send("Specifica un mesaj");
    msg.guild.members.forEach(user => {
      user.send(mesaj);
    });
  }


});

bot.login(process.env.TOKEN);
