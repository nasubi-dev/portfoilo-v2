# ポートフォリオを AI ネイティブに作り直す設計と、今のものの流用

Linear: [NAS-114](https://linear.app/nasubi/issue/NAS-114)（2026-11-23 調査）

AI（NAS-115 の bot）が記事を足し、本人がスマホでプレビューを見て、承認したら公開する。この流れを手間なく回すための案と、今のリポジトリをどこまで流用するかをまとめる。

## 今の公開の流れ

1. `src/content/` を Obsidian の vault として開いて書く
2. 画像・動画は Remotely Save で R2（`content.nasubi.dev/assets/`）に同期する。リポジトリには入れない（`src/content/assets` は `.gitignore`）
3. Obsidian の Shell Commands で main にコミットして push する（`Sync:<日時>` のコミット）
4. Cloudflare Pages（プロジェクト `portfoilo-v2`）の Git 連携が main をビルドして公開する

Cloudflare Pages の Git 連携は、main 以外のブランチもプレビューとして配る。main のコミットにも `Cloudflare Pages` のチェックが付き、`https://<ハッシュ>.portfoilo-v2.pages.dev` のプレビュー URL が出ている。この PR のブランチでも出るか確かめた（結果は末尾）。

## 公開までの流れの案

| 案 | 追加 | 下書き | プレビュー | 承認と公開 | 手間 | 確実さ |
|---|---|---|---|---|---|---|
| A. ブランチと PR | bot がブランチを切って記事を足し、PR を出す | ブランチそのもの | PR に Cloudflare Pages のプレビュー URL が付く。スマホで開ける | GitHub のアプリで PR をマージ | 少ない。新しく作るのは bot だけ | 高い。ビルドが落ちれば PR のチェックが赤くなり、main は壊れない |
| B. Obsidian の CMS フォルダ | bot が本人の Obsidian のフォルダ（main の作業ツリー）に `.md` を置く | `draft: true` を足す | 手元の `astro dev` か、draft を出すプレビュー用ビルドを別に用意 | 本人が draft を外し、Shell Commands で push | 多い。プレビューの仕組みを別に作る。PC が要る | 中。本人の未 push の変更と bot の書き込みがぶつかる |
| C. main に draft で直接 | bot が main に `draft: true` で push | `draft` の項目 | 本番には出さず、draft も出すプレビュー用の環境（環境変数で切り替え）を作る | bot か本人が `draft: false` にして push | 中。承認のたびにコミットが要る | 低い。bot が main に書く権限を持ち、ビルドが落ちると本番が止まる |
| D. A に Linear の承認を足す | A と同じ。PR を Linear のイシューに付ける | ブランチ | A と同じ | Linear で「OK」とコメントすると bot がマージ | A より多い。コメントを読んでマージする仕組みが要る | A と同じだが、bot にマージ権限が要る |

どの案でも、リポジトリが public なので下書きは GitHub 上で誰でも読める。pages.dev のプレビュー URL も URL を知っていれば誰でも開ける。気になるなら Cloudflare Access でプレビューに鍵をかけるか、リポジトリを private にする。

## 推す案: A（ブランチと PR）

承認がマージ 1 回で済み、プレビューは今の Cloudflare Pages の機能だけで出る。bot に main へ書く権限も、マージの権限も渡さなくてよい。Linear から見たいときは、shouka と同じく PR をイシューに付ければ足りる（D のように Linear から承認する仕組みは、A で回してみて不便だったら足す）。

流れ:

1. bot が `post/<slug>` のブランチを切り、`src/content/posts/<タイトル>.md` を足して PR を出す。画像は R2 に上げてから `![[ファイル名]]` で参照する
2. Cloudflare Pages がブランチをビルドし、PR のチェックにプレビュー URL が出る。ブランチ名の別名（`<ブランチ名>.portfoilo-v2.pages.dev`、`/` は `-` になる）でも開ける
3. 本人がスマホでプレビューを読み、直したいところは PR にコメントする。bot が同じブランチに直しを積む
4. GitHub のアプリでマージすると本番に出る

### 要るもの

- **スキーマ**: 変えなくても回る。ただし bot が `id`（21 文字の英数字とハイフン）を作れるようにする（nanoid など）。日付は `+09:00` 付きで書く決まりにし、スキーマでも `+09:00` か `Z` が無いものを弾く。今も `updatedAt` が 2 本タイムゾーン無しで、ビルドする機械の時刻（Cloudflare では UTC）で読まれて 9 時間ずれる。`draft` は A では要らない
- **CI**: Cloudflare Pages のビルドが PR のチェックになるので、新しく足さなくてよい。bot が PR を出す前に手元で `bun run build` を通す
- **Cloudflare Pages の設定**: プレビューのデプロイが「すべてのブランチ」になっているか、ダッシュボードで確かめる（今の動きからは有効に見える）
- **bot の権限**:
  - GitHub: このリポジトリだけに絞った fine-grained token（Contents と Pull requests の読み書き）。マージはしないので、main を branch protection で PR 必須にしてもよい
  - R2: 画像を上げるため、バケットを絞った R2 の API トークン（Object Read & Write）
  - どちらも 1Password に置き、`op run` で渡す
- **本人の Obsidian との共存**: bot の PR がマージされると main が進む。Shell Commands の push の前に `git pull --rebase` を入れる

## 部品ごとの流用

| 部品 | 判断 | 理由 |
|---|---|---|
| スキーマ（`src/content.config.ts`） | 流用 | そのままで A は回る。日付のタイムゾーンの検査だけ足す |
| 記事 6 本・products 8 本・about | 流用 | どのバージョンでもそのままビルドが通る |
| Markdown の拡張（リンクカード、WikiLink、見出しのリンク） | 流用（書き方を直す） | Astro 7 でも出力は同じ。Astro 7 では `@astrojs/markdown-remark` を足す必要があり、`markdown.remarkPlugins` の書き方は非推奨になったので `unified({...})` に移す |
| デザイン（Panda CSS 0.53、Ark UI） | 流用（Panda は 0.53 のまま） | Panda 2 に上げると `{ base, md }` のレスポンシブ指定が効かなくなる警告が 11 件出て、CSS が 48K から 32K に減る。Panda 2 への移行は作り直しとは別のイシューにする |
| 検索（pagefind） | 流用 | 1.6 で通る。今はヘッダーやフッターも索引に入るので、本文に `data-pagefind-body` を付ける |
| OGP | 作り直す | `og:image` が SVG で、X や Facebook は SVG を表示しない。`functions/posts/_middleware.ts`（vercel-og、タイトルの `div` だけ）と `src/pages/api/ogp/[slug].ts`（SVG）の 2 つが並んでいる。`og:description` も全ページがサイトの説明文。ビルド時に PNG を作る形（satori など）にまとめ、記事の `description` を使う |
| 記事の Markdown をそのまま返す `src/pages/[...path].md.ts` | 流用 | AI が記事を読むのに使える |
| `functions/helloworld.js`、README | 消す・書き直す | 動作確認の残りと、Astro のテンプレートのまま |

## 依存を上げたビルドの結果

Node 24.0.0、Bun 1.2.20 で、リポジトリのコピーを使って試した。

| 試したこと | 主なバージョン | 結果 |
|---|---|---|
| 今のまま（`bun install --frozen-lockfile`） | Astro 5.16.0、Panda 0.53.7、pagefind 1.4.0 | 通る。19 ページ |
| 範囲内で最新（`bun update`） | Astro 5.18.2、pagefind 1.6.0、Vite 6.4.1 | 通る。19 ページ |
| すべて最新 | Astro 7.4.13、@astrojs/react 7.1.9、Panda 2.6.0、Vite 8.3.8 | 落ちる。`markdown.remarkPlugins` を使うには `@astrojs/markdown-remark` が要る |
| すべて最新 + `@astrojs/markdown-remark` 7.3.10 | 同上 | 通る。19 ページ。ただし Panda 2 の警告 11 件、CSS 48K → 32K |
| すべて最新 + Panda を 0.53.7 に戻す | Astro 7.4.13、Panda 0.53.7 | 通る。19 ページ、警告なし、CSS 48K |

記事のページ（`/posts/obsidian-as-serious-cms/`）を比べると、画像・リンクカード・見出しのリンクの数は今のものと同じだった。

作り直しは「Astro 7 + Panda 0.53 + `@astrojs/markdown-remark`」から始められる。

## この PR のプレビュー

（PR を出したあとに追記）
