import { AbstractRepository, Product } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";


@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
    protected readonly logger = new Logger(ProductRepository.name);

    constructor(
        @InjectModel(Product.name) userModel: Model<Product>,
        @InjectConnection() connection: Connection
    ) {
        super(userModel, connection)
    }
}