interface Location {
  latitude: number;
  longitude: number;
}

interface Dish {
  dish_name: string;
  tags: string[];
}

interface Restaurant {
  restaurant_id: number;
  location: Location;
  menu: Dish[];
}

interface ScoredRestaurant {
  restaurant_id: number;
  score: number;
}

//const restaurants: Restaurant[] = [
//  {
//    name: '香蕉葉素食屋',
//    location: { latitude: 22.724503, longitude: 120.350234 },
//    menu: [
//      { dish_name: '素食拉麵', tags: ['麵類', '素食', '清淡'] },
//      { dish_name: '蔬菜炸醬麵', tags: ['麵類', '素食', '地方特色風味'] },
//      { dish_name: '花生炒麵', tags: ['麵類', '素食', '地方特色風味'] },
//      { dish_name: '素食炸雞', tags: ['主菜', '素食', '脆皮'] },
//      { dish_name: '草莓拿鐵', tags: ['飲品', '甜', '咖啡廳'] },
//      { dish_name: '素食甜點拼盤', tags: ['甜點', '素食', '多樣口味'] },
//    ],
//  },
//  {
//    name: '澎湖小漁村',
//    location: { latitude: 23.560074, longitude: 119.639752 },
//    menu: [
//      { dish_name: '海鮮粥', tags: ['湯類', '海鮮', '燉煮'] },
//      { dish_name: '澎湖烤鯖魚', tags: ['主菜', '海鮮', '烤'] },
//      { dish_name: '海味涼拌', tags: ['小吃', '海鮮', '清淡'] },
//      { dish_name: '澎湖風味炸蝦', tags: ['小吃', '海鮮', '脆皮'] },
//      { dish_name: '芋頭西米露', tags: ['甜品', '地方特色風味', '甜'] },
//    ],
//  },
//  {
//    name: '綠葉牛排館',
//    location: { latitude: 25.037821, longitude: 121.563811 },
//    menu: [
//      { dish_name: '特選和牛燒肉', tags: ['主菜', '牛肉', '燒烤'] },
//      { dish_name: '藍帶西冷牛排', tags: ['主菜', '牛肉', '煎烤'] },
//      { dish_name: '焗烤義大利牛排', tags: ['主菜', '牛肉', '義式'] },
//      { dish_name: '牛排沙拉', tags: ['沙拉', '牛肉', '清淡'] },
//      { dish_name: '巧克力牛奶霜', tags: ['飲品', '巧克力', '甜'] },
//      { dish_name: '提拉米蘇', tags: ['甜點', '義式'] },
//    ],
//  },
//  {
//    name: '印度風味廚房',
//    location: { latitude: 28.613939, longitude: 77.209021 },
//    menu: [
//      { dish_name: '咖哩雞肉飯', tags: ['飯類', '印度式', '咖哩口味'] },
//      { dish_name: '羊肉香料烤串', tags: ['小吃', '印度式', '香料'] },
//      { dish_name: '素食咖哩', tags: ['飯類', '素食', '印度式'] },
//      { dish_name: '香料奶茶', tags: ['飲品', '印度式', '香料'] },
//      { dish_name: '印度風彩虹冰淇淋', tags: ['甜點', '印度式', '多色'] },
//    ],
//  },
//];

//const user_1_location: Location = { latitude: 25.033, longitude: 121.565 };
//const user_1_tags: string[] = [
//  '飯類',
//  '牛肉',
//  '甜品',
//  '海鮮',
//  '地方特色風味',
//  '印度式',
//];

// Weight variables
const WEIGHT_DISH: number = 0.9;
const WEIGHT_DISTANCE: number = 0.1;

function calculateDishSimilarity(
  userTags: string[],
  dishTags: string[],
): number {
  const intersectionLen =
    new Set(userTags).size +
    new Set(dishTags).size -
    new Set([...userTags, ...dishTags]).size;
  const unionLen = new Set([...userTags, ...dishTags]).size;
  const similarity = unionLen !== 0 ? intersectionLen / unionLen : 0;
  return similarity;
}

function calculateDistanceScore(
  userLocation: Location,
  restaurantLocation: Location,
): number {
  const { latitude: userLat, longitude: userLon } = userLocation;
  const { latitude: restaurantLat, longitude: restaurantLon } =
    restaurantLocation;
  const distance = Math.sqrt(
    Math.pow(userLat - restaurantLat, 2) + Math.pow(userLon - restaurantLon, 2),
  );
  const distanceScore = 1 / (1 + distance);
  return distanceScore;
}

export default function getRecommendRestaurants(
  userLocation: Location,
  userTags: string[],
  restaurants: Restaurant[],
): ScoredRestaurant[] {
  const scores: ScoredRestaurant[] = [];

  for (const restaurant of restaurants) {
    // Calculate dish similarity scores
    const dishSimilarityScores = restaurant.menu.map((dish) =>
      calculateDishSimilarity(userTags, dish.tags),
    );
    const avgDishSimilarityScore =
      dishSimilarityScores.length > 0
        ? dishSimilarityScores.reduce((a, b) => a + b) /
          dishSimilarityScores.length
        : 0;

    // Calculate distance score
    const distanceScore = calculateDistanceScore(
      userLocation,
      restaurant.location,
    );

    const totalScore =
      WEIGHT_DISH * avgDishSimilarityScore + WEIGHT_DISTANCE * distanceScore;

    scores.push({
      restaurant_id: restaurant.restaurant_id,
      score: totalScore,
    });
  }

  const recommendedRestaurants = scores.sort((a, b) => b.score - a.score);

  return recommendedRestaurants;
}
