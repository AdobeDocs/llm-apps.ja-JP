---
title: Adobe LLM アプリのBeta オンボーディング
description: Beta プログラム参加者としてAdobe LLM Appsを開始します。
source-git-commit: 98d5590c927bf8ffad54061ee027664452c129c1
workflow-type: tm+mt
source-wordcount: '1551'
ht-degree: 0%

---


# Beta オンボーディング {#beta-onboarding}

>[!IMPORTANT]
>
>**免責事項：**&#x200B;これは[!DNL LLM Apps]のベータ版リリースです。 ここに示す機能、ワークフロー、UIは、必ずしもアプリケーションまたは製品の最終状態を表すものではありません。

>[!NOTE]
>
>開始する前に、すべての[前提条件](/help/beta-onboarding/prerequisites.md)が満たされていることを確認してください。

Beta プログラム参加者は、2つのzip アーカイブとアプリ設定リファレンスを含むメールを受け取ります。 アプリを公開するには、以下の手順に従ってください。

## 開始する前に

本ガイドで解説する手順に入る前に、この記事で使用する主要な概念を理解してください。 時間を節約し、あらゆる施策をスムーズに進めることができます。

**LLM アプリ** — ユーザーが[!DNL ChatGPT]またはその他のLLM プラットフォーム内で操作するブランド アシスタント。

**アクション** — アプリが提供する機能。 例えば、「ディストリビューターを探す」や「製品を参照する」などです。 ユーザーが関連する質問をすると、各アクションがLLMによって呼び出されます。

**アクションハンドラー** — アクションが呼び出されたときに実行されるコード。 APIを呼び出したり、ライブデータを取得したり、静的データを返したりできます。 Adobeが提供するサンプルハンドラーは、ハードコードされたデータを返すため、実際のバックエンドを接続する前に、エンドツーエンドで設定を検証できます。

**Widget** — ユーザーに表示される視覚的な応答 – カード、カルーセル、テーブル、またはLLMのテキスト返信と共にレンダリングされるカスタム UI。

**アプリ設定リファレンス** — Adobeが提供するファイルは、アプリの設定時に各アクションに何を入力するかを正確に示します。


## 手順1：提供されたアーカイブを[!DNL GitHub]にプッシュする

Adobeは、2つのzip アーカイブを電子メールで提供します。

- **アプリケーションコード** （`<project-name>.zip`） — [!DNL Adobe I/O Runtime]で実行され、アプリのロジックを強化するアクションハンドラー。 アプリをエンドツーエンドで動作させるためにこれらをそのままデプロイし、後でそれらを更新して実際のバックエンドを接続します。
- **EDS project** （`<project-name>-eds.zip`） – ウィジェットのフロントエンドコード。 Adobeでは、このような機能が事前に用意されています。ブランドに合わせてコードベースを所有し、カスタマイズし、スタイルを調整できます。

[!DNL GitHub]に&#x200B;**2個の空のリポジトリ**&#x200B;を作成し（アーカイブごとに1個）、各アーカイブを解凍してプッシュします。 各リポジトリーの名前は、対応するzip ファイルの後に付けることをお勧めします。アプリケーションコードは`<project-name>`、EDS プロジェクトは`<project-name>-eds`です。

`<your-github-org>`は、個人の[!DNL GitHub] ユーザー名または[!DNL GitHub]組織のいずれかを指します。どちらのアカウントがリポジトリを所有するか。

**アプリケーションコードリポジトリ** — アーカイブを解凍し、ローカル Git リポジトリを初期化して、[!DNL GitHub]にプッシュします。

```bash
# Unzip and enter the folder
unzip <project-name>.zip
cd <project-name>

# Initialize and push
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:<your-github-org>/<your-repo>.git
git push -u origin main
```

**EDS リポジトリ** — EDS アーカイブに対して同じ手順を繰り返し、2番目のリポジトリを指します。

```bash
unzip <project-name>-eds.zip
cd <project-name>-eds

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:<your-github-org>/<your-eds-repo>.git
git push -u origin main
```

## ステップ 2:LLM アプリの作成

