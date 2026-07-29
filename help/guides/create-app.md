---
title: 最初のLLM アプリを自動的に作成
description: web サイトからAdobe LLM アプリを作成し、生成されたアクションを確認してデプロイし、ChatGPTなどのサポートされているLLM プラットフォームでテストします。
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '1217'
ht-degree: 0%

---


# 最初のアプリを自動的に作成 {#create-first-app}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

このプラットフォームにより、web サイトがアプリの有効な基盤になります。 アクションの提案、ハンドラーのコードとテストの作成、EDS ウィジェットの作成、生成されたファイルの所有している2つの[!DNL GitHub] リポジトリへの送信を行います。

生成には約15分かかります。 このチュートリアルの最後に、サポートされている[!DNL ChatGPT]などのLLM プラットフォームでテストできるデプロイ済みアプリがあります。

**ジャーニー:**&#x200B;要件→確認して2つのリポジトリを作成し、生成されたアクション→レビューしてステージング→デプロイ→、実稼動システムを接続す→プラグインをテスト→ます。

## 開始する前に

このチュートリアルを開始する前に、すべての[LLM アプリの要件](/help/overview/overview.md#requirements)を完了してください。

このチュートリアルでは、[Frescopa Coffee](https://frescopa.coffee/)用のLLM アプリを作成します。

## 空のリポジトリを2つ作成します

プラットフォームには2つの空のリポジトリが必要です。 同じ[!DNL GitHub] アカウントまたは組織の両方を作成します。

- **ハンドラーリポジトリ** — アクションハンドラーとテストを格納します。 （例：`my-brand-llm-app`）。
- **EDS リポジトリ** – 生成されたウィジェットのブロックとスタイルを保存します。 （例：`my-brand-llm-app-eds`）。

各リポジトリの[github.com/new](https://github.com/new)に移動します。

README、`.gitignore`、またはライセンスを使用してリポジトリを初期化しないでください。 必要なプロジェクト構造を準備します。

>[!TIP]
>
>アプリと各リポジトリの目的を識別するリポジトリ名を使用します。 これにより、アプリ作成ダイアログでの認識が容易になります。

## アプリを起動

1. [Adobe LLM アプリ &#x200B;](https://experience.adobe.com/#/@llmapps/llm-apps/)を開き、**[!UICONTROL アプリの作成]**&#x200B;を選択します。
2. **[!UICONTROL LLM アプリ名]**&#x200B;とオプションの説明を入力します。
3. **[!UICONTROL Analytics領域]**&#x200B;を選択します。

   >[!IMPORTANT]
   >
   >アプリの作成後に分析領域を変更することはできません。

4. **[!UICONTROL アプリをビルド]**&#x200B;で、**[!UICONTROL アプリを自動的にビルド]**&#x200B;を選択します。
5. **[!UICONTROL お使いのweb サイト]**&#x200B;で、`https://` プロトコルを含むweb サイト URLを入力します。 プラットフォームはこのサイトを分析して、有用なアクションと代表的なサンプル結果を決定します。

![LLM アプリを作成 – アプリの詳細とアプリのビルドが有効になりました](/help/assets/guide-onboarding-agent/app-details-onboarding.png)

## [!DNL LLM Apps]にリポジトリへのアクセス権を付与

Adobe LLM アプリ [!DNL GitHub] アプリは、[!DNL LLM Apps]に選択したリポジトリへのアクセス権を与えます。

>[!NOTE]
>
>[!DNL GitHub]組織への接続は1回限りの設定です。 組織が既にダイアログに表示されている場合は、再接続する代わりに&#x200B;**[!UICONTROL Manage repos on GitHub]**&#x200B;を使用します。

### 連続性のある組織

リポジトリを作成する前に、Adobe LLM アプリ [!DNL GitHub] アプリが既にインストールされている場合：

1. 接続されている組織を選択します。
2. 「**[!UICONTROL GitHub]**&#x200B;でリポジトリを管理」を選択します。
3. 2つのリポジトリを既存の[!DNL GitHub] アプリのインストールに追加します。
4. [!DNL LLM Apps]に戻り、リポジトリリストを更新します。

### 初回接続のみ

ダイアログに組織が表示されない場合：

1. 「**[!UICONTROL GitHub組織を接続]**」を選択します。
2. Adobe LLM アプリ [!DNL GitHub] アプリをインストールします。
3. **[!UICONTROL Only select repositories]**&#x200B;を選択し、2つのリポジトリを選択します。
4. LLM アプリを作成ダイアログに戻ります。

[!DNL GitHub] アプリをインストールまたは更新できない場合は、組織管理者に問い合わせてください。

## リポジトリの選択

1. **[!UICONTROL Boilerplate Repository]**&#x200B;で、組織と空のハンドラーリポジトリを選択します。
2. **[!UICONTROL EDS リポジトリ]**&#x200B;で、組織と空のEDS リポジトリを選択します。

   ![&#x200B; マイアプリのビルド — GitHub組織、Boilerplate リポジトリ、およびEDS リポジトリを選択](/help/assets/guide-onboarding-agent/repos-selected.png)

3. 「**[!UICONTROL 利用条件]**」で、「**[!UICONTROL Adobe Developer利用条件に同意します]**」を確認します。
4. 「**[!UICONTROL アプリを作成]**」を選択します。

## EDSの設定を完了します

選択したEDS リポジトリが空の場合、[!DNL LLM Apps]はAEM ボイラープレートを使用して初期化します。 次に、このダイアログは、アプリの再作成を試みる前に、AEM Code Syncのインストールを求めます。

1. EDS リポジトリの下のメッセージで、**[!UICONTROL AEM Code Syncのインストール]**&#x200B;を選択します。
2. [!DNL GitHub]にAEM Code Syncをインストールし、EDS リポジトリへのアクセス権を付与します。
3. LLM アプリを作成ダイアログに戻ります。

![Create LLM App – 空のEDS リポジトリが初期化され、AEM Code Syncが必要](/help/assets/guide-onboarding-agent/install-aem-code-sync.png)

EDS サイトの管理者でなければなりません。 ダイアログで、自分が管理者ではないことが報告された場合：

![LLM アプリの作成 – EDS管理者アクセスが必要](/help/assets/guide-onboarding-agent/eds-admin-required.png)

1. 「**[!UICONTROL AEM Live Admin]**&#x200B;を開く」を選択します。
2. **[!UICONTROL + ユーザーを追加]** ボタンをクリックして、自分をEDS サイトの管理者として追加します。

   ![LLM アプリを作成 – EDS管理者として追加](/help/assets/guide-onboarding-agent/add-eds-admin.png)

3. [!DNL LLM Apps]に戻り、EDS リポジトリを更新して、**[!UICONTROL アプリの作成]**&#x200B;をもう一度選択します。

リポジトリと管理者が合格すると、[!DNL LLM Apps]はアプリを作成し、アクションの生成を開始します。

## アクションの生成を待つ

左から&#x200B;**[!UICONTROL アクション]** ページに移動します。 アクションページには、**担当者がweb サイトを分析してアプリを生成する際に、会話エクスペリエンスのアクションを検出する**&#x200B;と表示されます。 通常、生成には約15分かかります。 このページを離れて、後で戻ることができます。

![&#x200B; アクション – レコメンデーションの生成](/help/assets/guide-onboarding-agent/actions-generating.png)

生成中、[!DNL LLM Apps]:

1. web サイトを分析し、顧客の有用な意図を特定：
2. 説明や入力パラメーターを含むアクションメタデータを作成します。
3. ハンドラーを生成し、ハンドラーリポジトリ内の各アクションをテストします。
4. EDS リポジトリ内の各アクションに対してEDS ウィジェットを生成します。
5. レビュー用のアクションを準備します。

生成されたハンドラーは、最初にweb サイトから派生したサンプルデータを使用します。 包括的なエクスペリエンスを実証しますが、制作システムには接続されません。

## 生成されたアクションの確認

生成が完了すると、アクション ページには、生成されたアクションとウィジェットのプレビューが表示されます。 各アクションには&#x200B;**[!UICONTROL AIが生成したアクションがあり、レビュー]** バッジが必要です。

![&#x200B; アクション – レビュー用に生成されたアクション &#x200B;](/help/assets/guide-onboarding-agent/actions-ready-for-review.png)

各アクションについて：

1. 「**[!UICONTROL レビュー]**」を選択します。
2. 名前、説明、パラメーター、注釈、生成されたハンドラー、ウィジェットを確認します。
3. 「**[!UICONTROL レビュー済みとしてマーク]**」を選択します。 これにより、生成されたプルリクエストがマージされます。
4. 「アクション」ページに戻り、残りのアクションについても繰り返します。

![生成されたアクション – レビュー済みとしてマークする準備ができました](/help/assets/guide-onboarding-agent/generated-action-review.png)

すべてのアクションを確認したら、**[!UICONTROL アプリページに移動]**&#x200B;を選択します。

![&#x200B; アクション – 生成されたすべてのアクションがレビューされました](/help/assets/guide-onboarding-agent/actions-reviewed.png)

>[!NOTE]
>
>生成コードは、ユーザーが所有する出発点です。 レビュー後に、アクションメタデータ、ハンドラー、テスト、ウィジェットJavaScript、ウィジェットのスタイルを変更できます。

## アプリのデプロイ

1. アプリの詳細ページに戻ります。
2. 「**[!UICONTROL デプロイ]**」を選択します。
3. ターゲット環境として&#x200B;**[!UICONTROL ステージ]**&#x200B;を選択します。
4. 「**[!UICONTROL デプロイ]**」を選択します。

![&#x200B; デプロイ – ステージ環境を選択](/help/assets/guide-onboarding-agent/deploy-stage.png)

[!DNL LLM Apps]がアプリを準備、ビルド、公開するのを待ちます。

![&#x200B; デプロイ – 実行中のデプロイメントパイプライン &#x200B;](/help/assets/guide-onboarding-agent/deploy-running.png)

![&#x200B; デプロイ – ステージングのデプロイメントが成功しました](/help/assets/guide-onboarding-agent/deploy-successful.png)

デプロイメント後、**[!UICONTROL アプリのテスト]** セクションにステージング MCP サーバーのURLが表示されます。 「**[!UICONTROL URLをコピー]**」を選択します。

![&#x200B; アプリの詳細 – ステージング MCP サーバーのURLをコピー](/help/assets/guide-onboarding-agent/app-mcp-url.png)

## [!DNL ChatGPT]でテスト

[ChatGPT](/help/guides/test-in-chatgpt.md)でテストを実行して、ステージング MCP サーバーのURLを使用してプラグインを作成します。

生成されたアクションのいずれかに一致する質問をしてください。 次のことを確認します。

- [!DNL ChatGPT]は、期待されるアクションを選択します。
- ウィジェットはレンダリングされ、想定されるサンプルデータが含まれます。
- ウィジェットのコントロールは、予想されるフォローアップ動作を生成します。
- テキスト応答は、結果を正確に要約します。

![ChatGPT — LLM アプリのプラグイン応答を生成](/help/assets/guide-onboarding-agent/chatgpt-generated-app.png)

これで、エンドツーエンドの有効な基礎モードができました。

## アプリを本番環境で利用できるようにします

生成されたアプリは、サンプルデータを使用します。 お客様で使用する前に：

1. **システムを接続** — [生成された各ハンドラー](/help/guides/customize-handler.md)をカスタマイズして、サンプルデータをAPIまたはデータソースへの呼び出しに置き換えます。
2. **資格情報を保護** — API URLと資格情報を管理されたランタイム設定に保存します。ソースコードやウィジェット JavaScriptには保存されません。
3. **データの検証** — アクションの引数とAPI応答を検証し、リクエストのタイムアウトを追加し、安全なエラーメッセージを返します。
4. **ウィジェットを更新** – 各ウィジェットをハンドラーの`structuredContent`に合わせてから、ブランディングとアクセシビリティの要件を適用します。 [生成されたウィジェットのカスタマイズ &#x200B;](/help/guides/widgets.md)を参照してください。
5. **ハンドラーをテスト** – 有効な入力、無効な入力、空の結果、API エラー、およびウィジェットで想定されるデータ形状をカバーします。
6. **ステージ**&#x200B;で検証 – [!DNL ChatGPT] プラグインを使用して、すべてのアクションを再デプロイしてテストします。
7. **実稼動環境へのデプロイ** — ステージテストが成功した後、実稼動環境にデプロイし、実稼動環境のMCP サーバーURLを使用してプラグインを作成または更新します。

プラットフォームが作成しなかった機能を追加するには、[最初からアクションを作成する](/help/guides/create-action.md)を参照してください。

