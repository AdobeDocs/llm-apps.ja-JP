---
source-git-commit: 03c918b1643d9c4e8ebee40fd67694acb6751a14
workflow-type: tm+mt
source-wordcount: '1080'
ht-degree: 0%
---
# スクリーンショットマニフェスト

受信トレイをキャプチャ：`docs-captures/<YYYY-MM-DD>/`

利用者の意思決定やステータスの検証に役立つチェックポイントのみを取得します。

Sourceのファイル名は、最終的なファイル名と一致する必要はありません。 スキルマップは、表示されるUIの状態によってスクリーンショットをマッピングし、未加工ファイルを保持し、以下の名前を使用してサニタイズされたコピーを作成します。

以下の各ガイドは、独自の出力ディレクトリを宣言します。 キャプチャが属するセクションに対して1つを使用します。

# オンボーディングガイド

出力ディレクトリ：`help/assets/guide-onboarding-agent/`

## 必要なキャプチャ

### `app-details-onboarding.png`

- 状態：アプリ名、分析領域、および&#x200B;**自分のアプリを自動的に構築**&#x200B;が選択されました。
- 含める：アプリの詳細、分析リージョン、および「自分のアプリを構築」の先頭。
- 代替テキスト：`Create LLM App — app details and Build My App enabled`

### `install-aem-code-sync.png`

- 状態：AEMのボイラープレートで初期化された空のEDS リポジトリ。AEM Code Syncが必要です。
- 含める：EDS リポジトリ検証メッセージとインストールリンク。
- 代替テキスト：`Create LLM App — empty EDS repository initialized and AEM Code Sync required`

### `eds-admin-required.png`

- 状態：AEM Code Syncがインストールされていますが、現在のユーザーはEDS サイト管理者ではありません。
- 含める：完全な検証メッセージと&#x200B;**AEM ライブ管理者を開く**。
- 代替テキスト：`Create LLM App — EDS administrator access required`

### `actions-generating.png`

- 状態：オンボーディングがアクティブな間のアクションページ。
- 含める：進行状況メッセージと生成ステップ。
- 代替テキスト：`Actions — generating recommendations`

### `actions-ready-for-review.png`

- 状態：オンボーディング完了後および承認前に生成されたアクションリスト。
- 含める：アクション名、生成/レビューステータス、レビューコントロール。
- フィクスチャコンテンツのみを使用します。
- 代替テキスト：`Actions — generated actions ready for review`

### `generated-action-review.png`

- 状態：1つの代表者が生成したアクション。
- 含める：アクションとウィジェットのメタデータ ナビゲーション、ハンドラー生成結果、**レビュー済みとしてマーク**。
- マスク：必要に応じてリポジトリ所有者。
- 代替テキスト：`Generated action — ready to mark as reviewed`

### `actions-reviewed.png`

- 状態：生成されたすべてのアクションがレビューされました。
- 含める：**すべてのアクションがレビューされます**、アクションバッジ、**アプリページに移動**。
- 代替テキスト：`Actions — all generated actions reviewed`

### `deploy-stage.png`

- 状態：開始する前にデプロイメントダイアログを表示します。
- 含める：ターゲット環境をステージングし、**デプロイ**&#x200B;します。
- 代替テキスト：`Deploy — select the Stage environment`

### `deploy-running.png`

- 状態：デプロイメントパイプラインを実行中です。
- 含める：手順を準備、開始、構築、公開します。
- 代替テキスト：`Deploy — deployment pipeline running`

### `deploy-successful.png`

- 状態：ステージングのデプロイメントに成功しました。
- 含める：環境と成功ステータス。
- マスク：ランタイム名前空間、完全なMCP URL、ID、識別する場合のタイムスタンプ。
- 代替テキスト：`Deploy — successful staging deployment`

### `app-mcp-url.png`

- 状態：デプロイメント後にアプリセクションをテストします。
- 含める：ステージング環境、**URLをコピー**、デプロイメントの成功履歴。
- マスク：MCP サーバーのURL。
- 代替テキスト：`App Detail — copy the staging MCP server URL`

### `chatgpt-plugins-page.png`

