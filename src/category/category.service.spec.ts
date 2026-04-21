import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '../entities';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockCategoryRepo = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('CategoryService', () => {
    let service: CategoryService;
    let catRepo: ReturnType<typeof mockCategoryRepo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(Category),
                    useFactory: mockCategoryRepo,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        catRepo = module.get(getRepositoryToken(Category));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Find', () => {
        it('Should return all categories', async () => {
            const categories = [
                { id: '1', name: 'restaurants' },
                { id: '2', name: 'groceries' },
            ] as Category[];

            catRepo.find.mockResolvedValue(categories);

            const result = await service.findAll();

            expect(catRepo.find).toHaveBeenCalled();
            expect(result).toEqual(categories);
        });
    });

    describe('Find one', () => {
        it('Should return one category', async () => {
            const category = { id: '1', name: 'restaurants' } as Category;
            catRepo.findOneBy.mockResolvedValue(category);

            const result = await service.findOneById('1');

            expect(catRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(category);
        });

        it('Should throw error if missing', async () => {
            catRepo.findOneBy.mockResolvedValue(null);

            await expect(service.findOneById('2')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('Create', () => {
        it('Should create', async () => {
            const category = { name: 'restaurants' } as CreateCategoryDto;

            catRepo.findOneBy.mockResolvedValue(null);
            catRepo.save.mockResolvedValue(category);

            const result = await service.create(category);

            expect(catRepo.save).toHaveBeenCalledTimes(1);
            expect(result.name).toEqual(category.name);
        });

        it('Should throw error when duplicating name', async () => {
            const category = { name: 'restaurants' } as CreateCategoryDto;
            const existing = { id: '1', name: 'restaurants' } as Category;

            catRepo.findOneBy.mockResolvedValue(existing);
            await expect(service.create(category)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('Update', () => {
        it('Should throw error when not found', async () => {
            const category = {
                name: 'restaurants',
            } as UpdateCategoryDto;

            catRepo.save.mockResolvedValue(false);
            await expect(service.update('1', category)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('Should update', async () => {
            const category = { name: 'restaurants' } as UpdateCategoryDto;

            catRepo.save.mockResolvedValue({ id: '1', name: 'restaurants' });

            const result = await service.update('1', category);

            expect(result).toEqual({ id: '1', name: 'restaurants' });
        });
    });

    describe('Delete', () => {
        it('Should throw NotFoundException if not found', async () => {
            catRepo.delete.mockResolvedValue({ affected: 0 });
            await expect(service.remove('1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('Should remove', async () => {
            catRepo.delete.mockResolvedValue({ affected: 1 });
            await service.remove('1');
            expect(catRepo.delete).toHaveBeenCalledTimes(1);
            expect(catRepo.delete).toHaveBeenCalledWith('1');
        });
    });
});
