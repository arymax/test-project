import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDefaultDto } from './dto/create-default.dto';
import { UpdateDefaultDto } from './dto/update-default.dto';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { RestaurantBusinessTime } from '../restaurant/entities/restaurant-business-time';
import { Category } from '../category/entities/category.entity';
import { Meal } from '../meal/entities/meal.entity';
import { User } from '../user/entities/user.entity';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { MealSelection } from '../meal/entities/meal-selection';
import { MealSelectionOption } from '../meal/entities/meal-selection-option';

@Injectable()
export class DefaultService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
    @InjectRepository(MealSelection)
    private readonly mealSelectionRepository: Repository<MealSelection>,
    @InjectRepository(MealSelectionOption)
    private readonly mealSelectionOptionRepository: Repository<MealSelectionOption>,
    @InjectRepository(RestaurantBusinessTime)
    private readonly restaurantBusinessTimeRepository: Repository<RestaurantBusinessTime>,
  ) {}
  async createDefaultRestaurantForUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }
    const newRestaurant = new Restaurant();
    newRestaurant.name = 'Your Restaurant Name';
    newRestaurant.describe = 'Description of your restaurant';
    newRestaurant.image = 'URL to restaurant image';
    newRestaurant.address = 'Restaurant address';
    newRestaurant.owner = user;
    await this.restaurantRepository.save(newRestaurant);
    const newCategory = await this.createDefaultCategory(newRestaurant);
    await this.createDefaultMeal(newRestaurant, newCategory);
    const defaultBusinessTimes = this.createDefaultBusinessTimes(newRestaurant);
    await this.restaurantBusinessTimeRepository.save(defaultBusinessTimes);
  }
  async createDefaultCategory(restaurant: Restaurant): Promise<Category> {
    const newCategory = new Category();
    newCategory.name = 'Default Category';
    newCategory.describe = 'Default category description';
    newCategory.restaurant = restaurant;
    return await this.categoryRepository.save(newCategory);
  }
  async createDefaultMeal(
    restaurant: Restaurant,
    category: Category,
  ): Promise<void> {
    const newMeal = new Meal();
    newMeal.name = 'Default Meal';
    newMeal.describe = 'Default meal description';
    newMeal.price = 10; // 示例价格
    newMeal.imageUrl = 'URL to meal image';
    newMeal.category = category;
    const savedMeal = await this.mealRepository.save(newMeal);

    // 创建与餐点相关的标签
    await this.createDefaultHashtags(savedMeal);
  }
  async createDefaultHashtags(meal: Meal): Promise<void> {
    const newHashtag = new Hashtag();
    newHashtag.name = 'Default Hashtag';
    const savedHashtag = await this.hashtagRepository.save(newHashtag);

    // 将标签关联到餐点
    meal.hashtags = [savedHashtag];
    await this.mealRepository.save(meal);
  }
  async createMealSelection(
    mealId: number,
    name: string,
  ): Promise<MealSelection> {
    const meal = await this.mealRepository.findOne({ where: { id: mealId } });
    if (!meal) {
      throw new Error('meal not exist');
    }

    const mealSelection = new MealSelection();
    mealSelection.meal = meal;
    mealSelection.name = name;
    return await this.mealSelectionRepository.save(mealSelection);
  }

  async createMealSelectionOption(
    selectionId: number,
    name: string,
    price: number,
  ): Promise<MealSelectionOption> {
    const selection = await this.mealSelectionRepository.findOne({
      where: { id: selectionId },
    });
    if (!selection) {
      throw new Error('meal selection not exist');
    }
    const option = new MealSelectionOption();
    option.selection = selection;
    option.name = name;
    option.price = price;
    return await this.mealSelectionOptionRepository.save(option);
  }
  createDefaultBusinessTimes(restaurant: Restaurant): RestaurantBusinessTime[] {
    const businessTimes = [];
    for (let i = 0; i < 7; i++) {
      const businessTime = new RestaurantBusinessTime();
      businessTime.restaurant = restaurant;
      businessTime.weekend = i;
      businessTime.startHour = 9;
      businessTime.endHour = 17;
      businessTime.isOnBusiness = true;
      businessTimes.push(businessTime);
    }
    return businessTimes;
  }
  create(createDefaultDto: CreateDefaultDto) {
    return 'This action adds a new default';
  }

  findAll() {
    return `This action returns all default`;
  }

  findOne(id: number) {
    return `This action returns a #${id} default`;
  }

  update(id: number, updateDefaultDto: UpdateDefaultDto) {
    return `This action updates a #${id} default`;
  }

  remove(id: number) {
    return `This action removes a #${id} default`;
  }
}
