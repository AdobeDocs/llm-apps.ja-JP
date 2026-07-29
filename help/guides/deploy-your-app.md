---
title: アプリをデプロイ
description: LLM アプリ UIを使用して、Adobe LLM アプリをステージングおよび実稼動環境にデプロイする方法について説明します。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '322'
ht-degree: 0%

---


# アプリをデプロイ {#deploy-your-app}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

ハンドラーコードを記述し、リンクされたリポジトリにプッシュしたら、[!DNL LLM Apps] UIからアプリをデプロイできます。

あらゆるジャーニーで共有されるステップです。 デプロイメント後、引き続き[ChatGPT プラグインのテスト &#x200B;](/help/guides/test-in-chatgpt.md)または[Claude コネクタのテスト &#x200B;](/help/guides/test-in-claude.md)を行います。

## デプロイメントを開始

アプリの詳細ページを開き、**[!UICONTROL デプロイ]**&#x200B;を選択します。

ターゲット環境を選択し、**[!UICONTROL デプロイ]**&#x200B;を選択します。

![&#x200B; デプロイ – ターゲット環境を選択](/help/assets/guide-onboarding-agent/deploy-stage.png)

デプロイメントは、次の4つの手順で実行されます。

1. **準備中** — アプリのデプロイに必要な設定を取得します。
2. **展開を開始** – バックグラウンド展開プロセスを開始します。
3. **アプリをビルド** – 依存関係をインストールし、最新のリポジトリコードをビルドします。
4. **公開** — アプリを[!DNL Adobe I/O Runtime]に公開します。

![&#x200B; デプロイ – 実行中のデプロイメントパイプライン &#x200B;](/help/assets/guide-onboarding-agent/deploy-running.png)

>[!NOTE]
>
>アクションのメタデータがUIに含まれていても、リポジトリ内に一致するハンドラーファイルがない場合、そのアクションは引き続き登録されます。 呼び出しは、実際のコードを追加するまで、デフォルトのスタブハンドラーを使用します。

## デプロイメントが成功した後

すべての手順が完了すると、ダイアログに「**デプロイが成功しました**」と表示されます。

![&#x200B; デプロイ – 正常にデプロイされました](/help/assets/guide-onboarding-agent/deploy-successful.png)

ダイアログを閉じるには、**閉じる**&#x200B;をクリックします。 アプリの詳細ページの「**[!UICONTROL アプリをテストする]**」セクションまで下にスクロールします。

![&#x200B; アプリの詳細 – MCP サーバーのURLをコピー](/help/assets/guide-onboarding-agent/app-mcp-url.png)

デプロイされた各環境には、MCP サーバーのURLが表示されます。 「**[!UICONTROL URLをコピー]**」を選択し、それを使用してターゲット LLM プラットフォームにプラグインを作成します。

**デプロイメント履歴** セクションには、最新10件のデプロイメントが表示されます。

![&#x200B; デプロイメント履歴](/help/assets/guide-deploy/deployment-history.png)

各行には、ターゲット **環境** （ステージまたは実稼動）、**ステータス** （成功または失敗）、**デプロイ日**&#x200B;が表示されます。 このテーブルを使用して、デプロイメントが発生したタイミングを追跡し、デプロイメントが発生したことを
最新の展開が成功しました。

## 次の手順

- [&#x200B; デプロイされたアプリをChatGPT プラグインとしてテストします](/help/guides/test-in-chatgpt.md)。
- [&#x200B; デプロイされたアプリをClaude コネクタとしてテストします](/help/guides/test-in-claude.md)。

