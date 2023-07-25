import { parse } from 'csv-parse';
import fs from 'node:fs';
import{ v4 as uuid} from 'uuid';

const csvPath = new URL('../../uploads/csv.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

export async function ImportCSV() {
  console.log('ImportCSV')
  
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [task] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: uuid(),
        task, createdAt: new Date().toString()
      })
    })

    
  }

}



