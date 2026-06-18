---
title: Adobe LLM アプリの開発
description: Adobe LLM Apps ハンドラーコードのプロジェクト構造、ローカル開発ワークフロー、テスト設定。
source-git-commit: 51ffb31eec82f9639bd7ade9052d61028c262d0e
workflow-type: tm+mt
source-wordcount: '318'
ht-degree: 4%

---


# 開発 {#development}

>[!IMPORTANT]
>
>**免責事項：**&#x200B;これは[!DNL LLM Apps]のベータ版リリースです。 ここに示す機能、ワークフロー、UIは、必ずしもアプリケーションまたは製品の最終状態を表すものではありません。

この節では、ハンドラープロジェクトの構造、ローカル開発ワークフロー、テスト設定について説明します。 ハンドラー契約とサンプルコードについては、[ アクションハンドラーの記述](/help/guides/write-action-handler.md)を参照してください。

## プロジェクト構造

リンクされたリポジトリは、次のレイアウトに従います。

```
your-llm-app/
├── entry.js                   # Webpack entry — do not modify
├── actions/                   # One folder per action
│   ├── search-products/
│   │   └── index.js           # Handler (async function)
│   ├── get-product-details/
│   │   └── index.js
│   └── echo/
│       └── index.js
├── test/
│   ├── actions/
│   │   └── search-products.test.js
│   ├── fixtures/
│   │   └── actions.json
│   ├── html-transform.js
│   ├── jest.setup.js
│   └── server.test.js
├── server/
│   └── local.js               # Local dev server (port 9080)
├── actions.json               # Gitignored — local copy of UI metadata
├── app.config.yaml            # Adobe I/O Runtime config
├── webpack.config.js
└── package.json
```

重要なポイント：

- **`entry.js`**&#x200B;はwebpack エントリポイントです。 ビルド時には、すべての`actions/*/index.js` ファイルが検出され、1つの`dist/index.js`にバンドルされます。 修正しないでください。
- **`actions.json`**&#x200B;は許可されています。 ローカル開発用にUIの「アクション」ページからダウンロードします。 デプロイメントの場合、パイプラインはAPIから自動的に書き込みます。
- **テスト**&#x200B;は、`actions/`内の`test/actions/`、**ではなく**&#x200B;に存在します。 Webpackは`actions/`以下のすべての要素をデプロイ済みのアーティファクトにバンドルします。テストを共同で配置すると、[!DNL Adobe I/O Runtime]に送信されます。

## ローカル開発

Adobeの資格情報を使用せずに、ローカルでハンドラーを開発およびテストできます。

```bash
npm install
npm run dev:local
```

これにより、webpackでプロジェクトが構築され、`http://localhost:9080`にプレーン Node.js HTTP サーバーが開始されます。 サーバーは`actions/`の下にあるハンドラーファイルを自動検出し、MCP ツールとして登録します。

### `actions.json`をダウンロード

ローカルサーバーがアクションメタデータ（名前、説明、入力スキーマ）について把握するには、[!DNL LLM Apps] UIのアクションページから`actions.json`をダウンロードし、リポジトリルートに配置します。 これを使用しない場合、サーバーはハンドラーを検出しますが、最小限のメタデータで登録します。

`actions.example.json`を開始点として`actions.json`にコピーすることもできます。

### curlでテスト

```bash
# List all registered tools
curl -sX POST "http://localhost:9080" \
  -H 'content-type: application/json' \
  -H 'accept: application/json;q=1.0, text/event-stream;q=0.5' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Call the search-products action
curl -sX POST "http://localhost:9080" \
  -H 'content-type: application/json' \
  -H 'accept: application/json;q=1.0, text/event-stream;q=0.5' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search-products","arguments":{"category":"bagged-coffee"}}}'
```

### MCP Inspectorを使用したテスト

```bash
npx @modelcontextprotocol/inspector
```

**Transport Type**&#x200B;を`streamable-http`に、**URL**&#x200B;を`http://localhost:9080`に設定します。

## テスト

ハンドラー単体テストは`test/actions/`の下にあり、`actions/` レイアウトをミラーリングします。

```javascript
// test/actions/search-products.test.js
const handler = require('../../actions/search-products/index.js')

test('returns all products when no filter is given', async () => {
  const result = await handler({})
  expect(result.content[0].text).toContain('product')
  expect(result.structuredContent.products.length).toBeGreaterThan(0)
})

test('filters by category', async () => {
  const result = await handler({ category: 'bagged-coffee' })
  expect(result.structuredContent.products.every(
    (p) => p.category === 'bagged-coffee'
  )).toBe(true)
})

test('filters by query', async () => {
  const result = await handler({ query: 'dark-roast' })
  expect(result.structuredContent.products.length).toBeGreaterThan(0)
})

test('returns empty result for unknown category', async () => {
  const result = await handler({ category: 'nonexistent' })
  expect(result.structuredContent.products).toHaveLength(0)
})
```

次を使用してテストを実行：

```bash
npm test                                      # all tests
npx jest test/actions/search-products        # one action only
```

## デプロイメント

手動でビルドまたはデプロイすることはありません。 デプロイメントパイプラインの完全なチュートリアルについては、[ アプリのデプロイ ](/help/guides/deploy-your-app.md)を参照してください。

日々のワークフローは次のとおりです。

| ステップ | アクション |
|------|--------|
| &#x200B;1. ハンドラーの書き込みまたは編集 | `actions/<name>/index.js` |
| &#x200B;2. メタデータのダウンロード | アクションページ → **actions.jsonをダウンロード** |
| &#x200B;3. ローカルにテスト | `npm run dev:local` |
| &#x200B;4. プッシュコード | `git push` |
| &#x200B;5. デプロイ | アプリの詳細ページ → **[!UICONTROL デプロイ]** |

