
import { readFileSync } from 'fs';
import { join } from 'path';

export const JSON_CONFIG_FILENAME = 'config.json';

export const configuration = () => {
    return JSON.parse(
        readFileSync(join(JSON_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;
};
