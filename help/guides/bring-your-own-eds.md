---
title: 独自のEdge Delivery Services プロジェクトを持ち込む
description: 既存のAdobe Edge Delivery Services プロジェクトをAdobe LLM Apps アクションに接続します。
hidefromtoc: true
source-git-commit: 0f9dd0a5b1008e183eb8ab5a4c2eae34a78923bb
workflow-type: tm+mt
source-wordcount: '866'
ht-degree: 1%
---

# 自分のEDS プロジェクトを持ち込む {#bring-your-own-eds}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

このガイドを使用して、互換性のある既存のEdge Delivery Services（EDS）プロジェクトを接続したり、自分で作成したアクションにウィジェットを追加したりします。 既存のプロジェクトはオプションです。 独自のインフラストラクチャを設定する場合、デフォルトのパスは、[ インフラストラクチャのセットアップ ](/help/guides/create-app.md)中にプラットフォームが初期化する2つの空のリポジトリから始まります。

プラットフォームが自動的にウィジェットを作成した場合は、代わりに[生成されたウィジェットをカスタマイズ ](/help/guides/widgets.md)します。 生成されたプロジェクトには、ここに記載されているSDK ファイル、ブロック、コンテンツ、およびアクション設定が既に含まれています。

**このガイドでは、** EDS プロジェクトの準備、SDKのインストール、およびウィジェットのビルドとパブリッシュの方法について説明します。 次に、ウィジェットをアクションに接続し、デプロイしたアプリでテストします。

## 始める前に

次のものが必要です。

