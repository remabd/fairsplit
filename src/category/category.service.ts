import {
    ConflictException,
    Injectable,
    NotFoundException,
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
        return this.categoryRepository.find();
    }

    async findOneById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException();
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoryRepository.findOneBy({
            name: createCategoryDto.name,
        });
        if (existing) {
            throw new ConflictException();
        }
        const category = await this.categoryRepository.save(createCategoryDto);
        return category;
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const res = await this.categoryRepository.update(id, updateCategoryDto);
        if (!res.affected) throw new NotFoundException();
        return this.findOneById(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryRepository.delete(id);
        if (!result.affected) throw new NotFoundException();
    }
}
