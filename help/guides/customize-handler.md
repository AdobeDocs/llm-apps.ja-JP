---
title: 生成されたアクションハンドラーのカスタマイズ
description: Adobe LLM Apps ハンドラーコントラクトを理解し、生成されたサンプルデータを置き換え、ハンドラー出力をウィジェットに合わせます。
source-git-commit: 0f9dd0a5b1008e183eb8ab5a4c2eae34a78923bb
workflow-type: tm+mt
source-wordcount: '880'
ht-degree: 0%
---

# 生成されたハンドラーのカスタマイズ {#customize-generated-handler}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

プラットフォームは、生成されるあらゆるアクションに対して動作するハンドラーを作成します。 ハンドラーは、最初にエクスペリエンス全体をテストするためのサンプルデータを返します。

**このガイドでは、**&#x200B;生成されたハンドラーを見つけ、サンプルデータをシステムへの呼び出しに置き換え、ウィジェットと互換性のある応答を維持する方法について説明します。 変更をテストしてデプロイします。

## 生成されたハンドラーの検索

[ インフラストラクチャのセットアップ ](/help/guides/create-app.md)中に接続されたハンドラーリポジトリを開きます。 Adobeのマネージドインフラストラクチャを使用している場合は、続行する前にコードアクセスをリクエストしてください。

```text
actions/
└── <action-slug>/
    ├── index.js
    └── data.json
```

一致するテストは別のディレクトリにあります。

```text
test/
└── actions/
    └── <action-slug>.test.js
```

生成されたプルリクエストを使用して、正確なファイルを見つけます。 フォルダースラグはハイフンを使用しています。プラットフォームは、`actions/search-products/`の下にコード識別子`search_products`を含むアクションを生成します。 ランタイムは、ハイフネーションされたフォームと、識別子に正確に一致するフォルダーを認識します。

生成された`index.js`と関連するサンプルデータを編集します。 `entry.js`などのランタイムファイルは変更しないでください。

## ハンドラーコントラクト

各ハンドラーは、次の1つの非同期関数を書き出します。

```javascript
module.exports = async (args, extra) => {
  return {
    content: [
      { type: 'text', text: 'Response for the LLM platform.' }
    ],
    structuredContent: {
      // Data for the widget.
    }
  };
};
```

入力スキーマを持つアクションの場合、関数は`args` オブジェクトとオプションのランタイムコンテキスト `extra`を受け取り、結果オブジェクトを返します。 `getVariable(extra, 'PRODUCT_API_ORIGIN')`などのランタイムヘルパーには`extra`を使用します。アプリ変数は`process.env`を通じて自動的に公開されません。 [ アプリ変数とシークレットの設定](/help/guides/app-variables.md)を参照してください。

### 入力：`args`

`args`には、[!DNL LLM Apps]のアクションに対して定義されたパラメーターが含まれています。

`category`および`query` パラメーターを含むアクションの場合：

```javascript
module.exports = async ({ category = '', query = '' } = {}, extra) => {
  // Validate business rules before using the arguments.
};
```

アクションメタデータを使用すると、ランタイムは宣言された入力スキーマを、必須フィールド、プリミティブタイプ、列挙、配列項目など、サポートされているルールの検証に変換します。 ランタイムは完全なJSON スキーマ検証を実行しません。 ハンドラーの文字列長、数値範囲、ネストされたオブジェクトプロパティなどの制約を確認します。

スキーマメタデータのないローカル検出は、デプロイメントと同等ではありません。ランタイムは通常の`(args, extra)` フォームでアクション引数を渡しません。 ダイレクトハンドラーテストまたは代表的なローカル `actions.json` メタデータを使用して、引数をテストします。 [ ローカルハンドラーの開発とテスト ](/help/reference/development.md)を参照してください。

### 出力：`content`

常に`content`を返します。 これは、LLM プラットフォームおよびウィジェットを表示しないホストによって読み取られるコンテンツパーツの配列です。

```javascript
content: [
  {
    type: 'text',
    text: 'Found 3 products matching your search.'
  }
]
```

テキストの反応を簡潔にする： ユーザーに表示を許可していない資格情報、内部エラー、データは含めないでください。

### 出力：`structuredContent`

アクションにウィジェットがある場合、`structuredContent`を返します。 ベア配列ではなく、プレーンオブジェクトである必要があります。

```javascript
structuredContent: {
  arguments: { query: 'coffee' },
  records: [
    {
      id: 'P-100',
      name: 'Frescopa House Blend',
      price: '$14.99'
    }
  ]
}
```

`structuredContent`は、ホストに配信されたMCP アクション結果の一部です。 モデルやユーザーから隠されていると仮定しないでください。 エクスペリエンスに必要な承認済みデータのみを返します。資格情報やプライベートサーバー設定は返しません。

テキストのみのアクションの場合、`structuredContent`を返すことはオプションです。

## handler-widget コントラクト

ハンドラーとウィジェットは1つの契約を共有しています：`structuredContent`。

| ハンドラー出力 | 目的 |
|---|---|
| `content` | モデル読み取り可能な応答とテキストのみのフォールバック |
| `structuredContent` | データはホストに配信され、`bridge.toolResult`を通じてウィジェットで読み取られます |

このウィジェットは、LLM Apps SDK ブリッジからハンドラー結果を読み取ります。

```javascript
export default async function decorate(block, bridge) {
  if (!bridge?.isConnected || bridge.hostContext?.preview === true) {
    // Render the block's local preview data instead.
    return;
  }
  const result = await bridge.toolResult;
  const records = result?.structuredContent?.records ?? [];

  // Render records.
}
```

