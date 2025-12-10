import fs from "fs/promises";
import path from "path";
import { Schema } from "../types";
import { logger } from "../utils/logger.js";

export class StorageService {
    private baseDir: string;
    private dataDir: string;
    private schemaPath: string;

    constructor(baseDir: string = ".mockserver") {
        this.baseDir = path.resolve(process.cwd(), baseDir);
        this.dataDir = path.join(this.baseDir, "data");
        this.schemaPath = path.join(this.baseDir, "schema.json");
    }

    async init(initialSchema?: Schema) {
        try {
            await fs.mkdir(this.baseDir, { recursive: true });
            await fs.mkdir(this.dataDir, { recursive: true });

            // Check if schema exists, if not create it
            try {
                await fs.access(this.schemaPath);
            } catch (e) {
                if (initialSchema) {
                    await this.saveSchema(initialSchema);
                    logger.info("Initialized new schema at " + this.schemaPath);
                }
            }
        } catch (error) {
            logger.error("Failed to initialize storage: " + error);
            throw error;
        }
    }

    async getSchema(): Promise<Schema | null> {
        try {
            const data = await fs.readFile(this.schemaPath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return null; // Return null if schema doesn't exist or is invalid
        }
    }

    async saveSchema(schema: Schema): Promise<void> {
        await fs.writeFile(this.schemaPath, JSON.stringify(schema, null, 2));
    }

    async getData(resourceId: string): Promise<any[]> {
        const filePath = path.join(this.dataDir, `${resourceId}.json`);
        try {
            const data = await fs.readFile(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveData(resourceId: string, data: any[]): Promise<void> {
        const filePath = path.join(this.dataDir, `${resourceId}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
}

export const storage = new StorageService();
