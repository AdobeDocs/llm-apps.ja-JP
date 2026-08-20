---
title: アプリのワイヤリング方法
description: アクションメタデータ、ハンドラーコード、ウィジェットなど、所有している要素が、ビルド時と実行時に、単一の実行中のLLM アプリにどのように統合されるのかを詳しく見ていきます。
source-git-commit: 2f3480b3667a6ab7c4ed65b999eed4638c383edb
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

**LLM アプリ**&#x200B;は、単一のエンドポイントに公開する&#x200B;**アクション**&#x200B;のセットです（それぞれ&#x200B;**モデル コンテキスト プロトコル**&#x200B;または&#x200B;**MCP**&#x200B;で公開されたツールです）。 [!DNL ChatGPT]のようなチャットホストは、これらのツールを検出し、会話の途中で呼び出し、チャット内で&#x200B;**インタラクティブウィジェット**&#x200B;を結果としてレンダリングします。

## 配線全体、ビルド→実行

**図1 – ビルド時間。** 3つの個別のサーフェスを所有しています。プラットフォームはそれらを1つのデプロイ可能なアプリに融合させます。

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

- **LLM アプリ UI** – 各アクションの定義を作成、編集、管理する場所：その&#x200B;**コード識別子** （UI、ハンドラー、ウィジェット全体でこの同じアクションを結びつける固定スラグ `my_action`など）、説明、入力スキーマ、ウィジェットの選択、およびCSP/表示フラグ。 ノーコード：
- **Action Handler repo** — ビジネスロジックを記述するサーバーサイドのリポジトリ（ボイラープレートからスキャフォールド）。 各ハンドラー関数は、2つの項目（`content` （*LLM*&#x200B;が読み取るプレーンテキスト）と`structuredContent` （*ウィジェット*&#x200B;が読み取るデータオブジェクト）を返します。
- **Widget repo** – 各ウィジェットがブロックとして格納され、パブリック `*.aem.page` URLに公開されるEDS リポジトリ。 各ブロックは、ウィジェットとホスト/サーバーの間のブリッジである[`@adobe/llmapps-sdk`](https://www.npmjs.com/package/@adobe/llmapps-sdk)を使用します。 シンプルなAPIの背後にある&#x200B;**MCP Apps仕様** （基本プロトコル）を実装し、LLM ホスト自体を抽象化するので、同じウィジェットは[!DNL ChatGPT]、[!DNL Claude]、Gemini、またはその他のMCP ホストで変更せずに動作します。

**図2 — ランタイム。** 1つのサーバーがライブになると、ユーザーが送信するあらゆるメッセージで何が起こるか。 [!DNL ChatGPT]をサンプル ホストとして表示します。同じシーケンスが[!DNL Claude]などの任意のMCP ホストに対して再生されます。

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
