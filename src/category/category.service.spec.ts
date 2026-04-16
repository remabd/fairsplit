import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '../entities';

const mockCategoryRepo = () => ({
    find: jest.fn(),
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
});
