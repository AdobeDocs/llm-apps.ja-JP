---
title: アプリの作成
description: 最初のLLM アプリを作成し、GitHub リポジトリにリンクする方法を説明します。
source-git-commit: 914b8a659e690ff47257c2c112f76816f4b0232c
workflow-type: tm+mt
source-wordcount: '735'
ht-degree: 1%

---


# アプリの作成

>[!NOTE]
>
>**Beta プログラム参加者**&#x200B;の場合は、代わりに[Beta オンボーディングガイド &#x200B;](/help/beta-onboarding/beta-onboarding.md)を使用してください。このガイドでは、特定のアプリの完全なエンドツーエンド設定について説明します。

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。 ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。

>[!NOTE]
>
>開始する前に、すべての[前提条件](/help/overview/overview.md#prerequisites)が満たされていることを確認してください。

このガイドでは、最初のLLM アプリの作成を順を追って説明します。空の状態から、[!DNL GitHub] リポジトリにリンクされた完全に設定されたプロジェクトまで。

## [!DNL LLM Apps] を開きます。

[experience.adobe.com/llm-apps](https://experience.adobe.com/llm-apps)に移動します。 まだアプリが作成されていない場合は、最初のアプリを作成するためのプロンプトが表示された初回読み込みページが表示されます。

![&#x200B; アプリページ – まだアプリは作成されていません](/help/assets/guide-create-app/first-load.png)

左側のサイドバーでは、**[!UICONTROL アプリ]**&#x200B;と&#x200B;**[!UICONTROL アクション]**&#x200B;の間を移動できます。 「**[!UICONTROL アプリを作成]**」をクリックして開始します。

## アプリの詳細を入力

アプリを作成ダイアログがフルスクリーンで開きます。

![&#x200B; アプリの作成ダイアログ &#x200B;](/help/assets/guide-create-app/app-details-1.png)

以下を入力します。

- **[!UICONTROL LLM アプリ名]** （必須） – アプリの表示名。 英数字とスペースのみ使用できます。
- **[!UICONTROL LLM アプリの説明]** — アプリの機能の簡単な説明。 例えば、*ユーザーがLLM プラットフォームを通じて製品と予約サービスを発見できるよう支援します*。
- **[!UICONTROL あなたのweb サイト]** （必須） – ブランド web サイトのURL。 [!DNL LLM Apps]は、これを使用して、事前設定済みのアクションを自動的に作成します。

## 分析データ領域の選択

このアプリの分析データが保存される地域を選択してください。

>[!IMPORTANT]
>
>アプリの作成後に分析データ領域を変更することはできません。

![Analytics データ領域ドロップダウン &#x200B;](/help/assets/guide-create-app/app-details-analytics-dropdown.png)

**Analytics地域**&#x200B;のドロップダウンは、デフォルトで&#x200B;**米国（米国）**&#x200B;になります。 使用可能なオプションは、**米国（US）**&#x200B;および&#x200B;**欧州（EU）**&#x200B;です。 続行する前に、データレジデンシー要件に最も適した地域を選択してください。

## [!DNL GitHub] リポジトリのリンク

アプリの詳細の下に、[!DNL GitHub] リポジトリをリンクできます。 このリポジトリは、アクションハンドラーコードが存在する場所です。LLM プラットフォームがアプリを呼び出したときに[!DNL Adobe I/O Runtime]に実行される`actions/` フォルダーの下でJavaScriptが機能します。

初めて使用する場合は、リポジトリはリストに表示されません。 組織に&#x200B;**[!DNL Adobe LLM Apps Link]** [!DNL GitHub] アプリをインストールする必要があります。

1. ダイアログの下部にある「**Github**&#x200B;のリポジトリを管理」をクリックします。
2. これにより、[!DNL Adobe LLM Apps Link] [!DNL GitHub] アプリページが新しいタブで開きます。

   ![Adobe LLM Apps Link — GitHub アプリのインストールページ &#x200B;](/help/assets/guide-create-app/github-app-install.png)

3. **[!UICONTROL Install]**&#x200B;をクリックし、[!DNL GitHub]組織を選択します。
4. **[!UICONTROL リポジトリアクセス]**&#x200B;で、「**リポジトリのみを選択**」を選択し、アプリコードをホストするリポジトリを選択します。

   ![Adobe LLM Apps Link — リポジトリアクセス &#x200B;](/help/assets/guide-create-app/github-repo-access.png)

5. 「**[!UICONTROL 保存]**」をクリックします。 アプリを作成ダイアログに戻ります。リポジトリが&#x200B;**リポジトリを選択** ドロップダウンに表示されます。
6. 使用するリポジトリを選択します。

![&#x200B; アプリの作成ダイアログ – リポジトリがリンクされています](/help/assets/guide-create-app/app-details-repo-linked.png)

>[!NOTE]
>
>アプリの作成中にリポジトリのリンクをスキップし、後でアプリ設定からリンクできます。 ただし、リポジトリがリンクされるまでデプロイすることはできません。

## アプリの作成

「**[!UICONTROL アプリを作成]**」をクリックします。 Developer Consoleでプロジェクトを作成する際に、読み込み画面が表示されます。

![&#x200B; アプリを作成しています – 画面を読み込んでいます](/help/assets/guide-create-app/app-loading.png)

完了すると、**アプリの詳細** ページにリダイレクトされます。

## アプリの詳細ページ

アプリの詳細ページは、アプリを管理するための中心的なハブです。

![&#x200B; アプリの詳細ページ – 上位セクション &#x200B;](/help/assets/guide-create-app/app-detail-top.png)

### アプリバナー

![&#x200B; アプリバナー](/help/assets/guide-create-app/app-banner.png)

上部の色付きのバナーには、現在選択されているアプリ（アプリのアバター、名前、説明、アプリを切り替えるためのドロップダウンなど）が表示されます。 バナーは、スクロールしたときに上部に固定されたままになります。

### ページタイトルとアクション

![&#x200B; アプリバナー](/help/assets/guide-create-app/page-title.png)

バナーの下に、次のアクションボタンを含むアプリ名が見出しとして表示されます。

- **...** （その他のアクション） – 新しいアプリを作成するか、現在のアプリを削除します。
- **[!UICONTROL 設定]** – リンクされたリポジトリとその他のオプションを設定します。
- **[!UICONTROL デプロイ]** — アプリを[!DNL Adobe I/O Runtime]にデプロイします（リポジトリがリンクされるまで無効）。

### アプリ情報カード

![&#x200B; アプリ情報カード &#x200B;](/help/assets/guide-create-app/app-info-card.png)

このカードは、アプリのキーメタデータ（名前、説明、ステータスバッジ （**デプロイされていない**&#x200B;または&#x200B;**デプロイ済み**）、アプリ ID、作成日）をまとめたものです。 また、次の2つのリンクされたリポジトリも表示されます。

- **ハンドラーリポジトリ** — アクションハンドラーコードが存在する場所（JavaScriptは[!DNL Adobe I/O Runtime]に機能します）。
- **EDS リポジトリ** — ウィジェット UIが存在する場所（[!DNL Edge Delivery Services]が提供するブロックとスタイル）。

### アクション、アプリのテスト、デプロイメント履歴

![&#x200B; アプリの詳細ページ – 下部セクション &#x200B;](/help/assets/guide-create-app/app-detail-bottom.png)

情報カードの下には、次の3つのセクションがあります。

- **[!UICONTROL アクション]** — アプリに対して定義されたアクションハンドラーを一覧表示します。 「**アクションに移動**」をクリックして、アクション ページに移動します。
- **[!UICONTROL アプリをテスト]** – デプロイメント後、ステージング環境と実稼動環境のMCP サーバーURLが表示されます。
- **デプロイメント履歴** — ステータスと日付を持つ環境全体のすべてのデプロイメントを追跡します。

## 次の手順

- [&#x200B; ガイド：アクションの作成](/help/guides/create-action.md) — メタデータとウィジェットの設定を使用してアクションを定義します。

