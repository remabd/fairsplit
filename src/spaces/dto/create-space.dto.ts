import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateSpaceDto {
    @IsString()
    @MinLength(1)
    name!: string;

    @IsOptional()
    @IsString()
    currency?: string;
}
