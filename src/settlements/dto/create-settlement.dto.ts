import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateSettlementDto {
    @IsUUID()
    toUserId!: string;

    @IsNumber()
    @Min(0.01)
    amount!: number;
}
