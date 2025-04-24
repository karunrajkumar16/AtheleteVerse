import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

const dbName = "athleteverse"

export async function getDb() {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error("Failed to connect to database:", error)
    
    console.warn("Database connection failed")
    return null;
  }
}

export async function getCollection(collection: string) {
  try {
    const db = await getDb()
    if (!db) {
      throw new Error("Database connection failed")
    }
    return db.collection(collection)
  } catch (error) {
    console.error(`Failed to get collection ${collection}:`, error)
    throw new Error("Database operation failed. Please try again later.")
  }
}

export async function getUserById(id: string) {
  try {
    const users = await getCollection("users")
    return users.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error(`Failed to get user by ID ${id}:`, error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const users = await getCollection("users")
    return users.findOne({ email: email.toLowerCase() })
  } catch (error) {
    console.error(`Failed to get user by email ${email}:`, error)
    return null
  }
}

export async function getUsers(limit = 10, skip = 0, filter = {}) {
  try {
    const users = await getCollection("users")
    return users
      .find(filter, { projection: { password: 0 } }) // Exclude password
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()
  } catch (error) {
    console.error("Failed to get users:", error)
    return []
  }
}

export async function createUser(userData: any) {
  try {
    const users = await getCollection("users")
    const result = await users.insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Failed to create user:", error)
    throw new Error("Failed to create user. Please try again later.")
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const users = await getCollection("users")
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...userData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error)
    throw new Error("Failed to update user. Please try again later.")
  }
}

