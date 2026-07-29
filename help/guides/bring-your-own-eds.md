---
title: 独自のEdge Delivery Services プロジェクトを持ち込む
description: 既存のAdobe Edge Delivery Services プロジェクトをAdobe LLM Apps アクションに接続します。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '472'
ht-degree: 3%

---


# 独自のEDS プロジェクトを作成する {#bring-your-own-eds}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

このガイドは、既にEdge Delivery Services（EDS）プロジェクトがある場合や、アプリを自動作成せずに作成した場合に使用します。

プラットフォームが自動的にウィジェットを作成した場合は、代わりに[生成されたウィジェットをカスタマイズ ](/help/guides/widgets.md)します。 生成されたプロジェクトには、ここに記載されているSDK ファイル、ブロック、コンテンツ、およびアクション設定が既に含まれています。

**ジャーニー:** EDS プロジェクトを準備→、SDKをインストールしてブロックをビルドおよび公開→、デプロイとテストのアクション→設定→ます。

## 開始する前に

次のものが必要です。

- [AEM Code Sync](https://github.com/apps/aem-code-sync)がインストールされたEDS リポジトリ。
- そのリポジトリに依存関係を追加し、ブロックを作成する権限。
- EDS サイトの応答ヘッダーを設定する権限。
- `structuredContent`を返すハンドラーを含む[!DNL LLM Apps]のアクション。

## LLM Apps SDKのインストール

EDS プロジェクトルートから：

```bash
npm install @adobe/llmapps-sdk
```

パッケージは、ウィジェットのエントリポイントとブリッジ実装をプロジェクトにコピーします。

```text
scripts/
├── aem-embed.js
└── llmapps-sdk.js
```

アクションで使用されるスクリプト URLは`scripts/aem-embed.js`を指しています。

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
export default async function decorate(block, bridge) {
  if (bridge) {
    bridge.applyHostStyles();
  }

  const result = bridge ? await bridge.toolResult : null;
  const products = result?.structuredContent?.products ?? [];

  const list = document.createElement('ul');
  products.forEach((product) => {
    const item = document.createElement('li');
    item.textContent = String(product.name ?? 'Product');
    list.append(item);
  });

  block.replaceChildren(list);

  if (bridge) {
    bridge.autoResize(block);
  }
}
```

テキスト値をエンコードするDOM APIを使用します。 外部データをHTMLに連結しないでください。

## ウィジェットページの作成と公開

ウィジェット用に1つのEDS ページを作成し、ブロックをそのページに追加します。 ページを公開します。

ライブページ URLは、アクションのウィジェット URLになります。

```text
https://main--<repo>--<owner>.aem.live/<widget-page>
```

ページパスはアクション名と一致する必要はありませんが、一貫した規則を使用すると、プロジェクトの保守が容易になります。

## CORSの設定

このウィジェットは、EDS ページに加えて、オリジン間のスクリプト、スタイル、ブロック、メディアを読み込みます。 EDS サイトのヘッダーを設定します。

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

サポートされているLLM プラットフォームで必要な特定のホストオリジンを使用します。 ウィジェットが意図的にパブリックであり、資格情報によるクロスオリジン要求を使用せず、セキュリティ要件で許可されている場合にのみ`*`を使用してください。

EDS設定の詳細については、[設定サービス ](https://aem.live/docs/config-service-setup)を参照してください。

## アクションの設定

[!DNL LLM Apps]でアクションを開き、**[!UICONTROL ウィジェットメタデータ]**&#x200B;を選択します。

次を入力 :

- **[!UICONTROL スクリプト URL]**

  ```text
  https://main--<repo>--<owner>.aem.live/scripts/aem-embed.js
  ```

- **[!UICONTROL ウィジェット URL]**

  ```text
  https://main--<repo>--<owner>.aem.live/<widget-page>
  ```

最小権限を使用して、CSP ドメインとブラウザー権限を設定します。 ウィジェットに必要なオリジンと機能のみを追加します。

フィールド定義については、[ アクションとウィジェットフィールド ](/help/reference/reference-docs.md)を参照してください。

## 統合のテスト

1. EDS ページを直接プレビューし、サンプルデータのフォールバックを確認します。
2. ハンドラーをローカルでテストし、その`structuredContent`をブロックで期待される形状と比較します。
3. アプリをステージングにデプロイします。
4. [!DNL ChatGPT]からアクションを呼び出します。
5. 読み込み、成功、空、エラーの状態を確認します。

ページがLLM プラットフォームで直接機能するが、機能しない場合は、CORS、CSP、HTTPS URL、および`structuredContent` シェイプを確認してください。 「[ トラブルシューティング ](/help/reference/troubleshooting.md)」を参照してください。
