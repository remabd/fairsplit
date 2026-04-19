import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

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

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<UpdateResult> {
        const existing = await this.categoryRepository.findOneBy({ id: id });
        if (!existing) throw new NotFoundException('Category not found');
        const category = await this.categoryRepository.update(
            id,
            updateCategoryDto,
        );
        if (!category) throw new InternalServerErrorException();
        return category;
    }

    async remove(id: string): Promise<void> {
        const existing = await this.categoryRepository.findOneBy({ id: id });
        if (!existing) throw new NotFoundException('Category not found');
        const result = await this.categoryRepository.delete(id);
        if (!result) throw new InternalServerErrorException();
        return;
    }
}