- 状態：ChatGPT プラグインページ。
- 含める：「プラグイン」タブ、検索、作成ボタン。
- 代替テキスト：`ChatGPT — Plugins page`

### `chatgpt-new-plugin.png`

- 状態：新規プラグインダイアログ。
- 名前、説明、サーバーURL、認証、確認、作成を含めます。
- マスク：MCP サーバーのURL。
- 代替テキスト：`ChatGPT — create a plugin with the MCP server URL`

### `chatgpt-plugin-connect.png`

- 状態：プラグイン作成後に確認します。
- 含める：**追加 <plugin> ChatGPT **および** Connect **に送信します。
- マスク：ブラウザーのURLとコネクタの識別子。
- 代替テキスト：`ChatGPT — connect the new plugin`

### `chatgpt-generated-app.png`

- 状態：ChatGPTでFixture プラグインが呼び出されました。
- 含める：添付アプリ、生成ウィジェット、テキスト応答。
- 除外：会話の履歴、アカウント名、および無関係なアプリ。
- 代替テキスト：`ChatGPT — generated LLM App plugin response`

## オプションのキャプチャ

散文で決定を明確に説明できない場合にのみキャプチャを追加します。

- GitHub アプリのリポジトリアクセスの選択。
- トラブルシューティングに失敗したオンボーディング状態。
- プラグインアイコンのアップロード：

既に散文中にクリアされている静的フィールドリストのスクリーンショットを追加しないでください。

# 認証ガイド

出力ディレクトリ：`help/assets/guide-authentication/`

[authentication.md](../../../help/guides/authentication.md)が参照しています。

**[!UICONTROL リソース IDをコピー]**手順では、オンボーディングガイドの
`app-mcp-url.png`. もう一度キャプチャしないでください。

このセクションのすべてのキャプチャには、セキュリティ設定が表示されます。 保存する前のマスク：

- **[!UICONTROL 発行者]** URLと、ID プロバイダーまたはそのベンダーを識別する任意のホスト名。
- MCP サーバーのURLは、表示される場所に関わらず、完全に表示されます。
- テナント、クライアント、組織の識別子。
- アカウント名、アバター、メールアドレス。

フィールドが判読可能な状態を維持する必要がある場合は、中立的なプレースホルダー値を使用します（例：発行者
`https://auth.example.com`. スコープ名は、`orders:read`などの汎用例として読み取る必要があります。

## 必要なキャプチャ

### `auth-core-settings.png`

- 状態：**[!UICONTROL 設定]** > **[!UICONTROL 認証]**、および&#x200B;**[!UICONTROL 認証を有効にする]**、および&#x200B;**[!UICONTROL コア設定]**&#x200B;が入力されました。
- 含める：**[!UICONTROL Workspace]** ピッカーに表示されている&#x200B;**[!UICONTROL ステージ]**、**[!UICONTROL 有効にする認証]**&#x200B;の状態、**[!UICONTROL 発行者]**、および&#x200B;**[!UICONTROL スコープは、少なくとも2つのスコープを保持している]**&#x200B;をサポートしています。
- 折りたたまれた&#x200B;**[!UICONTROL 詳細設定]** コントロールを含めると、読者は&#x200B;**[!UICONTROL JWKS URI]**&#x200B;がオプションであり、このURIが存在する場所を確認できます。
- マスク：イシュアのホスト名。
- 代替テキスト：`Authentication — enable authentication and complete the core settings`

2026-08-25をキャプチャ。 空のキャンバスをドロップするために切り抜きました。マスクは不要です。理由
**[!UICONTROL Issuer]**&#x200B;は製品の`https://auth.example.com`に設定され、
キャプチャ。 後で画像を編集するよりも優先できます。 **[!UICONTROL 個のスコープがサポートされています]**件の保持
1つの範囲（`read:all`）。2つの値の方がフィールドを示しますが、これは値がありません
独自に再キャプチャします。

### `auth-per-action.png`

