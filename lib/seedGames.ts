import { getCollection } from './db';
import { ObjectId } from 'mongodb';

// Game data for seeding the database
const gameData = [
  // FPS Games
  {
    title: "Counter-Strike 2",
    description: "The iconic tactical shooter returns with upgraded graphics and gameplay.",
    category: "fps",
    image: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/03/counter-strike-2-release-date.jpg",
    activePlayers: 1250000,
    platforms: ["PC", "Mac"],
    publisher: "Valve",
    releaseYear: 2023
  },
  {
    title: "Valorant",
    description: "A character-based tactical shooter where precise gunplay meets unique agent abilities.",
    category: "fps",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5599d0d810824279/6036ca30ce4a0d12c3ec1dfa/V_EP2_A1_KeyArt.jpg",
    activePlayers: 980000,
    platforms: ["PC"],
    publisher: "Riot Games",
    releaseYear: 2020
  },
  
  // MOBA Games
  {
    title: "League of Legends",
    description: "A fast-paced, competitive online game that blends speed and strategy.",
    category: "moba",
    image: "https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-2935d0a3e332decb8e727fe56789b6ab",
    activePlayers: 1800000,
    platforms: ["PC", "Mac"],
    publisher: "Riot Games",
    releaseYear: 2009
  },
  {
    title: "Dota 2",
    description: "A deeply complex, team-based strategy game with hundreds of heroes to choose from.",
    category: "moba",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg",
    activePlayers: 750000,
    platforms: ["PC", "Mac", "Linux"],
    publisher: "Valve",
    releaseYear: 2013
  },
  
  // Battle Royale Games
  {
    title: "Fortnite",
    description: "Build, battle, and create your way to a Victory Royale in this colorful battle royale game.",
    category: "battle-royale",
    image: "https://cdn2.unrealengine.com/huge-savings-on-fortnite-v-bucks-and-real-money-purchases-1900x600-465861740.jpg",
    activePlayers: 1500000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    publisher: "Epic Games",
    releaseYear: 2017
  },
  {
    title: "Apex Legends",
    description: "A free-to-play battle royale game featuring legendary characters with powerful abilities.",
    category: "battle-royale",
    image: "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg",
    activePlayers: 850000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    publisher: "Electronic Arts",
    releaseYear: 2019
  },
  
  // Sports Games
  {
    title: "FIFA 24",
    description: "Experience the world's game with authentic football action in EA SPORTS FIFA 24.",
    category: "sports",
    image: "https://images.purexbox.com/fe7f72a0b3e47/1280x720.jpg",
    activePlayers: 580000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "Electronic Arts",
    releaseYear: 2023
  },
  {
    title: "Rocket League",
    description: "A high-powered hybrid of arcade soccer and vehicular mayhem.",
    category: "sports",
    image: "https://rocketleague.media.zestyio.com/rl_season_9_key_art_169.jpg",
    activePlayers: 690000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "Psyonix",
    releaseYear: 2015
  }
];


export async function seedGames() {
  try {
    const games = await getCollection('games');
    
    
    const count = await games.countDocuments();
    
    if (count === 0) {
      console.log('No games found in database, seeding with initial data...');
      
    
      const gamesWithIds = gameData.map(game => ({
        ...game,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
     
      await games.insertMany(gamesWithIds);
      console.log(`Successfully seeded database with ${gamesWithIds.length} games`);
    } else {
      console.log(`Database already has ${count} games, skipping seed operation`);
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding games:', error);
    return false;
  }
} 