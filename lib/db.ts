import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import { demoGames } from "./demoData"

// Database Name
const dbName = "athleteverse"

// Flag to track if we're using mock data due to connection issues
let useMockData = false;

// Get database
export async function getDb() {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error("Failed to connect to database:", error)
    
    // In development, we can use mock data as a fallback
    if (process.env.NODE_ENV === "development") {
      console.warn("Using mock data as fallback in development mode")
      useMockData = true;
      return null; // Return null to indicate we're using mock data
    }
    
    throw new Error("Database connection failed. Please try again later.")
  }
}

// Collections
export async function getCollection(collection: string) {
  try {
    // If we're using mock data, return a mock collection
    if (useMockData) {
      return getMockCollection(collection);
    }
    
    const db = await getDb()
    // Check if db is null (which would happen if we're using mock data)
    if (!db) {
      return getMockCollection(collection);
    }
    return db.collection(collection)
  } catch (error) {
    console.error(`Failed to get collection ${collection}:`, error)
    throw new Error("Database operation failed. Please try again later.")
  }
}

// Mock collection for development fallback
function getMockCollection(collectionName: string) {
  // This is a simplified mock that just returns empty arrays or null
  // In a real app, you would have more sophisticated mock data
  return {
    find: () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            toArray: () => Promise.resolve([])
          })
        })
      })
    }),
    findOne: () => Promise.resolve(null),
    insertOne: () => Promise.resolve({ insertedId: new ObjectId() }),
    updateOne: () => Promise.resolve({ modifiedCount: 1 }),
    deleteOne: () => Promise.resolve({ deletedCount: 1 })
  };
}

// User operations
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

// Event operations
export async function getEvents(limit = 10, skip = 0, filter = {}) {
  try {
    const events = await getCollection("events")
    return events.find(filter).sort({ date: 1 }).skip(skip).limit(limit).toArray()
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

// Join event
export async function joinEvent(eventId: string, userId: string) {
  try {
    const events = await getCollection("events")
    const result = await events.updateOne({ _id: new ObjectId(eventId) }, { $addToSet: { participants: userId } })
    return result
  } catch (error) {
    console.error(`Failed to join event ${eventId} for user ${userId}:`, error)
    throw new Error("Failed to join event. Please try again later.")
  }
}

// Leave event
export async function leaveEvent(eventId: string, userId: string) {
  try {
    const events = await getCollection("events")
    // Fix the type error by using type assertion
    const result = await events.updateOne(
      { _id: new ObjectId(eventId) }, 
      { $pull: { participants: userId } as any }
    )
    return result
  } catch (error) {
    console.error(`Failed to leave event ${eventId} for user ${userId}:`, error)
    throw new Error("Failed to leave event. Please try again later.")
  }
}

// Game operations
export async function getGames(limit = 10, skip = 0, filter = {}) {
  try {
    // If we're using mock data, return demo games
    if (useMockData || process.env.NODE_ENV === "development") {
      const filteredGames = demoGames.filter(game => {
        // Apply filter logic if needed
        return true;
      });
      return filteredGames.slice(skip, skip + limit);
    }
    
    const games = await getCollection("games")
    return games.find(filter).sort({ title: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error("Failed to get games:", error)
    return []
  }
}

export async function getGameById(id: string) {
  try {
    // If we're using mock data, return a demo game
    if (useMockData || process.env.NODE_ENV === "development") {
      return demoGames.find(game => game._id.toString() === id);
    }
    
    const games = await getCollection("games")
    return games.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error(`Failed to get game by ID ${id}:`, error)
    return null
  }
}

export async function getGamesByCategory(category: string, limit = 10, skip = 0) {
  try {
    // If we're using mock data, return demo games filtered by category
    if (useMockData || process.env.NODE_ENV === "development") {
      const filteredGames = demoGames.filter(game => game.category === category);
      // Sort by active players in descending order
      const sortedGames = filteredGames.sort((a, b) => b.activePlayers - a.activePlayers);
      return sortedGames.slice(skip, skip + limit);
    }
    
    const games = await getCollection("games")
    return games.find({ category }).sort({ activePlayers: -1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error(`Failed to get games by category ${category}:`, error)
    return []
  }
}

// Tournament operations
export async function getTournaments(limit = 10, skip = 0, filter = {}) {
  try {
    const tournaments = await getCollection("tournaments")
    return tournaments.find(filter).sort({ date: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error("Failed to get tournaments:", error)
    return []
  }
}

export async function getTournamentById(id: string) {
  try {
    const tournaments = await getCollection("tournaments")
    return tournaments.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error(`Failed to get tournament by ID ${id}:`, error)
    return null
  }
}

export async function getTournamentsByGame(gameId: string, limit = 10, skip = 0) {
  try {
    const tournaments = await getCollection("tournaments")
    return tournaments.find({ gameId }).sort({ date: 1 }).skip(skip).limit(limit).toArray()
  } catch (error) {
    console.error(`Failed to get tournaments by game ID ${gameId}:`, error)
    return []
  }
}

