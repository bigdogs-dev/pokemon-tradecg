const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")
const { clientId, guildId, token } = require("./config.json")

const commands = [
  {
    name: "register",
    description: "Register a card for trading",
    options: [
      {
        name: "type",
        type: ApplicationCommandOptionType.String,
        description: "Available or wanted",
        required: true,
        choices: [
          { name: "Available", value: "available" },
          { name: "Wanted", value: "wanted" },
        ],
      },
      {
        name: "card_name",
        type: ApplicationCommandOptionType.String,
        description: "Name of the card",
        required: true,
      },
    ],
  },
  {
    name: "my_cards",
    description: "Show your registered cards",
  },
  {
    name: "remove",
    description: "Remove a card from your list",
    options: [
      {
        name: "card_name",
        type: ApplicationCommandOptionType.String,
        description: "Name of the card to remove",
        required: true,
      },
    ],
  },
  {
    name: "reject",
    description: "Reject a trade proposal",
    options: [
      {
        name: "match_id",
        type: ApplicationCommandOptionType.String,
        description: "ID of the match to reject",
        required: true,
      },
    ],
  },
  {
    name: "accept",
    description: "Accept a trade proposal",
    options: [
      {
        name: "match_id",
        type: ApplicationCommandOptionType.String,
        description: "ID of the match to accept",
        required: true,
      },
    ],
  },
]

const rest = new REST({ version: "10" }).setToken(token)
;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()

