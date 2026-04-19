import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../entities';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async findOneById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id: id });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async findOneByName(name: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({
            name: name,
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoryRepository.findOneBy({
            name: createCategoryDto.name,
        });
        if (existing) {
            throw new UnauthorizedException();
        }
        const category = await this.categoryRepository.save(createCategoryDto);
        if (!category) {
            throw new InternalServerErrorException();
        }
        return category;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }
    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
