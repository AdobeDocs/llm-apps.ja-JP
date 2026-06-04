---
title: ChatGPTでテスト
description: デプロイされたAdobe LLM アプリをChatGPTに追加し、実際の会話でテストする方法について説明します。
source-git-commit: 483a71f5f1de5caf1bd89b26f4d67d2d5a0aa15a
workflow-type: tm+mt
source-wordcount: '798'
ht-degree: 2%

---


# [!DNL ChatGPT]でテスト

>[!IMPORTANT]
>
>**免責事項：**&#x200B;これは[!DNL LLM Apps]のベータ版リリースです。 ここに示す機能、ワークフロー、UIは、必ずしもアプリケーションまたは製品の最終状態を表すものではありません。

>[!NOTE]
>
>このガイドでは、[!DNL ChatGPT]を例として使用します。 一般的な手順（MCP サーバーのURLの登録と会話でのテスト）は、他のLLM プラットフォームにも適用されますが、設定フローとUIは異なります。

デプロイメントが正常に完了すると、アプリは[!DNL Adobe I/O Runtime]で実行され、MCP サーバーのURLが公開されます。 このガイドでは、[!DNL ChatGPT]に追加して、実際の会話でテストする方法について説明します。

## プランの要件

カスタム開発者アプリの[!DNL ChatGPT]への追加は、OpenAIのサブスクリプション層によって管理されます。これは[!DNL LLM Apps]の制限ではなく、OpenAIが現在カスタム MCP アプリへのアクセスを管理する方法です。

| [!DNL ChatGPT] プラン | カスタム MCP アプリ |
|--------------|-----------------|
| 無料 | 使用不可 |
| 移動 | 使用不可 |
| プラス | 使用不可 |
| Pro | 使用可 |
| ビジネス | 使用可 |
| エンタープライズ/教育機関 | 使用可 |

>[!NOTE]
>
>無料、Go、またはPlus プランを利用している場合、**はデプロイ済みアプリ**&#x200B;を[!DNL ChatGPT]に追加できません。 **Pro**&#x200B;にアップグレードするか、組織の管理者に&#x200B;**Business**&#x200B;または&#x200B;**Enterprise** ワークスペースで有効にするように依頼してください。

## 開発者モードを有効にする

カスタム MCP アプリを追加するには、[!DNL ChatGPT] アカウントで&#x200B;**開発者モード**を有効にする必要があります。 フォロー
検証して有効にするには、次の手順を実行します。

### 設定を開く

左下隅のプロファイルアバターをクリックし、**[!UICONTROL 設定]**&#x200B;をクリックします。

![ChatGPT – 設定メニュー](/help/assets/guide-test-chatgpt/chatgpt-settings-menu.png)

### アプリに移動

設定ダイアログで、左側のサイドバーで「**[!UICONTROL アプリ]**」を選択します。 下部の「**[!UICONTROL 詳細設定]**」をクリックします。

![ChatGPT — アプリ設定](/help/assets/guide-test-chatgpt/chatgpt-apps-settings.png)

### 開発者モードを有効にする

**[!UICONTROL 開発者モード]** トグルが（青）になっていることを確認します。 これにより、未検証のカスタム MCP サーバーURLを登録できます。

>[!NOTE]
>
>開発者モードは、OpenAIによるレビューを受けていないアプリを許可するため、*高リスク*&#x200B;とラベル付けされます。 [!DNL ChatGPT]は、開発者モード アプリを使用する会話のメモリを自動的に無効にします。

![ChatGPT – 開発者モードが有効](/help/assets/guide-test-chatgpt/chatgpt-developer-mode.png)

## アプリを[!DNL ChatGPT]に追加

### MCP サーバーのURLをコピー

[!DNL LLM Apps]の&#x200B;**アプリの詳細** ページに移動し、**[!UICONTROL アプリのテスト]** セクションを見つけます。 **ステージング**&#x200B;または&#x200B;**実稼動** URLをコピーします。次のようになります。

```
https://<namespace>.adobeioruntime.net/api/v1/web/llm-apps/mcp
```

### アプリページを開く

[!DNL ChatGPT]で、**[!UICONTROL 設定] → [!UICONTROL  アプリ]**&#x200B;に移動します。

