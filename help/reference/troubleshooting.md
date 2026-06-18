---
title: Adobe LLM アプリのトラブルシューティング
description: Adobe LLM アプリの構築、デプロイ、およびテスト時の一般的な問題に対するソリューション。
source-git-commit: 98d5590c927bf8ffad54061ee027664452c129c1
workflow-type: tm+mt
source-wordcount: '439'
ht-degree: 0%

---


# トラブルシューティング {#troubleshooting}

>[!IMPORTANT]
>
>**免責事項：**&#x200B;これは[!DNL LLM Apps]のベータ版リリースです。 ここに示す機能、ワークフロー、UIは、必ずしもアプリケーションまたは製品の最終状態を表すものではありません。

## 一般的な問題

| 症状 | 考えられる原因 | 体験する施策 |
|---------|----------------|-------------|
| アプリがLLM プラットフォームに表示されない | LLM プラットフォームのサブスクリプションでカスタム MCP アプリがサポートされていないか、開発者モードが有効になっていません | プランがカスタム MCP アプリをサポートしていることを確認します。 **アプリの設定→詳細設定**&#x200B;で開発者モード→有効にする |
| LLM プラットフォームの「接続できませんでした」エラー | MCP サーバーのURLが正しくないか、展開に失敗しました | アプリの詳細ページからURLを再確認します。 エラーのデプロイメント履歴を確認する |
| アクションは呼び出されません | LLM プラットフォームは、ユーザーの質問とアクションを一致させることができませんでした | `@YourApp`を使用して明示的に呼び出します。 アクションの説明を改善して、モデルが意図に一致するようにします |
| Widgetがレンダリングされない | EDS ウィジェット URLまたはCSP ドメインが正しく設定されていない | アクションを作成ダイアログで、スクリプト URLとウィジェットの埋め込みURLを確認します。 CSP リソースと接続ドメインにEDS オリジンが含まれていることを確認します |
| 空またはエラーの応答 | ハンドラーにバグがあるか、見つかりません | 最初に`npm start`を使用してローカルでテストします。 [ローカル開発](/help/reference/development.md#local-development)を参照 |
| ウィジェットは読み込まれますが、データは表示されません | `structuredContent` シェイプがブロックの期待値と一致しません | ブロックの`decorate`関数に`bridge.toolResult`を記録し、ハンドラー出力と比較します |
| 「クローンとビルド」でデプロイメントが失敗する | リポジトリ内の`npm install`またはwebpack ビルドエラー | `npm install && npm run build`をローカルで実行して、エラーを再現します |
| 「資格情報の収集」でデプロイメントが失敗する | リポジトリがリンクされていないか、Developer Console プロジェクトが正しく設定されていない | アプリの詳細設定ページでリポジトリがリンクされていることを確認します |
| ウィジェット読み込み時のCORS エラー | EDS サイトに`access-control-allow-origin` ヘッダーがありません | `admin.hlx.page`を介したCORS ヘッダーの設定 |
| CORS ヘッダーを保存すると、HTTP ヘッダーエディターが`404 Error updating config: config not found`を返します | サイト設定に`headers` セクションがありません | 以下の「[EDS サイト設定ヘッダーの初期化」セクション ](#initialize-the-eds-site-config-headers-section)を参照してください |
| ウィジェットはプレビューでレンダリングされますが、LLM プラットフォームではレンダリングされません | ブロックはプレビューモードでサンプルデータにフォールバックしますが、ライブデータでは失敗します | MCP インスペクターまたはcurlを使用して、実際の`structuredContent`でテストします |

## EDS サイト設定ヘッダーセクションの初期化

HTTP ヘッダーエディターが`404 Error updating config: config not found`を返す場合、サイト設定に`headers` セクションがありません。 手動で修正する：

1. [tools.aem.live/tools/headers-edit/index.html](https://tools.aem.live/tools/headers-edit/index.html)に移動し、組織とサイトを入力して、**[!UICONTROL Fetch]**&#x200B;をクリックします。
2. ブラウザーの開発ツール （ネットワーク タブ）を開き、Fetch リクエストから`x-auth-token` ヘッダーの値をコピーします。
3. 現在のサイト設定を取得します。

   ```bash
   curl -H "x-auth-token: $TOKEN" \
     https://admin.hlx.page/config/<your-github-org>/sites/<your-eds-repo>.json > config.json
   ```

4. `config.json`を開き、`"headers": {}`をJSON オブジェクトに追加します。
5. 更新した設定をPOSTして戻します。

   ```bash
   curl -X POST \
     -H "x-auth-token: $TOKEN" \
     -H "Content-Type: application/json" \
     -d @config.json \
     "https://admin.hlx.page/config/<your-github-org>/sites/<your-eds-repo>.json"
   ```

6. ヘッダーエディターをリロードし、`Access-Control-Allow-Origin` ヘッダーを通常どおりに保存します。

