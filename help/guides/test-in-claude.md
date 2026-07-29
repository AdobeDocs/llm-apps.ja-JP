---
title: Claude コネクタとしてのLLM アプリのテスト
description: Adobe LLM Apps MCP サーバーのURLからClaude コネクタを作成し、会話でテストします。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '399'
ht-degree: 1%

---


# LLM アプリを[!DNL Claude] コネクタとしてテストします {#test-in-claude}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

デプロイメント後、LLM アプリはMCP サーバーのURLを公開します。 このURLを[!DNL Claude]にカスタムコネクタとして追加し、生成されたアクションとウィジェットをテストします。

これは、アプリの構築、カスタマイズ、拡張の後の最後の検証ステップです。

## プランの要件

リモート MCPを使用するカスタム コネクタは、[!DNL Claude]、[!DNL Claude] デスクトップ、およびCoworkのFree、Pro、Max、Team、およびEnterprise プランで利用できます。 無料プランのアカウントは、1つのカスタムコネクタに制限されています。 グループ版およびエンタープライズ版の組織の場合、他のメンバーがコネクタを使用する前に、オーナーまたはプライマリオーナーがコネクタを有効にする必要があります。

## MCP サーバーのURLをコピー

[!DNL LLM Apps] に移動します。

1. アプリの詳細ページを開きます。
2. **[!UICONTROL アプリのテスト]**&#x200B;を検索します。
3. **[!UICONTROL ステージング環境]**&#x200B;で、**[!UICONTROL URLをコピー]**&#x200B;を選択します。

## カスタムコネクタの追加

1. [claude.ai/new?modal=add-custom-connector](https://claude.ai/new?modal=add-custom-connector#settings/customize-connectors)を開きます。 これにより、**[!UICONTROL カスタムコネクタを追加]** ダイアログが直接開きます。
2. 次を入力 :
   - **[!UICONTROL Name]** — コネクタ名。
   - **[!UICONTROL リモート MCP サーバーのURL]** — コピーしたMCP サーバーのURL。
3. 「**[!UICONTROL 追加]**」を選択します。

   ![&#x200B; クラウド – カスタムコネクタダイアログを追加](/help/assets/guide-test-claude/claude-add-custom-connector.png)

>[!NOTE]
>
>信頼できる開発者からのコネクタのみを使用してください。 Anthropicは、開発者が利用できるツールを制御せず、それらが意図したとおりに動作するか、変更されないかを確認できません。

## 生成されたツールを許可する

生成された各アクションは、コネクタページの&#x200B;**[!UICONTROL ツール権限]**&#x200B;の下にリストされます。 デフォルトでは、新しいツールは&#x200B;**[!UICONTROL Needs approval]**&#x200B;に設定されており、テスト中のすべての呼び出しを承認するよう求められます。

各ツール（または&#x200B;**[!UICONTROL インタラクティブツール]** グループ全体）を&#x200B;**[!UICONTROL 常に許可]**&#x200B;に設定し、承認プロンプトによってテストが中断されないようにします。

![Claude — ツールの権限を常に許可に設定](/help/assets/guide-test-claude/claude-tool-permissions.png)

## コネクタのテスト

1. 新しいチャットを開始します。
2. メッセージボックスで&#x200B;**+**&#x200B;を選択し（または`/`と入力）、**[!UICONTROL コネクタ]**&#x200B;にカーソルを合わせ、この会話に追加したコネクタをオンにします。

   ![Claude – 会話のコネクタを有効にする](/help/assets/guide-test-claude/claude-enable-connector-chat.png)

3. 生成されたアクションのいずれかに一致する質問をしてください。 例：*コーヒーを見せてください。*

次のことを確認します。

- [!DNL Claude]が期待されるアクションを呼び出します。
- ウィジェットには、想定されるサンプルデータが表示されます。
- テキスト応答はウィジェットと一致します。
- ウィジェットのコントロールが期待どおりに動作します。

## 次の手順

- [生成されたウィジェットをカスタマイズ &#x200B;](/help/guides/widgets.md)。
- [最初からアクションを作成](/help/guides/create-action.md)。
