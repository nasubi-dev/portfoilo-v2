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
- **Cloudflare Pages の設定**: プレビューのデプロイは「すべてのブランチ」、PR へのコメントも有効になっている。Node のバージョンは本番の環境変数ではなく `.node-version` で決め、本番とプレビューをそろえる（下の「この PR のプレビュー」）
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
| Markdown の拡張（リンクカード、WikiLink、見出しのリンク） | TanStack Markdown に移す | 下の「再調査: Markdown の処理を TanStack Markdown に移す」。試作で今の出力とほぼ同じになり、remark・rehype の依存 4 つが要らなくなる |
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

作り直しは「Astro 7 + Panda 0.53」から始められる（Markdown を TanStack Markdown に移すなら `@astrojs/markdown-remark` は要らない）。Astro 7 は Node 22.23.4 以上が要る（Astro 5.16 は 18.20.8 以上）。

## この PR のプレビュー

- 最初のコミットではプレビューのビルドが落ちた。Cloudflare Pages の `NODE_VERSION`（18.20.8）は本番の環境にだけあり、プレビューは既定の Node 18.17.1 で動いて、Astro 5.16 が「18.20.8 以上」で止まった
- `.node-version`（`22`）を足すと、プレビューは Node 22.23.4 で通った。PR のチェックが緑になり、Cloudflare のボットが PR にプレビュー URL をコメントした
- プレビュー（`https://<ハッシュ>.portfoilo-v2.pages.dev`、ブランチ名の別名 `https://nasubi-dev-nas-114.portfoilo-v2.pages.dev`）はどちらも 200 で開け、`x-robots-tag: noindex` が付いていた。検索エンジンには載らない
- 本番には `NODE_VERSION` の環境変数があるので、マージ後もたぶん 18.20.8 のまま（環境変数と `.node-version` のどちらが優先かは確かめていない。22 になっても Astro 5.16 は動く）。Astro 7 は Node 22.23.4 以上が要るので、上げるときは本番の `NODE_VERSION` を消すか 22 にする

## 再調査: Markdown の処理を TanStack Markdown に移す

