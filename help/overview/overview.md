---
title: Adobe LLM アプリの概要
description: Adobe LLM アプリの概要、仕組み、導入に必要な機能をご紹介します。
source-git-commit: e066f66b37914e2f747176e865e26dcc074bff20
workflow-type: tm+mt
source-wordcount: '973'
ht-degree: 1%

---


# Adobe LLM Apps – 概要 {#adobe-llm-apps-an-overview}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

## [!DNL Adobe LLM Apps]とは

[!DNL Adobe LLM Apps]では、[!DNL ChatGPT]などのAI アシスタント内で、製品の発見、可用性チェック、サービス予約などの有用なアクションを企業が提供できます。

[!DNL LLM Apps]は[experience.adobe.com](https://experience.adobe.com/#/@llmapps/llm-apps/)で利用できます。

## [!DNL LLM Apps]でできること

- **ブランド所有のLLM アクションを作成** — AI アシスタント内でアクティブ化する特定のビジネスフローを定義します（例：*テストドライブのスケジュール*、*製品の比較*、*サービスを予約*）。
- **インタラクティブ LLM ウィジェットを作成** — [!DNL GitHub] リポジトリでAEM コンポーネントとして管理されるビジュアル UI コンポーネント（製品カード、予約フォーム、ストアロケータ）を作成します。
- **一元的なブランドガバナンスの維持** – 作成者と開発者は、LLM プラットフォーム内で公開されるあらゆるコンテンツ、コピー、ビジュアルを完全に制御でき、承認はAEMで管理されます。
- **ステージングおよび実稼動環境へのデプロイ** – 管理されたデプロイメントパイプラインを使用すると、実稼動環境にプロモートする前に、ステージング環境でエクスペリエンスをテストできます。
- **アクションレベルでの可視性を制御** — デプロイメント後、アプリ全体を再デプロイすることなく、個々のアクションのオンとオフを切り替えることができます。
- **意思決定を促進する要因を測定** – 組み込みの分析機能（Adobe Customer Journey Analyticsを搭載）により、アクションのトリガー数、成功率、放棄率、上位のユーザープロンプト、可視性スコアが表示されます。

## [!DNL LLM Apps]が重要な理由

LLMのインタラクションは、従来の検索とは根本的に異なります。 LLMの平均セッションは、従来の検索セッションの4倍の長さで動作します。 消費者の40%以上が、複雑な購入決定をAI ツールで行っています。 [!DNL LLM Apps]がなければ、メンションに勝っても顧客を失う可能性があります。 [!DNL LLM Apps]は、ブランドが表示されるだけでなく、ユーザーが決定する準備ができた正確な瞬間に実用的であることを保証します。

## 主な概念 {#key-concepts}

### LLM アプリ

ユーザーが[!DNL ChatGPT]またはその他のLLM プラットフォーム内で操作するブランド アシスタント。 すべてのアクションをグループ化し、1つのユニットとしてデプロイします。

### アクション {#actions}

アプリが提供する機能（*ディストリビューターの検索*&#x200B;または&#x200B;*製品の参照*&#x200B;など）。 LLM プラットフォームは、リクエストが説明と一致するとアクションを呼び出します。 アクションメタデータは[!DNL LLM Apps]で管理されますが、そのハンドラーは[!DNL GitHub] リポジトリ内のコードです。

### アクションハンドラー

アクションが呼び出されたときに実行されるサーバーサイド関数。 入力を検証し、APIを呼び出し、テキストと構造化データを返すことができます。

### ウィジェット {#widgets-eds}

カード、カルーセル、テーブルなど、LLMの返信が表示される視覚的な応答。 生成されたウィジェットは、自分が所有する[!DNL Edge Delivery Services] （EDS） リポジトリ内のブロックです。

### MCP サーバー

デプロイメント後に公開されたエンドポイント。 サポートされているLLM プラットフォームがこのエンドポイントに接続し、アクションを検出して呼び出します。

## 仕組み

大まかに言うと、3つのことが起こります。つまり、[!DNL LLM Apps]さんにブランドを伝えることです
AI アシスタントがアクションに移せるように支援し
顧客はチャット内で回答を得ることができます。

```
┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
│     Your brand     │          │      LLM Apps      │          │    AI assistant    │
│                    │          │                    │          │                    │
│   What you offer   │   ───▶   │  Turns that into   │   ───▶   │ Answers with your  │
│  and how you help  │          │    something AI    │          │    brand, live     │
│  customers today   │          │     can act on     │          │  inside the chat   │
└────────────────────┘          └────────────────────┘          └────────────────────┘
```

技術的な詳細を確認する：どのような要素を構築し、どのように組み合わせるのかを確認します
[&#x200B; アプリの接続方法](/help/overview/app-architecture.md)を参照してください。

## 要件 {#requirements}

アプリを作成する前に、次のすべての要件を満たしてください。

### Adobe 開発者コンソール

Adobe IMS組織は[[!DNL App Builder]](https://developer.adobe.com/app-builder/docs/intro_and_overview/)へのアクセス権を持っている必要があります。 **開発者**&#x200B;または&#x200B;**システム管理者**&#x200B;の役割が必要です。

アクセスを確認するには、[Adobe Developer Console](https://developer.adobe.com/console)を開きます。 クイックスタート画面で、必要なアクセス権があることを確認します。

![Adobe Developer Console – 開発者へのアクセスを確認するクイックスタート画面](/help/assets/overview/dev-console-access-granted.png)

**制限付きアクセス**&#x200B;が表示された場合は、IMS組織管理者に連絡し、開発者の役割をリクエストしてください。

![Adobe Developer Console – 制限付きアクセス メッセージ &#x200B;](/help/assets/overview/dev-console-access-denied.png)

### [!DNL GitHub]

**can**&#x200B;が次の操作を行うには、[!DNL GitHub] アカウントが必要です。 これは権限の確認です。まだ何もインストールしないでください。

- アカウントまたは組織内で、アプリを所有する2つのリポジトリを作成します。
- [!DNL GitHub] アプリをセットアップ プロセスの後半でインストールするか、それらを承認できる組織管理者を設定します。

リポジトリ作成アクセス権を確認するには、[github.com/new](https://github.com/new)を開き、目的のアカウントまたは組織が&#x200B;**所有者**&#x200B;の下に表示されていることを確認します。

![GitHub — リポジトリ所有者を選択](/help/assets/overview/github-repo-owner-dropdown.png)

組織が所有するリポジトリの場合、組織管理者は[!DNL GitHub] アプリを承認する必要がある場合があります。

>[!NOTE]
>
>これは権限チェックで、設定ステップではありません。 まだ[!DNL GitHub] アプリをインストールしないでください – [最初のアプリを自動的に作成する](/help/guides/create-app.md)では、作成した正確なリポジトリを対象として、必要な時点で各アプリをインストールする手順を説明します。

### Web サイト

アプリがサポートする必要がある製品、サービス、タスクを表すパブリック HTTPS web サイトが必要です。 プラットフォームは、このウェブサイトを分析して行動を提案し、代表的なサンプルデータを作成します。

機密情報やアクセス制御情報を公開するweb サイトは使用しないでください。

### テスト用の[!DNL ChatGPT]または[!DNL Claude]

開始チュートリアルを完了するには、開発者モードが有効になっているサポートされている[!DNL ChatGPT] プランまたはカスタムコネクタが有効になっているサポートされている[!DNL Claude] プランを使用します。 Workspaceまたは組織の管理者は、アクセスを制限できます。 [ChatGPTでのテスト &#x200B;](/help/guides/test-in-chatgpt.md#plan-requirements)または[&#x200B; クロードでのテスト &#x200B;](/help/guides/test-in-claude.md#plan-requirements)を参照してください。

## ジャーニーの選択 {#choose-your-journey}

### &#x200B;1. 最初のアプリをビルドして起動する

[最初のアプリをビルドして起動します](/help/guides/create-app.md)。 このジャーニーは、2つの空のリポジトリから始まり、[!DNL ChatGPT]などのサポートされているLLM プラットフォームでプラグインとしてテストされた実稼動対応アプリで終了します。

### &#x200B;2. 生成されたアプリのカスタマイズ

プラットフォームがアプリを自動的に作成し、サンプル動作を置き換える場合は、このジャーニーを選択します。

1. [生成されたハンドラー](/help/guides/customize-handler.md)をカスタマイズして、APIを接続し、各アクションによって返されるデータを定義します。
2. [生成されたウィジェット &#x200B;](/help/guides/widgets.md)をカスタマイズして、そのデータを使用し、インタラクションとデザインを適用します。

### &#x200B;3. 新しいアクションを最初から追加

[新しいメタデータを定義し、ハンドラーを記述し、ウィジェットを接続し、テストし、アクションをデプロイするには、](/help/guides/create-action.md)から新しいアクションを追加します。

### &#x200B;4. 既存のEDS プロジェクトの接続

既にEDS サイトを持っているか、アプリを自動的に構築していない場合は、[既存のEDS プロジェクトを接続](/help/guides/bring-your-own-eds.md)します。

すべてのジャーニーでは、共有[&#x200B; デプロイメント &#x200B;](/help/guides/deploy-your-app.md) ステップを使用し、次に[ChatGPT プラグイン テスト &#x200B;](/help/guides/test-in-chatgpt.md)または[Claude コネクタテスト &#x200B;](/help/guides/test-in-claude.md)を使用します。

