---
title: ローカルハンドラーの開発とテスト
description: Adobe LLM アプリのプロジェクト構造、ローカルサーバーコマンド、MCP テスト、単体テストを処理します。
source-git-commit: 0f9dd0a5b1008e183eb8ab5a4c2eae34a78923bb
workflow-type: tm+mt
source-wordcount: '664'
ht-degree: 0%
---

# ローカルハンドラーの開発とテスト {#development}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

この参照は、ハンドラーをローカルで開発する際に使用します。 ハンドラー結果コントラクトについては、[生成されたハンドラーのカスタマイズ ](/help/guides/customize-handler.md)を参照してください。

## 要件

- Node.js 24以降。
- npm:
- リンクされたハンドラーリポジトリのローカルクローン。

Adobe Managed Infrastructureの場合は、このリファレンスに従う前にリポジトリアクセスをリクエストしてください。 ローカルハンドラーの実行にはAdobeの資格情報は必要ありませんが、保護されたアップストリームサービスには、独自の承認済みアクセスが必要です。

## プロジェクト構造

現在のハンドラーボイラープレートは、次のレイアウトに従います。

```
your-llm-app/
├── entry.js                   # Webpack entry — do not modify
├── actions/                   # One folder per action
│   └── echo/
│       └── index.js           # Example handler
├── test/
│   ├── actions/
│   │   └── echo.test.js
│   ├── fixtures/
│   │   └── actions.json
│   ├── html-transform.js
│   ├── jest.setup.js
│   └── server.test.js
├── server/
│   └── local.js               # Local dev server (port 9080)
├── actions.json               # Gitignored — optional local metadata
├── app.config.yaml            # Adobe I/O Runtime config
├── webpack.config.js
└── package.json
```

重要なポイント：

- **`entry.js`**&#x200B;はwebpack エントリポイントです。 ビルド時に、すべての`actions/*/index.js` ファイルが検出され、1つの`dist/index.js`にバンドルされます。 エントリポイントは変更しないでください。
- **`actions.json`**&#x200B;は許可されています。 デプロイメントパイプラインは、[!DNL LLM Apps]のアクションメタデータから自動的に書き込みます。
- **テスト**&#x200B;は、`actions/`内の`test/actions/`、**ではなく**&#x200B;に存在します。 ビルドはハンドラーのエントリポイントを検出し、そのインポートをバンドルします。その検出ツリーの外にテストを保持します。
- **アクションパス**&#x200B;は、コード識別子またはそのハイフネーション付きフォームを使用します。 例えば、`search_products`は`actions/search_products/index.js`に解決されるか、生成されたコードの場合は`actions/search-products/index.js`に解決されます。 表示名がルックアップキーではありません。
- **生成された`data.json`などのサポートデータ**&#x200B;は、ハンドラーが読み込むときにバンドルされます。

## ローカル開発

Adobe資格情報を使用せずにローカルでハンドラーを開発およびテストするには、次を実行します。

```bash
npm install
npm run dev:local
```

開発コマンドは、webpackを使用してプロジェクトを構築し、`http://localhost:9080`にプレーン Node.js HTTP サーバーを起動します。 ハンドラーまたはローカル メタデータの変更後に`npm run dev:local`を停止して再実行します。コマンドはファイルを監視しません。

別のポートを使用するには：

```bash
PORT=9081 npm run dev:local
```

### ローカルメタデータの動作

ボイラープレート READMEとランタイム スタートアップ バナーが言及されていても、現在のUIでは`actions.json` ダウンロードは提供されません。 ローカルサーバーも入力されたファイルなしで開始します。ビルドは、ファイルが見つからないときに`{"actions":[]}`を作成し、ランタイムはハンドラー検出にフォールバックします。

検出はハンドラーのリスト作成には便利ですが、完全な引数テストモードではありません。 入力スキーマがない場合、MCP SDKは、通常の`(args, extra)`署名を使用する代わりに、ランタイムコンテキストを最初の引数としてハンドラーを呼び出します。 SDKは、指定されたアクション引数を転送しません。

