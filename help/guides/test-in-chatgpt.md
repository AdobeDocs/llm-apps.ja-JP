---
title: ChatGPT プラグインとしてLLM アプリをテストする
description: Adobe LLM Apps MCP サーバーのURLからChatGPT プラグインを作成し、会話でテストします。
source-git-commit: b7199fbb387d91a5c77deac47a2bc883381931c1
workflow-type: tm+mt
source-wordcount: '335'
ht-degree: 1%

---


# LLM アプリを[!DNL ChatGPT] プラグインとしてテストする {#test-in-chatgpt}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

デプロイメント後、LLM アプリはMCP サーバーのURLを公開します。 このURLを[!DNL ChatGPT]にプラグインとして追加し、生成されたアクションとウィジェットをテストします。

これは、アプリの構築、カスタマイズ、拡張の後の最後の検証ステップです。

## プランの要件

開発者モードは、Pro、Plus、Business、Enterprise、Education アカウントのwebで利用できます。 Workspaceの管理者は、アクセスを制限できます。

## 開発者モードを有効にする

[!DNL ChatGPT] に移動します。

1. **[!UICONTROL 設定] → [!UICONTROL  セキュリティとログイン]**&#x200B;を開きます。
2. **[!UICONTROL 開発者モード]**&#x200B;を有効にします。

プラグインページのプラスボタンは、開発者モードが有効になった後にのみMCP-backed プラグインを作成します。 [ChatGPT開発者モード ](https://developers.openai.com/api/docs/guides/developer-mode)を参照してください。

## MCP サーバーのURLをコピー

[!DNL LLM Apps] に移動します。

1. アプリの詳細ページを開きます。
2. **[!UICONTROL アプリのテスト]**&#x200B;を検索します。
3. **[!UICONTROL ステージング環境]**&#x200B;で、**[!UICONTROL URLをコピー]**&#x200B;を選択します。

## プラグインの作成

1. [chatgpt.com/plugins](https://chatgpt.com/plugins)を開きます。
2. 「**[!UICONTROL プラグイン]**」タブで、検索フィールドの横にある「**+**」を選択します。

   ![ChatGPT — プラグインページ ](/help/assets/guide-onboarding-agent/chatgpt-plugins-page.png)

3. **[!UICONTROL 新しいプラグイン]**&#x200B;で、次のように入力します。
   - **[!UICONTROL Name]** — プラグイン名。
   - **[!UICONTROL 説明]** — オプション。
   - **[!UICONTROL 接続]** — **[!UICONTROL サーバーURL]**&#x200B;を選択し、MCP サーバーURLを貼り付けます。
   - **[!UICONTROL 認証]** — **[!UICONTROL 認証なし]**&#x200B;を選択します。
4. 「**[!UICONTROL I understand and want to continue]**」を選択します。
5. 「**[!UICONTROL 作成]**」を選択します。

   ![ChatGPT — MCP サーバーのURL](/help/assets/guide-onboarding-agent/chatgpt-new-plugin.png)を使用したプラグインの作成

6. 確認ダイアログで、**[!UICONTROL Connect]**&#x200B;を選択します。

   ![ChatGPT – 新しいプラグインを接続](/help/assets/guide-onboarding-agent/chatgpt-plugin-connect.png)

## プラグインをテストする

1. 新しいチャットを開始します。
2. プラスメニューから、**[!UICONTROL 開発者モード]**&#x200B;を選択し、プラグインを選択します。
3. 生成されたアクションのいずれかに一致する質問をしてください。 例：*コーヒーを見せてください。*

![ChatGPT — LLM アプリのプラグイン応答を生成](/help/assets/guide-onboarding-agent/chatgpt-generated-app.png)

次のことを確認します。

- [!DNL ChatGPT]が期待されるアクションを呼び出します。
- ウィジェットには、想定されるサンプルデータが表示されます。
- テキスト応答はウィジェットと一致します。
- ウィジェットのコントロールが期待どおりに動作します。

## 次の手順

- [生成されたウィジェットをカスタマイズ ](/help/guides/widgets.md)。
- [最初からアクションを作成](/help/guides/create-action.md)。
