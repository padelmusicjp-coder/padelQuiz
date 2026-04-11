import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '../src/data/questions.json');
const csvFilePath = path.join(__dirname, '../questions.csv');

try {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  const rows = jsonData.map(q => {
    const row = {
      id: q.id,
      categoryId: q.categoryId,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
      tags: q.tags.join(',')
    };

    // 最大4つの選択肢を処理
    for (let i = 0; i < 4; i++) {
      const choice = q.choices[i];
      row[`c${i+1}_text`] = choice ? choice.text : '';
      row[`c${i+1}_isCorrect`] = choice ? (choice.isCorrect ? 'TRUE' : 'FALSE') : '';
    }
    return row;
  });

  const csvData = stringify(rows, {
    header: true,
    columns: [
      'id', 'categoryId', 'difficulty', 'question', 'explanation', 'tags',
      'c1_text', 'c1_isCorrect', 'c2_text', 'c2_isCorrect',
      'c3_text', 'c3_isCorrect', 'c4_text', 'c4_isCorrect'
    ]
  });

  fs.writeFileSync(csvFilePath, '\uFEFF' + csvData, 'utf8'); // Excel文字化け防止のためBOMを追加
  console.log(`✅ エクスポート成功: ${csvFilePath}`);

} catch (error) {
  console.error("❌ エクスポートに失敗しました:", error);
}
