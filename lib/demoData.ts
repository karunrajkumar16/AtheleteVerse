import { ObjectId } from "mongodb";

export const demoGames = [
  // FPS Games
  {
    _id: new ObjectId(),
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
    _id: new ObjectId(),
    title: "Valorant",
    description: "A character-based tactical shooter where precise gunplay meets unique agent abilities.",
    category: "fps",
    image: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5599d0d810824279/6036ca30ce4a0d12c3ec1dfa/V_EP2_A1_KeyArt.jpg",
    activePlayers: 980000,
    platforms: ["PC"],
    publisher: "Riot Games",
    releaseYear: 2020
  },
  {
    _id: new ObjectId(),
    title: "Call of Duty: Modern Warfare III",
    description: "The latest installment in the popular military first-person shooter franchise.",
    category: "fps",
    image: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/home/reveal/new/MWIII-ANNOUNCE-FULL-TOUT.jpg",
    activePlayers: 870000,
    platforms: ["PC", "PlayStation", "Xbox"],
    publisher: "Activision",
    releaseYear: 2023
  },
  {
    _id: new ObjectId(),
    title: "Overwatch 2",
    description: "Team-based action game with a diverse cast of powerful heroes, each with unique abilities.",
    category: "fps",
    image: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2022/10/overwatch-2-review-550x309.jpg",
    activePlayers: 720000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "Blizzard Entertainment",
    releaseYear: 2022
  },

  // Battle Royale Games
  {
    _id: new ObjectId(),
    title: "PUBG: Battlegrounds",
    description: "A battle royale shooter that pits 100 players against each other in a struggle for survival.",
    category: "battle-royale",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
    activePlayers: 930000,
    platforms: ["PC", "PlayStation", "Xbox", "Mobile"],
    publisher: "KRAFTON, Inc.",
    releaseYear: 2017
  },
  {
    _id: new ObjectId(),
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
    _id: new ObjectId(),
    title: "Apex Legends",
    description: "A free-to-play battle royale game featuring legendary characters with powerful abilities.",
    category: "battle-royale",
    image: "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg",
    activePlayers: 850000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    publisher: "Electronic Arts",
    releaseYear: 2019
  },
  {
    _id: new ObjectId(),
    title: "Call of Duty: Warzone",
    description: "A massive combat arena with up to 150 players in a battle for survival.",
    category: "battle-royale",
    image: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg",
    activePlayers: 920000,
    platforms: ["PC", "PlayStation", "Xbox"],
    publisher: "Activision",
    releaseYear: 2020
  },

  // MOBA Games
  {
    _id: new ObjectId(),
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
    _id: new ObjectId(),
    title: "Dota 2",
    description: "A deeply complex, team-based strategy game with hundreds of heroes to choose from.",
    category: "moba",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg",
    activePlayers: 750000,
    platforms: ["PC", "Mac", "Linux"],
    publisher: "Valve",
    releaseYear: 2013
  },
  {
    _id: new ObjectId(),
    title: "Heroes of the Storm",
    description: "A raucous MOBA featuring famous faces from Blizzard's storied franchises.",
    category: "moba",
    image: "https://blz-contentstack-images.akamaized.net/v3/assets/blt3452e3b114fab0cd/blt4a01f14fa8623afa/6165ee7bac13b3236554fa73/Heroes-Sample-Header-04.jpg",
    activePlayers: 320000,
    platforms: ["PC", "Mac"],
    publisher: "Blizzard Entertainment",
    releaseYear: 2015
  },
  {
    _id: new ObjectId(),
    title: "Smite",
    description: "A third-person MOBA featuring mythological gods from various pantheons.",
    category: "moba",
    image: "https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/4902d296912d23cd914cfc98b3d93739.jpg",
    activePlayers: 280000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "Hi-Rez Studios",
    releaseYear: 2014
  },

  // Sports Games
  {
    _id: new ObjectId(),
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
    _id: new ObjectId(),
    title: "NBA 2K24",
    description: "The latest iteration of the premier NBA video game simulation series.",
    category: "sports",
    image: "https://assets.2k.com/1a6ngf98576c/3xBNmCTafdXpcbRwdLlG8r/18ef5a0c6afe6e088d644ebc8ef80614/NBA2K24_GAME-INFO_STANDARD-EDITION_1920x1080.jpg",
    activePlayers: 450000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "2K Sports",
    releaseYear: 2023
  },
  {
    _id: new ObjectId(),
    title: "Rocket League",
    description: "A high-powered hybrid of arcade soccer and vehicular mayhem.",
    category: "sports",
    image: "https://rocketleague.media.zestyio.com/rl_season_9_key_art_169.jpg",
    activePlayers: 690000,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    publisher: "Psyonix",
    releaseYear: 2015
  },
  {
    _id: new ObjectId(),
    title: "eFootball 2024",
    description: "The latest evolution of the long-running Pro Evolution Soccer/Winning Eleven series.",
    category: "sports",
    image: "https://www.konami.com/efootball/s/img/purchase/edition_1.png",
    activePlayers: 310000,
    platforms: ["PC", "PlayStation", "Xbox", "Mobile"],
    publisher: "Konami",
    releaseYear: 2023
  }
]; 