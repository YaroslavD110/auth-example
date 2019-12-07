import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly config: Record<string, string>;

  constructor(filePath: string) {
    this.config = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.config[key];
  }
}
