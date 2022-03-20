import {IsBoolean, IsNumber, IsString} from "class-validator";

export class TestDto {
    @IsNumber()
    numberField: number

    @IsString()
    strField: string
    
    @IsBoolean()
    boolField: boolean
}