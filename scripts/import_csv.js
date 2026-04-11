import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '../src/data/questions.json');
const csvFilePath = path.join(__dirname, '../questions.csv');

try {
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  
  const records = parse(csvContent, {
    columns: true,     // ヘッダー行をキーにする
    skip_empty_lines: true,
    bom: true          // BOMを自動削除
  });

  const jsonData = records.map((record, index) => {
    const choices = [];
    for (let i = 1; i <= 4; i++) {
        const text = record[`c${i}_text`];
        const isCorrectStr = record[`c${i}_isCorrect`];
        if (text && text.trim() !== '') {
            // "TRUE" (大文字小文字問わず) や "1" があれば true 扱い
            const isCorrect = /^(true|1)$/i.test((isCorrectStr || '').trim());
            choices.push({
                id: `c${i}`,
                text: text.trim(),
                isCorrect: isCorrect
            });
        }
    }

    return {
      id: record.id || `q_${String(index + 1).padStart(3, '0')}`,
      categoryId: record.categoryId || 'other',
      difficulty: parseInt(record.difficulty, 10) || 1,
      question: record.question || '',
      choices: choices,
      explanation: record.explanation || '',
      tags: record.tags ? record.tags.split(',').map(t => t.trim()).filter(t => t !== '') : []
    };
  });

  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`✅ インポート成功: JSONファイルを更新しました (${jsonFilePath})`);

} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`❌ CSVファイルが見つかりません: ${csvFilePath}`);
  } else {
    console.error("❌ インポートに失敗しました:", error);
  }
}
