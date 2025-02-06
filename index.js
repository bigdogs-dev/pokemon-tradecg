const { Client, GatewayIntentBits } = require("discord.js")
const { token } = require("./config.json")
const { handleCommands } = require("./commands")
const { initDatabase } = require("./database")
const { startMatchmaking } = require("./matchmaking")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
})

client.once("ready", () => {
  console.log("Pokémon TCG Trade Bot is online!")
  initDatabase()
  startMatchmaking(client)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return
  await handleCommands(interaction)
})

client.login(token)

