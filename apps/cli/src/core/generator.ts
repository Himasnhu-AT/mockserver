import { faker } from "@faker-js/faker";
import type { FieldType } from "../types";

export class DataGenerator {
  generateData(fields: Record<string, FieldType | any>, count: number): any[] {
    return Array.from({ length: count }).map(() => this.generateRow(fields));
  }

  private generateRow(fields: Record<string, FieldType | any>): any {
    const row: any = {};

    for (const [key, type] of Object.entries(fields)) {
      row[key] = this.generateField(type);
    }

    return row;
  }

  private generateField(type: FieldType | any): any {
    // Handle nested objects
    if (typeof type === "object" && !Array.isArray(type)) {
      return this.generateRow(type);
    }

    if (typeof type !== "string") return type;

    // Basic types
    if (type === "uuid") return faker.string.uuid();
    if (type === "email") return faker.internet.email();
    if (type === "username") return faker.internet.username();
    if (type === "firstName") return faker.person.firstName();
    if (type === "lastName") return faker.person.lastName();
    if (type === "sentence") return faker.lorem.sentence();
    if (type === "paragraph") return faker.lorem.paragraph();
    if (type === "word") return faker.lorem.word();
    if (type === "avatar") return faker.image.avatar();
    if (type === "image") return faker.image.url();
    if (type === "url") return faker.internet.url();
    if (type === "city") return faker.location.city();
    if (type === "timezone") return faker.location.timeZone();
    if (type === "boolean") return faker.datatype.boolean();

    // Date types
    if (type === "date:past") return faker.date.past().toISOString();
    if (type === "date:recent") return faker.date.recent().toISOString();
    if (type === "date:future") return faker.date.future().toISOString();
    if (type === "date:recent:nullable")
      return faker.datatype.boolean()
        ? faker.date.recent().toISOString()
        : null;

    // Integer with range: "integer" or "integer:min:max"
    if (type.startsWith("integer")) {
      const parts = type.split(":");
      if (parts.length === 3) {
        const min = parseInt(parts[1]);
        const max = parseInt(parts[2]);
        return faker.number.int({ min, max });
      }
      return faker.number.int({ min: 0, max: 1000 });
    }

    // Enum: "enum:option1,option2,option3"
    if (type.startsWith("enum:")) {
      const options = type.replace("enum:", "").split(",");
      return faker.helpers.arrayElement(options);
    }

    // Array: "array:type:min:max"
    if (type.startsWith("array:")) {
      const parts = type.replace("array:", "").split(":");
      const itemType = parts[0];
      const min = parts[1] ? parseInt(parts[1]) : 0;
      const max = parts[2] ? parseInt(parts[2]) : 5;
      const count = faker.number.int({ min, max });

      return Array.from({ length: count }).map(() =>
        this.generateField(itemType),
      );
    }

    // Image with type: "image:type" (landscape, portrait, avatar)
    if (type.startsWith("image:")) {
      const imageType = type.split(":")[1];
      if (imageType === "landscape")
        return faker.image.urlLoremFlickr({ category: "nature" });
      if (imageType === "portrait") return faker.image.avatar();
      if (imageType === "nullable")
        return faker.datatype.boolean() ? faker.image.url() : null;
      return faker.image.url();
    }

    // Emoji (simple implementation)
    if (type === "emoji") {
      const emojis = ["❤️", "👍", "😂", "🔥", "✨", "💯", "🎉", "👏"];
      return faker.helpers.arrayElement(emojis);
    }

    // Default fallback
    return `Unknown: ${type}`;
  }
}

export const dataGenerator = new DataGenerator();
