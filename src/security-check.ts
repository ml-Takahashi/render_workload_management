#!/usr/bin/env ts-node

/**
 * セキュリティチェックスクリプト
 * 機密情報が誤ってコミットされていないかチェックします
 */

import * as fs from 'fs';

// チェック対象のファイル
const filesToCheck: string[] = [
  'env.example',
  'README.md',
  'src/app.ts',
  'src/env.ts',
  'src/types.ts'
];

// 危険なパターン（実際のトークンやシークレット）
const dangerousPatterns: RegExp[] = [
  /sk-[A-Za-z0-9]{20,}/g,     // OpenAI API Key
  /pk_[A-Za-z0-9]{20,}/g,     // Stripe Public Key
  /sk_[A-Za-z0-9]{20,}/g,     // Stripe Secret Key
  /[A-Za-z0-9]{40,}/g         // 一般的な長いシークレット（40文字以上）
];

// 除外するパターン（プレースホルダーなど）
const excludePatterns: RegExp[] = [
  /your-.*-here/g,
  /your-.*-token-here/g,
  /your-.*-secret-here/g,
  /xoxb-your-.*-token-here/g,
  /your-actual-.*-here/g,
  /xoxb-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/g,  // プレースホルダー例
  /xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/g  // プレースホルダー例
];

interface SecurityIssue {
  file: string;
  pattern: string;
  match: string;
  line: number;
}

function checkFile(filePath: string): SecurityIssue[] {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ファイルが見つかりません: ${filePath}`);
    return [];
  }

  const content: string = fs.readFileSync(filePath, 'utf8');
  const issues: SecurityIssue[] = [];

  dangerousPatterns.forEach((pattern: RegExp) => {
    const matches: RegExpMatchArray | null = content.match(pattern);
    if (matches) {
      matches.forEach((match: string) => {
        // 除外パターンに該当しないかチェック
        const isExcluded: boolean = excludePatterns.some((excludePattern: RegExp) => 
          excludePattern.test(match)
        );
        
        if (!isExcluded) {
          issues.push({
            file: filePath,
            pattern: pattern.toString(),
            match: match,
            line: content.split('\n').findIndex((line: string) => line.includes(match)) + 1
          });
        }
      });
    }
  });

  return issues;
}

function main(): void {
  console.log('🔍 セキュリティチェックを開始します...\n');
  
  let totalIssues: number = 0;
  
  filesToCheck.forEach((file: string) => {
    const issues: SecurityIssue[] = checkFile(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach((issue: SecurityIssue) => {
        console.log(`   - 行 ${issue.line}: ${issue.match}`);
      });
      totalIssues += issues.length;
    } else {
      console.log(`✅ ${file}: 問題なし`);
    }
  });

  console.log(`\n📊 チェック結果: ${totalIssues} 件の問題が見つかりました`);
  
  if (totalIssues > 0) {
    console.log('\n⚠️  機密情報が検出されました。以下の対応を行ってください:');
    console.log('1. 実際のトークンやシークレットを削除');
    console.log('2. プレースホルダー値に置き換え');
    console.log('3. .envファイルに移動（.gitignoreに含まれていることを確認）');
    process.exit(1);
  } else {
    console.log('\n✅ セキュリティチェック完了: 問題は見つかりませんでした');
  }
}

main();
