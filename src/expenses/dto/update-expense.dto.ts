import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
    IsDateString,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseSplitDto } from './create-expense.dto';

export class UpdateExpenseDto {
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    amount?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExpenseSplitDto)
    splits?: ExpenseSplitDto[];

    @IsString()
    categoryId!: string;
}
