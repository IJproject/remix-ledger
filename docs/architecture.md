# アーキテクチャ

## 層と依存の向き

関数型ドメインモデリング（FDDD）の考え方で、業務のルールを `app/domain/` に閉じ込める。依存は外側から内側への一方向にする。

| 層 | 置くもの | import してよい相手 |
|---|---|---|
| `app/domain/` | 業務の語彙とルール。純粋な型と関数だけ | `app/domain/` の中だけ（Remix・DB・UI は import しない） |
| `app/external/` | 外部サービス（DB など）とのやり取り。ドメインが定めたポートを満たす実装（アダプタ） | `app/domain/`、外部ライブラリ |
| `app/actions/` | HTTP（フォーム）とドメインの変換、ワークフロー・クエリへのアダプタの注入、画面 | すべて |

- controller はアダプタを直接呼ばない。読み取りもクエリ（`query/`）にアダプタを注入して呼ぶ
- 境界の変換は外側の層が持つ。DB の行 → ドメインの型はアダプタ、フォームの値 → ドメインの入力は controller が行う
- 値が正しいかの判定（`AccountCode.create` など）はドメインの関数を呼ぶ。外側の層でルールを書かない

## ディレクトリ構成

機能を足してもこの図を書き換えずに済むよう、個別の機能名は並べず `<concept>` などのパターンで書く。具体例は、見本の実装である勘定科目（`account`）だけを挙げる。

```
app/
├─ routes.ts                  ルートの定義。サーバーとブラウザの両方から使い、型付きの href を作る
├─ router.ts                  ミドルウェアの設定と、ルートと controller の対応づけ
├─ assets.ts                  ブラウザ用 JS/CSS の配信設定
├─ domain/
│  ├─ building-blocks.ts      Primitive（ブランド型）、Result、State（ワークフローの状態）、NonEmptyArray
│  └─ <concept>/              概念ごと（例: account）
│     ├─ port.ts              外部とのやり取りの型（ポート）
│     ├─ model/
│     │  ├─ primitive.ts      値オブジェクト（create で検証して作る）
│     │  └─ entity.ts         エンティティ
│     ├─ workflow/            状態を変える処理。ワークフローごとに1ファイル（例: register-account.ts）
│     │  ├─ common.ts         複数のワークフローで共有する状態（未検証→検証済み）とステップ
│     │  └─ <workflow>.ts     ポートを受け取って動くワークフロー
│     └─ query/               状態を変えずに読む処理。クエリごとに1ファイル（例: query-accounts.ts）
│        └─ <query>.ts        ポートを受け取って動くクエリ
├─ external/
│  └─ db/
│     ├─ client.ts            PostgreSQL への接続と、起動時のマイグレーション
│     ├─ tables.ts            data-table のテーブル定義（概念をまたいで共有）
│     ├─ adapters/<concept>.ts  ポートの実装。DB の行をドメインの型に変換する
│     ├─ migrations/          SQL のマイグレーション
│     ├─ seed.sql             開発用の動作確認データ
│     └─ docker-init/         コンテナ初回起動時の SQL（テスト用 DB の作成）
├─ actions/
│  ├─ controller.tsx          トップレベルのルートの処理
│  ├─ document.tsx            全ページ共通の HTML の外枠（<head> とブラウザ用 JS の読み込み）
│  ├─ home-page.tsx           ホーム画面（スターターのまま）
│  ├─ public/                 ブラウザで動くコードの入口
│  ├─ <route-key>/            ルートのまとまりごとの controller・画面・テスト
│  └─ settings/               マスタメンテナンス画面（/settings/<resource>）
│     ├─ settings-layout.tsx  設定画面の共通レイアウト
│     └─ <resource>/          マスタごとの controller・画面・テスト（例: accounts/）
├─ styles/app.css             Tailwind の入力ファイル（public/app.css に書き出す）
├─ middleware/database.ts     DB を context.db として渡す
├─ lib/                       ドメインに依存しない汎用コード
└─ components/                ドメインに依存しない共通 UI
public/                       そのまま配信する静的ファイル
compose.yaml                  開発・テスト用の PostgreSQL（ledger / ledger_test、ポート 54320）
test-setup.ts                 テスト開始時にテスト用 DB へマイグレーションを流す
```

## 決めごと

- ブラウザで動くコードと、そこから import するものは、すべて `public/` という名前のディレクトリの下に置く（`app/assets.ts` の `allowFiles` で、それ以外はブラウザに配信されない）
- ワークフローの状態（例: `ValidatedAccount`）は `State<'Tag', {...}>` で定義する。TypeScript は形が同じなら代入できてしまう（構造的部分型）ので、名前を付けて別物にする。キーの symbol を export していないため、オブジェクトリテラルでは作れない。作るのは、その状態に進めるステップ（例: `validateAccount`）の中の `as` だけにする。オブジェクトに `Primitive` を使わないのは、`__brand` が普通の文字列キーで、リテラルで偽造できてしまうため
- ワークフローの失敗は `NonEmptyArray<...Error>` で返す（理由のない失敗を型で作れなくする）
- スキーマの変更は、番号付きのマイグレーション（`app/external/db/migrations/<番号>_<name>/up.sql` と `down.sql`）を新しく足す。適用済みのマイグレーションは書き換えない
- 列を足したら、マイグレーションと `tables.ts` の両方を直す（自動では同期しない）
- スタイルは Tailwind のクラスで書く。`public/app.css` は Tailwind CLI の生成物（git 管理外）なので直接編集しない。`app/styles/app.css` でレイヤー順を宣言しており、Tailwind のユーティリティは Remix の `css()` より優先される
- テストは `NODE_ENV=test` で `TEST_DATABASE_URL`（`ledger_test`）に接続する。開発用 DB には触れない

## 機能を追加するとき

勘定科目（`account`）の実装を見本にする。

1. `app/domain/<concept>/` に primitive・entity・port・workflow・query とテストを書く
2. テーブルが要るなら、マイグレーションと `app/external/db/tables.ts` を足す
3. `app/external/db/adapters/<concept>.ts` にポートの実装を書く
4. `app/routes.ts` にルートを足し、`app/actions/<route-key>/controller.tsx` を作って `app/router.ts` で `router.map()` する
5. 画面は `app/actions/<route-key>/` に置く。複数の画面で使う、ドメインに依存しない UI は `app/components/` に置く
6. controller のテストは `router.fetch` でミドルウェアごと動かして書く