[experience.adobe.com/llm-apps/](https://experience.adobe.com/llm-apps/)に移動し、**[!UICONTROL LLM アプリの作成]**&#x200B;をクリックします。

![&#x200B; アプリページ – まだアプリは作成されていません](/help/assets/guide-create-app/first-load.png)

アプリ設定リファレンスの「**[!UICONTROL アプリの詳細]**」セクションの値を使用して、**[!UICONTROL アプリの詳細]**&#x200B;を入力します。

- **[!UICONTROL LLM アプリ名]**
- **[!UICONTROL LLM アプリの説明]**
- **[!UICONTROL お客様のweb サイト]**

![&#x200B; アプリの作成ダイアログ &#x200B;](/help/assets/guide-create-app/app-details-1.png)

**[!UICONTROL 分析データ領域]**&#x200B;で、分析データを保存する領域を選択します。 この&#x200B;**は、アプリの作成後に変更できません**。

>[!IMPORTANT]
>
>アプリの作成後に分析データ領域を変更することはできません。

![Analytics データ領域ドロップダウン &#x200B;](/help/assets/guide-create-app/app-details-analytics-dropdown.png)

**リポジトリ**&#x200B;で、[!DNL GitHub]組織と、先ほどプッシュした&#x200B;**アプリケーションコードリポジトリ**&#x200B;を選択します。

>[!NOTE]
>
>アプリを初めて設定する場合、[!DNL GitHub]組織はまだリストに表示されません。 「**[!UICONTROL 別のGitHub組織を接続]**」をクリックして、組織をリンクし、リポジトリへのアクセス権を付与します。

![&#x200B; アプリの作成ダイアログ – リポジトリがリンクされています](/help/assets/guide-create-app/app-details-repo-linked.png)

Web サイトに基づいて&#x200B;**[!UICONTROL 自動的にアクションを提案]**&#x200B;します。このオプションは手動で設定します。

**[!UICONTROL Adobe Developer条件]**&#x200B;に同意し、**[!UICONTROL アプリを作成]**&#x200B;をクリックします。

![&#x200B; アプリを作成しています – 画面を読み込んでいます](/help/assets/guide-create-app/app-loading.png)

![&#x200B; アプリの詳細ページ &#x200B;](/help/assets/guide-create-app/app-detail-top.png)


## ステップ 3：ウィジェットを公開する

この手順では、Adobeが提供するEDS プロジェクトを設定し、[!DNL DA.live] — AdobeのオーサリングとCDN レイヤーを通じて公開します。 公開された各ドキュメントは、アクションが呼び出されたときにユーザーに表示されるウィジェットになります。

### 手順3.1: EDS リポジトリを[!DNL DA.live]に接続する

1. [github.com/apps/aem-code-sync](https://github.com/apps/aem-code-sync)に移動します。 アプリがまだインストールされていない場合は、**[!UICONTROL インストール]**&#x200B;をクリックします。 既にインストールされている場合は、**[!UICONTROL Configure]**&#x200B;をクリックし、アクセス可能なリポジトリのリストに`<your-eds-repo>`を追加します。
2. インストール後、**[!DNL AEM Code Sync]登録済み**&#x200B;の確認ページに移動します。 **次のステップ → コンテンツの作成**&#x200B;で、[!DNL DA.live] リンクをクリックします。
3. **デモコンテンツ**&#x200B;画面で、**なし**&#x200B;を選択し、**素晴らしいものを作成**&#x200B;をクリックします。
4. サイトの[!DNL DA.live]作成者ビューに移動しました。

### 手順3.2：各アクションの[!DNL DA.live] ドキュメントを作成する

[!DNL DA.live]では、アクションごとに&#x200B;**1つのドキュメントを作成する必要があります**。 公開すると、各ドキュメントは、そのアクションが呼び出されたときにユーザーに表示されるウィジェットになります。

各アクションについて：

1. [!DNL DA.live]で、サイトのルートに新しいドキュメントを作成し、アプリ設定リファレンスで指定されている名前を付けます（**[!DNL DA.live]ドキュメント** セクションを参照）。
2. ドキュメントで、左側のサイドバーを使用し、**[!UICONTROL ブロック]**&#x200B;をクリックして新しいブロックを挿入します。
3. ブロック ヘッダーを、アプリ設定リファレンスで指定されたブロック名に設定します（**[!DNL DA.live]ドキュメント** セクションを参照）。
4. 「**[!UICONTROL 公開]**」ボタン（上部のツールバーの紙面アイコン）を使用してドキュメントを公開します。

公開すると、各ドキュメントに`https://main--<your-eds-repo>--<your-github-org>.aem.live/<document-name>`からアクセスできるようになります。 このURLは、手順4で各アクションを設定する際に、**[!UICONTROL Widget URL]** フィールドに入力するものです。


### 手順3.3:EDS サイトのCORS ヘッダーの設定

LLM プラットフォームがクロスオリジンのウィジェットを読み込めるようにするには、`Access-Control-Allow-Origin` ヘッダーをEDS サイトに追加する必要があります。

[tools.aem.live/tools/headers-edit/index.html](https://tools.aem.live/tools/headers-edit/index.html)の&#x200B;**HTTP Headers Editor**&#x200B;に移動します。

1. **組織** （`<your-github-org>`）と&#x200B;**サイト** （EDS リポジトリ名）を入力し、**[!UICONTROL Fetch]**&#x200B;をクリックします。 サイトへのアクセスの認証と承認を求めるメッセージが表示されます。
2. パス `/**`の下で、**[!UICONTROL ヘッダーを追加]**&#x200B;をクリックします。
3. ヘッダー名を`Access-Control-Allow-Origin`に、値を`*`に設定します。
4. 「**[!UICONTROL 保存]**」をクリックします。

[!DNL AEM Edge Delivery Services]のカスタム HTTP ヘッダーに関する完全なドキュメントについては、[aem.live/docs/custom-headers](https://www.aem.live/docs/custom-headers)を参照してください。

ヘッダーを保存した後、コード同期をトリガーして、変更内容をすべてのファイルに反映します。

```bash
curl -X POST "https://admin.hlx.page/code/<your-github-org>/<your-eds-repo>/main/*"
```


## 手順4：アクションの追加

[LLM アプリ UI](https://experience.adobe.com/llm-apps/)でアプリを開き、左側のサイドバーの&#x200B;**[!UICONTROL アクション]**&#x200B;に移動します。 **+**&#x200B;をクリックして、新しいアクションを作成します。 アプリ設定リファレンスに記載されているすべてのアクションについて、これを繰り返します（**アクション 1**、**アクション 2**、**アクション 3** セクションを参照）。

![&#x200B; アクションページ – まだアクションがありません](/help/assets/guide-create-action/actions-empty.png)

### 「アクション」タブ

- **アクション名**&#x200B;および&#x200B;**説明** — LLM プラットフォームがアクションを呼び出すタイミングを決定するために使用します。 アプリ設定リファレンスの「**アクション」タブ**」セクションの正確な値を使用します。
- **入力パラメーター** – 各パラメーターの名前、種類、説明。 アプリ設定リファレンスの「**アクション」タブ**」セクションの値を使用します。

![&#x200B; アクションの作成 – 基本情報](/help/assets/guide-create-action/action-basic-info.png)

### 「Widget Metadata」タブ

- **Type** — **[!UICONTROL EDS]**&#x200B;を選択します。

**[!UICONTROL CSP設定]**&#x200B;を展開し、次の項目を入力します。

- **[!UICONTROL CSP — ドメインを接続]** — アプリ設定リファレンスの「**ウィジェットメタデータ」タブ**」セクションの値を使用します。
- **[!UICONTROL CSP — リソースドメイン]** — アプリ設定リファレンスの「**ウィジェットメタデータ」タブ**」セクションの値を使用します。

![&#x200B; アクションの作成 – ウィジェットのメタデータ &#x200B;](/help/assets/guide-create-action/widget-metadata.png)

![&#x200B; アクションの作成 – 権限とCSP](/help/assets/guide-create-action/widget-permissions-csp.png)

### 「Widget Builder」タブ

**[!UICONTROL ウィジェットソース]**&#x200B;で「**[!UICONTROL 既存のウィジェットを使用]**」を選択し、次の項目を入力します。

- **[!UICONTROL スクリプト URL]** — アプリ設定リファレンスの「**ウィジェットメタデータ」タブ**」セクションの値を使用します。
- **[!UICONTROL ウィジェット URL]** — アプリ設定リファレンスの「**ウィジェットメタデータ」タブ**」セクションの値を使用します。

「**[!UICONTROL アクションを作成]**」をクリックします。 アクションは、**[!UICONTROL EDS]** バッジとパラメーター数を持つアクションページにカードとして表示されます。

![&#x200B; アクションページ – アクションが作成されました](/help/assets/guide-create-action/actions-with-action.png)


## 手順5：デプロイ

すべてのアクションを設定したら、アプリの詳細ページに移動し、右上隅にある「**[!UICONTROL デプロイ]**」をクリックします。

![&#x200B; アプリの詳細 – デプロイの準備ができました](/help/assets/guide-deploy/app-detail-deploy-ready.png)

ターゲット環境を選択し、**[!UICONTROL デプロイ]**&#x200B;をクリックします。 パイプラインは、資格情報の準備、デプロイメントの開始、リポジトリからのアプリの構築、[!DNL Adobe I/O Runtime]への公開の4つのステップで実行されます。

![実行中のパイプラインのデプロイ &#x200B;](/help/assets/guide-deploy/deploy-pipeline-deploying.png)

完了したら、「**[!UICONTROL アプリのテスト]**」セクションまでスクロールして、**[!UICONTROL MCP サーバーURL]**、つまり[!DNL ChatGPT]にアプリを登録する必要があります。

![&#x200B; デプロイが成功しました](/help/assets/guide-deploy/app-detail-deploy-finish.png)

![&#x200B; アプリのテスト – デプロイされたURL](/help/assets/guide-deploy/test-app-deployed.png)


## 手順6: アプリを[!DNL ChatGPT]に追加する

[!DNL ChatGPT]にカスタムアプリを追加するには、**Pro**、**Business**&#x200B;または&#x200B;**Enterprise**&#x200B;のサブスクリプションが必要です。 Free プランとPlus プランでは、カスタム MCP アプリはサポートされていません。

1. [!DNL ChatGPT]で、プロファイルアバターをクリックし、**[!UICONTROL 設定]**&#x200B;に移動します。

   ![ChatGPT – 設定メニュー](/help/assets/guide-test-chatgpt/chatgpt-settings-menu.png)

2. サイドバーで「**[!UICONTROL アプリ]**」を選択し、**[!UICONTROL 詳細設定]**」をクリックして、**[!UICONTROL 開発者モード]**&#x200B;を有効にします。

   ![ChatGPT – 開発者モードが有効](/help/assets/guide-test-chatgpt/chatgpt-developer-mode.png)

3. **[!UICONTROL 設定] → [!UICONTROL &#x200B; アプリ]**&#x200B;に移動し、**[!UICONTROL アプリの作成]**&#x200B;をクリックします。

   ![ChatGPT — アプリの作成ダイアログ &#x200B;](/help/assets/guide-test-chatgpt/chatgpt-create-app.png)

4. [!DNL LLM Apps]からコピーした&#x200B;**[!UICONTROL MCP サーバーURL]**&#x200B;を貼り付け、**[!UICONTROL 認証]**&#x200B;を&#x200B;*認証*&#x200B;に設定し、確認チェックボックスをオンにして、**作成**&#x200B;をクリックします。

このアプリは&#x200B;**[!UICONTROL 有効なアプリ]**&#x200B;の下に&#x200B;**[!UICONTROL 開発]** バッジが表示されます。

![ChatGPT — アプリが有効](/help/assets/guide-test-chatgpt/chatgpt-app-enabled.png)

新しい会話を開始し、**+** ボタンを使用するか、**@**&#x200B;と入力してアプリ名を入力し、設定したアクションのいずれかに一致する質問をしてください。

![ChatGPT — メニューからアプリを選択](/help/assets/guide-test-chatgpt/chatgpt-select-app.png)

![ChatGPT — アクション結果](/help/assets/guide-test-chatgpt/chatgpt-response.png)

## 次の手順

デプロイしたサンプルアプリは、ハードコードデータを使用します。 本番環境での利用に対応するには、次の手順に従います。

- **APIを接続** – 実際のAPI、データベース、またはサービスを呼び出すために、アプリケーションコードリポジトリ内のアクションハンドラーを更新します。 各ハンドラーは`actions/<action-name>/index.js`に存在します。
- **ウィジェットのレビューと調整** — EDS プロジェクトを開き、ブランドに合わせてブロックのスタイルとレイアウトを調整し、ライブデータでウィジェットが正しくレンダリングされることを確認します。
- **再デプロイ** — ハンドラーとウィジェットが更新されたら、変更を[!DNL GitHub]にプッシュし、[!DNL LLM Apps] UIの&#x200B;**[!UICONTROL デプロイ]**&#x200B;をクリックして新しいバージョンを公開します。
- **公開用に送信** – エクスペリエンスに満足したら、[!DNL ChatGPT] プラグインまたはコネクターの公開プロセスを通じてアプリをレビュー用に送信します。 Adobeはこのプロセスを制御しません。提出の要件とタイムラインについては、LLM プラットフォームのドキュメントを参照してください。
