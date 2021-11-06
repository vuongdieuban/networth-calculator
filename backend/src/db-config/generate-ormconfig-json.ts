import * as dotenv from 'dotenv';
dotenv.config();

import fs = require('fs');
import { ormconfig } from './ormconfig';

fs.writeFileSync('ormconfig.json', JSON.stringify(ormconfig, null, 2));
