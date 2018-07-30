const Command = require("../Command.js")

const Discord = require("discord.js")

module.exports = class HelpCommand extends Command {
    constructor(bot) {
        super(bot)

        this.description = "Displays information about commands and their categories."
    }

    callback(msg, line) {
        line = line.toLowerCase()

        let embed = new Discord.MessageEmbed()
            .setColor(this.bot.colors.blue)
            // .setAuthor(msg.author.tag, msg.author.avatarURL())

        let result = this.bot.commands.get(line)
        if (result instanceof Command) {
            embed.setTitle(`:information_source: Command help: \`${result.name}\``)
            embed.setDescription(result.description)
        } else {
            embed.setTitle(":tools: Command list")
            let showAll = line === "all"
            if (!showAll) {
                embed.setDescription("If you want to see all commands at once, run the same command again with argument `all`.")
            }

            let categories = {} // meh
            for (const _ in this.bot.commands) {
                if (this.bot.commands.hasOwnProperty(_)) {
                    const cmd = this.bot.commands[_]
                    if (cmd instanceof Command) {
                        let category = showAll ? "commands" : cmd.category
                        categories[category] = categories[category] || []
                        categories[category].push("`" + cmd.name + "`")
                        for (const alias of cmd.aliases) {
                            categories[category].push("`" + alias + "`")
                        }
                    }
                }
            }

            for (const name in categories) {
                if (categories.hasOwnProperty(name)) {
                    const category = categories[name]
                    embed.addField(Command.categoryNames[name], category.join(", "))
                }
            }
        }

        msg.reply(embed)
    }
}
