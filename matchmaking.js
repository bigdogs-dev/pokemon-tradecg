const { readDatabase, writeDatabase } = require("./database")

function startMatchmaking(client) {
  setInterval(() => {
    const matches = findMatches()
    notifyUsers(client, matches)
  }, 60000) // Run matchmaking every minute
}

function findMatches() {
  const db = readDatabase()
  const matches = []

  for (const [user1Id, user1Data] of Object.entries(db.users)) {
    for (const [user2Id, user2Data] of Object.entries(db.users)) {
      if (user1Id === user2Id) continue

      for (const availableCard of user1Data.available) {
        if (user2Data.wanted.includes(availableCard)) {
          for (const wantedCard of user1Data.wanted) {
            if (user2Data.available.includes(wantedCard)) {
              const matchId = `${user1Id}-${user2Id}-${Date.now()}`
              matches.push({
                id: matchId,
                user1: user1Id,
                user2: user2Id,
                card1: availableCard,
                card2: wantedCard,
              })

              // Remove matched cards from available and wanted lists
              user1Data.available = user1Data.available.filter((card) => card !== availableCard)
              user2Data.wanted = user2Data.wanted.filter((card) => card !== availableCard)
              user2Data.available = user2Data.available.filter((card) => card !== wantedCard)
              user1Data.wanted = user1Data.wanted.filter((card) => card !== wantedCard)

              // Break the inner loop after finding a match
              break
            }
          }
          // Break the outer loop after finding a match
          if (matches.length > 0) break
        }
      }
      // Break the outermost loop after finding a match
      if (matches.length > 0) break
    }
  }

  if (matches.length > 0) {
    db.matches.push(...matches)
    writeDatabase(db)
  }

  return matches
}

async function notifyUsers(client, matches) {
  for (const match of matches) {
    const user1 = await client.users.fetch(match.user1)
    const user2 = await client.users.fetch(match.user2)

    const message = `
A trade match has been found!
Match ID: ${match.id}
You offer: ${match.card1}
You receive: ${match.card2}
Trading with: ${user2.username}

To accept this trade, use the command: /accept ${match.id}
To reject this trade, use the command: /reject ${match.id}
    `

    await user1.send(message)

    const reverseMessage = `
A trade match has been found!
Match ID: ${match.id}
You offer: ${match.card2}
You receive: ${match.card1}
Trading with: ${user1.username}

To accept this trade, use the command: /accept ${match.id}
To reject this trade, use the command: /reject ${match.id}
    `

    await user2.send(reverseMessage)
  }
}

module.exports = { startMatchmaking }

