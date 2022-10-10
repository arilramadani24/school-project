import { Category } from '../entities/category.entity';
import { Global, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';

@Global()
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(newCategory);
  }

  findAll() {
    return this.categoryRepository.find({
      relations: ['products', 'products.details'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'products.details'],
    });

    if (!category)
      throw new HttpException(
        `Product with id ${id} is not found !`,
        HttpStatus.NOT_FOUND,
      );

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    category.category_name = updateCategoryDto.category_name;

    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    return await this.categoryRepository.remove(category);
  }
}
