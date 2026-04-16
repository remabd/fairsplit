import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '../entities';

const mockCategoryRepo = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
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

            const result = await service.findOne('1');

            expect(catRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(category);
        });

        it('Should return null if id incorrect', async () => {
            catRepo.findOneBy.mockResolvedValue(null);

            const result = await service.findOne('2');
            expect(catRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(null);
        });
    });
});
