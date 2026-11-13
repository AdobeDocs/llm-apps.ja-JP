---
title: アクションをゼロから作成
description: アクションメタデータを定義し、そのハンドラーを実装し、EDS ウィジェットを接続してテストし、Adobe LLM アプリを使用してデプロイします。
source-git-commit: 0276ae4e4627e49157911ad579a42c0e77045eee
workflow-type: tm+mt
source-wordcount: '1582'
ht-degree: 0%
---

# アクションをゼロから作成 {#create-action-from-scratch}

>[!IMPORTANT]
>
>LLM Appsは、AEM Sites Cloud Serviceのすべてのユーザーが独自のアプリケーションを開発および管理できます。 メーター設定が開始されると、各アプリ呼び出しは、お客様のAEM Sites コンテンツリクエストにカウントされます。 Adobeは、計量が有効になる前に、計量レートと開始日を発表します。

>[!NOTE]
>
>このガイドでは、Adobe Edge Delivery Services （EDS）に関する基本的な知識を前提としています。 EDSを初めて使用する場合は、最初に[EDS開発者チュートリアル ](https://www.aem.live/developer/tutorial)および[ ブロックの探索](https://www.aem.live/docs/exploring-blocks)を読んで、ウィジェットを接続する前に、ブロック、`decorate`関数、EDS プロジェクト構造などの基本を学びます。

プラットフォームが作成しなかった機能を追加します。 [!DNL LLM Apps]でアクションを定義し、リンクされたリポジトリにそのハンドラーを書き込み、必要に応じてウィジェットを追加します。

**このガイドでは、** アクションを定義し、そのハンドラーを実装し、オプションのウィジェットを接続する方法について説明します。 アクションをローカルにテストし、アプリをデプロイし、サポートされているLLM プラットフォームでアクションを試します。

最初のアプリの場合は、[ インフラストラクチャの設定](/help/guides/create-app.md)から開始し、[ アクションの作成](/help/guides/creating-actions.md)を行います。 アクションの作成ガイドでは、web サイトからの自動生成と手動での作成について説明します。

## 始める前に

次のものが必要です。

- 既存のLLM アプリ。
- リンクされたハンドラーリポジトリ。
- 依存関係がインストールされたリポジトリのローカルクローン。
- アクションがウィジェットを表示する場合のEDS プロジェクト。
- 生産結果を取得するための明確なAPIまたはデータソース。

## アクションの計画

ひとつの明確なユーザータスクをもとに、各アクションをデザインします。 UIを開く前に、以下を定義します。

- **インテント** — ユーザーが達成しようとしているもの。
- **説明** — アクションを選択するタイミング。
- **Inputs** — ユーザーに必要な最小情報。
- **結果** — ハンドラーによって返されるテキストおよび構造化データ。
- **ビヘイビアー** — アクションがデータの読み取り、データの変更、または外部システムの呼び出しを行うかどうか。
- **Widget** – 結果に視覚的なインターフェイスが必要かどうか。

例えば、次のプランを&#x200B;**製品を検索** アクションに使用します。

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

関連するタスクと異なるタスクの区別。 タスクの情報、リスク、確認要件が異なるため、製品検索と製品購入では個別のアクションを使用します。

## アクションメタデータの作成

アプリを開いて&#x200B;**[!UICONTROL アクション]**&#x200B;を選択し、**[!UICONTROL アクションの作成]**&#x200B;を選択します。

**[!UICONTROL 新しいアクションの作成]** ダイアログには、4つのタブがあります：**[!UICONTROL アクションの詳細]**、**[!UICONTROL LLM ウィジェットの詳細]**、**[!UICONTROL アプリケーションインサイト]**、および&#x200B;**[!UICONTROL ChatGPT拡張機能]**。 ダイアログが&#x200B;**[!UICONTROL アクションの詳細]**&#x200B;に開きます。 保存済みアクションエディターは、同じタブを使用します。

オプションの&#x200B;**[!UICONTROL ChatGPT Extensions]**&#x200B;設定を使用すると、ユーザーはアプリを直接開いたり、カスタムファイルビューアを使用したり、サポートされているクライアントでコンポーザーでリソースを検索したりできます。 対応するアクションとウィジェットの動作の準備が整った後に、これらの設定を行います。 [ChatGPT拡張機能の設定](/help/guides/chatgpt-extensions.md)を参照してください。

### アクション情報と入力パラメーターを入力します

![新しいアクションの作成 – アクション名、コード ID、説明、および2つの入力パラメーターを含むアクションの詳細](/help/assets/guide-create-action/action-basic-info.png)

**[!UICONTROL アクション情報]**&#x200B;の下に、次のように入力します。

- **[!UICONTROL アクション名]** — *製品の検索*&#x200B;などの短いタスク名。
- **[!UICONTROL 説明]** — アクションを使用するタイミングと返される内容を説明します。

このダイアログでは、名前から&#x200B;**[!UICONTROL コード識別子]**&#x200B;が派生します（例：`search-products`）。 識別子は作成後に修正され、アプリ内で一意である必要があります。 ハンドラーフォルダーに正確な識別子を使用します。

便利な説明は次のとおりです。

```text
Search the product catalog by category or keyword. Returns matching
products with their names, prices, categories, and image URLs.
```

「*製品情報を取得します*」といった曖昧な説明は避けます。 LLM プラットフォームは、説明をもとにアクションを選択します。

**[!UICONTROL 入力パラメーター]**&#x200B;で、ハンドラーが受け入れる値ごとに&#x200B;**[!UICONTROL パラメーター]**&#x200B;を1回追加するを選択します。 各パラメーターに対して、次のように入力します。

- **[!UICONTROL パラメーター名]** — ハンドラーが受け取るキー。
- **[!UICONTROL Type]** – 文字列、数値、整数、ブール値、オブジェクトまたはファイル。
- **[!UICONTROL 必須]** — アクションに値が必要かどうか。
- **[!UICONTROL 説明]** – 値の抽出方法。

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

### LLM設定の設定

**[!UICONTROL LLM設定]**&#x200B;を展開します。 セクションはデフォルトで折りたたまれます。

![新しいアクションを作成 – LLM設定に注釈、OpenAI メタデータのステータス テキスト、および表示を追加](/help/assets/guide-create-action/action-llm-settings.png)

「**[!UICONTROL 注釈]**」で、アクションに対してtrueのヒントのみを選択します。

- **[!UICONTROL 破壊的なヒント]** — アクションはデータを削除または完全に変更できます。
- **[!UICONTROL Idempotent （same args = no extra effect）]** – 同じリクエストを繰り返すと、同じ効果が得られます。
- **[!UICONTROL Open world hint]** — アクションは外部システムと通信します。
- **[!UICONTROL 読み取り専用ヒント]** — アクションでデータが変更されることはありません。

たとえば、商品検索は通常、読み取り専用、等価、オープンワールドです。

**[!UICONTROL OpenAI メタデータ]**&#x200B;の下に、アクションの実行中および完了後に表示される短いメッセージを、それぞれ最大64文字まで入力します。

```text
Invoking status text: Searching products...
Invoked status text: Products found
```

**[!UICONTROL 表示]**&#x200B;の下：

- **[!UICONTROL AI モデルに公開]**&#x200B;すると、モデルはアクションを選択できます。
- **[!UICONTROL アプリ サーフェスでウィジェットとして表示]**&#x200B;すると、設定されたウィジェットが表示されます。

ウィジェットの種類は表示によって選択されません。 テキストのみのアクションの場合は、**[!UICONTROL LLM ウィジェットの詳細]** > **[!UICONTROL ウィジェットタイプ]**&#x200B;の下にある&#x200B;**[!UICONTROL インタラクティブ UIなし]**&#x200B;を選択します。

### アプリケーションインサイトの設定 {#configure-analytics}

**[!UICONTROL アプリケーションインサイト]**&#x200B;を開きます。 **[!UICONTROL ユーザーインテントの収集]**&#x200B;がデフォルトで選択されています。LLM プラットフォームは、アクション実行時にユーザーが達成しようとしていたことの短い、匿名化された概要を作成します。

独自の[!DNL Adobe Analytics]または[!DNL Customer Journey Analytics]を設定すると、ユーザーインテントもそこに送信されます。 [Adobe AnalyticsとCustomer Journey Analyticsの設定](/help/guides/analytics-setup.md)を参照してください。

チェックボックスの下にある手順を確認して、概要を確認します。 機密性のない匿名化された意図に限定し、プライバシーポリシーにデータ収集を記載します。 命令は最大2,000文字を受け付けます。 **[!UICONTROL ユーザーインテントを収集]**&#x200B;をクリアして、概要を収集しません。

![新しいアクションの作成 – ユーザーのインテントを収集し、デフォルトの手順を使用したアプリケーションインサイト ](/help/assets/guide-create-action/action-analytics-user-intent.png)

完全なフィールド定義については、[ アクションとウィジェットフィールド ](/help/reference/reference-docs.md)を参照してください。

## ウィジェットの設定

**[!UICONTROL LLM ウィジェットの詳細]**&#x200B;を開きます。 テキストのみのアクションの場合は、**[!UICONTROL ウィジェットタイプ]**&#x200B;の下にある&#x200B;**[!UICONTROL インタラクティブ UIなし]**&#x200B;を選択し、残りのウィジェット設定をスキップします。

![新しいアクションを作成 – Edge Delivery Services ブロックを選択し、テンプレート URLの例を示すLLM Widgetの詳細](/help/assets/guide-create-action/widget-metadata.png)

**[!UICONTROL ウィジェット情報]**&#x200B;で、次の項目を設定します。

- **[!UICONTROL Widget type]** — インタラクティブ ウィジェットの&#x200B;**[!UICONTROL Edge Delivery Services ブロック]**&#x200B;を選択します。
- **[!UICONTROL Widget domain]** — ウィジェットのサンドボックスの生成元。 UIでは、アプリの提出に必要な項目とアプリごとに一意の項目が識別されます。これは、EDS ページのURLと同じではありません。
- **[!UICONTROL ウィジェットの説明]** — ウィジェットのレンダリング後にモデルが表示するのは、最大512文字です。

ウィジェットの説明は、アクションの説明とは異なります。

- **アクションの説明**&#x200B;は、モデルがアクションを呼び出すタイミングを決定するのに役立ちます。
- **ウィジェットの説明**&#x200B;は`_meta["openai/widgetDescription"]`にマッピングされ、レンダリングされたコンポーネントが示す内容を要約して、繰り返しナレーションを減らします。

[!DNL LLM Apps]は、ウィジェットの説明をコンポーネントメタデータとして適用します。 ハンドラーから説明を返さないでください。

**[!UICONTROL テンプレート URL]**&#x200B;を展開し、次を入力します。

- **[!UICONTROL スクリプト URL]** — EDS ウィジェットのエントリポイント。
- **[!UICONTROL ウィジェット URL]** – このアクションの公開済みEDS ページ。

一般的なURLは次のとおりです。

```text
Script URL:
https://main--<repo>--<owner>.aem.live/scripts/aem-embed.js

Widget URL:
https://main--<repo>--<owner>.aem.live/<widget-page>
```

**[!UICONTROL CSP設定]**&#x200B;の下で、ウィジェットがアセットとネットワークリクエストに必要なオリジンのみを追加します。 外部リソースを読み込むウィジェットは、CSPが不完全な場合、レンダリングされない可能性があります。

![新しいアクションの作成 – リソース、接続、フレーム、リダイレクト、およびベース URI ドメイン リストを使用したCSP設定](/help/assets/guide-create-action/widget-csp.png)

EDS プロジェクトまたはウィジェットページがまだ存在しない場合は、[自分のEDS プロジェクトを作成](/help/guides/bring-your-own-eds.md)し、アクションに戻ります。

## アクションを保存

「**[!UICONTROL 新しいアクションを作成]**」を選択します。 アクションは、**デプロイされていない** バッジを持つアクションページに表示されます。

保存するとメタデータが作成されますが、アクションにはまだハンドラーが必要です。

保存したアクションを再度開くと、エディターに同じタブが表示されます。 後で編集した内容を保存するには、**[!UICONTROL 変更を保存]**&#x200B;を選択します。

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

LLM プラットフォームは、`content`をテキストフォールバックとして読み取ります。

```javascript
content: [
  { type: 'text', text: 'Found 3 matching products.' }
]
```

アクションにウィジェットがある場合でも、常に便利な`content`を返します。

### `structuredContent`を返す

ウィジェットは`structuredContent`をプレーンオブジェクトとして使用します。

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

サーバーサイドハンドラーでAPI呼び出しを保持します。 この例では、パブリック製品APIを呼び出します。 `PRODUCT_API_ORIGIN`という名前の[ アプリ変数](/help/guides/app-variables.md)でAPIのHTTPS オリジンを設定します。 この例では、上記で定義された`query`および`category` パラメーターを受け入れ、少なくとも1つのパラメーターを必要とし、資格情報は必要ありません。

```javascript
const { getVariable } = require('@adobe/llm-apps-runtime');

module.exports = async ({ query = '', category = '' } = {}, extra) => {
  const normalizedQuery = typeof query === 'string' ? query.trim() : '';
  const normalizedCategory = typeof category === 'string' ? category.trim() : '';
  if (typeof query !== 'string' || typeof category !== 'string'
      || (!normalizedQuery && !normalizedCategory)
      || normalizedQuery.length > 200 || normalizedCategory.length > 100) {
    return {
      isError: true,
      content: [{ type: 'text', text: 'Enter a valid product search.' }],
      structuredContent: { products: [], total: 0 }
    };
  }

  const apiOrigin = getVariable(extra, 'PRODUCT_API_ORIGIN');
  if (!apiOrigin) {
    throw new Error('Product API configuration is unavailable.');
  }

  const origin = new URL(apiOrigin);
  if (origin.protocol !== 'https:') {
    throw new Error('Product API configuration must use HTTPS.');
  }

  const url = new URL('/v1/products', origin);
  if (normalizedQuery) {
    url.searchParams.set('query', normalizedQuery);
  }
  if (normalizedCategory) {
    url.searchParams.set('category', normalizedCategory);
  }

  const response = await fetch(url, {
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

ソースコード、アクションメタデータ、ウィジェット、JavaScript、ログ、ユーザー向けエラーなどにAPI資格情報を含めないでください。 **[!UICONTROL 変数とシークレット]** UIは、現在、シークレットではなく非機密変数のみをサポートしています。 API トークンを変数に格納しないでください。 アップストリーム APIに資格情報が必要な場合は、接続する前に、承認済みのサーバーサイド資格情報メカニズムを配置します。

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
3. [ChatGPT](/help/guides/test-in-chatgpt.md)または[Claude](/help/guides/test-in-claude.md)でアプリをテストします。
4. アクションと、そのアクションを呼び出さない無関係なプロンプトに一致するプロンプトを使用して、アクションの選択を確認します。
5. ステージが成功したら、実稼動環境にデプロイします。

一致するハンドラーなしでメタデータが存在する場合、デプロイメントはアクションをデフォルトスタブに登録します。 アクションをユーザーが利用できるようにする前に、ハンドラーを追加します。
