import { Injectable } from '@nestjs/common';
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

    async findOne(id: string): Promise<Category | null> {
        return await this.categoryRepository.findOneBy({ id: id });
    }

    // create(createCategoryDto: CreateCategoryDto) {
    //     return 'This action adds a new category';
    // }
    // findAll() {
    //     return `This action returns all category`;
    // }
    // findOne(id: number) {
    //     return `This action returns a #${id} category`;
    // }
    // update(id: number, updateCategoryDto: UpdateCategoryDto) {
    //     return `This action updates a #${id} category`;
    // }
    // remove(id: number) {
    //     return `This action removes a #${id} category`;
    // }
}