2026-11-23 に追加。`astro.config.mjs` の自作の remark プラグインをやめ、[TanStack Markdown](https://tanstack.com/markdown/latest/docs)（`@tanstack/markdown` 1.2.1、2026-11-19 公開）に移せるかを、Astro 7 で試作して確かめた。

**結論: 移せる。** 記事・products・about の全ページで、カード以外の出力（画像、動画、YouTube の埋め込み、見出しの ID、リスト、コード）が今と同じになった。カードの付け方は「リンクだけの行をカードにする」に変わる。これに合わせて、アフィリエイトのリンクと記事どうしのリンクも扱える。

### TanStack Markdown

ブログやドキュメント向けの小さな Markdown パーサーで、依存が無い。CommonMark・GFM を全部は追わず、足りないものは拡張で足す。

- パーサーは同期。OGP のような fetch は、パースのあと、描く前にまとめて済ませる
- 拡張でできること: 独自のインライン記法（`![[...]]` など）、パース後の文書の書き換え、HTML を描くときのフック
- 生の HTML は既定でエスケープされる。`allowHtml: true` で通る（`<script>` も通る）
- コードの色付けは外に出してある。試作では今と同じ shiki の houston を使った

Astro 7 では、ページで `renderPost(post.body)` を呼び、返った HTML を `<Fragment set:html={…} />` で出す。目次の見出しも同じ関数から返す。Astro の `render()` と Markdown の設定は使わないので、`@astrojs/markdown-remark`・`rehype-slug`・`rehype-autolink-headings`・`unist-util-visit` を外せる。外してもビルドは通った。

### 今の自作の処理がしていること

| 処理 | 今の実装 | 記事での使われ方 | 移したあと |
|---|---|---|---|
| `![[画像]]`・`![[動画]]` | `remarkWikiLinks`。R2 の URL にし、動画は `<video>` | 70 か所 | 拡張で同じ出力にした |
| `[[ページ]]` | 同上。リンクの URL がファイル名のままになる | 0 か所 | 記事の一覧から URL とタイトルを引き、カードにする |
| リンクカード | `remarkEmbedLinks`。**本文のリンクをすべて**ビルド時に fetch し、OGP のカードにする | 49 枚 | リンクだけの行をカードにする |
| YouTube・Spotify | 同上。`watch?v=`・`youtu.be` は iframe | YouTube 1 か所 | 同じ |
| x.com のポスト | 専用の処理は無い。ほかのサイトと同じく OGP のカードで、X が返す OGP（アカウント名と画像）が出る | 11 か所 | 同じ |
| 見出しの ID とリンク | `rehype-slug`・`rehype-autolink-headings` | 121 個 | ID は全部同じ。🔗 は `<h2>` の中に入る |
| コード | Astro の shiki（houston） | 3 か所 | 同じ |
| 裸の URL | Astro の GFM | 17 行 | `autolinksExtension` で同じ |

記事は表・脚注・チェックボックス・生の HTML・callout を使っていない。

### 移すときに要る手当て

試作で見つかった、そのままでは崩れるところ。

1. **タブで字下げしたリストが入れ子にならない。** Obsidian の既定はタブで、about と記事 2 本が崩れる。パースの前に、コードブロックの外の行頭のタブを空白 4 つに置き換えた
2. **既定の見出し ID が日本語を落とす。**「見出し A」が `a` になる。github-slugger と同じ規則の関数を `headingIds` に渡すと、121 個すべて今と同じ ID になった
3. **詰めて書いたリストの中では、段落のフックが呼ばれない。** 描くときではなく、パースのあとに文書を書き換えてカードにした
4. **🔗 の位置が変わる。** 今は `<div class="heading-wrapper">` で見出しと 🔗 を横に並べている。移したあとは `<h2>` の中に入るので、`panda.config.ts` の `.heading-wrapper` の CSS を見出しに付け替える

### カードの付け方が変わるところ

今はリンクなら文中でもカードになり、文が途中で切れる。移したあとは、行にリンクしか無いときだけカードにする（箇条書きの項目、段落の続きの行も含む）。今の記事で文字のリンクに変わるのは 8 か所。

- 文中のリンク: 北海道の記事の YouTube のチャンネル
- 「ラベル: URL」の行: `GitHub: https://…`（fookeys）、`URL: https://…`（fookeys-mini で 3 か所）、`引用: https://…`（Obsidian の記事）、`GitHub: [...](...)`・`公式サイト: [...](...)`（kintai-discord）

カードのままにしたいところは、URL を次の行に移せばよい。

### サイト内のリンクのカード

今は `nasubi.dev` のリンクも本番のサイトから OGP を取るので、about のカードのタイトルは 5 枚とも「nasubi.dev」になっている。PR のブランチで足したばかりの記事は、本番にまだ無いのでカードが空になる。

試作では、ビルドのときに記事と products の一覧（URL、ファイル名、タイトル）を作り、`https://nasubi.dev/posts/…` のリンクと `[[記事のファイル名]]` を一覧から引いてカードにした。fetch しないので、同じ PR で足した記事どうしでもカードが出る。about のカードも、記事の本当のタイトルが出るようになった。

### アフィリエイトのリンクと広告の表記

[NAS-116](https://linear.app/nasubi/issue/NAS-116) の調査（vault の `auto/claude/個人ブログのアフィリエイトの始め方.md`）で決めた処理は、移したあとの形でそのまま入る。

- アフィリエイトのリンクはホスト名で見分ける（`af.moshimo.com`・`px.a8.net`・`hb.afl.rakuten.co.jp`・`ck.jp.ap.valuecommerce.com`・`amzn.to`、`tag=` の付いた `amazon.co.jp`）。行にそれだけでもカードにせず fetch もしない。`rel="sponsored noopener" target="_blank"` の文字のリンクになることを試作で確かめた
- もしもの「かんたんリンク」のような ASP の HTML を貼るなら `allowHtml: true` にする。記事を書くのは本人と bot だけなので、通してよい
- 冒頭の「この記事には広告（アフィリエイトリンク）を含みます」は Markdown ではなくレイアウトの仕事で、スキーマに `pr` を足して `BlogPost.astro` で出す。Markdown の処理は関係しない

### ついでに見つかったこと

- `src/pages/rss.xml.js` が無いコレクション `blog` を読んでいて、RSS が空になっている（ビルドの警告 `The collection "blog" does not exist or is empty`）。`post` に直す
- 試作（Astro 7）では、about の SKILLS・ORGANIZATIONS・EXPERIENCES の並びが逆になる。コレクションの並びに頼らず、ページで順番を決める