- 状態：**[!UICONTROL 認証を有効にした後のアクションごとの設定]**。モードは意図的に混在しています。
- 含める：少なくとも3つのアクション（モードごとに1つ） — **[!UICONTROL なし]**、**[!UICONTROL 必須]**、**[!UICONTROL オプション]** – およびゲーテッドアクションに入力された&#x200B;**[!UICONTROL スコープ]**&#x200B;列。
- 含める：**[!UICONTROL すべてのアクションに対して認証を要求]**。理想的には、混在設定が生成する不確定状態です。
- フィックスアクション名のみを使用します。
- 代替テキスト：`Authentication — set an auth mode and scopes for each action`

2026-08-25をキャプチャ。 切り抜きのみで、マスクするものはありません。 3つのモードをすべて表示します。入力された
**[!UICONTROL スコープ]**&#x200B;のセルと&#x200B;**[!UICONTROL すべてのアクションに対する認証を要求]**の
状態は不定で、`Test Action 1/2/3`がフィクスチャ名として使用されます。

設定パネルの独自のコンテナ境界の&#x200B;**内側**を切り抜きます。各コンテナには、フルハイトの1 px ルールが適用されます
キャプチャの側面で、フレーム内に一方を残すと、の端に迷路として読み込まれます。
画像：

コネクタごとの認証を適用する[!DNL Claude]に関する製品独自の警告は次のとおりです
**2回のキャプチャラウンド**でこのタブでは観察されないため、ここでは必須ではありません。  
ガイドでは、代わりにproseで動作すると述べています。 警告が後のビルドに存在する場合は、
`auth-claude-warning.png`としてキャプチャし、エントリを追加します。

### `chatgpt-authentication-mode.png`

- 状態：**[!UICONTROL 認証]** ドロップダウンが開いた&#x200B;**[!UICONTROL 新しいプラグイン]** ダイアログ。
- 次の3つの値をすべて含めます：**[!UICONTROL No Auth]**、**[!UICONTROL Mixed]**、**[!UICONTROL OAuth]**。したがって、ガイド内のマッピングテーブルは実際のコントロールに対してチェックできます。
- マスク：MCP サーバーのURLと、ブラウザーのURL内のコネクタ識別子。
- 代替テキスト：`ChatGPT — select the authentication mode for the plugin`

オンボーディングガイドの`chatgpt-new-plugin.png`と同じ方法で作成します。ダイアログカードには
ページの余白は引き続きその周りに表示され、左と上がおよそ40 px表示されます。 フラッシュをトリミングしない
カード。

2026-08-25のライトモードをキャプチャして、ドキュメント内の他のすべてのキャプチャと一致させます。  
ドロップダウンには**[!UICONTROL サーバーURL]** フィールドが含まれているので、MCP URLは読み取れませんが
その半透明の素材は、そのフィールドのコンテンツのぼやけた画像を、そのフィールドのコンテンツの横に染み込ませます
オプション： ハイライト表示されていない3つの行は、パネルの塗りつぶしとラベルで再描画されました
再レンダリングされ、削除されます。 目ではなくサンプリングで確認する：出血が十分に弱い
missはMCP サーバーのURLです。

ライブコントロールは&#x200B;**4**&#x200B;個の値を提供しています – **[!UICONTROL OAuth]**、**[!UICONTROL アクセス
トークン / API キー]**、**[!UICONTROL 認証なし]**、**[!UICONTROL 混在]**。 ガイドのマッピング
表は、アプリの認証モードがマッピングできる3つのみをカバーしていますが、正しくありません
ドロップダウンには3つのオプションがあると説明します。

## オプションのキャプチャ

散文が不十分であることが証明された場合にのみ追加します。

- `auth-scope-blocked.png` — **[!UICONTROL 保存]**&#x200B;がブロックされました。アクションには&#x200B;**[!UICONTROL スコープがサポートされていないため、]**&#x200B;のスコープが必要です。 トラブルシューティングのエントリに役立ちます。
- 会話の途中のサインインプロンプト「**[!UICONTROL オプション]**」アクションが発生します。 プラットフォームが所有するUIは頻繁に変更され、既に散文で説明されています。

ID プロバイダー独自のサインインページを取得しないでください。 このドキュメントでは言及していないベンダーを特定します。
