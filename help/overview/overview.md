---
title: Adobe LLM アプリの概要
description: Adobe LLM アプリの概要、仕組み、導入に必要な機能をご紹介します。
source-git-commit: 1a99e2e80e50a3bcf9ce6fb910365202bf06e113
workflow-type: tm+mt
source-wordcount: '873'
ht-degree: 1%

---


# Adobe LLM Apps – 概要 {#adobe-llm-apps-an-overview}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

## [!DNL Adobe LLM Apps]とは

[!DNL Adobe LLM Apps]では、商品の発見、可用性チェック、サービスの予約などの主要なアクションを、[!DNL ChatGPT]やClaudeなどのAI アシスタント内で直接公開することができます。 AIの回答で受動的に言及するのではなく、顧客が会話から離れることなく、実際のビジネスフローを導くことができます。

[!DNL LLM Apps]は[experience.adobe.com/llm-apps](https://experience.adobe.com/llm-apps)で利用できます。

## [!DNL LLM Apps]でできること

- **ブランド所有のLLM アクションを作成** — AI アシスタント内でアクティブ化する特定のビジネスフローを定義します（例：*テストドライブのスケジュール*、*製品の比較*、*サービスを予約*）。
- **インタラクティブ LLM ウィジェットを作成** — [!DNL GitHub] リポジトリでAEM コンポーネントとして管理されるビジュアル UI コンポーネント（製品カード、予約フォーム、ストアロケータ）を作成します。
- **一元的なブランドガバナンスの維持** – 作成者と開発者は、LLM プラットフォーム内で公開されるあらゆるコンテンツ、コピー、ビジュアルを完全に制御でき、承認はAEMで管理されます。
- **ステージングおよび実稼動環境へのデプロイ** – 管理されたデプロイメントパイプラインを使用すると、実稼動環境にプロモートする前に、ステージング環境でエクスペリエンスをテストできます。
- **アクションレベルでの可視性を制御** — デプロイメント後、アプリ全体を再デプロイすることなく、個々のアクションのオンとオフを切り替えることができます。
- **意思決定を促進する要因を測定** – 組み込みの分析機能（Adobe Customer Journey Analyticsを搭載）により、アクションのトリガー数、成功率、放棄率、上位のユーザープロンプト、可視性スコアが表示されます。

## [!DNL LLM Apps]が重要な理由

LLMのインタラクションは、従来の検索とは根本的に異なります。 平均[!DNL ChatGPT] セッションは、従来の検索セッションよりも4倍長く続きます。 消費者の40%以上が、複雑な購入決定をAI ツールで行っています。 [!DNL LLM Apps]がなければ、メンションに勝っても顧客を失う可能性があります。 [!DNL LLM Apps]は、ブランドが表示されるだけでなく、ユーザーが決定する準備ができた正確な瞬間に実用的であることを保証します。

## 主な概念

**LLM アプリ** — ユーザーが[!DNL ChatGPT]またはその他のLLM プラットフォーム内で操作するブランド アシスタント。 すべてのアクションをグループ化し、1つのユニットとしてデプロイします。

**アクション** — アプリが提供する機能。 例えば、「ディストリビューターを探す」や「製品を参照する」などです。 ユーザーが関連する質問をすると、各アクションがLLMによって呼び出されます。 すべてのアクションには、メタデータ（名前、説明、パラメーター）が[!DNL LLM Apps] UIで管理され、ハンドラー（コード）が[!DNL GitHub]で管理される2つの部分があります。

**アクションハンドラー** — アクションが呼び出されたときに実行されるコード。 APIを呼び出したり、ライブデータを取得したり、静的データを返したりできます。 ハンドラーは`actions/<name>/index.js`にある[!DNL GitHub] リポジトリにあります。

**Widget** — ユーザーに表示される視覚的な応答 – カード、カルーセル、テーブル、またはLLMのテキスト返信と共にレンダリングされるカスタム UI。 ウィジェットは、[!DNL Edge Delivery Services] （EDS）サイトでホストされているHTML ページです。

## 仕組み

次の図は、UIでのアプリの定義から、LLM プラットフォームでの結果の確認まで、各要素の組み合わせを示しています。

```
┌─────────────────────────────────────────────────────────────┐
│                      LLM Apps UI                            │
│  ┌──────────┐   ┌──────────┐   ┌───────────────────────┐    │
│  │   App    │──▶│ Actions  │──▶│ Metadata + Widget cfg │    │
│  └──────────┘   └──────────┘   └───────────┬───────────┘    │
└─────────────────────────────────────────── │ ────────────-──┘
                                             │ deploy
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Adobe I/O Runtime                          │
│               MCP Server (auto-generated)                   │
│  ┌───────────────┐ ┌──────────────────┐ ┌───────────────┐   │
│  │ search-       │ │ get-product-     │ │ find-where-   │   │
│  │ products      │ │ details          │ │ to-buy        │   │
│  └───────────────┘ └──────────────────┘ └───────────────┘   │
└──────────────────────────────┬──────────────────────────────┘
                               │ MCP protocol
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        ChatGPT                              │
│  Conversation                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  EDS Widget                                           │  │
│  │  Product carousel, store locator, detail card ...     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 前提条件

### Adobe 開発者コンソール

[Adobe Developer Console](https://developer.adobe.com/console)にアクセスするには、Adobe IMS組織の&#x200B;**Developer** ロール（または&#x200B;**System Admin** ロール）が必要です。 組織が[[!DNL App Builder]](https://developer.adobe.com/app-builder/docs/intro_and_overview/)へのアクセス権を持っていることを確認します。

確認するには、[developer.adobe.com/console](https://developer.adobe.com/console)に移動します。 クイックスタート画面が表示された場合は、権限が正しく設定されています。

![Adobe Developer Console – 開発者へのアクセスを確認するクイックスタート画面](/help/assets/overview/dev-console-access-granted.png)

代わりに&#x200B;**制限付きアクセス** メッセージが表示される場合は、開発者の役割がありません。 アクセスをリクエストするには、IMS組織の管理者にお問い合わせください。

![Adobe Developer Console – 制限付きアクセス メッセージ ](/help/assets/overview/dev-console-access-denied.png)

### [!DNL GitHub]

組織に次の権限を持つ[!DNL GitHub] アカウントが必要です。

- **リポジトリを作成** – 組織内に2つのリポジトリ（アプリケーションコード用とEDS プロジェクト用）を作成する必要があります。 確認するには、[github.com/new](https://github.com/new)に移動します。**所有者** ドロップダウンから組織を選択できる場合は、権限があります。

  組織の選択を表示する![GitHub新しいリポジトリ所有者ドロップダウン ](/help/assets/overview/github-repo-owner-dropdown.png)

- **アプリ [!DNL GitHub]をインストール** – 組織に[!DNL GitHub] アプリをインストールするには、適切な権限が必要です。 GitHub アプリをインストールするための[要件](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party#requirements-to-install-a-github-app)を参照してください。

### AEM Sitesと[!DNL Edge Delivery Services]

アクションウィジェットは&#x200B;**Adobe Experience Manager [!DNL Edge Delivery Services] （EDS）**&#x200B;でホストされます。 [!DNL Edge Delivery Services]を含むAEM Sites ライセンスが必要です。 EDS組織に&#x200B;**管理者**&#x200B;の役割が必要です。

確認するには、[EDS ユーザー管理ツール ](https://tools.aem.live/tools/user-admin/index.html)に移動し、組織名を入力し、**サイト**&#x200B;を空白のままにして、**ユーザーを取得**&#x200B;をクリックします。 リストでアカウントを検索し、**管理者** バッジが表示されていることを確認します。

![管理者の役割を持つユーザーを表示するEDS ユーザー管理ツール ](/help/assets/overview/eds-user-admin.png)

### LLM プラットフォーム（テスト用）

デプロイ済みアプリをテストするには、カスタム MCP アプリと&#x200B;**開発者モード**&#x200B;を有効にできる、サポートされているサブスクリプション層が必要です。 例えば、[!DNL ChatGPT]では、**Pro**、**Business**&#x200B;または&#x200B;**Enterprise / Edu**&#x200B;のサブスクリプションが必要です。

## 今すぐ始める

次の手順で、状況に合ったパスを選択します。

| | **Beta参加者** | **一般公開** |
|---|---|---|
| **あなたは**&#x200B;を持っています | Beta プログラムに参加し、Adobeからアプリケーションコードアーカイブ、EDS プロジェクトアーカイブ、およびアプリケーション設定リファレンスを受け取っています | ユースケースを念頭に置いたAdobeは、アプリの構築とデプロイを支援します |
| **ここから開始** | [Beta オンボーディング ](/help/beta-onboarding/beta-onboarding.md) | [ アプリを作成](/help/guides/create-app.md) |