引数を含むMCP呼び出しの場合は、アクションエディターに一致する代表メタデータを含む&#x200B;**ローカルのみ** `actions.json`を作成します。 ボイラープレート `echo` ハンドラーの場合：

```json
{
  "actions": [
    {
      "name": "echo",
      "description": "Echo the supplied message.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "message": { "type": "string" }
        },
        "required": ["message"]
      }
    }
  ]
}
```

`actions`配列が空でない場合、ランタイムは配列にという名前のアクションのみを登録します。 各アクションのコード IDを`name`として使用します。 パラメーターを持たないアクションでも、通常のハンドラー署名を保持するために`"properties": {}`を持つオブジェクトスキーマが必要です。

ローカルメタデータは、UIまたはデプロイメント設定を更新しません。 ランタイムは、サポートされているタイプ、必須フィールド、列挙、配列項目を検証しますが、すべてのJSON スキーマ制約を検証するわけではありません。ハンドラーの長さ、範囲、ネストされたオブジェクト、およびビジネスルールを検証します。 ボイラープレート統合テストでは、`test/fixtures/actions.json`を代表的なメタデータとして使用します。

### ローカルアプリ変数

アプリ変数は`process.env`ではなく`extra.variables`を通じてハンドラーに到達します。 `@adobe/llm-apps-runtime`の`getVariable(extra, name)`で読み上げます。 ビルド後に機密性のない設定をシミュレートするには：

```bash
npm run build
node server/local.js \
  --param 'LLMA_VARIABLE_NAMES=["GREETING_PREFIX"]' \
  --param GREETING_PREFIX=Howdy
```

JSON マニフェストと名前付き値の両方を指定します。 通常の`(args, extra)`契約をテストする際に、入力スキーマを使用してローカル `actions.json`にハンドラーを含めます。 コマンドラインフラグは、プラットフォームからアプリ設定を読み込みません。 環境固有のデプロイメント設定については、[ アプリ変数とシークレットの設定](/help/guides/app-variables.md)を参照してください。

### curlでテスト

上記のローカル `echo` メタデータを追加したら、サーバーをビルドして起動し、次を実行します。

```bash
# List all registered tools
curl -sX POST "http://localhost:9080" \
  -H 'content-type: application/json' \
  -H 'accept: application/json;q=1.0, text/event-stream;q=0.5' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Call the boilerplate echo action (returns "Echo: hello")
curl -sX POST "http://localhost:9080" \
  -H 'content-type: application/json' \
  -H 'accept: application/json;q=1.0, text/event-stream;q=0.5' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"echo","arguments":{"message":"hello"}}}'
```

### MCP Inspectorを使用したテスト

```bash
npx @modelcontextprotocol/inspector
```

**Transport Type**&#x200B;を`streamable-http`に、**URL**&#x200B;を`http://localhost:9080`に設定します。

## テスト

ハンドラー単体テストは`test/actions/`の下に存在し、MCP スキーマ検証なしで、書き出された関数を直接呼び出します。

```javascript
// test/actions/echo.test.js
const handler = require('../../actions/echo/index.js')

test('echoes the message', async () => {
  const result = await handler({ message: 'hello' })
  expect(result.content[0].text).toBe('Echo: hello')
})

test('always returns content parts', async () => {
  const result = await handler({})
  expect(Array.isArray(result.content)).toBe(true)
})
```

次を使用してテストを実行：

```bash
npm test                                 # configured Jest suite
npm test -- --runInBand test/actions/echo.test.js  # one boilerplate action
```

生成されたテストの中には、Jestの代わりにNodeの組み込みのテストランナーを使用するものもあります。 テストのインポートを確認し、一致するランナー（例：`node --test test/actions/search-products.test.js`）を`node:test`をインポートするファイルに使用します。 ファイルを`test/actions/`の下に配置した後、生成された相対インポートを確認します。

単体テストだけでは、メタデータ、MCP検証、ウィジェットの読み込み、ホストの動作は検証されません。 代表的なメタデータを使用してローカルエンドポイントをテストし、サポートされているLLM プラットフォームでデプロイされたアプリをテストします。

ローカルテストが合格したら、変更をプッシュして[変更をデプロイ ](/help/guides/deploy-your-app.md)します。
