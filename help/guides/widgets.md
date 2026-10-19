---
title: 生成されたEDS ウィジェットのカスタマイズ
description: Adobe LLM アプリによって自動的に作成されるEdge Delivery Services ウィジェットについて理解し、カスタマイズします。
source-git-commit: 0f9dd0a5b1008e183eb8ab5a4c2eae34a78923bb
workflow-type: tm+mt
source-wordcount: '1065'
ht-degree: 0%
---

# 生成されたウィジェットのカスタマイズ {#customize-generated-widget}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

>[!NOTE]
>
>このガイドでは、Adobe Edge Delivery Services （EDS）に関する基本的な知識を前提としています。 EDSを初めて使用する場合は、ウィジェットをカスタマイズする前に、[EDS開発者チュートリアル ](https://www.aem.live/developer/tutorial)および[ ブロックの探索](https://www.aem.live/docs/exploring-blocks)をお読みください。 これらのリソースには、ブロック、`decorate`関数、およびEDS プロジェクト構造が含まれています。

生成が成功すると、プラットフォームは[!DNL LLM Apps]のアクションにリンクされたEDS ウィジェットを提供します。 ウィジェットは、プレビュー用に代表データをレンダリングし、サポートされているLLM プラットフォームに接続されたときにハンドラーの結果を読み取ります。 ウィジェットをカスタマイズする前に、生成されたデザインと動作を確認します。

まず、生成されたウィジェットをテストします。 次に、データ契約、インタラクション、ビジュアルデザインをカスタマイズします。

**このガイドでは、**&#x200B;生成されたウィジェットを見つけて、アクションのデータとブランドのデザインに適応させる方法について説明します。 次に、変更をローカルでプレビューし、デプロイしたアプリでテストします。

## 生成されたウィジェットの検索

[ インフラストラクチャのセットアップ ](/help/guides/create-app.md)中に接続されたEDS リポジトリを開きます。 Adobeのマネージドインフラストラクチャを使用している場合は、続行する前にコードアクセスをリクエストしてください。 生成された各ウィジェットはEDS ブロックです。

```text
blocks/
└── <action-slug>/
    ├── <action-slug>.js
    └── <action-slug>.css
```

- JavaScript ファイルは、アクション結果を読み取り、インターフェイスを構築します。
- CSS ファイルは、レイアウト、レスポンシブ動作、ビジュアルデザインを制御します。
- 生成されたプルリクエストには、アクション用に作成されたファイルが正確に表示されます。

スラグはハイフンを使用しています。コード識別子`search_products`を持つアクションは`blocks/search-products/`などのブロックを使用します。 生成されたウィジェットページは通常`/eds-widgets/search-products-demo`です。実際の&#x200B;**[!UICONTROL ウィジェット URL]**&#x200B;をアクションメタデータに使用してください。

また、ウィジェット URLとサポートするSDK ファイルも設定します。 2つ目のEDS プロジェクトを作成したり、生成されたウィジェットをカスタマイズするためにウィジェット URLを再入力したりする必要はありません。

## LLM Apps SDKがウィジェットを接続する方法

`@adobe/llmapps-sdk` パッケージは、EDS ウィジェットをLLM ホストに接続します。 生成されたEDS リポジトリ内のそのエントリポイントは次のとおりです。

```text
scripts/
├── aem-embed.js
└── llmapps-sdk.js
```

`aem-embed.js`はホスト接続を確立し、EDS ページを読み込み、ブロックを呼び出します。

```javascript
export default async function decorate(block, bridge) {
  // Customize the widget here.
}
```

埋め込みは、ウィジェットページの`.plain.html` コンテンツを取得し、そのブロックを読み込みます。 ブロックにSDKを読み込むことはありません。 埋め込みは自動的に`bridge`を提供します。通常のEDS ページの読み込みでは提供されません。 ブリッジはウィジェットを許可します。

- ハンドラーの結果を`bridge.toolResult`で読み取ります。
- ホストのスタイル設定を`bridge.applyHostStyles()`で適用します。
- `bridge.sendMessage()`との会話を続行します。
- `bridge.callTool()`で別のアクションを呼び出します。
- サイズを`bridge.autoResize()`と同期しておきます。

このガイドでは、一般的なブリッジ方法について説明します。 完全なAPIについては、[`@adobe/llmapps-sdk` パッケージ ](https://www.npmjs.com/package/@adobe/llmapps-sdk)を参照してください。

## データコントラクトについて

アクションハンドラーは`structuredContent`を返し、ブロックは`bridge.toolResult`から読み取ります。

```javascript
// Handler result
return {
  content: [{ type: 'text', text: `Found ${records.length} products.` }],
  structuredContent: { arguments: { query: 'coffee' }, records }
};
```

```javascript
// EDS block
const PREVIEW_RESULT = {
  records: [{ id: 'P-100', name: 'Frescopa House Blend' }]
};

export default async function decorate(block, bridge) {
  const live = bridge?.isConnected && bridge.hostContext?.preview !== true;
  const result = live ? await bridge.toolResult : null;
  const data = live ? result?.structuredContent : PREVIEW_RESULT;
  const records = Array.isArray(data?.records) ? data.records : [];
  // Render records or an error state when result?.isError is true.
}
```

この例では、`PREVIEW_RESULT`はブロックのローカル サンプル データ オブジェクトです。 現在の生成ウィジェットでは`structuredContent.arguments`と`structuredContent.records`が使用されています。生成されたファイルを正確な形状に合わせて調べます。 空のライブ結果をプレビューレコードで置き換えない。

`bridge.toolResult`は最初の結果でのみ解決されます。 ウィジェットがマウントされたままであり、後で結果を処理する必要がある場合は、`bridge.onToolResult(callback)`を使用します。

`structuredContent`を変更する場合は、ハンドラーとウィジェットを一緒に更新します。 構造化データがモデルから隠されていると仮定しないでください。これはホストのアクション結果の一部です。 完全な返品契約については、[生成ハンドラーのカスタマイズ ](/help/guides/customize-handler.md)を参照してください。

## 外部データの安全なレンダリング

ハンドラー出力を信頼できないデータとして扱います。 `innerHTML`に応答値を挿入する代わりに、`textContent`などのDOM APIを優先します。

```javascript
function createProductCard(product, bridge) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const title = document.createElement('h3');
  title.textContent = String(product.name ?? 'Product');

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Tell me more';
  button.disabled = !bridge?.isConnected;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  button.addEventListener('click', async () => {
    if (bridge?.isConnected && typeof product.id === 'string') {
      try {
        await bridge.sendMessage(`Show me details for product ${product.id}`);
      } catch {
        status.textContent = 'Unable to send the request. Try again.';
      }
    }
  });

  card.append(title, button, status);
  return card;
}
```

URLを`href`または`src`に割り当てる前に検証し、エクスペリエンスに必要なプロトコルのみを許可します。

## ホストブリッジの使用

埋め込みはブリッジを`decorate(block, bridge)`に渡します。 `bridge?.isConnected`を使用したインタラクティブ呼び出しを保護して、直接EDS プレビュー中にもブロックをレンダリングします。 ブリッジ オブジェクトは接続せずにスタンドアロン モードで存在できます。スタンドアロン モードで`toolResult`を待っても解決できません。 LLM アプリのプレビューでは、ブロックがサンプルデータを選択できるように`bridge.hostContext.preview`も設定されます。

### ホストスタイルの適用

```javascript
if (bridge?.isConnected) {
  bridge.applyHostStyles();
}
```

メソッドは、使用可能なホスト CSS変数とフォントスタイルを適用します。 ホストスタイルの適用はオプションです。生成されたウィジェットは、代わりに独自のデザイントークンを使用できます。 埋め込みでは、シャドウ本体に`.light`および`.dark`個のクラスが保持されます。 ブロックがテーマの変更に対応する必要がある場合は、`bridge.hostContext.theme`と`bridge.onContextChange(callback)`を使用します。

### フォローアップメッセージを送信する

```javascript
if (bridge?.isConnected) {
  await bridge.sendMessage('Show me similar products.');
}
```

`sendMessage`を使用して、インタラクション後に会話を続行します。

### アクションを直接呼び出す

```javascript
if (bridge?.isConnected) {
  const result = await bridge.callTool('search_products', { query: 'coffee' });
  // Re-render this widget from result.structuredContent, or show result.isError.
}
```

アクション結果を必要とする明示的なインタラクションには、`callTool`を使用します。 ブロックフォルダー名や表示名ではなく、実際のターゲットアクションのコード識別子を渡します。`search_products`はその例です。 ホストはアクション呼び出しをサポートする必要があり、ターゲットアクションはアプリの表示を許可する必要があります。 アクションを呼び出しても、現在のウィジェットは自動的に再レンダリングされません。 内部の詳細を公開することなく、検証済みの値のみを渡し、拒否された呼び出しを処理します。

ターゲットアクションの表示を変更する必要がある場合は、**[!UICONTROL アクションの詳細]**&#x200B;の下でそのアクションのみを編集し、変更を保存して、テスト中の環境に再デプロイします。

### ウィジェットサイズを同期したままにする

```javascript
if (bridge?.isConnected) {
  bridge.autoResize(block);
}
```

ホストがコンテンツの変更に応答できるようにするには、最初のレンダリング後に`autoResize`を呼び出します。 メソッドは、ウィジェットが削除されたときに観察を停止するクリーンアップ関数を返します。

## 変更をプレビュー

生成されたブロックには、ブリッジが見つからないか、切断されているか、プレビューとしてマークされている場合の直接プレビュー用のサンプルデータが含まれています。 サンプルデータのフォールバックは、空の状態とエラー状態から分離します。

EDS プロジェクトをローカルでプレビューするには：

```bash
npm install -g @adobe/aem-cli
aem up
```

アクションのWidget URLのパスを、サイトルートだけでなく、ローカルサーバー（例：`http://localhost:3000/eds-widgets/search-products-demo`）で開きます。 検証：

- 空、読み込み、成功、エラーの状態です。
- 長いテキストとオプションのフィールドがありません。
- キーボードナビゲーションと表示フォーカス：
- 明るいテーマと暗いテーマ
- 狭いレイアウトと幅広いレイアウト。

ダイレクト EDS プレビューでは、ホストハンドシェイクやライブアクションデータはテストされません。 サポートされているLLM プラットフォームでEDSの変更を公開し、ライブ `structuredContent`でテストします。

## カスタマイズを公開

1. EDSの変更をコミットしてプッシュします。
2. ウィジェットページと変更されたスクリプトとスタイルが、設定済みのEDS URLで使用できることを確認します。 EDS公開ワークフローを使用してコンテンツの変更を公開します。
3. ハンドラーまたはアクションメタデータを変更した場合は、変更をプッシュして、アプリをステージにデプロイします。
4. サポートされているLLM プラットフォームでアクションとウィジェットをテストします。 [ChatGPTでのテスト ](/help/guides/test-in-chatgpt.md)または[ クロードでのテスト ](/help/guides/test-in-claude.md)を参照してください。
5. テストが成功したら、必要に応じてハンドラーとメタデータの変更を実稼動環境にデプロイします。

EDS パブリケーションは、アプリ デプロイメントとは別です。 ステージングと実稼動で同じEDS URLを使用する場合、これらのURLでのウィジェットの変更は両方の環境に影響します。ステージングにデプロイしても、分離されたウィジェットのコピーは作成されません。

## その他のEDS設定

自分でアクションを作成した場合、または互換性のある既存のEDS サイトを統合する場合は、[独自のEDS プロジェクトを作成する](/help/guides/bring-your-own-eds.md)を参照してください。
