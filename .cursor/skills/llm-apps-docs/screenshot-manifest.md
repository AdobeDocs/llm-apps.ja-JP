---
source-git-commit: bb3d8a02f22a91ceeeba5999453aeb4221060f80
workflow-type: tm+mt
source-wordcount: '398'
ht-degree: 0%

---
# オンボーディングスクリーンショットマニフェスト

受信トレイをキャプチャ：`docs-captures/<YYYY-MM-DD>/`

出力ディレクトリ：`help/assets/guide-onboarding-agent/`

利用者の意思決定やステータスの検証に役立つチェックポイントのみを取得します。

Sourceのファイル名は、最終的なファイル名と一致する必要はありません。 スキルマップは、表示されるUIの状態によってスクリーンショットをマッピングし、未加工ファイルを保持し、以下の名前を使用してサニタイズされたコピーを作成します。

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
- 含める：**追加 <plugin> ChatGPT &#x200B;** および **&#x200B; Connect &#x200B;** に送信します。
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
