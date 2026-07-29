---
title: 生成されたアクションハンドラーのカスタマイズ
description: Adobe LLM Apps ハンドラーコントラクトを理解し、生成されたサンプルデータを置き換え、ハンドラー出力をウィジェットに合わせます。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '541'
ht-degree: 0%

---


# 生成されたハンドラーのカスタマイズ {#customize-generated-handler}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

プラットフォームは、生成されるあらゆるアクションに対して動作するハンドラーを作成します。 ハンドラーは最初にサンプルデータを返すので、完全なエクスペリエンスをテストできます。

このガイドでは、ハンドラー契約について説明し、サンプルデータをAPIまたはデータソースに置き換えます。

**ジャーニー:**&#x200B;生成されたハンドラーを見つけ→その入力を理解し、結果→システムを接続→て、ウィジェットのコントラクトをテストおよびデプロイ→維持します。

## 生成されたハンドラーの検索

オンボーディング中に選択したハンドラーリポジトリを開きます。

```text
actions/
└── <action-name>/
    └── index.js
```

一致するテストは別々に保存されます。

```text
test/
└── actions/
    └── <action-name>.test.js
```

生成された`index.js`を編集します。 `entry.js`などのランタイムファイルは変更しないでください。

## ハンドラーコントラクト

各ハンドラーは、次の1つの非同期関数を書き出します。

```javascript
module.exports = async (args) => {
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

関数は`args` オブジェクトを受け取り、結果オブジェクトを返します。

### 入力：`args`

`args`には、[!DNL LLM Apps]のアクションに対して定義されたパラメーターが含まれています。

`category`および`query` パラメーターを含むアクションの場合：

```javascript
module.exports = async ({ category = '', query = '' } = {}) => {
  // Use the validated action arguments.
};
```

ランタイムは、アクションのメタデータに`inputSchema`が含まれている場合、デプロイメント後と同様に入力スキーマを検証します。 `actions.json`のないローカルハンドラー検出では、スキーマ検証は適用されません。 ハンドラーは、サポートされる値、最大長、許可される組み合わせなどのビジネスルールを常に適用する必要があります。

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

この回答はできるだけ簡潔にしてください。 ユーザーに表示を許可していない資格情報、内部エラー、データは含めないでください。

### 出力：`structuredContent`

アクションにウィジェットがある場合、`structuredContent`を返します。 ベア配列ではなく、プレーンオブジェクトである必要があります。

```javascript
structuredContent: {
  products: [
    {
      id: 'P-100',
      name: 'Frescopa House Blend',
      price: '$14.99'
    }
  ],
  total: 1
}
```

`structuredContent`はLLMではなくウィジェットに送信されます。 インターフェイスで必要なフィールドのみを返します。

テキストのみのアクションの場合、`structuredContent`は省略できます。

## handler-widget コントラクト

ハンドラーとウィジェットは1つの契約を共有しています：`structuredContent`。

```text
Action arguments
      ↓
Handler
      ├── content → LLM text response
      └── structuredContent → Widget
                                  ↓
                           bridge.toolResult
```

このウィジェットは、LLM Apps SDK ブリッジからハンドラー結果を読み取ります。

```javascript
export default async function decorate(block, bridge) {
  const result = await bridge.toolResult;
  const products = result?.structuredContent?.products ?? [];

  // Render products.
}
```

ハンドラーが次の値を返した場合：

```javascript
structuredContent: {
  products: [...],
  total: 3
}
```

ウィジェットは`structuredContent.products`と`structuredContent.total`を読む必要があります。

フィールド名またはタイプを変更すると、ウィジェットが壊れる可能性があります。 ハンドラー、ウィジェット、テストを一緒に更新します。

## サンプルデータの置き換え

生成されたハンドラーには、通常、メモリ内のサンプル配列が含まれます。 そのデータルックアップを、システムへのサーバーサイド呼び出しに置き換えます。

```javascript
const API_ORIGIN = process.env.PRODUCT_API_ORIGIN;
const API_TOKEN = process.env.PRODUCT_API_TOKEN;

module.exports = async ({ query = '' } = {}) => {
  const normalizedQuery = String(query).trim();
  if (!normalizedQuery || normalizedQuery.length > 200) {
    return {
      content: [{ type: 'text', text: 'Enter a valid product search.' }],
      structuredContent: { products: [], total: 0 }
    };
  }

  if (!API_ORIGIN || !API_TOKEN) {
    throw new Error('Product API configuration is unavailable.');
  }

  const origin = new URL(API_ORIGIN);
  if (origin.protocol !== 'https:') {
    throw new Error('Product API configuration must use HTTPS.');
  }

  const url = new URL('/v1/products', origin);
  url.searchParams.set('query', normalizedQuery);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) {
    throw new Error('Product service request failed.');
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.products)
      || !payload.products.every((product) =>
        product
        && typeof product.id === 'string'
        && typeof product.name === 'string'
        && typeof product.price === 'string')) {
    throw new Error('Product service returned an unexpected response.');
  }

  const products = payload.products.map(({ id, name, price }) => ({
    id,
    name,
    price
  }));

  return {
    content: [
      { type: 'text', text: `Found ${products.length} matching products.` }
    ],
    structuredContent: {
      products,
      total: products.length
    }
  };
};
```

ハンドラー内の保護されたネットワーク アクセスを維持します。 Widget JavaScriptやソースコントロールにAPI資格情報を絶対に入力しない。

## 期待状態の処理

結果ごとに予測可能な出力シェイプを保持します。

### 結果が見つかりました

```javascript
{
  content: [{ type: 'text', text: 'Found 3 products.' }],
  structuredContent: { products: [...], total: 3 }
}
```

### 結果なし

```javascript
{
  content: [{ type: 'text', text: 'No matching products were found.' }],
  structuredContent: { products: [], total: 0 }
}
```

ウィジェットは、`products`が存在するかどうかを推測せずに、空の状態をレンダリングできるようになりました。

サービス障害の場合、スタックトレース、トークン、内部ホスト、またはアップストリームの応答ボディを公開せずに、安全なエラーを返すかスローします。

## 契約のテスト

ハンドラーが変更されるたびに、生成されたテストを更新します。 カバー :

- 有効な引数と無効な引数。
- 結果と結果なし状態：
- APIのエラーとタイムアウト：
- 形式が正しくないAPI応答。
- `content`は常に存在します。
- `structuredContent`はプレーンオブジェクトです。
- ウィジェットで期待される形状。

実行:

```bash
npm test
```

ローカル MCP テストについては、[&#x200B; ローカルハンドラーの開発とテスト &#x200B;](/help/reference/development.md)を参照してください。

## 変更をデプロイ

1. ハンドラーの変更を確定してプッシュします。
2. データシェイプが変更された場合は、ウィジェットを更新してプッシュします。
3. [&#x200B; アプリを](/help/guides/deploy-your-app.md) ステージにデプロイします。
4. [ChatGPT プラグインをテスト &#x200B;](/help/guides/test-in-chatgpt.md)。
5. ステージが成功したら、実稼動環境にデプロイします。

次に、[生成されたウィジェットのカスタマイズ &#x200B;](/help/guides/widgets.md)を参照してください。
