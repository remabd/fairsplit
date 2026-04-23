import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsUUID,
    IsOptional,
    IsDateString,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExpenseSplitDto {
    @IsUUID()
    userId!: string;

    @IsNumber()
    @Min(0)
    percentage!: number;
}

export class CreateExpenseDto {
    @IsUUID()
    spaceId!: string;

    @IsNumber()
    @Min(0.01)
    amount!: number;

    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsDateString()
    date!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExpenseSplitDto)
    splits!: ExpenseSplitDto[];

    @IsString()
    categoryId!: string;
}
