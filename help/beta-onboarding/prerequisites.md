---
title: 前提条件
description: Adobe LLM Apps Betaオンボーディングセッションの前に設定する必要があるもの。
source-git-commit: 1ff383dff82068f68746d665d079216375ba523a
workflow-type: tm+mt
source-wordcount: '530'
ht-degree: 2%

---


Adobeを使用してオンボーディングセッションを実施する前に、次の点を確認してください。 可能であれば、次の検証手順を実行します。結果は、部屋に誰が必要かを示し、続行できるかどうかを示しません。

## Adobe 開発者コンソール

[Adobe Developer Console](https://developer.adobe.com/console)にアクセスするには、Adobe IMS組織の&#x200B;**Developer** ロール（または&#x200B;**System Admin** ロール）が必要です。 組織が[[!DNL App Builder]](https://developer.adobe.com/app-builder/docs/intro_and_overview/)へのアクセス権を持っていることを確認します。

確認するには、[developer.adobe.com/console](https://developer.adobe.com/console)に移動します。 クイックスタート画面が表示された場合は、権限が正しく設定されています。

![Adobe Developer Console – 開発者へのアクセスを確認するクイックスタート画面](/help/assets/overview/dev-console-access-granted.png)

代わりに&#x200B;**制限付きアクセス** メッセージが表示される場合は、開発者の役割がありません。 IMS組織の管理者をオンボーディングセッションに招待します。

![Adobe Developer Console – 制限付きアクセス メッセージ &#x200B;](/help/assets/overview/dev-console-access-denied.png)

## [!DNL GitHub]

組織に次の権限を持つ[!DNL GitHub] アカウントが必要です。

- **リポジトリを作成** – 組織内に2つのリポジトリ（アプリケーションコード用とEDS プロジェクト用）を作成する必要があります。 確認するには、[github.com/new](https://github.com/new)に移動します。**所有者** ドロップダウンから組織を選択できる場合は、権限があります。

  組織の選択を表示する![GitHub新しいリポジトリ所有者ドロップダウン &#x200B;](/help/assets/overview/github-repo-owner-dropdown.png)

- **アプリ [!DNL GitHub]をインストール** – 組織に[!DNL GitHub] アプリをインストールするには、適切な権限が必要です。 GitHub アプリをインストールするための[要件](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party#requirements-to-install-a-github-app)を参照してください。

**オンボーディングセッションの前に権限を確認する**

Adobeとミーティングする前に、このクイックチェックを実行します。 結果は、その部屋に誰が必要かを示します。続行できるかどうかではありません。

1. [github.com/new](https://github.com/new)に移動し、組織を所有者として選択し、`llm-apps-test`という名前のリポジトリを作成します。
2. [Adobe LLM Apps Permission Checker](https://github.com/apps/adobe-llm-apps-permission-checker/installations/new)のインストールページに移動し、`llm-apps-test` リポジトリのアプリのみをインストールします。

| 結果 | テクノロジーの意味 | アクション |
|---|---|---|
| 両方の手順が成功します | 必要な権限があります | オンボーディングセッションの準備が整いました |
| 手順2には、**インストール**&#x200B;ではなく&#x200B;**リクエスト**&#x200B;が表示されます | [!DNL GitHub]個のアプリをインストールする権限がありません | [!DNL GitHub]組織の管理者をオンボーディングミーティングに招待する |

完了したら、`llm-apps-test` リポジトリを削除し、組織設定から権限チェッカーアプリをアンインストールします。

## AEM Sitesと[!DNL Edge Delivery Services]

アクションウィジェットは&#x200B;**Adobe Experience Manager [!DNL Edge Delivery Services] （EDS）**&#x200B;でホストされます。 [!DNL Edge Delivery Services]を含むAEM Sites ライセンスが必要です。 EDS組織に&#x200B;**管理者**&#x200B;の役割が必要です。

確認するには、[EDS ユーザー管理ツール &#x200B;](https://tools.aem.live/tools/user-admin/index.html)に移動し、組織名を入力し、**サイト**&#x200B;を空白のままにして、**ユーザーを取得**&#x200B;をクリックします。 リストでアカウントを検索し、**管理者** バッジが表示されていることを確認します。

![管理者の役割を持つユーザーを表示するEDS ユーザー管理ツール &#x200B;](/help/assets/overview/eds-user-admin.png)

EDS組織をまだ持っていない場合、アクションは必要ありません。オンボーディングプロセス中に作成されます。

## LLM プラットフォーム（テスト用）

デプロイ済みアプリをテストするには、カスタム MCP アプリと&#x200B;**開発者モード**&#x200B;を有効にできる、サポートされているサブスクリプション層が必要です。 例えば、[!DNL ChatGPT]では、**Pro**、**Business**&#x200B;または&#x200B;**Enterprise / Edu**&#x200B;のサブスクリプションが必要です。
