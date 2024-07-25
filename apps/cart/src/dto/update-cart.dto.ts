import { Product } from '@app/common';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class UpdateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Product)
  product?: Product[];
}