![ChatGPT — アプリページ ](/help/assets/guide-test-chatgpt/chatgpt-apps-page.png)

### 新しいアプリを作成

詳細設定行の「**[!UICONTROL アプリを作成]**」をクリックします。

![ChatGPT — アプリの作成ダイアログ ](/help/assets/guide-test-chatgpt/chatgpt-create-app.png)

次の項目を入力します。

| フィールド | 値 |
|-------|-------|
| **アイコン** | オプション - 128 x 128 PNG （最大10 KB）をアップロード |
| **名前** | アプリの表示名（例：*My Brand App*） |
| **説明** | アプリの機能の簡単な説明 |
| **MCP サーバーURL** | [!DNL LLM Apps]のURLを貼り付けます |
| **[!UICONTROL 認証]** | *認証なし*&#x200B;を選択 |

「**I understand and want to continue**」チェックボックスをオンにします。これにより、MCP サーバーが
はOpenAIによるレビューを受けていません。**作成**&#x200B;をクリックしてください。

### アプリが有効になっていることを確認します

作成後、アプリは&#x200B;**[!UICONTROL 有効なアプリ]**&#x200B;の下に&#x200B;**[!UICONTROL DEV]** バッジで表示され、アクティブであることを確認します。

>[!NOTE]
>
>アプリは&#x200B;**下書き**&#x200B;にも表示されます。これらは、開発者モードで作成したプライベートアプリで、アカウントでのみ表示されます。

これで、アプリを[!DNL ChatGPT]の会話で使用する準備ができました。

![ChatGPT — アプリが有効](/help/assets/guide-test-chatgpt/chatgpt-app-enabled.png)

## 会話でテスト

アプリが有効になったら、[!DNL ChatGPT]で新しい会話を開始します。 質問する前に、2つの方法のいずれかを使用してアプリを添付します。

### オプション 1 - メニューから選択します

チャット入力の「**+**」ボタンをクリックし、**詳細**&#x200B;をクリックして、使用可能なツールの完全なリストを展開します。 リストからアプリを選択して、現在の会話に添付します。

![ChatGPT — メニューからアプリを選択](/help/assets/guide-test-chatgpt/chatgpt-select-app.png)

### オプション 2 - @mentionを使用する

チャット入力に「**@**」と入力し、ドロップダウンからアプリを選択します。 これにより、アプリがインラインに添付され、同じメッセージで引き続き質問を入力できます。

>[!NOTE]
>
>同じアプリで&#x200B;**@mention**&#x200B;をもう一度使用すると、そのアプリの選択が解除され、会話から削除されます。

![ChatGPT — アプリ@mention インストール ](/help/assets/guide-test-chatgpt/chatgpt-mention-app.png)

選択すると、アプリがインラインで添付され、同じメッセージで質問を入力できます。

![ChatGPT — @mention](/help/assets/guide-test-chatgpt/chatgpt-mention.png)経由で添付されたアプリ

### 結果を見る

アプリが添付されたら、設定したアクションのいずれかに沿った質問を入力します。例：*「製品を表示する」* [!DNL ChatGPT]は関連するアクションと一致し、入力パラメーターを抽出し、[!DNL Adobe I/O Runtime]でハンドラーを呼び出し、結果をレンダリングします。

![ChatGPT — アクション結果](/help/assets/guide-test-chatgpt/chatgpt-response.png)

応答には、次が含まれます。

- **EDS ウィジェット** – 画像、評価、アクションボタンを含むリッチ UI コンポーネント。
- **テキスト応答** — ウィジェットの下、[!DNL ChatGPT]はハンドラーから返された`content`を使用します
結果の自然言語サマリーを作成します。
- **ステータスインジケーター** — アクションの作成ダイアログで設定した&#x200B;*呼び出されたステータステキスト*。

## 次の手順

- **さらにアクションを追加** — UIで追加のアクションを定義し、そのハンドラーを記述して、再デプロイします。
- **実稼動環境にデプロイ** — ステージでテストした場合は、ライブエクスペリエンスの実稼動環境にデプロイします。
- **チームと共有** — アプリの詳細ページの&#x200B;**URLをコピー**&#x200B;して、MCP サーバーのURLをチームメイトと共有します。

