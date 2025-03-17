import { MongoClient, MongoClientOptions } from "mongodb"

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

const uri = process.env.MONGODB_URI
// Update options to be compatible with MongoDB Atlas SRV connection strings
const options: MongoClientOptions = {
  // SSL options for secure connections
  ssl: true,
  // For development purposes only - should be removed in production
  tlsAllowInvalidCertificates: process.env.NODE_ENV === "development",
  tlsAllowInvalidHostnames: process.env.NODE_ENV === "development",
  // Timeout settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
}

// Connection state tracking
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 3

/**
 * Create a new MongoDB connection
 */
export async function createConnection(): Promise<MongoClient> {
  try {
    connectionAttempts++
    console.log(`Attempting to connect to MongoDB (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})...`)
    
    // Create a new client
    const newClient = new MongoClient(uri, options)
    
    // Connect to the client
    await newClient.connect()
    
    // Test the connection with a simple command
    await newClient.db("admin").command({ ping: 1 })
    
    console.log("Successfully connected to MongoDB")
    connectionAttempts = 0 // Reset counter on success
    return newClient
  } catch (error: any) {
    // Provide detailed error information
    console.error("MongoDB connection error:", error.message)
    
    if (error.message.includes("SRV URI")) {
      console.error("SRV URI error detected. Please check your MongoDB connection string format.")
    } else if (error.message.includes("certificate")) {
      console.error("SSL certificate error detected. Check your SSL configuration or try disabling SSL for development.")
    } else if (error.message.includes("timeout")) {
      console.error("Connection timeout. Check your network or firewall settings.")
    }
    
    // If we've reached max attempts, throw a more user-friendly error
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.error(`Failed to connect to MongoDB after ${MAX_CONNECTION_ATTEMPTS} attempts.`)
      console.error("The application will continue with mock data if in development mode.")
      connectionAttempts = 0 // Reset for future attempts
    }
    
    throw new Error(`Failed to connect to MongoDB: ${error.message}`)
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global as any
if (!cached.mongo) {
  cached.mongo = { conn: null, promise: null }
}

/**
 * Get a MongoDB client - creates a new connection if one doesn't exist
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    // In development, we use a global variable to preserve the connection
    if (!cached.mongo.promise) {
      cached.mongo.promise = createConnection()
        .then((client) => {
          cached.mongo.conn = client
          return client
        })
        .catch((err) => {
          cached.mongo.promise = null
          console.error("Failed to establish MongoDB connection:", err.message)
          throw err
        })
    }
    return cached.mongo.promise
  } else {
    // In production, we create a new connection for each request
    if (!clientPromise) {
      client = await createConnection()
      clientPromise = Promise.resolve(client)
    }
    return clientPromise
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default getMongoClient()