現在の生成ハンドラーは、`arguments`と`records`を含むオブジェクトを使用しています。 既存のアプリでは別のシェイプを使用できるので、編集する前に生成されたファイルを確認してください。 フィールド名またはタイプを変更すると、ウィジェットが壊れる可能性があります。 ハンドラー、ウィジェット、テストを一緒に更新します。

## サンプルデータの置き換え

生成されたハンドラーは、`data.json`から代表レコードを読み込みます。 サンプルデータ検索を、システムへのサーバーサイド呼び出しに置き換えます。 次の例では、パブリック HTTPS カタログ APIを使用し、その機密性のないオリジンをアプリ変数から読み取ります。 応答の検証をAPIに適応させます。

```javascript
const { getVariable } = require('@adobe/llm-apps-runtime');

module.exports = async ({ query = '' } = {}, extra) => {
  const normalizedQuery = typeof query === 'string' ? query.trim() : '';
  if (!normalizedQuery || normalizedQuery.length > 200) {
    return {
      content: [{ type: 'text', text: 'Enter a valid product search.' }],
      structuredContent: { arguments: {}, records: [] },
      isError: true
    };
  }

  const knownArguments = { query };
  try {
    const apiOrigin = getVariable(extra, 'PRODUCT_API_ORIGIN');
    if (!apiOrigin) {
      throw new Error('Missing configuration');
    }
    const origin = new URL(apiOrigin);
    if (origin.protocol !== 'https:' || origin.username || origin.password) {
      throw new Error('Invalid API origin');
    }
    const url = new URL('/v1/products', origin);
    url.searchParams.set('query', normalizedQuery);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.products)
        || !payload.products.every((product) =>
          product
          && typeof product.id === 'string'
          && typeof product.name === 'string'
          && typeof product.price === 'string')) {
      throw new Error('Unexpected response');
    }

    const records = payload.products.map(({ id, name, price }) => ({
      id,
      name,
      price
    }));

    return {
      content: [
        { type: 'text', text: `Found ${records.length} matching products.` }
      ],
      structuredContent: { arguments: knownArguments, records }
    };
  } catch {
    return {
      content: [{ type: 'text', text: 'Product search is unavailable. Try again later.' }],
      structuredContent: { arguments: knownArguments, records: [] },
      isError: true
    };
  }
};
```

ハンドラー内の保護されたネットワーク アクセスを維持します。 Widget JavaScriptやソースコントロールにAPI資格情報を絶対に入力しない。 サインイン ユーザーの代理で行われたリクエストについては、[ エンドユーザーの認証](/help/guides/authentication.md)を参照してください。

サービス URLなど、ハンドラーが必要とする機密性のない設定については、[ アプリ変数とシークレットの設定](/help/guides/app-variables.md)を参照してください。 環境ごとに変数を個別に設定します。 変数の変更は、次のデプロイメントで有効になります。 現在のUIでは、変数の追加のみがサポートされています。変数を使用してAPI資格情報を保存しないでください。

## 期待状態の処理

結果ごとに予測可能な出力シェイプを保持します。

### 結果が見つかりました

```javascript
{
  content: [{ type: 'text', text: 'Found 3 products.' }],
  structuredContent: { arguments: { query: 'coffee' }, records: [...] }
}
```

### 結果なし

```javascript
{
  content: [{ type: 'text', text: 'No matching products were found.' }],
  structuredContent: { arguments: { query: 'coffee' }, records: [] }
}
```

予測可能な結果シェイプを使用すると、`records`が存在するかどうかを推測せずに、ウィジェットが空の状態をレンダリングできます。

サービス失敗の場合は、例に示すように、`isError: true`という安全なエラー結果を返します。 失敗したリクエストが正常な空の検索として表示されないように、ウィジェットで`result.isError`を確認します。 スタックトレース、資格情報、内部ホスト、またはアップストリーム応答ボディは公開しないでください。

## 契約のテスト

ハンドラーが変更されるたびに、生成されたテストを更新します。 カバー :

- 有効な引数と無効な引数。
- 結果と結果なし状態：
- APIのエラーとタイムアウト：
- 形式が正しくないAPI応答。
- すべての結果に`content`が含まれています。
- `structuredContent`のプレーンオブジェクト。
- ウィジェットで期待される形状。

リポジトリの設定されたテストスイートを実行します。

```bash
npm test
```

生成されたテストがJestではなく`node:test`をインポートする場合は、`node --test test/actions/<action-slug>.test.js`で実行し、そのインポートパスが`test/actions/`から解決することを確認します。 ファイルに適したテストランナーを使用します。ボイラープレートの`npm test` コマンドはJestを実行します。

ローカル MCP テストについては、[ ローカルハンドラーの開発とテスト ](/help/reference/development.md)を参照してください。

## 変更をデプロイ

1. ハンドラーの変更を確定してプッシュします。
2. データシェイプを変更する場合は、ウィジェットを更新してプッシュします。
3. [ アプリを](/help/guides/deploy-your-app.md) ステージにデプロイします。
4. サポートされているLLM プラットフォームでテストする。 [ChatGPTでのテスト ](/help/guides/test-in-chatgpt.md)または[ クロードでのテスト ](/help/guides/test-in-claude.md)を参照してください。
5. ステージでテストが合格したら、実稼動環境にデプロイします。

次に、[生成されたウィジェットのカスタマイズ ](/help/guides/widgets.md)を参照してください。
