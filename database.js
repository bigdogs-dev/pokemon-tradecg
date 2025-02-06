const fs = require("fs")
const path = require("path")

const DB_FILE = path.join(__dirname, "database.json")

function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, matches: [] }))
  }
}

function readDatabase() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function registerCard(userId, cardName, type) {
  const db = readDatabase()
  if (!db.users[userId]) {
    db.users[userId] = { available: [], wanted: [] }
  }

  const list = type === "available" ? db.users[userId].available : db.users[userId].wanted
  if (!list.includes(cardName)) {
    list.push(cardName)
    writeDatabase(db)
    return `Card "${cardName}" added to your ${type} list.`
  }
  return `Card "${cardName}" is already in your ${type} list.`
}

function removeCard(userId, cardName) {
  const db = readDatabase()
  if (!db.users[userId]) return "You have no registered cards."

  let removed = false
  ;["available", "wanted"].forEach((type) => {
    const index = db.users[userId][type].indexOf(cardName)
    if (index !== -1) {
      db.users[userId][type].splice(index, 1)
      removed = true
    }
  })

  if (removed) {
    writeDatabase(db)
    return `Card "${cardName}" removed from your lists.`
  }
  return `Card "${cardName}" not found in your lists.`
}

function getUserCards(userId) {
  const db = readDatabase()
  if (!db.users[userId]) return "You have no registered cards."

  const available = db.users[userId].available.join(", ")
  const wanted = db.users[userId].wanted.join(", ")
  return `Your available cards: ${available}\nYour wanted cards: ${wanted}`
}

function rejectTrade(userId, matchId) {
  const db = readDatabase()
  const matchIndex = db.matches.findIndex((m) => m.id === matchId && (m.user1 === userId || m.user2 === userId))

  if (matchIndex === -1) return "Match not found or you are not part of this match."

  db.matches.splice(matchIndex, 1)
  writeDatabase(db)
  return "Trade rejected successfully."
}

function acceptTrade(userId, matchId) {
  const db = readDatabase()
  const matchIndex = db.matches.findIndex((m) => m.id === matchId && (m.user1 === userId || m.user2 === userId))

  if (matchIndex === -1) return "Match not found or you are not part of this match."

  const match = db.matches[matchIndex]

  // Remove traded cards from users' lists
  removeCard(match.user1, match.card1)
  removeCard(match.user2, match.card2)

  // Remove the match
  db.matches.splice(matchIndex, 1)
  writeDatabase(db)
  return "Trade accepted successfully. The cards have been exchanged."
}

module.exports = {
  initDatabase,
  registerCard,
  removeCard,
  getUserCards,
  rejectTrade,
  acceptTrade,
  readDatabase,
  writeDatabase,
}

