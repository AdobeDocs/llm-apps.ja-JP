---
title: アプリのワイヤリング方法
description: アクションメタデータ、ハンドラーコード、ウィジェットなど、所有している要素が、ビルド時と実行時に、単一の実行中のLLM アプリにどのように統合されるのかを詳しく見ていきます。
source-git-commit: e066f66b37914e2f747176e865e26dcc074bff20
workflow-type: tm+mt
source-wordcount: '335'
ht-degree: 0%

---


# アプリのワイヤリング方法 {#app-architecture}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

## 一文で

**LLM アプリ**&#x200B;は、**アクション**&#x200B;のセットです（各1つは、**モデルで公開されたツールです）
単一のエンドポイントに公開するコンテキストプロトコル**&#x200B;または&#x200B;**MCP**）。 チャットホスト
[!DNL ChatGPT]さんがそれらのツールを見つけ、会話の途中で呼び出し、レンダリングします
結果が**インタラクティブウィジェット**&#x200B;です（チャット内）。

## 配線全体、ビルド→実行

**図1 – ビルド時間。** 3つの個別のサーフェスを所有します。プラットフォームはヒューズを使用します
1つのデプロイ可能なアプリに変換することです。

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ 1  LLM Apps UI      │   │ 2  Action Handler   │   │ 3  Widget repo      │
│                     │   │    repo             │   │                     │
│ Create, edit, and   │   │                     │   │ Each widget is an   │
│ manage your action  │   │ Business logic —    │   │ EDS block,          │
│ definitions here    │   │ built from our      │   │ published to a      │
│ (metadata)          │   │ boilerplate         │   │ public URL on       │
│                     │   │                     │   │ *.aem.page          │
│                     │   │ Returns content     │   │                     │
│                     │   │ (for the LLM) +     │   │                     │
│                     │   │ structuredContent   │   │                     │
│                     │   │ (for the widget)    │   │                     │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                       ┌─────────────────────────────┐
                       │ LLM Apps deploy pipeline    │
                       │ Combines the 3 surfaces     │
                       │ into one running app        │
                       └─────────────────────────────┘
                                     │
                                     ▼
                 ┌─────────────────────────────────────────┐
                 │ ONE MCP server on Adobe I/O Runtime     │
                 │ https://<ns>.adobeioruntime.net/.../mcp │
                 └─────────────────────────────────────────┘
```

- **LLM アプリ UI** – 各アクションの定義を作成、編集、管理する場所：
その**コード識別子** （ここで一度設定した固定スラグ（`my_action`など）
ui、ハンドラー、ウィジェットをまたいで同じアクションを結び付けます）。
説明、入力スキーマ、ウィジェットの選択、CSP/表示フラグ。 ノーコード：
- **Action Handler repo** — サーバーサイドのリポジトリ （ボイラープレートからスキャフォールド）
定義することができます。 すべてのハンドラー関数は、次の2つを返します。
  `content` （*LLM*&#x200B;が読み取るプレーンテキスト）および`structuredContent` （データオブジェクト
  *ウィジェット*&#x200B;は次のように読みます）。
- **Widget repo** – 各ウィジェットがブロックとして格納され、取得されるEDS リポジトリ
パブリック `*.aem.page` URLに公開しました。 各ブロックは
  [`@adobe/llmapps-sdk`](https://www.npmjs.com/package/@adobe/llmapps-sdk)、
ウィジェットとホスト/サーバーの間のブリッジです。 **MCP アプリを実装します
仕様** – 基礎となるプロトコル – 単純なAPIとitの背後
はLLM ホスト自体を抽象化するので、同じウィジェットはで変更せずに動作します
  [!DNL ChatGPT]、[!DNL Claude]、Gemini、またはその他のMCP ホスト。

**図2 — ランタイム。** ユーザーが送信するあらゆるメッセージに1回おこなうこと
その1つのサーバーは稼働しています。 [!DNL ChatGPT]をサンプル ホストとして表示する – 
[!DNL Claude]などの任意のMCP ホストに対して、同じシーケンスが再生されます。

```
┌── ChatGPT  (the MCP host) ──────────────────────────────────────────────┐
│  1  tools/list  >  sees `my_action` + its description + input schema    │
│  2  user asks   >  "I need help with …"                                 │
│  3  model picks >  the description matches -> calls this tool           │
│  4  tools/call  >  { name: "my_action", arguments: {situation, ...} }   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                 routes by CODE IDENTIFIER  ->  my_action
                                     ▼
┌── Adobe I/O Runtime ────────────────────────────────────────────────────┐
│  actions/my_action/index.js  --  your handler runs                      │
│  returns  { content -> text for the model , structuredContent -> data } │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌── Rendered inside the conversation ─────────────────────────────────────┐
│  5  render      >  ChatGPT renders the Widget repo's EDS block          │
│  The EDS block reads the structuredContent the Action Handler repo      │
│  returned, and draws the interactive card — live, inside the chat.      │
└─────────────────────────────────────────────────────────────────────────┘
```
