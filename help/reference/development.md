---
title: ローカルハンドラーの開発とテスト
description: Adobe LLM アプリのプロジェクト構造、ローカルサーバーコマンド、MCP テスト、単体テストを処理します。
source-git-commit: eec74b87457bc852d7a8dd0e46c2a4385a93ae0a
workflow-type: tm+mt
source-wordcount: '280'
ht-degree: 2%

---


# ローカルハンドラーの開発とテスト {#development}

>[!IMPORTANT]
>
>[!DNL Adobe LLM Apps]は現在Betaにいます。
>
>ここに示す機能、ワークフロー、UIは、必ずしも製品の最終状態を表すものではありません。 Betaに参加するには、llm-apps-beta@adobe.comに電子メールを送信します。

この参照は、ハンドラーをローカルで開発する際に使用します。 ハンドラー結果コントラクトについては、[生成されたハンドラーのカスタマイズ &#x200B;](/help/guides/customize-handler.md)を参照してください。

## 要件

- Node.js 24以降。
- npm:
- リンクされたハンドラーリポジトリのローカルクローン。

## プロジェクト構造

リンクされたリポジトリは、次のレイアウトに従います。

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

- **`entry.js`**&#x200B;はwebpack エントリポイントです。 ビルド時には、すべての`actions/*/index.js` ファイルが検出され、1つの`dist/index.js`にバンドルされます。 修正しないでください。
- **`actions.json`**&#x200B;は許可されています。 デプロイメントパイプラインは、[!DNL LLM Apps]のアクションメタデータから自動的に書き込みます。
- **テスト**&#x200B;は、`actions/`内の`test/actions/`、**ではなく**&#x200B;に存在します。 Webpackは`actions/`以下のすべての要素をデプロイ済みのアーティファクトにバンドルします。テストを共同で配置すると、[!DNL Adobe I/O Runtime]に送信されます。

## ローカル開発

Adobeの資格情報を使用せずに、ローカルでハンドラーを開発およびテストできます。

```bash
npm install
npm run dev:local
```

これにより、webpackでプロジェクトが構築され、`http://localhost:9080`にプレーン Node.js HTTP サーバーが開始されます。 サーバーは`actions/`の下にあるハンドラーファイルを自動検出し、MCP ツールとして登録します。

### ローカルメタデータの動作

現在のUIには`actions.json` ダウンロードが提供されていません。 このファイルを使用せずにローカルサーバーを実行できます。`actions/`以下のハンドラーを検出し、最小限のメタデータで登録します。

`actions.json`がない場合、UI入力スキーマに対してローカル アクション引数は検証されません。 単体テストと統合テストでは、代表的なメタデータに`test/fixtures/actions.json`を使用します。

### curlでテスト

```bash
# List all registered tools
curl -sX POST "http://localhost:9080" \
  -H 'content-type: application/json' \
  -H 'accept: application/json;q=1.0, text/event-stream;q=0.5' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Call the boilerplate echo action
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

ハンドラー単体テストは`test/actions/`の下にあり、`actions/` レイアウトをミラーリングします。

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
npm test                                      # all tests
npx jest test/actions/echo                   # one action only
```

ローカルテストが合格したら、変更をプッシュして[変更をデプロイ &#x200B;](/help/guides/deploy-your-app.md)します。

