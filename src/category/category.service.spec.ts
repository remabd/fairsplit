import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from 'src/entities';

describe('CategoryService', () => {
    let service: CategoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryService],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe("Find categories", ()=> {
        it('Should return all categories', ()=> {
            const categories = service.findAll();
            expect(categories).toBeInstanceOf(Category[]);
        })
    })
});
