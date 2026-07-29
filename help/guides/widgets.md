---
title: 生成されたEDS ウィジェットのカスタマイズ
description: Adobe LLM アプリによって自動的に作成されるEdge Delivery Services ウィジェットについて理解し、カスタマイズします。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '646'
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
>このガイドでは、Adobe Edge Delivery Services （EDS）に関する基本的な知識を前提としています。 EDSを初めて使用する場合は、最初に[EDS開発者チュートリアル &#x200B;](https://www.aem.live/developer/tutorial)および[&#x200B; ブロックの探索](https://www.aem.live/docs/exploring-blocks)を読んで、ウィジェットをカスタマイズする前に、ブロック、`decorate`関数、EDS プロジェクト構造などの基本を学びます。

このプラットフォームは、生成されたアクションごとにEDS ウィジェットを作成します。 ウィジェットは既にアクション結果を受け取り、サンプルデータをレンダリングし、ホストのスタイルを適用し、[!DNL LLM Apps]でアクションにリンクされています。

まず、生成されたウィジェットをテストします。 次に、データ契約、インタラクション、ビジュアルデザインをカスタマイズします。

**ジャーニー:**&#x200B;生成されたブロックを検索し、そのデータ コントラクト→整列させ→安全にカスタマイズ→、ローカルでプレビュー→デプロイおよびテストを行います。

## 生成されたウィジェットの検索

アプリの作成時に選択したEDS リポジトリを開きます。 生成された各ウィジェットはEDS ブロックです。

```text
blocks/
└── <action-name>/
    ├── <action-name>.js
    └── <action-name>.css
```

- JavaScript ファイルは、アクション結果を読み取り、インターフェイスを構築します。
- CSS ファイルは、レイアウト、レスポンシブ動作、ビジュアルデザインを制御します。
- 生成されたプルリクエストには、アクション用に作成されたファイルが正確に表示されます。

また、ウィジェット URLとサポートするSDK ファイルも設定します。 2つ目のEDS プロジェクトを作成したり、生成されたウィジェットをカスタマイズするためにこれらの値を再入力したりする必要はありません。

## LLM Apps SDKがウィジェットを接続する方法

`@adobe/llmapps-sdk` パッケージは、EDS ウィジェットをLLM ホストに接続します。 生成されたEDS リポジトリには、次のものが含まれます。

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

ブロックにSDKを読み込むことはありません。 接続されている`bridge`が自動的に提供されます。 ウィジェットを次のように設定できます。

- ハンドラーの結果を`bridge.toolResult`で読み取ります。
- ホストのスタイル設定を`bridge.applyHostStyles()`で適用します。
- `bridge.sendMessage()`との会話を続行します。
- `bridge.callTool()`で別のアクションを呼び出します。
- サイズを`bridge.autoResize()`と同期しておきます。

このガイドでは、一般的なブリッジ方法について説明します。 完全なAPIについては、[`@adobe/llmapps-sdk` パッケージ &#x200B;](https://www.npmjs.com/package/@adobe/llmapps-sdk)を参照してください。

## データコントラクトについて

アクションハンドラーは`structuredContent`を返し、ブロックは`bridge.toolResult`から読み取ります。

```javascript
// Handler result
return {
  content: [{ type: 'text', text: `Found ${products.length} products.` }],
  structuredContent: { products, total: products.length }
};
```

```javascript
// EDS block
export default async function decorate(block, bridge) {
  const result = bridge ? await bridge.toolResult : null;
  const products = result?.structuredContent?.products ?? [];
  // Render products.
}
```

`structuredContent`を変更する場合は、ハンドラーとウィジェットを一緒に更新します。 完全な返品契約については、[生成ハンドラーのカスタマイズ &#x200B;](/help/guides/customize-handler.md)を参照してください。

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
  button.addEventListener('click', () => {
    if (bridge && product.id) {
      bridge.sendMessage(`Show me details for product ${String(product.id)}`);
    }
  });

  card.append(title, button);
  return card;
}
```

URLを`href`または`src`に割り当てる前に検証し、エクスペリエンスに必要なプロトコルのみを許可します。

## ホストブリッジの使用

EDSは接続されたブリッジを`decorate(block, bridge)`に渡します。 Guard bridgeが呼び出されるため、ブロックは直接EDS プレビュー中にもレンダリングされます。

### ホストスタイルの適用

```javascript
if (bridge) {
  bridge.applyHostStyles();
}
```

これは、ホストのタイポグラフィとテーマ変数に適用されます。 ウィジェット CSSは、明るいテーマと暗いテーマの両方をサポートする必要があります。

### フォローアップメッセージを送信する

```javascript
await bridge.sendMessage('Show me similar products.');
```

インタラクションが会話を継続する必要がある場合は、`sendMessage`を使用します。

### 別のアクションを呼び出す

```javascript
const result = await bridge.callTool('get-product-details', {
  id: product.id
});
```

別のアクション結果を必要とする明示的なインタラクションには、`callTool`を使用します。 内部の詳細を公開することなく、検証済みの値のみを渡し、エラーを処理します。

### ウィジェットサイズを同期したままにする

```javascript
if (bridge) {
  bridge.autoResize(block);
}
```

最初のレンダリングの後に`autoResize`を呼び出して、ホストがコンテンツの変更に応答できるようにします。

## 変更をプレビュー

生成されたブロックには、`bridge`が使用できない場合の直接プレビュー用のサンプルデータを含める必要があります。

EDS プロジェクトをローカルでプレビューするには：

```bash
npm install -g @adobe/aem-cli
aem up
```

生成されたウィジェットページ（`http://localhost:3000`）を開きます。 検証：

- 空、読み込み、成功、エラーの状態です。
- 長いテキストとオプションのフィールドがありません。
- キーボードナビゲーションと表示フォーカス：
- 明るいテーマと暗いテーマ
- 狭いレイアウトと幅広いレイアウト。

その後、アプリをステージングにデプロイし、LLM プラットフォームのライブ `structuredContent`でテストします。

## カスタマイズを公開

1. EDSの変更をコミットしてプッシュします。
2. データシェイプを変更した場合は、一致するハンドラーの変更を確定してプッシュします。
3. アプリをステージングにデプロイします。
4. [!DNL ChatGPT]のアクションとウィジェットをテストします。
5. 検証済みバージョンを本番環境に昇格します。

## その他のEDS設定

アプリを自動的にビルドしなかった場合、または既存のEDS サイトを統合する場合は、[独自のEDS プロジェクトを作成する](/help/guides/bring-your-own-eds.md)を参照してください。
