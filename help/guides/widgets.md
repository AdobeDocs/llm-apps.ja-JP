---
title: ウィジェットの設定（EDS）
description: Edge Delivery Services ウィジェットプロジェクトを設定し、LLM プラットフォーム内で視覚的な応答をレンダリングするためのブロックコントラクトを実装する方法について説明します。
source-git-commit: 483a71f5f1de5caf1bd89b26f4d67d2d5a0aa15a
workflow-type: tm+mt
source-wordcount: '1214'
ht-degree: 1%

---


# ウィジェットの設定（EDS）

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。 ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。

このガイドでは、EDS ウィジェットをエンドツーエンドで作成する方法について説明します。[!DNL LLM Apps] UIでのアクションの設定から、EDS プロジェクトの設定、LLM プラットフォーム内でのデータをレンダリングするブロックコードの記述まで。 概要については、[&#x200B; コアコンセプト &#x200B;](/help/overview/overview.md#widgets-eds)を参照してください。

## ザ [!DNL LLM Apps] SDK

すべてが[`@adobe/llmapps-sdk`](https://www.npmjs.com/package/@adobe/llmapps-sdk) npm パッケージで始まります。 SDKは、ウィジェットとLLM ホスト間の双方向通信チャネルを強化するJavaScript ライブラリです。

SDKには、`aem-embed.js`も含まれています。これは、SDKを標準のEDS ブロックパイプラインに接続するEDS固有のエントリポイントです。 `npm install @adobe/llmapps-sdk`の場合、インストール後のスクリプトによって、2つのファイルがプロジェクトに自動的にコピーされます。

```
scripts/
└── llm-apps/
    ├── aem-embed.js     ← EDS widget entry point, ships with the SDK
    └── llmapps-sdk.js   ← core SDK, loaded internally by aem-embed.js
```

EDS プロジェクトでは、**ブロックコードでSDKを直接使用することはできません。** `aem-embed.js`は、SDK接続を作成および管理し、完全に接続された`LLMApp` インスタンスを`decorate(block, bridge)`の`bridge`引数としてブロックに渡します。 完全なSDK APIは`bridge`で利用できます。インポートは必要ありません。

EDS **（標準バンドラーまたはTypeScript プロジェクト）を使用せずにウィジェット**&#x200B;を作成する場合は、SDKを直接使用できます。

```javascript
import { LLMApp } from '@adobe/llmapps-sdk';

const app = new LLMApp({ appInfo: { name: 'MyWidget', version: '1.0.0' } });
await app.connect();

const { structuredContent } = await app.toolResult;
```

## アドビのツールと統合すれば

AIがアクションを呼び出し、ハンドラーが`structuredContent`を返すと、LLM プラットフォームは会話内でインタラクティブウィジェットをレンダリングします。 この連携を実現するには、次の3つの要素が必要です。

**[!DNL LLM Apps] UI** — アクションを作成する際、「ウィジェットのメタデータ」タブに&#x200B;**[!UICONTROL スクリプト URL]**&#x200B;と&#x200B;**[!UICONTROL ウィジェット URL]**&#x200B;を入力します。 スクリプト URLは`aem-embed.js`を指しています。これは、SDKに付属し、`scripts/llm-apps/aem-embed.js`にあるEDS リポジトリ内にあるファイルです。 これは、アクションが呼び出されたときに読み込むスクリプトをLLM プラットフォームに伝えます。

**`aem-embed.js`** — LLM プラットフォームは、このスクリプトをサンドボックス化されたウィジェットサーフェスに読み込みます。 `aem-embed.js`は、ウィジェットのEDS対応エントリポイントとして機能するカスタム HTML要素（`<aem-embed>`）です。 SDKを使用してLLM ホストとのハンドシェイクを実行し、通常のEDS ページパイプライン（ヘッダー/フッターなし）を抑制し、Widget URLからEDS ページコンテンツを取得し、EDS ブロックパイプラインを実行し、各ブロックの`decorate()`関数にライブ `bridge` オブジェクトを配信します。

**ブロックコード** — `decorate(block, bridge)`関数を書き出す標準のEDS ブロックを作成します。 `bridge`は、接続されたSDK インスタンスです。アクションの構造化された結果を提供し、メッセージを会話に送り返すことができます。

## 既存のEDS プロジェクトに追加

既にEDS プロジェクトがある場合、ブロックの書き込みを開始するには2つの手順しかありません。

1. `@adobe/llmapps-sdk`をインストールします。 インストール後のスクリプトは`aem-embed.js`と`llmapps-sdk.js`を`scripts/llm-apps/`にコピーします：

   ```bash
   npm install @adobe/llmapps-sdk
   ```

2. LLM プラットフォームがクロスオリジンでウィジェットページとスクリプトを読み込めるようにCORS ヘッダーを設定します。以下の[CORS ヘッダーの設定](#configure-cors-headers)を参照してください。

次に、[`decorate(block, bridge)` コントラクト &#x200B;](#the-decorateblock-bridge-contract)に従ってブロックを作成し、ウィジェットページをオーサリングして、アクションを作成ダイアログにURLを入力します。

## 新しいEDS プロジェクトの設定

### リポジトリの作成

1. [AEM ボイラープレート &#x200B;](https://github.com/adobe/aem-boilerplate) テンプレートに基づいて、新しい[!DNL GitHub] リポジトリを作成します。
2. [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync)をリポジトリに追加します。
3. ローカル開発 `npm install -g @adobe/aem-cli`用のAEM CLIをインストールします。
4. `@adobe/llmapps-sdk`をインストールします。 インストール後のスクリプトは`aem-embed.js`と`llmapps-sdk.js`を`scripts/llm-apps/`にコピーします：

   ```bash
   npm install @adobe/llmapps-sdk
   ```

EDS プロジェクトに関する完全なガイドについては、[AEM developer tutorial](https://www.aem.live/developer/tutorial)および[project anatomy](https://www.aem.live/developer/anatomy-of-a-project)を参照してください。

設定が完了すると、EDS サイトは次の場所で利用できます。

- **プレビュー：** `https://main--<repo>--<owner>.aem.page/`
- **ライブ：** `https://main--<repo>--<owner>.aem.live/`

### リポジトリ構造

```
my-brand-eds/
├── scripts/
│   ├── llm-apps/
│   │   ├── aem-embed.js           # Widget entry point — copied by post-install
│   │   └── llmapps-sdk.js         # Core SDK — copied by post-install
│   ├── aem.js                     # AEM core library
│   └── scripts.js                 # Site-level decoration and loading
├── blocks/
│   └── search-products/           # One folder per widget block
│       ├── search-products.js
│       └── search-products.css
├── styles/
│   └── styles.css
├── head.html
└── package.json
```

### CORS ヘッダーの設定

EDS ウィジェットページは、LLM プラットフォームによってサンドボックス化されたウィジェットサーフェス内に読み込まれます。 ホストがウィジェットのコンテンツをクロスオリジンで取得できるように、EDS サイトは正しい`access-control-allow-origin` ヘッダーを返す必要があります。

ヘッダーは、[Configuration Service](https://aem.live/docs/config-service-setup)を使用して、`admin.hlx.page`のAEM管理パネルを介して設定されます。 ウィジェットページとSDK スクリプトが存在するパスにカスタム応答ヘッダーを追加します。

```json
{
  "/<your-widget-pages-path>/**": [
    { "key": "access-control-allow-origin", "value": "*" }
  ],
  "/scripts/**": [
    { "key": "access-control-allow-origin", "value": "*" }
  ]
}
```

>[!NOTE]
>
>`*`をオリジン値として使用することは、`.aem.live` ドメイン上の公開ウィジェットコンテンツで許容されます。 サイトに保護されたコンテンツが含まれる場合は、オリジンを特定のドメインに制限します。

### ウィジェットページの作成

EDS オーサリングツールでページを作成し、ブロックを追加します。 ページ URLは、アクションで設定した&#x200B;**[!UICONTROL ウィジェット URL]**&#x200B;になります。これは、アクションとブロックの間の唯一の接続です。 ブロックとアクション名の間に名前を付ける必要はありません。

![EDS オーサリング – ウィジェットページに追加されたブロック &#x200B;](/help/assets/guide-widget/aem-author.png)

### アクションを作成ダイアログでURLを入力します

EDS リポジトリを設定したら、アクションの作成時に&#x200B;**Widget Metadata → Template URL**&#x200B;に移動します。

**[!UICONTROL スクリプト URL]** — EDS リポジトリ内の`aem-embed.js`を指します。 これは、同じEDS プロジェクト内のすべてのアクションに対して同じ値です。

```
https://main--<repo>--<owner>.aem.live/scripts/llm-apps/aem-embed.js
```

**[!UICONTROL ウィジェット URL]** – このウィジェット用に作成したEDS ページのURL。 アクションごとに一意：

```
https://main--<repo>--<owner>.aem.live/<path-to-your-widget-page>
```

LLM プラットフォームは、スクリプト URLから`aem-embed.js`を読み込みます。 次に、`aem-embed.js`はウィジェット URLから`.plain.html`を取得して、ブロック コンテンツを取得します。

## データフロー

ハンドラーからレンダリングされたウィジェットへの完全なパス：

1. **アクションハンドラー**&#x200B;が`structuredContent`を返します：

```javascript
// actions/search-products/index.js
return {
  structuredContent: {
    products: [
      { id: 'COF-001', name: 'Single Origin Ethiopian Coffee', price: '$18', rating: 4.7 },
      { id: 'COF-002', name: 'Colombia Huila Natural', price: '$22', rating: 4.5 },
    ],
    total: 2,
    category: 'coffee'
  }
};
```

1. **LLM プラットフォーム**&#x200B;がウィジェットサーフェスを開き、スクリプト URLから`aem-embed.js`を読み込みます。

1. **`aem-embed.js`**&#x200B;はSDKを介してホストに接続し、Widget URLから`.plain.html`を取得し、EDS ブロックパイプラインを実行し、ブロックで`decorate(block, bridge)`を呼び出します。

1. **ブロック**&#x200B;は`bridge.toolResult`からデータを読み取り、UIをレンダリングします。

1. **ユーザーインタラクション**&#x200B;が`bridge.sendMessage(...)`または`bridge.callTool(...)`をトリガーし、会話のフォローアップを送信します。

## `decorate(block, bridge)`契約

すべてのEDS ウィジェットブロックは、デフォルトの`decorate`関数を書き出す必要があります。 これは、2番目の引数で拡張された標準的なEDS ブロック署名です。接続された`bridge`は、使用可能な完全なAPIを備えた[`LLMApp`](https://www.npmjs.com/package/@adobe/llmapps-sdk) SDK インスタンスです。

```javascript
export default async function decorate(block, bridge) {
  // ...
}
```

`bridge`は、LLM プラットフォーム ウィジェット サーフェス内で実行する場合にのみ存在します。 ブラウザーまたはローカル開発サーバーで直接プレビューする際にも、ブロックがレンダリングされるように、常にブリッジ呼び出しを保護します。

### アクション結果からのデータのレンダリング

`bridge.toolResult`は、`structuredContent`を含む、ハンドラーが返した結果の全体を解決するPromiseです。

```javascript
const SAMPLE_PRODUCTS = [
  { id: 'COF-001', name: 'Single Origin Ethiopian Coffee', price: '$18', rating: 4.7 },
];

export default async function decorate(block, bridge) {
  let products = SAMPLE_PRODUCTS;

  if (bridge) {
    const result = await bridge.toolResult;
    products = result?.structuredContent?.products ?? [];
  }

  block.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      <button data-id="${p.id}">Tell me more</button>
    </div>
  `).join('');
}
```

### ホストテーマの適用

`decorate`の早い段階で`bridge.applyHostStyles()`を呼び出して、ホストのCSS変数とフォント（ライト/ダークテーマ、タイポグラフィ）をウィジェットに挿入します。 これにより、ウィジェットは周囲のLLM プラットフォーム UIと視覚的に一致します。

```javascript
export default async function decorate(block, bridge) {
  if (bridge) {
    bridge.applyHostStyles();
  }
  // ...
}
```

実行時にテーマの変更に対応するには（例えば、ユーザーがライトモードとダークモードを切り替えるとき）:

```javascript
if (bridge) {
  bridge.onContextChange(ctx => {
    block.dataset.theme = ctx.theme; // 'light' | 'dark'
  });
}
```

### フォローアップメッセージの送信

`bridge.sendMessage(text)`さんが会話にユーザーメッセージを挿入します。 これは、商品カードをクリックして詳細を確認するなど、ウィジェットトリガーがAIとのやり取りを促進する主な方法です。

```javascript
block.querySelectorAll('button[data-id]').forEach(btn => {
  btn.addEventListener('click', () => {
    bridge.sendMessage(`Show me details for product ${btn.dataset.id}`);
  });
});
```

### 別のアクションを直接呼び出す

`bridge.callTool(name, args)`は、ユーザーメッセージを経由せずに、ウィジェット内から別のアクションを呼び出します。 関連データをオンデマンドで読み込むのに便利です。

```javascript
btn.addEventListener('click', async () => {
  const result = await bridge.callTool('get-product-details', { id: product.id });
  renderDetails(result.structuredContent);
});
```

### ウィジェットの自動サイズ変更

LLM プラットフォームは、レポート内容に応じてウィジェットのサイズを調整します。 `bridge.autoResize(element)`を使用して、コンテンツの変更に合わせてウィジェットの高さを同期させます。内部では`ResizeObserver`を使用します。 最初のレンダリング後に呼び出します。

```javascript
export default async function decorate(block, bridge) {
  // ... render content ...

  if (bridge) {
    bridge.autoResize(block);
  }
}
```

または固定サイズを手動で報告します。

```javascript
bridge.reportSize(block.offsetWidth, block.offsetHeight);
```

### プレビューモードとローカル開発

ブラウザーまたはローカル開発サーバーでEDS ページを直接プレビューする場合、`bridge`は`undefined`です。 上記のサンプルデータフォールバックパターンを使用して、ライブハンドラーなしでブロックがすぐにレンダリングされるようにします。

ローカル開発サーバーを起動するには：

```bash
npm install -g @adobe/aem-cli
aem up
```

これで`http://localhost:3000`が開き、ウィジェットページに移動して、サンプルデータを使用したブロックのレンダリングを確認できます。 ブロック JSおよびCSSの変更は、すぐに反映されます。

## 次の手順

- [ガイド：アクションハンドラーの記述](/help/guides/write-action-handler.md)

