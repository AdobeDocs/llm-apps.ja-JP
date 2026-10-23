---
title: Adobe AnalyticsとCustomer Journey Analyticsの設定
description: Adobe Experience Platform データストリームを通じて、Adobe LLM Apps イベントを独自のAdobe Analytics レポートスイートとCustomer Journey Analytics データビューに転送します。
source-git-commit: 557173e8d95325b980efac4d72c06bb3d90dcd72
workflow-type: tm+mt
source-wordcount: '2962'
ht-degree: 3%
---

# Adobe AnalyticsとCustomer Journey Analyticsの設定 {#analytics-setup}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

アプリのイベントを[!DNL Adobe Analytics]、[!DNL Customer Journey Analytics]またはその両方に送信します。 [!DNL LLM Apps]は、所有しているデータストリームを通じてイベントを[!DNL Adobe Experience Platform] Edge Networkに転送します。 データストリームは、イベントを追加した各サービスにルーティングします。

- **[!DNL Adobe Analytics]**&#x200B;は、LLM プラットフォームが呼び出すアクション、ユーザーが選択するウィジェット リンク、各呼び出しの背後にある意図を報告します。
- **[!DNL Customer Journey Analytics]**&#x200B;は、[!DNL Experience Platform] データで構築したデータ ビューで、同じイベントを人物ごとに分析します。

この設定は、[!DNL LLM Apps]の組み込み分析とは別のものです。

**このガイドの内容：** [!DNL Experience Platform]、[!DNL Adobe Analytics]、および[!DNL Customer Journey Analytics]で[!DNL LLM Apps]に必要な設定と、各製品画面のExperience League手順へのリンクについて説明します。 次に、アプリでAnalyticsを有効にし、ステージングにデプロイし、データを実稼動にデプロイする前に検証します。

## チェックリストを設定 {#setup-checklist}

使用するサービスに対して&#x200B;**必須**&#x200B;とマークされたすべての手順を完了します。 スキップしたステップでエラーが表示されることはほとんどありません。 データは届きません。

