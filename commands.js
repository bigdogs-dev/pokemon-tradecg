const { registerCard, removeCard, getUserCards, rejectTrade, acceptTrade } = require("./database")

async function handleCommands(interaction) {
  const { commandName, options } = interaction

  switch (commandName) {
    case "register":
      await handleRegister(interaction)
      break
    case "my_cards":
      await handleMyCards(interaction)
      break
    case "remove":
      await handleRemove(interaction)
      break
    case "reject":
      await handleReject(interaction)
      break
    case "accept":
      await handleAccept(interaction)
      break
    default:
      await interaction.reply("Unknown command")
  }
}

async function handleRegister(interaction) {
  const cardName = interaction.options.getString("card_name")
  const type = interaction.options.getString("type")
  const userId = interaction.user.id

  const result = registerCard(userId, cardName, type)
  await interaction.reply(result)
}

async function handleMyCards(interaction) {
  const userId = interaction.user.id
  const cards = getUserCards(userId)
  await interaction.reply(cards)
}

async function handleRemove(interaction) {
  const cardName = interaction.options.getString("card_name")
  const userId = interaction.user.id

  const result = removeCard(userId, cardName)
  await interaction.reply(result)
}

async function handleReject(interaction) {
  const matchId = interaction.options.getString("match_id")
  const userId = interaction.user.id

  const result = rejectTrade(userId, matchId)
  await interaction.reply(result)
}

async function handleAccept(interaction) {
  const matchId = interaction.options.getString("match_id")
  const userId = interaction.user.id

  const result = acceptTrade(userId, matchId)
  await interaction.reply(result)
}

module.exports = { handleCommands }

