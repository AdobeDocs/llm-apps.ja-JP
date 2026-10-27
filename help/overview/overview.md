---
title: Adobe LLM アプリの概要
description: Adobe LLM アプリとは何か、どのように機能するのか、アプリの構築を開始する方法について説明します。
source-git-commit: d37cb1f4e199d77c94def7a034a55598bd3d8d83
workflow-type: tm+mt
source-wordcount: '624'
ht-degree: 1%
---

# Adobe LLM Apps – 概要 {#adobe-llm-apps-an-overview}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

## [!DNL Adobe LLM Apps]とは

[!DNL Adobe LLM Apps]では、[!DNL ChatGPT]や[!DNL Claude]などのサポート対象AI アシスタント内で、製品の検索、可用性チェック、サービス予約などの便利なアクションを提供できます。

>[!VIDEO](https://video.tv.adobe.com/v/3504875/?learn=on&enablevpops)

[!DNL LLM Apps]は[experience.adobe.com/llm-apps](https://experience.adobe.com/llm-apps)で利用できます。


## [!DNL LLM Apps]でできること

- **ブランド所有のLLM アクションを作成** — AI アシスタント内でアクティブ化する特定のビジネスフローを定義します（例：*テストドライブのスケジュール*、*製品の比較*、*サービスを予約*）。
- **インタラクティブ LLM ウィジェットを作成** — [!DNL GitHub] リポジトリでAEM コンポーネントとして管理されるビジュアル UI コンポーネント（製品カード、予約フォーム、ストアロケータ）を作成します。
- **一元的なブランドガバナンスの維持** – 作成者と開発者は、LLM プラットフォーム内で公開されるあらゆるコンテンツ、コピー、ビジュアルを完全に制御でき、承認はAEMで管理されます。
- **ステージングおよび実稼動環境へのデプロイ** – 管理されたデプロイメントパイプラインを使用すると、実稼動環境にプロモートする前に、ステージング環境でエクスペリエンスをテストできます。
- **アクションレベルで表示を制御** – 個々のアクションを有効または無効にしてから、アプリをデプロイして変更を適用します。
- **意思決定を促進する要因を測定** – 組み込みの分析機能（Adobe Customer Journey Analyticsを搭載）により、アクションのトリガー数、成功率、放棄率、上位のユーザープロンプト、可視性スコアが表示されます。

## [!DNL LLM Apps]が重要な理由

LLMのインタラクションは、従来の検索とは根本的に異なります。 LLMの平均セッションは、従来の検索セッションの4倍の長さで動作します。 消費者の40%以上が、複雑な購入決定をAI ツールで行っています。 [!DNL LLM Apps]がなければ、メンションに勝っても顧客を失う可能性があります。 [!DNL LLM Apps]は、ブランドが表示されるだけでなく、ユーザーが決定する準備ができた正確な瞬間に実用的であることを保証します。

## 主な概念 {#key-concepts}

### LLM アプリ

ユーザーが[!DNL ChatGPT]またはその他のLLM プラットフォーム内で操作するブランド アシスタント。 すべてのアクションをグループ化し、1つのユニットとしてデプロイします。

### アクション {#actions}

アプリが提供する機能（*ディストリビューターの検索*&#x200B;または&#x200B;*製品の参照*&#x200B;など）。 LLM プラットフォームは、リクエストが説明と一致するとアクションを呼び出します。 [!DNL LLM Apps]はアクションのメタデータを管理し、[!DNL GitHub] リポジトリはハンドラーコードを保存します。

### アクションハンドラー

LLM プラットフォームがアクションを呼び出したときに実行されるサーバーサイド関数。 ハンドラーを使用して入力を検証し、APIを呼び出して、テキストと構造化データを返します。

### ウィジェット {#widgets-eds}

カード、カルーセル、テーブルなど、LLMの返信が表示される視覚的な応答。 生成されたウィジェットは、[!DNL Edge Delivery Services] （EDS）リポジトリ内のブロックです。 Adobeのマネージドインフラストラクチャでは、Adobeがリポジトリを準備およびホストします。 あるいは、独自のリポジトリを接続することもできます。

### MCP サーバー

デプロイメント後に公開されたエンドポイント。 サポートされているLLM プラットフォームがこのエンドポイントに接続し、アクションを検出して呼び出します。

## 仕組み

ブランドの機能は[!DNL LLM Apps]で定義します。 プラットフォームはそうした機能をアクションとして利用できるようにし、AI アシスタントはそのアクションを利用して会話内で顧客のリクエストに答えます。

```
┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
│     Your brand     │          │      LLM Apps      │          │    AI assistant    │
│                    │          │                    │          │                    │
│   What you offer   │   ───▶   │  Turns that into   │   ───▶   │ Answers with your  │
│  and how you help  │          │    something AI    │          │    brand, live     │
│  customers today   │          │     can act on     │          │  inside the chat   │
└────────────────────┘          └────────────────────┘          └────────────────────┘
```

ビルドする内容とコンポーネントの連携の仕組みについて詳しくは、[&#x200B; アプリを連携させる方法](/help/guides/app-architecture.md)を参照してください。

## 今すぐ始める {#choose-your-journey}

アプリの作成とアクションの作成は別々の手順で行います。

1. [&#x200B; インフラストラクチャの設定](/help/guides/create-app.md)。 Adobeのマネージドインフラストラクチャを使用して簡単に設定するか、独自の[!DNL GitHub] リポジトリを使用します。
2. [&#x200B; アクションを作成](/help/guides/creating-actions.md)。 web サイトを分析してアクションを生成したり、自社で作成したりできます。
3. [&#x200B; アプリをデプロイしてテスト &#x200B;](/help/guides/deploy-your-app.md)。 生成された作業を確認し、ステージにデプロイし、サポートされているLLM プラットフォームでテストします。

自動生成は、サンプルの動作を最初に示します。 このアプリを顧客が利用できるようにするには、[&#x200B; ハンドラーをシステムに接続](/help/guides/customize-handler.md)し、[&#x200B; ウィジェットをカスタマイズ &#x200B;](/help/guides/widgets.md)します。

自分の[!DNL Adobe Analytics]または[!DNL Customer Journey Analytics]のアプリについて報告するには、[Adobe AnalyticsとCustomer Journey Analyticsの設定](/help/guides/analytics-setup.md)を参照してください。