| ステップ | [!DNL Adobe Analytics] | [!DNL Customer Journey Analytics] |
|---|---|---|
| [1. ID名前空間](#identity-namespace)を作成します | 必須 | 必須 |
| [2. スキーマの作成](#schema) | 必須 | 必須 |
| [3. データセットを作成](#dataset) | 不要 | 必須 |
| [4. レポートスイートの準備](#report-suite) | 必須 | 不要 |
| [5. データストリームを作成](#datastream) | 必須 | 必須 |
| [6. Analyticsを有効にしてステージ &#x200B;](#enable-analytics)にデプロイ | 必須 | 必須 |
| [7. 接続とデータ ビューを作成](#cja) | 不要 | 必須 |
| [8. データを確認し、実稼動環境](#verify)にデプロイします | 必須 | 必須 |

同じ[!DNL Experience Platform] サンドボックスに名前空間、スキーマ、データセットおよびデータストリームを作成します。 実稼動環境でレポートするサンドボックスとデータストリームを使用します。 アプリにデータストリームを保存したら、LLM アプリチームに連絡して変更します。

## 始める前に {#before-you-begin}

次のものが必要です。

- **サポートされているランタイムとSDK。** ハンドラーリポジトリでは、`@adobe/llm-apps-runtime` 1.2.0以降を使用する必要があります。 EDS ウィジェットの場合は、LLM Apps SDK 0.1.13以降を使用します。 Analyticsを有効にする前に、古いアプリを最新のランタイムおよびSDKに更新するには、[既存のアプリをアップグレード &#x200B;](/help/guides/upgrade-existing-app.md)します。 これらの要件を満たすアプリは、アップグレードは必要ありません。
- **エージェント型フィールドグループ。** エージェンティック情報と会話イベントのフィールドグループに対して、組織を有効にする必要があります。 スキーマにフィールドグループを追加しても、これらのフィールドグループが表示されない場合は、Adobeのアカウントチームにお問い合わせください。 [会話インサイトの実装](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/conversation-insights/implement#schema-and-datasets)を参照してください。 アクション呼び出しは、[!DNL Experience Platform]のBetaにあるAgentic Informationの`agenticExperience.tools` フィールドに記録されます。
- サンドボックスにID名前空間、スキーマ、データセット、データストリームを作成するための&#x200B;**[!DNL Experience Platform]権限**。
- **[!DNL Adobe Analytics]の場合：**&#x200B;権限で、レポートスイートと処理ルールを管理します。 製品管理者は、デフォルトで両方を持っています。
- **[!DNL Customer Journey Analytics]の場合：**&#x200B;製品管理者アクセスで、接続とデータビューを作成できます。

## アプリが送信するデータ {#what-your-app-sends}

Analyticsとデプロイを有効にすると、アプリは2種類のイベントを送信します。

| イベント | `eventType` | 次の時に送信 | 次を含む |
|---|---|---|---|
| アクションコール | `mcp.tool_call` | LLM プラットフォームは、サインインプロンプトの失敗や返しの呼び出しなど、アプリのアクションの1つを呼び出します。 | アクションのコード IDと、呼び出しが失敗したかどうかを示します。 ユーザーのインテント（アクションが収集し、プラットフォームが提供する場合）。 プラットフォームがそれらを提供する場合：プラットフォーム名、会話ID、プラットフォームのユーザーID、ロケール、組織、およびユーザーのおおよその場所。 |
| ウィジェット操作 | `web.webinteraction.linkClicks` | Edge Delivery Services ウィジェットのリンクまたはボタンを選択したユーザー。 | リンクまたはボタンのラベル（最大100文字）。 アクション呼び出しによって指定された場合、会話IDとターン ID。 Adobe Web SDKでは、ウィジェットフレームのURL、画面とブラウザーのウィンドウサイズ、ローカルタイムとタイムゾーン、独自のバージョンも追加されます。 |

[!DNL Adobe Analytics]では、各アクション呼び出しは`mcp:<code identifier>`という名前のページのページビューとしてカウントされ、各ウィジェットのインタラクションはリンククリックとしてカウントされます。 Adobe Analytics[&#128279;](https://experienceleague.adobe.com/ja/docs/analytics/implementation/aep-edge/hit-types)のEdge Network イベントタイプを参照してください。

すべてのアクション呼び出しとウィジェットのインタラクションは、[!DNL Experience Platform] データセット内の1つの[!DNL Adobe Analytics] ヒットと1つのイベントです。 トラフィックの多いアプリで、Analyticsを有効にする前に、契約がこのボリュームをカバーしていることを確認します。

レポートでは、次の点に注意してください。

- **失敗した呼び出しには、サインインプロンプトが含まれます。** 一部のアクションでログインが必要な場合は、より高い失敗率を期待します。
- **一部の拒否された呼び出しは記録されません。** アクションが実行される前に呼び出しが拒否され、イベントは送信されません。[!DNL ChatGPT]以外のプラットフォームが、有効なサインインまたは必要な範囲を持たずにサインインを必要とするアクションを呼び出す場合。 すべてのアクションでログインが必要なアプリでは、ログインのない呼び出しは同じように拒否されます。
- **ユーザーインテントが見つからない場合が多い。** プラットフォームが提供するかどうかを決定するので、多くの呼び出しには何も含まれず、**未指定**&#x200B;と表示されます。
- **プラットフォームの詳細が異なります。** 現在、[!DNL ChatGPT]はすべての機能を提供しています。 [!DNL Claude]の場合、プラットフォーム名のみが記録されます。
- **ウィジェットのラベルがページから取得されます。** 安定したラベルを設定するには、リンクまたはボタンに`data-analytics`属性を追加します。 それ以外の場合は、その表示テキストが使用されます。

ユーザーの意図を収集するアクションを選択するには、[分析の設定](/help/guides/create-action.md#configure-analytics)を参照してください。

>[!NOTE]
>
>イベントには、プラットフォームユーザーIDと概算の場所を含めることができます。 Analyticsを有効にする前に、プライバシーポリシーとデータガバナンスの設定を確認します。

### イベントが顧客を識別する方法 {#identities}

| イベント | プライマリ ID | 名前空間 |
|---|---|---|
| アクションコール | LLM プラットフォームがユーザーIDを提供する場合のユーザーID | `MCPHOSTUSER` |
| ウィジェット操作 | Edge Networkがアクションコール中に発行するExperience Cloud ID （ECID）。 `MCPHOSTUSER` IDは、使用可能な場合はセカンダリ IDとして含まれます。 | `ECID` |

[!DNL Claude]などの一部のプラットフォームでは、ユーザーIDが提供されていません。 これらのプラットフォームからのアクション呼び出しにはIDが含まれていないため、[!DNL Customer Journey Analytics]はスキップします。

>[!NOTE]
>
>各アクション呼び出しは新しいECIDを取得し、ウィジェットのインタラクションはウィジェットを示すアクション呼び出しのECIDを使用します。 これにより、以下を実現できます。
>
>- [!DNL Customer Journey Analytics]は、ユーザーのアクション呼び出しを1人としてカウントしますが、ウィジェットのインタラクションは、アクション呼び出しごとに別の人物としてカウントします。
>- [!DNL Adobe Analytics]は、各アクション呼び出しを新規訪問者としてカウントできます。

## 手順1:ID名前空間の作成 {#identity-namespace}

**次に必要：** [!DNL Adobe Analytics]および[!DNL Customer Journey Analytics]。

アクション呼び出しは`MCPHOSTUSER`名前空間のユーザーを識別するため、名前空間はサンドボックスに存在する必要があります。 次の設定を使用して、カスタム名前空間を作成します。

| 設定 | 値 |
|---|---|
| 表示名 | `MCP host user`、または選択した別の名前 |
| ID記号 | `MCPHOSTUSER`は、図とまったく同じです |
| ID タイプ | **[!UICONTROL 個々のクロスデバイス ID]** |

手順については、[&#x200B; カスタム名前空間の作成](https://experienceleague.adobe.com/ja/docs/experience-platform/identity/features/namespaces#create-namespaces)を参照してください。

## 手順2：スキーマの作成 {#schema}

**次に必要：** [!DNL Adobe Analytics]および[!DNL Customer Journey Analytics]。

データストリームとデータセットはどちらも、このスキーマを使用します。 次の設定を使用してスキーマを作成します。

| 設定 | 値 |
|---|---|
| スキーマタイプ | **[!UICONTROL 標準]**、**[!UICONTROL 手動]** オプションで作成 |
| ベースクラス | **[!UICONTROL エクスペリエンスイベント]** |
| フィールドグループ | エージェント情報、会話イベント、Webの詳細、環境の詳細、実装の詳細 |
| 表示名 | 任意の名前（例：`AEM LLM Apps`） |

>[!IMPORTANT]
>
>5つのフィールドグループをすべて追加します。 [!DNL LLM Apps]では、アクションコールにエージェント情報と会話イベントが必要です。 他の3つは、イベントにも含まれるページ、リンク、デバイス、環境、実装のフィールドを保持します。 フィールドグループが見つからない場合、[!DNL Experience Platform]はこれらのフィールドを削除するか、イベントを拒否する可能性があります。

Adobe Analytics ExperienceEvent フィールドグループは必要ありません。 ユーザーのインテントは、代わりに処理ルールを通じて[!DNL Adobe Analytics]に達します。 [手順4](#report-suite)を参照してください。

手順については、[新しいスキーマの作成](https://experienceleague.adobe.com/ja/docs/experience-platform/xdm/ui/resources/schemas#create)および[&#x200B; フィールドグループの追加](https://experienceleague.adobe.com/ja/docs/experience-platform/xdm/ui/resources/schemas#add-field-groups)を参照してください。

## 手順3：データセットの作成 {#dataset}

**は次の場合に必要です：** [!DNL Customer Journey Analytics]。

データセットは、アプリのイベントを[!DNL Experience Platform]に保存します。 次の設定でデータセットを作成します。

| 設定 | 値 |
|---|---|
| 作成方法 | **[!UICONTROL スキーマからデータセットを作成]** |
| スキーマ | [手順2](#schema)のスキーマ |
| 名前 | 任意の名前（例：`AEM LLM Apps`） |

手順については、[&#x200B; データセットの作成](https://experienceleague.adobe.com/ja/docs/experience-platform/catalog/datasets/user-guide#create)を参照してください。

## 手順4：レポートスイートの準備 {#report-suite}

**は次の場合に必要です：** [!DNL Adobe Analytics]。

[!DNL Adobe Analytics]はページ名とリンクフィールドを自動的にマッピングするので、`mcp:<code identifier>` ページとウィジェットのリンククリックは追加の設定を必要としません。 ユーザーインテントには、eVarと処理ルールが必要です。

### レポートスイートの作成または選択 {#create-report-suite}

レポートスイートを作成するか、既存のレポートスイートを選択します。 [!DNL Adobe Analytics]が追加するプレフィックスを含む、完全なレポートスイート IDをメモします。 [手順5](#datastream)のIDが必要です。

手順については、[&#x200B; レポートスイートの作成](https://experienceleague.adobe.com/ja/docs/analytics/admin/admin-tools/manage-report-suites/c-new-report-suite/t-create-a-report-suite)を参照してください。

### User Intent eVarを有効にする {#user-intent-evar}

レポートスイートのコンバージョン変数で、次の設定でeVarを有効にします。

| 設定 | 値 |
|---|---|
| eVar | eVar3 |
| 名前 | `User Intent` |
| 種類 | **[!UICONTROL テキスト文字列]** |
| 配分 | **[!UICONTROL 最新（最後）]** |
| 有効期限 | **[!UICONTROL 訪問]** |
| ステータス | **[!UICONTROL 有効]** |

レポートスイートで既にeVar3を使用している場合は、別の未使用のeVarを選択し、そのeVarを処理ルールで使用します。

手順については、[&#x200B; コンバージョン変数の追加または編集](https://experienceleague.adobe.com/ja/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/conversion-variables/conversion-var-admin#add-or-edit-conversion-variables)を参照してください。

### 処理ルールの作成 {#processing-rule}

[!DNL Adobe Analytics]は、ユーザーインテントをeVarではなくコンテキストデータ変数として受け取ります。 その理由については、[暗黙的マッピング &#x200B;](https://experienceleague.adobe.com/ja/docs/analytics/implementation/aep-edge/xdm-var-mapping#implicit-mapping)を参照してください。 ユーザーインテントをeVarにコピーする処理ルールを作成します。

- **条件：** コンテキスト データ変数`a.x.conversation.prompt.raw.0.purpose`は`intents`に等しいです。
- **アクション：**&#x200B;は、**ユーザーインテント （eVar3）**&#x200B;の値をコンテキストデータ変数`a.x.conversation.prompt.raw.0.text`で上書きします。

このルールがないと、**ユーザーインテント** ディメンションは空のままになります。 ルールは、保存後に収集されたデータにのみ適用されます。 ウィジェットのインタラクションにはユーザーの意図がないので、ルールは変更しません。

呼び出しが失敗したか、プラットフォーム名であるかなど、その他のフィールドもコンテキストデータ変数として届きます。 [!DNL Adobe Analytics]でそれらを報告するには、同じように処理ルールをさらに作成します。

手順については、[処理ルールの概要](https://experienceleague.adobe.com/ja/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/processing-rules/pr-overview)および[処理ルールの使用例](https://experienceleague.adobe.com/ja/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/processing-rules/pr-use-cases)を参照してください。

## 手順5：データストリームの作成 {#datastream}

**次に必要：** [!DNL Adobe Analytics]および[!DNL Customer Journey Analytics]。

データストリームは、アプリのイベントを受信し、追加した各サービスに転送します。

### データストリームの作成 {#create-datastream}

次の設定でデータストリームを作成します。

| 設定 | 値 |
|---|---|
| 名前 | 任意の名前（例：`AEM LLM Apps`） |
| マッピングスキー | [手順2](#schema)のスキーマ |

スキーマと同じサンドボックスにデータストリームを作成します。 データストリームを作成した後で、そのサンドボックスを変更することはできません。

手順については、[&#x200B; データストリームの作成](https://experienceleague.adobe.com/ja/docs/experience-platform/datastreams/configure#create)を参照してください。

### サービスの追加 {#add-services}

各宛先のサービスを追加します。

| サービス | 設定 | に必要 |
|---|---|---|
| **[!UICONTROL Adobe Analytics]** | **[!UICONTROL 有効]**。 **[!UICONTROL レポートスイート ID]**&#x200B;で、[手順4](#report-suite)のIDを入力します。 | [!DNL Adobe Analytics] |
| **[!UICONTROL Adobe Experience Platform]** | **[!UICONTROL 有効]**。 **[!UICONTROL イベントデータセット]**&#x200B;で、[手順3](#dataset)からデータセットを選択します。 他のオプションをクリアしたままにします。 | [!DNL Customer Journey Analytics] |

![Add Service - Adobe Analyticsが有効化され、レポートスイート IDの例](/help/assets/guide-analytics/datastream-analytics-service.png)が表示される

![Adobe Experience Platform サービス – イベントデータセットが選択され、他のオプションがクリアされました](/help/assets/guide-analytics/datastream-platform-service.png)

手順については、[&#x200B; データストリームへのサービスの追加](https://experienceleague.adobe.com/ja/docs/experience-platform/datastreams/configure#add-services)、[Adobe Analytics settings](https://experienceleague.adobe.com/ja/docs/experience-platform/datastreams/configure#analytics)、[Adobe Experience Platform settings](https://experienceleague.adobe.com/ja/docs/experience-platform/datastreams/configure#aep)を参照してください。

次に、データストリームの詳細から&#x200B;**[!UICONTROL データストリーム ID]**&#x200B;をコピーします。 [手順6](#enable-analytics)で必要です。

![&#x200B; データストリームの詳細 – Adobe AnalyticsおよびAdobe Experience Platform サービスが有効になっており、サイドパネルにデータストリーム IDとマッピングスキーマの例が表示されている](/help/assets/guide-analytics/datastream-services.png)

## 手順6:Analyticsを有効にしてステージにデプロイする {#enable-analytics}

**次に必要：** [!DNL Adobe Analytics]および[!DNL Customer Journey Analytics]。

>[!IMPORTANT]
>
>保存すると、データストリームはアプリ設定で読み取り専用になります。 変更またはAnalyticsをオフにするには、LLM アプリチームにお問い合わせください。 保存する前に、データストリーム IDを確認してください。 データストリーム自体のレポートスイートとデータセットは、引き続き変更できます。

1. アプリを開き、左側のナビゲーションで「**[!UICONTROL 設定]**」を選択します。
2. 「**[!UICONTROL Analytics]**」タブを選択します。
3. **[!UICONTROL Analyticsを有効にする]**&#x200B;をオンにします。
4. **[!UICONTROL データストリーム ID]**&#x200B;で、[手順5](#datastream)からIDを貼り付けます。
5. **[!UICONTROL 要件]**&#x200B;で、**[!UICONTROL 詳細を表示]**&#x200B;を選択し、アプリが各要件を満たしていることを確認します。

   ![&#x200B; アプリ設定、「Analytics」タブ – 「Analyticsを有効にする」をオンにし、空のデータストリーム ID フィールドと拡張された要件リスト &#x200B;](/help/assets/guide-analytics/analytics-settings.png)

6. **[!UICONTROL 変更を保存]**&#x200B;を選択します。
7. [&#x200B; アプリをステージングにデプロイします](/help/guides/deploy-your-app.md)。 この設定は、各環境への次のデプロイメントに対して有効になります。

>[!NOTE]
>
>データストリームはアプリ全体に適用されます。 ステージングと実稼動環境はイベントを同じデータストリームに送信し、イベントはイベントを送信した環境を記録しません。 ステージでのテスト呼び出しは、実稼動トラフィックと同じレポートに表示されます。

## 手順7：接続とデータビューの作成 {#cja}

**は次の場合に必要です：** [!DNL Customer Journey Analytics]。

### 接続の作成 {#connection}

接続を作成し、次の設定で[手順3](#dataset)からデータセットを追加します。

| 設定 | 値 |
|---|---|
| サンドボックス | データセットを含むサンドボックス |
| 1日当たりの平均イベント数 | 予想される音量に一致する範囲 |
| データセット | [手順3](#dataset)のデータセット |
| ユーザー ID | **[!UICONTROL ID マップ]** |
| プライマリ ID 名前空間を使用 | 選択 |
| Timestamp | **[!UICONTROL タイムスタンプ]** |
| データソースタイプ | **[!UICONTROL その他]** |
| データソースの説明 | 任意の説明（例：`LLM Apps events`） |
| 新しいデータの読み込み | **[!UICONTROL すべての新しいデータの読み込み]**&#x200B;が有効になりました |
| データセットのバックフィル | データセットに分析するイベントが既に含まれている場合は、**[!UICONTROL 既存のすべてのデータのバックフィル]**&#x200B;が有効になります |

>[!IMPORTANT]
>
>**[!UICONTROL すべての新しいデータの読み込み]**&#x200B;を有効にします。 この設定により、継続的な接続が作成されるため、Workspaceで新しいイベントが自動的に利用できるようになります。

この人物IDでは、[!DNL Customer Journey Analytics]は各イベントのプライマリ IDを人物として使用し、プライマリ IDのないイベントをスキップします。 [&#x200B; イベントがユーザーを識別する方法](#identities)を参照してください。

手順については、[接続の作成](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-connections/create-connection#create-connection)、[&#x200B; イベントデータセット設定](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-connections/create-connection#event-dataset-settings)、[ID マップを人物IDとして使用](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-connections/create-connection#id-map)を参照してください。

### データビューの作成 {#data-view}

次の設定を使用して、接続のデータビューを作成します。

| 設定 | 値 |
|---|---|
| 接続 | 作成した接続 |
| 名前 | 任意の名前（例：`LLM Apps`） |
| コンポーネント | レポートを作成するディメンションと指標。 以下の表を参照してください。 |

これらのスキーマフィールドをコンポーネントとして追加します。

| レポート日 | スキーマフィールド | 別名で追加 |
|---|---|---|
| アクション | `agenticExperience.tools.name` | 寸法 |
| 失敗したアクションコール | `agenticExperience.tools.failed` | 寸法 |
| 失敗の理由 | `agenticExperience.tools.errorReason` | 寸法 |
| プラットフォーム | `agenticExperience.agents.name` | 寸法 |
| ユーザーインテント | `conversation.prompt.raw.text` | 寸法 |
| 会話 | `conversation.conversationID` | 寸法 |
| ウィジェットラベル | `web.webInteraction.name` | 寸法 |

ユーザーインテントなどのテキストフィールドをディメンションとして追加します。 指標として追加されたテキストフィールドはカウントすることしかできず、その値で分類すると、**無効**&#x200B;と表示されます。

手順については、[&#x200B; データビューの設定](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-dataviews/create-dataview#configure)および[&#x200B; コンポーネント &#x200B;](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-dataviews/create-dataview#components)を参照してください。

## 手順8：データを確認して実稼動環境にデプロイする {#verify}

**次に必要：** [!DNL Adobe Analytics]および[!DNL Customer Journey Analytics]。

サポートされているLLM プラットフォームからステージアプリでアクションを呼び出し、そのウィジェットでリンクを選択します。 [ChatGPTでのテスト &#x200B;](/help/guides/test-in-chatgpt.md)または[&#x200B; クロードでのテスト &#x200B;](/help/guides/test-in-claude.md)を参照してください。 次に、設定した各サービスを確認します。

| サービス | 確認する場所 | 何を期待するか |
|---|---|---|
| [!DNL Experience Platform] | [手順3](#dataset)のデータセットの&#x200B;**[!UICONTROL データセットアクティビティ]** | 新しい取り込まれたバッチと失敗したバッチなし |
| [!DNL Adobe Analytics] | [手順4](#report-suite)のレポートスイートをフリーフォームテーブルと共に使用するWorkspace プロジェクト | **ユーザーインテント** ディメンション内の&#x200B;**[!UICONTROL ページ]**&#x200B;行、`mcp:<code identifier>`という名前の&#x200B;**[!UICONTROL カスタムリンク]**&#x200B;行、およびインテントテキスト |
| [!DNL Customer Journey Analytics] | [手順7](#cja)のデータビューを使用するWorkspace プロジェクト | アクション呼び出しとウィジェットのインタラクション用の&#x200B;**[!UICONTROL イベント]** |

各サービスはデータをある程度の遅延で処理するため、新しいイベントがすぐに表示されることはありません。

レポートを作成するには、[Adobe Analyticsでプロジェクトを作成](https://experienceleague.adobe.com/ja/docs/analytics/analyze/analysis-workspace/build-workspace-project/create-projects)、[&#x200B; フリーフォームテーブルの概要](https://experienceleague.adobe.com/ja/docs/analytics/analyze/analysis-workspace/visualizations/freeform-table/freeform-table)および[Customer Journey Analyticsでプロジェクトを作成](https://experienceleague.adobe.com/ja/docs/analytics-platform/using/cja-workspace/build-workspace-project/create-projects)を参照してください。

データが正しく表示されたら、[&#x200B; アプリを実稼動環境にデプロイします](/help/guides/deploy-your-app.md)。

## 制限事項 {#limitations}

- **ウィジェットのインタラクションが多くのユーザーに分割されます。** 各アクション呼び出しは新しいECIDを取得するので、[!DNL Customer Journey Analytics]は、異なるアクション呼び出しからのウィジェットのインタラクションを異なるユーザーとしてカウントします。 [&#x200B; イベントがユーザーを識別する方法](#identities)を参照してください。
- **Web サイトへのリンクがありません。** 誰かがウィジェットのリンクをクリックしても、web サイトへの訪問は会話にリンクされません。
- **ステージおよび実稼動共有レポート。** 両方の環境が同じデータストリームに送信し、イベントは、どの環境がそれらを送信したかを記録しません。
- **一部のプラットフォームはIDを送信しません。** ユーザーIDを提供しないプラットフォームからのアクション呼び出し（[!DNL Claude]など）は、[!DNL Customer Journey Analytics]でスキップされます。
- **アクションコールごとに1 ターン。** 各アクションコールは独自の会話ターンとして記録されるので、トリガーに複数のアクションを指示するプロンプトは、複数のターンとしてカウントされます。

## トラブルシューティング {#troubleshooting}

| 表示される内容 | 確認すべきこと |
|---|---|
| データセットはバッチを受信しません | Analytics設定を保存した後、テスト対象の環境にアプリをデプロイしました。 データストリーム IDが正しい。 データストリームには、データセットを含む&#x200B;**[!UICONTROL Adobe Experience Platform]** サービスがあります。 |
| バッチが失敗する | スキーマには、[手順2](#schema)の5つのフィールドグループがすべて含まれます。 |
| [!DNL Adobe Analytics]にはデータがありません | データストリームでは、正しいレポートスイート IDで&#x200B;**[!UICONTROL Adobe Analytics]** サービスが有効になっています。 |
| **ページ**&#x200B;には`mcp:<code identifier>`が表示されますが、**ユーザーインテント**&#x200B;およびアクションフィールドが空です | ハンドラーリポジトリは`@adobe/llm-apps-runtime` 1.2.0以降を使用しており、アップグレード後にデプロイします。 [始める前に](#before-you-begin)を参照してください。 |
| **ユーザーインテント**&#x200B;は、一部のアクションでは空です | [手順4](#processing-rule)の処理ルールでは、小文字と正しいeVarに示されているとおりに、コンテキストデータ変数が正確に使用されます。 アクションでは、**[!UICONTROL ユーザーのインテントを収集]**&#x200B;がオンになっています。 ルールは、保存後に収集されたデータにのみ適用されます。 |
| [!DNL Customer Journey Analytics]は、データセットよりもイベントが少ない | **[!UICONTROL すべての新しいデータを読み込む]**&#x200B;が有効です。 プライマリ IDのないイベントはスキップされます。例えば、ユーザーIDを提供しないプラットフォームからのアクション呼び出しなどです。 |
| データストリーム IDを変更したり、Analyticsをオフにしたりすることはできません | これらの設定は、アクティベーション後にアプリ設定で読み取り専用になります。 ヘルプについては、LLM アプリチームにお問い合わせください。 他の場所にデータをルーティングするには、データストリーム自体でレポートスイートまたはデータセットを変更します。 |

## 次の手順 {#whats-next}

- [アクション用のAnalyticsの設定](/help/guides/create-action.md#configure-analytics)
- [アプリをデプロイ](/help/guides/deploy-your-app.md)
