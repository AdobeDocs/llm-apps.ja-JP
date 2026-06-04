---
title: アクションハンドラーの記述
description: ハンドラーコントラクト、structuredContent、作業例など、Adobe LLM アプリのアクションハンドラーの作成方法について説明します。
source-git-commit: 483a71f5f1de5caf1bd89b26f4d67d2d5a0aa15a
workflow-type: tm+mt
source-wordcount: '714'
ht-degree: 0%

---


# アクションハンドラーの記述

>[!IMPORTANT]
>
>**免責事項：**&#x200B;これは[!DNL LLM Apps]のベータ版リリースです。 ここに示す機能、ワークフロー、UIは、必ずしもアプリケーションまたは製品の最終状態を表すものではありません。

UIでアクションを作成した後、メタデータは[!DNL LLM Apps] APIに保存されますが、その背後にはコードがありません。 このガイドでは、LLM プラットフォーム（[!DNL ChatGPT]やClaudeなど）がアクションを呼び出したときに実行されるハンドラー関数の記述について説明します。

プロジェクトのレイアウト、ローカル開発、テストの詳細については、[開発](/help/reference/development.md)を参照してください。

## 開発者契約

ハンドラーのみを書きます。 それ以外のすべて（アクション名、説明、入力スキーマ、注釈、ウィジェットの表示、権限、CSP）は[!DNL LLM Apps] UIにあり、デプロイ時に自動的にランタイムに配信されます。 リポジトリ内のメタデータを手作業で編集したり、コードにツールを登録したりすることはありません。

| 懸念材料 | どこに住んでいるか |
|---------|----------------|
| メタデータ（名前、説明、スキーマ、ウィジェット設定） | [!DNL LLM Apps] UI — APIに保存されました |
| ハンドラーコード（実行する関数） | あなたの[!DNL GitHub] リポジトリ — `actions/<name>/index.js` |
| `actions.json` （メタデータスナップショット） | デプロイパイプラインによって作成されます。ローカル開発用にUIからダウンロードされます。 |

## はじめに

