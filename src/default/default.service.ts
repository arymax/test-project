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
    console.log('Starting createDefaultRestaurantForUser');
    // 验证用户存在
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('用户不存在');
    }

    // 创建新的餐厅实体
    const newRestaurant = new Restaurant();
    newRestaurant.name = 'Your Restaurant Name';
    newRestaurant.describe = 'Description of your restaurant';
    newRestaurant.image = 'URL to restaurant image';
    newRestaurant.address = 'Restaurant address';
    newRestaurant.owner = user;

    // 保存餐厅实体并获取生成的 ID
    console.log('Saving new restaurant', newRestaurant);
    const savedRestaurant = await this.restaurantRepository.save(newRestaurant);
    console.log('Restaurant saved', savedRestaurant);

    // 使用保存后获得的餐厅 ID 创建默认分类
    console.log('Creating default category for the restaurant');
    await this.createDefaultCategory(savedRestaurant.id); // 注意这里传递的是 savedRestaurant 的 id
  }
  async createDefaultCategory(restaurantId: number): Promise<Category> {
    console.log('Starting createDefaultCategory');

    // 从数据库中获取 restaurant 的实例
    const restaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    // 检查 restaurant 是否存在
    if (!restaurant) {
      throw new Error(`Restaurant with ID ${restaurantId} not found`);
    }
    const newCategory = new Category();
    newCategory.name = 'Default Category';
    newCategory.describe = 'Default category description';
    newCategory.restaurant = restaurant;

    console.log('Saving new category', newCategory);
    const savedCategory = await this.categoryRepository.save(newCategory);
    console.log('Category saved', savedCategory);

    // 调用 createDefaultMeal 函数，创建并保存新的 Meal 实例
    console.log('Creating default meal for the category');
    await this.createDefaultMeal(restaurantId, savedCategory.id); // 确保传递正确的参数
    const updatedCategory = await this.categoryRepository.findOne({
      where: { id: savedCategory.id },
      relations: ['meals'],
    });
    if (!updatedCategory) {
      throw new Error(
        `Category with ID ${savedCategory.id} not found after update`,
      );
    }
    // 创建默认的营业时间
    console.log('Creating default business times');
    const defaultBusinessTimes = this.createDefaultBusinessTimes(restaurant);
    await this.restaurantBusinessTimeRepository.save(defaultBusinessTimes);

    return updatedCategory; // 返回已保存的 Category 实例
  }
  async createDefaultMeal(
    restaurantId: number,
    categoryId: number,
  ): Promise<void> {
    console.log('Starting createDefaultMeal');
    try {
      // 从数据库中获取 restaurant 和 category 的实例
      const restaurant = await this.restaurantRepository.findOneBy({
        id: restaurantId,
      });
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      // 检查 restaurant 和 category 是否存在
      if (!restaurant || !category) {
        throw new Error('Restaurant or Category not found');
      }

      const newMeal = new Meal();
      newMeal.name = 'Default Meal';
      newMeal.describe = 'Default meal description';
      newMeal.price = 10;
      newMeal.imageUrl = 'URL to meal image';
      newMeal.category = category; // 使用从数据库检索的 category 实例

      // 保存 Meal 实体
      console.log('Saving new meal', newMeal);
      const savedMeal = await this.mealRepository.save(newMeal);
      console.log('Meal saved', savedMeal);

      // 创建与餐点相关的标签
      console.log('Creating hashtags for meal');
      await this.createDefaultHashtags(savedMeal);
      console.log('Hashtags created for meal');
    } catch (error) {
      console.error('Error in createDefaultMeal', error);
      throw error; // 重新抛出异常
    }
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
