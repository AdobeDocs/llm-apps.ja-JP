---
title: アクションをゼロから作成
description: アクションメタデータを定義し、そのハンドラーを実装し、EDS ウィジェットを接続してテストし、Adobe LLM アプリを使用してデプロイします。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '1137'
ht-degree: 1%

---


# アクションをゼロから作成 {#create-action-from-scratch}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

>[!NOTE]
>
>このガイドでは、Adobe Edge Delivery Services （EDS）に関する基本的な知識を前提としています。 EDSを初めて使用する場合は、最初に[EDS開発者チュートリアル ](https://www.aem.live/developer/tutorial)および[ ブロックの探索](https://www.aem.live/docs/exploring-blocks)を読んで、ウィジェットを接続する前に、ブロック、`decorate`関数、EDS プロジェクト構造などの基本を学びます。

このガイドを使用して、プラットフォームが作成しなかった機能を追加します。 [!DNL LLM Apps]でアクションを定義し、リンクされたリポジトリにそのハンドラーを書き込み、必要に応じてウィジェットを追加し、テストしてデプロイします。

**ジャーニー:** メタデータを作成→るアクションを計画し→ハンドラーを書き込み、ウィジェット→接続してローカルにテスト→、プラグイン→デプロイしてテストします。

最初のアプリの場合は、[最初のアプリを自動的に作成](/help/guides/create-app.md)します。

## 開始する前に

次のものが必要です。

- 既存のLLM アプリ。
- リンクされたハンドラーリポジトリ。
- リポジトリは、依存関係がインストールされた状態でローカルに複製されました。
- アクションがウィジェットを表示する場合のEDS プロジェクト。
- 生産結果を取得するための明確なAPIまたはデータソース。

## アクションの計画

アクションは、1つの明確なユーザータスクを実行する必要があります。 UIを開く前に、以下を定義します。

- **インテント** — ユーザーが達成しようとしているもの。
- **説明** — LLM プラットフォームがこのアクションを選択する必要がある場合。
- **Inputs** — ユーザーに必要な最小情報。
- **結果** — ハンドラーによって返されるテキストおよび構造化データ。
- **ビヘイビアー** — アクションがデータの読み取り、データの変更、または外部システムの呼び出しを行うかどうか。
- **Widget** – 結果に視覚的なインターフェイスが必要かどうか。

例えば、**製品を検索** アクションでは、次を使用できます。

```text
Intent: Find products matching a category or search phrase
Inputs:
  category: optional string
  query: optional string
Result:
  content: text summary
  structuredContent: products and total count
Behavior: read-only, idempotent, open-world
Widget: product cards
```

関連するタスクと異なるタスクの区別。 製品検索と製品購入は、それぞれの情報源やリスク、確認要件が異なるため、ひとつのアクションとして捉えるべきではありません。

## アクションメタデータの作成

アプリを開いて&#x200B;**[!UICONTROL アクション]**&#x200B;を選択し、**[!UICONTROL アクションの作成]**&#x200B;を選択します。

エディターには、**[!UICONTROL アクション]**&#x200B;と&#x200B;**[!UICONTROL ウィジェットメタデータ]**&#x200B;のタブが含まれています。

### 基本情報を入力

![ アクションの作成 – 基本情報](/help/assets/guide-create-action/action-basic-info.png)

次を入力 :

- **[!UICONTROL アクション名]** — *製品の検索*&#x200B;などの短いタスク名。
- **[!UICONTROL 説明]** — アクションを使用するタイミングと返される内容を説明します。

便利な説明は次のとおりです。

```text
Search the product catalog by category or keyword. Returns matching
products with their names, prices, categories, and image URLs.
```

「*製品情報を取得します*」といった曖昧な説明は避けます。 LLM プラットフォームは、説明をもとにアクションを選択します。

### 注釈を選択

注釈は、アクションの動作を説明します。

- **破壊的なヒント** — アクションはデータを削除または完全に変更できます。
- **Idempotent （same args = no extra effect）** – 同じリクエストを繰り返すと、同じ効果が得られます。
- **Open world hint** — アクションは外部システムと通信します。
- **読み取り専用ヒント** — アクションでデータが変更されることはありません。

trueの注釈のみを選択します。 たとえば、商品検索は通常、読み取り専用、等価、オープンワールドです。

### OpenAI メタデータの追加

アクションの実行中および完了後に表示される短いメッセージを入力します。

```text
Invoking: Searching products...
Invoked: Products found
```

ウィジェットを使用するアクションの場合は、**[!UICONTROL ウィジェットの説明]**&#x200B;を追加します。 これは、アクションの説明とは異なります。

- **アクションの説明**&#x200B;は、モデルがアクションを呼び出すタイミングを決定するのに役立ちます。
- **ウィジェットの説明**&#x200B;は`_meta["openai/widgetDescription"]`にマッピングされ、レンダリングされたコンポーネントが示す内容を要約して、繰り返しナレーションを減らします。

[!DNL LLM Apps]はこれをコンポーネントメタデータとして適用します。 ハンドラーから返さないでください。

### 表示を設定

- **[!UICONTROL AI モデルに公開]**&#x200B;すると、モデルはアクションを選択できます。
- **[!UICONTROL アプリ サーフェスでウィジェットとして表示]**&#x200B;すると、設定されたウィジェットが表示されます。

アクションがテキストのみを返す場合、ウィジェットの表示を無効にします。

### 入力パラメーターの追加

ハンドラーが受け入れる値ごとに1つのパラメーターを追加します。 各パラメーターには次のものが必要です。

- **Name** — ハンドラーが受信したキー。
- **Type** – 文字列、数値、整数またはブール値。
- **説明** — モデルが値を抽出する方法。
- **必須** — アクションを実行できるかどうかを指定します。

**製品を検索**&#x200B;の場合：

```text
category
  Type: String
  Required: No
  Description: Product category used to narrow the catalog.

query
  Type: String
  Required: No
  Description: Product name or search phrase.
```

安定したパラメーター名を使用します。 名前を変更するには、ハンドラーとそのテストも変更する必要があります。

### 分析の設定

アクションに至った会話の概要をAnalyticsに含める場合は、**[!UICONTROL ユーザーインテントを収集]**&#x200B;を有効にします。

![ アクションの作成 – ユーザーインテント分析](/help/assets/guide-create-action/action-analytics-user-intent.png)

完全なフィールド定義については、[ アクションとウィジェットフィールド ](/help/reference/reference-docs.md)を参照してください。

## ウィジェットの設定

テキストのみのアクションの場合は、このセクションをスキップします。

**[!UICONTROL ウィジェットメタデータ]**&#x200B;を開きます。

![ アクションの作成 – ウィジェットのメタデータ ](/help/assets/guide-create-action/widget-metadata.png)

設定：

- **Type** — EDSを選択します。
- **Widget domain** — ウィジェットをホストするEDS オリジン。
- **境界線を優先** — ホスト内の境界線コンテナをリクエストします。
- **スクリプト URL** — EDS ウィジェットのエントリポイント。
- **ウィジェット URL** – このアクションの公開済みEDS ページ。

一般的なURLは次のとおりです。

```text
Script URL:
https://main--<repo>--<owner>.aem.live/scripts/aem-embed.js

Widget URL:
https://main--<repo>--<owner>.aem.live/<widget-page>
```

必要なブラウザー権限とCSP ドメインのみを付与します。

![ アクションの作成 – 権限とCSP](/help/assets/guide-create-action/widget-permissions-csp.png)

EDS プロジェクトまたはウィジェットページがまだ存在しない場合は、[自分のEDS プロジェクトを作成](/help/guides/bring-your-own-eds.md)し、アクションに戻ります。

## アクションを保存

「**[!UICONTROL 新しいアクションを作成]**」を選択します。 アクションは、**デプロイされていない** バッジを持つアクションページに表示されます。

この時点ではメタデータは存在しますが、アクションにはまだハンドラーが必要です。

## ハンドラーの実装

リンクされたハンドラーリポジトリを複製し、その依存関係をインストールします。

```bash
npm install
```

次のファイルを作成します。

```text
actions/
└── search-products/
    └── index.js
```

フォルダー名は、アクションエディターに表示されるアクションのコード識別子と一致する必要があります。

結果のコントラクトとハンドラーとウィジェットの関係について詳しくは、[生成ハンドラーのカスタマイズ ](/help/guides/customize-handler.md)を参照してください。

### ハンドラーコントラクト

1つの非同期関数を書き出します。

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

ハンドラーは、UIで定義されたパラメーターを受け取ります。

### `content`を返す

`content`は、LLM プラットフォームが読み取ったテキストフォールバックです。

```javascript
content: [
  { type: 'text', text: 'Found 3 matching products.' }
]
```

アクションにウィジェットがある場合でも、常に便利な`content`を返します。

### `structuredContent`を返す

`structuredContent`は、ウィジェットで使用されるプレーンオブジェクトです：

```javascript
structuredContent: {
  products: [
    { id: 'P-100', name: 'Product A', price: '$20' }
  ],
  total: 1
}
```

図形は、`bridge.toolResult`から読み取るEDS ブロックと一致している必要があります。

### APIの接続

サーバーサイドハンドラーで保護されたAPI アクセスを維持します。 ランタイム環境から設定を読み込み、固定HTTPS オリジンを使用します。

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

  const products = payload.products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price
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

ソースコード、アクションメタデータ、ウィジェット、JavaScript、ログ、ユーザー向けエラーなどにAPI資格情報を含めないでください。

実稼動コードの場合は、承認されたフィールドを`structuredContent`にマッピングする前に、アップストリームの完全な応答を検証します。

## ハンドラーテストの追加

一致するテストを作成します。

```text
test/
└── actions/
    └── search-products.test.js
```

少なくともテスト：

- 有効な入力：
- 入力がないか、無効です。
- 結果が空です。
- APIのタイムアウトまたは失敗。
- 形式が正しくないAPI データ。
- ウィジェットで想定される`structuredContent` シェイプ。

実行:

```bash
npm test
```

プロジェクトのレイアウトとローカル MCP テストについては、[ ローカルハンドラーの開発とテスト ](/help/reference/development.md)を参照してください。

## アクションをローカルでテストする

実行:

```bash
npm run dev:local
```

ローカル `actions.json`がなければ、サーバーは最小限のメタデータと入力スキーマの検証を行わずにハンドラーを検出します。

MCP インスペクターまたは`curl`を使用して、次を行います。

1. 登録したアクションを一覧表示します。
2. 代表引数を使用して新しいアクションを呼び出します。
3. `content`と`structuredContent`を確認します。
4. 無効なリクエストと空のリクエストをテストします。

## ウィジェットの接続とテスト

アクションにウィジェットがある場合：

1. ウィジェットにハンドラーの`structuredContent`を読み取らせます。
2. `textContent`などの安全なDOM APIを使用して、外部値をレンダリングします。
3. 読み込み、空、エラーの状態を追加します。
4. EDS ページをローカルでプレビューします。
5. CSP、CORS、およびウィジェットのURLを確認します。

「[独自のEDS プロジェクトを作成する](/help/guides/bring-your-own-eds.md)」を参照してください。

## デプロイとテスト

1. ハンドラーとウィジェットの変更をコミットしてプッシュします。
2. [ アプリを](/help/guides/deploy-your-app.md) ステージにデプロイします。
3. [ChatGPT プラグインをテスト ](/help/guides/test-in-chatgpt.md)。
4. アクションを呼び出す必要がある、または呼び出さないプロンプトを確認します。
5. ステージが成功したら、実稼動環境にデプロイします。

一致するハンドラーなしでメタデータが存在する場合、デプロイメントはアクションをデフォルトスタブに登録します。 アクションをユーザーが利用できるようにする前に、ハンドラーを追加します。
- [ガイド：ウィジェットの設定（EDS）](/help/guides/widgets.md)