リンクされたリポジトリーには、ハンドラーを記述する前にプロジェクト構造が必要です。 **[Adobe LLM Apps ボイラープレート ](https://github.com/Adobe-AIFoundations/llm-apps-boilerplate)**&#x200B;を複製して、空の開始点から開始します。

アプリの作成中にリンクしたリポジトリにコンテンツをプッシュします（例：`your-org/your-repo`）。

コードを配置したら、次を実行します。

```bash
npm install
```

これにより、[`@adobe/llm-apps-runtime`](https://www.npmjs.com/package/@adobe/llm-apps-runtime)を含むすべての依存関係がインストールされます。これは、MCP プロトコル通信、アクション検出、およびリクエストのルーティングを処理するランタイムです。 ランタイムは直接操作しません。ビルド時に`entry.js`によって使用されます。

>[!TIP]
>
>[Claude Code](https://claude.ai/code)または[Cursor](https://cursor.com)を使用している場合、ボイラープレートには`.claude/skills/llm-apps-action-author/`にすぐに使用できるClaude スキルが含まれています。 新しいアクションの基礎を築いたり、テストファイルを生成したり、ハンドラーの形状を検証したり、ハンドラーの契約を導くことができます。 これを使用するには、Claudeに&#x200B;*に「search-products」*&#x200B;というアクションを追加するよう依頼すると、正しいプロジェクト規則に自動的に従います。

## ハンドラーコントラクト

ハンドラーは、1つの非同期関数を書き出す`actions/<name>/index.js`の1つのファイルです。

```javascript
module.exports = async (args) => {
  return {
    content: [{ type: 'text', text: 'response for the LLM' }],
    structuredContent: { /* data for the widget */ }
  }
}
```

関数は、アクションの入力引数をプレーンオブジェクトとして受け取ります。これらは、アクションを作成ダイアログで定義したパラメーターです。 サーバーは、ハンドラーが呼び出される前に、入力スキーマに対してそれらを検証します。

### `content` （必須）

LLMおよびテキストのみのホストに送信されるコンテンツパーツの配列。 LLM プラットフォームは、これを読んで応答を策定します。

```javascript
content: [
  { type: 'text', text: 'Found 5 products matching category "bagged-coffee".' }
]
```

常に`content`を返します。これは、任意のホストのユニバーサルフォールバックです。

### `structuredContent`

ウィジェットに送信されるプレーン JavaScript オブジェクト。 このデータには&#x200B;**トークンのコストがゼロ**&#x200B;です。このデータは、商品カルーセルやマップなどのリッチ UIをレンダリングするためにEDS ウィジェット ブロックによって消費されます。

```javascript
structuredContent: {
  products: [
    { name: 'Product A', category: 'bagged-coffee', imageUrl: '...' },
    { name: 'Product B', category: 'bagged-coffee', imageUrl: '...' }
  ],
  total: 2,
  category: 'bagged-coffee'
}
```

構造は自由です。EDS ウィジェット ブロックが`bridge.toolResult`経由で期待するものと一致する必要があります。

>[!IMPORTANT]
>
>`structuredContent`は、ベア配列ではなくプレーンオブジェクトである必要があります。

### `_meta`（オプション）

結果と一緒に送信される追加メタデータ。 `openai/widgetDescription` キーは、ウィジェットの表示方法をLLM プラットフォームに伝えます。

```javascript
_meta: {
  'openai/widgetDescription': 'The widget displays a scrollable product carousel. '
    + 'Do NOT repeat the product list. Instead, highlight one or two recommendations.'
}
```

## 例：製品ハンドラーの検索

次に、`search-products` ハンドラーの例を示します。 オプションの`category` フィルターとフリーテキスト `query`を受け入れ、製品カタログを検索し、LLMのテキスト概要とウィジェットカルーセルの構造化データの両方を返します。

>[!NOTE]
>
>この例では、簡単にするためにハードコードされた製品アレイを使用しています。 実際のアプリケーションでは、通常、独自の製品APIまたはデータベースを呼び出して、結果を動的に取得します。

```javascript
// actions/search-products/index.js

const PRODUCTS = [
  {
    name: 'Product A',
    description: 'A short description of Product A.',
    category: 'bagged-coffee',
    sub_category: 'dark-roast',
    image_url: 'https://www.example.com/products/product-a/hero.jpg',
    url: 'https://www.example.com/products/product-a',
    productId: 'PROD-001',
    rating: 4.7,
    reviewCount: 58
  },
  // ... more products
];

const WIDGET_DESCRIPTION = 'The widget displays a scrollable product carousel '
  + 'with images, star ratings, and review counts. Do NOT repeat the product list.';

module.exports = async ({ category = '', query = '' } = {}) => {
  let results = PRODUCTS;

  if (category) {
    const categoryLower = category.toLowerCase();
    results = results.filter((p) =>
      p.category.toLowerCase().includes(categoryLower)
      || p.sub_category.toLowerCase().includes(categoryLower)
    );
  }

  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter((p) =>
      p.name.toLowerCase().includes(queryLower)
      || p.description.toLowerCase().includes(queryLower)
    );
  }

  const products = results.map((p) => ({
    productId: p.productId,
    name: p.name,
    shortDescription: p.description,
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageUrl: p.image_url,
    productUrl: p.url,
  }));

  if (products.length === 0) {
    return {
      content: [{ type: 'text', text: `No products found for "${category}".` }],
      structuredContent: { products: [], total: 0, category: null },
      _meta: { 'openai/widgetDescription': WIDGET_DESCRIPTION }
    };
  }

  return {
    content: [
      { type: 'text', text: `Found ${products.length} product(s) in "${category}".` }
    ],
    structuredContent: { products, total: products.length, category },
    _meta: { 'openai/widgetDescription': WIDGET_DESCRIPTION }
  };
};
```

**実行時の処理：**

1. ユーザーがLLM プラットフォーム *に「コーヒー製品を見せてください」と尋ねます。*
2. LLM プラットフォームは、インテントを&#x200B;*製品を検索*&#x200B;し、`category`を抽出します。
3. MCP サーバーが`{ category: 'bagged-coffee' }`を使用してハンドラーを呼び出します。
4. ハンドラーはカタログをフィルターし、`content` （LLMのテキスト概要） + `structuredContent` （ウィジェットの製品配列）を返します。
5. LLM プラットフォームは、テキスト応答を表示し、構造化データをEDS ウィジェットに渡し、製品カルーセルをレンダリングします。

## ハンドラーが見つからない場合は？

UIでアクションを定義したが、まだハンドラーファイルを作成していない場合、アクションはデプロイ時に登録されたままです。 呼び出しは、実際のコードを追加するまで空のコンテンツを返すデフォルトのスタブハンドラーを使用します。 つまり、最初にUIですべてのアクションを定義し、段階的に実装できます。