- [AEM Code Sync](https://github.com/apps/aem-code-sync)がインストールされ、設定済みのコンテンツソースを含む、AEM ボイラープレートと互換性のあるEDS リポジトリ。
- そのリポジトリに依存関係を追加し、ブロックを作成する権限。
- EDS サイトの応答ヘッダーを設定する権限。
- `structuredContent`を返すハンドラーを含む[!DNL LLM Apps]のアクション。

既存のリポジトリをリンクすると、プラットフォームは`scripts/aem.js`、`blocks/`、`styles/styles.css`、`head.html`をチェックします。 埋め込みでは、`scripts/scripts.js`も読み込まれ、書き出された`decorateMain`関数を呼び出してブロックを準備します。 EDSのブロック読み込み契約を維持します。 必要なファイルだけでは、高度にカスタマイズされたプロジェクトが正しくレンダリングされることを確認できません。

## LLM Apps SDKのインストール

EDS プロジェクトルートから：

```bash
npm install @adobe/llmapps-sdk
```

パッケージのポストインストールフックは、ウィジェットのエントリポイント、ブリッジ実装、およびサポートするAdobe ライブラリをプロジェクトにコピーします。

```text
scripts/
├── aem-embed.js
├── llmapps-sdk.js
├── alloy-base.min.js
└── alloy-standalone.min.js
```

アクションのスクリプト URLは`scripts/llmapps-sdk.js`ではなく`scripts/aem-embed.js`を指しています。 インストールによってSDK ファイルがコピーされたことを確認してから、それらをプロジェクトにコミットしてプッシュします。 SDKをインストールまたは更新すると、フックによってコピーされたファイルが上書きされます。コピーされたSDK ファイルはカスタマイズしないでください。

## ウィジェットブロックの作成

アクションのブロックを作成します。

```text
blocks/
└── search-products/
    ├── search-products.js
    └── search-products.css
```

2番目の引数として接続されたブリッジを使用して、標準のEDS `decorate`関数をエクスポートします。

```javascript
const PREVIEW_RESULT = {
  records: [{ id: 'P-100', name: 'Frescopa House Blend' }]
};

export default async function decorate(block, bridge) {
  if (bridge?.isConnected) {
    bridge.applyHostStyles();
  }

  const live = bridge?.isConnected && bridge.hostContext?.preview !== true;
  const result = live ? await bridge.toolResult : null;
  const data = live ? result?.structuredContent : PREVIEW_RESULT;
  const records = Array.isArray(data?.records) ? data.records : [];

  if (result?.isError) {
    const message = document.createElement('p');
    message.textContent = 'Product search is unavailable. Try again later.';
    block.replaceChildren(message);
    bridge.autoResize(block);
    return;
  }

  const list = document.createElement('ul');
  records.forEach((product) => {
    const item = document.createElement('li');
    item.textContent = String(product?.name ?? 'Product');
    list.append(item);
  });

  if (records.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'No matching products were found.';
    list.append(item);
  }
  block.replaceChildren(list);

  if (bridge?.isConnected) {
    bridge.autoResize(block);
  }
}
```

テキスト値をエンコードするDOM APIを使用します。 外部データをHTMLに連結しないでください。

この例では、`structuredContent.records`が想定されています。 ハンドラーによって返されるプロパティ名とレコードフィールドを一致させます。 ブリッジが存在するかどうかを確認するだけでなく、`bridge.isConnected`を確認してください：`toolResult`はスタンドアロン モードでは解決されません。 `bridge.hostContext.preview`がプレビューモードを示す場合、LLM アプリのプレビューで、ブロックのサンプルデータを使用します。

## ウィジェットページの作成と公開

ウィジェット用に1つのEDS ページを作成し、ブロックをそのページに追加します。 ページを公開します。

ページ URLは、アクションのウィジェット URLになります。 例えば、デフォルトで生成される設定では、EDS プレビューのオリジンを使用します。

```text
https://main--<repo>--<owner>.aem.page/eds-widgets/search-products-demo
```

`https://main--<repo>--<owner>.aem.live`などのEDS ライブオリジンは、ページとアセットがそこに公開される場合にも機能します。 実際のサイトオリジンを使用します。設定されたEDS サイトには、GitHub リポジトリおよび所有者とは異なるサイト名および組織名を使用できます。

ウィジェット URLに`.plain.html`を追加すると、ページフラグメントが返され、ページに`search-products` ブロックが含まれていることを確認します。 ページパスはアクション識別子と一致する必要はありませんが、一貫した規則を使用すると、プロジェクトの保守が容易になります。

## CORSの設定

このウィジェットは、複数のオリジンにまたがるEDS ページ、スクリプト、スタイル、ブロック、メディアを読み込みます。 EDS サイトのヘッダーを設定します。

```json
{
  "/**": [
    {
      "key": "access-control-allow-origin",
      "value": "<allowed-host-origin>"
    }
  ]
}
```

チャットサイトのオリジンだけでなく、サポートされているLLM プラットフォームで必要となる実際のウィジェットサンドボックスオリジンを使用できます。 `.plain.html`の応答と、読み込まれたJavaScript、スタイル、フォント、メディアのCORSを確認します。

プラットフォームの自動EDS設定は、公開ウィジェットの配信用に`access-control-allow-origin: *`を設定し、より狭い既存の値を置き換えることができます。 このポリシーは、認証済みのクロスオリジン要求を持たず、セキュリティ要件が許可されている場合にのみ、意図的に公開されたリソースに対してのみ使用してください。 制限付きの既存サイトを管理する場合は、接続する前にそのポリシーを確認してください。ウィジェットを機能させるためにプライベートサイトコンテンツを公開しないでください。

EDS設定の詳細については、[設定サービス ](https://aem.live/docs/config-service-setup)を参照してください。

## アクションの設定

[!DNL LLM Apps]でアクションを開き、**[!UICONTROL LLM ウィジェットの詳細]**&#x200B;を選択します。 **[!UICONTROL ウィジェット情報]**&#x200B;で、**[!UICONTROL ウィジェットタイプ]**&#x200B;を&#x200B;**[!UICONTROL EDS]**&#x200B;に設定し、**[!UICONTROL テンプレート URL]**&#x200B;を展開します。

次を入力 :

- **[!UICONTROL スクリプト URL]**

  ```text
  https://main--<repo>--<owner>.aem.page/scripts/aem-embed.js
  ```

- **[!UICONTROL ウィジェット URL]**

  ```text
  https://main--<repo>--<owner>.aem.page/eds-widgets/search-products-demo
  ```

上記で確認した作業用サイトのオリジンとページに例を置き換えます。 最小権限を使用して、CSP ドメインとブラウザー権限を設定します。 EDS オリジンは、ページフラグメントの取得などの接続と、ブロックスクリプトやスタイルなどのリソースの両方に対して許可されている必要があります。 ウィジェットで必要な場合にのみ、他のオリジンを追加します。

「**[!UICONTROL 変更を保存]**」を選択してから、テスト中の環境に再デプロイします。 保存されたウィジェット設定は、デプロイメントするまで、実行中のMCP サーバーを更新しません。

フィールド定義については、[ アクションとウィジェットフィールド ](/help/reference/reference-docs.md)を参照してください。

## 統合のテスト

1. EDS ページを直接プレビューし、サンプルデータのフォールバックを確認します。
2. ハンドラーをローカルでテストし、その`structuredContent`をブロックで期待される形状と比較します。
3. ハンドラーとアクションメタデータをステージにデプロイします。 EDS コードとコンテンツ公開は別のステップです。
4. サポートされているLLM プラットフォームからアクションを呼び出します。 [ChatGPTでのテスト ](/help/guides/test-in-chatgpt.md)または[ クロードでのテスト ](/help/guides/test-in-claude.md)を参照してください。
5. 読み込み、成功、空、エラーの状態を確認します。

ページがLLM プラットフォームで直接機能するが、機能しない場合は、CORS、CSP、HTTPS URL、および`structuredContent` シェイプを確認してください。 「[ トラブルシューティング ](/help/reference/troubleshooting.md)」を参照してください。