export async function getEvents(limit = 10, skip = 0, filter = {}) {
  try {
    const events = await getCollection("events")
    // Sort by date field, and if dateTime is available, use that as well
    return events.find(filter).sort({ date: 1, dateTime: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error("Failed to get events:", error)
    return []
  }
}

export async function getEventById(id: string) {
  try {
    const events = await getCollection("events")
    return events.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error(`Failed to get event by ID ${id}:`, error)
    return null
  }
}

export async function createEvent(eventData: any) {
  try {
    const events = await getCollection("events")
    const result = await events.insertOne({
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Failed to create event:", error)
    throw new Error("Failed to create event. Please try again later.")
  }
}

export async function updateEvent(id: string, eventData: any) {
  try {
    const events = await getCollection("events")
    const result = await events.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...eventData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error)
    throw new Error("Failed to update event. Please try again later.")
  }
}

export async function deleteEvent(id: string) {
  try {
    const events = await getCollection("events")
    const result = await events.deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error)
    throw new Error("Failed to delete event. Please try again later.")
  }
}

export async function joinEvent(eventId: string, userId: string) {
  try {
    // Step 1: Add user to event participants
    const events = await getCollection("events")
    const result = await events.updateOne({ _id: new ObjectId(eventId) }, { $addToSet: { participants: userId } })
    
    // Step 2: Update user's participation history
    await updateUserEventParticipation(userId, eventId, true)
    
    return result
  } catch (error) {
    console.error(`Failed to join event ${eventId} for user ${userId}:`, error)
    throw new Error("Failed to join event. Please try again later.")
  }
}

export async function leaveEvent(eventId: string, userId: string) {
  try {
    // Step 1: Remove user from event participants
    const events = await getCollection("events")
    const result = await events.updateOne(
      { _id: new ObjectId(eventId) }, 
      { $pull: { participants: userId } as any }
    )
    
    // Step 2: Update user's participation history
    await updateUserEventParticipation(userId, eventId, false)
    
    return result
  } catch (error) {
    console.error(`Failed to leave event ${eventId} for user ${userId}:`, error)
    throw new Error("Failed to leave event. Please try again later.")
  }
}

export async function getGames(limit = 10, skip = 0, filter = {}) {
  try {
    const games = await getCollection("games")
    return games.find(filter).sort({ title: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error("Failed to get games:", error)
    return []
  }
}

export async function getGameById(id: string) {
  try {
    const games = await getCollection("games")
    return games.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error(`Failed to get game by ID ${id}:`, error)
    return null
  }
}

export async function getGamesByCategory(category: string, limit = 10, skip = 0) {
  try {
    const games = await getCollection("games")
    return games.find({ category }).sort({ activePlayers: -1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error(`Failed to get games by category ${category}:`, error)
    return []
  }
}

export async function getTournaments(limit = 10, skip = 0, filter = {}) {
  try {
    const tournaments = await getCollection("tournaments")
    return tournaments.find(filter).sort({ startDateTime: 1, date: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error("Failed to get tournaments:", error)
    return []
  }
}

export async function getTournamentById(id: string) {
  try {
    const tournaments = await getCollection("tournaments")
    const tournament = await tournaments.findOne({ _id: new ObjectId(id) })
    
    // Normalize tournament data
    if (tournament) {
      // Ensure rules is an array if it exists
      if (tournament.rules && !Array.isArray(tournament.rules)) {
        // If rules exists but isn't an array, convert it to an array of objects
        if (typeof tournament.rules === 'object') {
          // Convert object to array of rule objects
          tournament.rules = Object.entries(tournament.rules).map(([key, value]) => ({
            title: key,
            description: String(value)
          }));
        } else {
          // If it's something else, create a single rule with the value as description
          tournament.rules = [{
            title: "General Rule",
            description: String(tournament.rules)
          }];
        }
      } else if (!tournament.rules) {
        // If rules doesn't exist, initialize as empty array
        tournament.rules = [];
      }
    }
    
    return tournament
  } catch (error) {
    console.error(`Failed to get tournament by ID ${id}:`, error)
    return null
  }
}

export async function getTournamentsByGame(gameId: string, limit = 10, skip = 0) {
  try {
    const tournaments = await getCollection("tournaments")
    return tournaments.find({ gameId }).sort({ startDateTime: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error(`Failed to get tournaments by game ID ${gameId}:`, error)
    return []
  }
}

export async function createTournament(tournamentData: any) {
  try {
    const tournaments = await getCollection("tournaments")
    
    // Normalize tournament data before insertion
    const normalizedData = { ...tournamentData };
    
    // Ensure rules is an array if provided
    if (normalizedData.rules) {
      if (!Array.isArray(normalizedData.rules)) {
        if (typeof normalizedData.rules === 'object') {
          // Convert object to array of rule objects
          normalizedData.rules = Object.entries(normalizedData.rules).map(([key, value]) => ({
            title: key,
            description: String(value)
          }));
        } else {
          // If it's something else, create a single rule
          normalizedData.rules = [{
            title: "General Rule",
            description: String(normalizedData.rules)
          }];
        }
      }
    } else {
      // Initialize as empty array if not provided
      normalizedData.rules = [];
    }
    
    const result = await tournaments.insertOne({
      ...normalizedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Failed to create tournament:", error)
    throw new Error("Failed to create tournament. Please try again later.")
  }
}

export async function updateTournament(id: string, tournamentData: any) {
  try {
    const tournaments = await getCollection("tournaments")
    
    // Normalize tournament data before update
    const normalizedData = { ...tournamentData };
    
    // Ensure rules is an array if provided
    if (normalizedData.rules) {
      if (!Array.isArray(normalizedData.rules)) {
        if (typeof normalizedData.rules === 'object') {
          // Convert object to array of rule objects
          normalizedData.rules = Object.entries(normalizedData.rules).map(([key, value]) => ({
            title: key,
            description: String(value)
          }));
        } else {
          // If it's something else, create a single rule
          normalizedData.rules = [{
            title: "General Rule",
            description: String(normalizedData.rules)
          }];
        }
      }
    } else if (normalizedData.rules === undefined) {
      // Keep existing rules if not provided in update
    } else {
      // Initialize as empty array if explicitly set to null
      normalizedData.rules = [];
    }
    
    const result = await tournaments.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...normalizedData,
          updatedAt: new Date(),
        },
      }
    )
    return result
  } catch (error) {
    console.error(`Failed to update tournament ${id}:`, error)
    throw new Error("Failed to update tournament. Please try again later.")
  }
}

export async function joinTournament(tournamentId: string, userId: string) {
  try {
    // Step 1: Add user to tournament participants
    const tournaments = await getCollection("tournaments")
    const tournament = await tournaments.findOne({ _id: new ObjectId(tournamentId) })
    
    if (!tournament) {
      throw new Error("Tournament not found")
    }
    
    await tournaments.updateOne(
      { _id: new ObjectId(tournamentId) },
      { $addToSet: { participants: userId } }
    )
    
    // Step 2: Update user's participation data
    const users = await getCollection("users")
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $addToSet: { tournamentsJoined: tournamentId },
        $inc: { tournamentCount: 1 }
      }
    )
    
    return { success: true }
  } catch (error) {
    console.error(`Failed to join tournament ${tournamentId} for user ${userId}:`, error)
    throw new Error("Failed to join tournament. Please try again later.")
  }
}

export async function leaveTournament(tournamentId: string, userId: string) {
  try {
    // Step 1: Remove user from tournament participants
    const tournaments = await getCollection("tournaments")
    await tournaments.updateOne(
      { _id: new ObjectId(tournamentId) },
      { $pull: { participants: userId } as any }
    )
    
    // Step 2: Update user's participation data
    const users = await getCollection("users")
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { tournamentsJoined: tournamentId } as any,
        $inc: { tournamentCount: -1 }
      }
    )
    
    return { success: true }
  } catch (error) {
    console.error(`Failed to leave tournament ${tournamentId} for user ${userId}:`, error)
    throw new Error("Failed to leave tournament. Please try again later.")
  }
}

export async function updateUserEventParticipation(userId: string, eventId: string, joining: boolean) {
  try {
    const users = await getCollection("users")
    
    if (joining) {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $addToSet: { eventsJoined: eventId },
          $inc: { eventCount: 1 }
        }
      )
    } else {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $pull: { eventsJoined: eventId } as any,
          $inc: { eventCount: -1 }
        }
      )
    }
    
    return { success: true }
  } catch (error) {
    console.error(`Failed to update user ${userId} event participation:`, error)
    throw new Error("Failed to update participation. Please try again later.")
  }
}

export async function getUserParticipationHistory(userId: string) {
  try {
    // Get user data
    const user = await getUserById(userId)
    
    if (!user) {
      throw new Error("User not found")
    }
    
    // Get events the user has joined
    const eventsJoined = user.eventsJoined || []
    const events = await getCollection("events")
    const eventsList = eventsJoined.length > 0 
      ? await events.find({ 
          _id: { $in: eventsJoined.map((id: string) => new ObjectId(id)) } 
        }).toArray()
      : []
      
    // Get tournaments the user has joined
    const tournamentsJoined = user.tournamentsJoined || []
    const tournaments = await getCollection("tournaments")
    const tournamentsList = tournamentsJoined.length > 0
      ? await tournaments.find({ 
          _id: { $in: tournamentsJoined.map((id: string) => new ObjectId(id)) } 
        }).toArray()
      : []
    
    return {
      eventCount: user.eventCount || 0,
      tournamentCount: user.tournamentCount || 0,
      events: eventsList,
      tournaments: tournamentsList
    }
  } catch (error) {
    console.error(`Failed to get participation history for user ${userId}:`, error)
    return {
      eventCount: 0,
      tournamentCount: 0,
      events: [],
      tournaments: []
    }
  }
}

