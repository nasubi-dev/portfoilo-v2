---
id: oGxO7eu8B2OcUNC6wKCKq
slug: nasubi-dev
title: nasubi.dev
author: nasubi
description: 
tags:
  - Astro
  - Cloudflare
  - R2
  - Obsidian
  - GSAP
createdAt: 2025-05-16T01:37+09:00
updatedAt: 2025-05-16T01:37+09:00
thumbnail: "![[nasubi-dev-メイン画面.webp]]"
carousel:
---
![[nasubi-dev-products一覧.webp]]


## 概要

パフォーマンス指標の悪化が目立っていた旧サイトを廃棄し, 完全にゼロからポートフォリオを再構築しました. 今回は表示速度を最優先事項として設計し, モダンなSSGアーキテクチャとそれに適したCSS, そしてシームレスなUXを両立させるアニメーション実装にフォーカスしています.

また, 旧サイトで好評だった遊び心のあるアニメーションやイースターエッグはこのサイトでも今後実装予定です.

## 技術構成

- ドメイン名: nasubi.dev
- フレームワーク: Astro
- ホスティング: Cloudflare Workers
- css: PandaCSS
- アニメーションライブラリ: GSAP
- CMS: Obsidian + R2
- R2 Bucket名: content.nasubi.dev

特筆すべき点として, CMSに一般的なヘッドレスCMSではなくObsidian + R2という構成を採用しています. ローカル編集がメインのワークフローに最適化したアプローチで, 開発体験と運用効率を両立させています.

## 機能

Blogによくある基本機能はすべて実装しました.

- アンカーリンク
- 動的に生成される目次
- OGP表示(SNSプレビュー最適化)
- Markdown表示
- シンタックスハイライト
- CMSから取得した画像, 動画の最適化表示
- 全文検索エンジン

今回のサイトではMarkdownの記法だけで, ObsidianとBlogのどちらもが理想通り表示されることを目標に制作しました.

## 技術的ハイライト

### CMSに Obsidian + R2

Astroでは`content/`の階下にある`.md`, `.mdx`ファイルを解析してビルドするため, `content/`をObsidianのvaultsに設定することでObsidian上でmdファイルを編集することができます.
基本的にすべてのテキストデータはObsidianから編集しています.

#### 技術選定の理由

この構成を選択した理由：

1. **スケーラビリティ**: ストレージの容量が許す限り, 膨大な量のコンテンツを管理可能
2. **コスト効率**: R2の無料枠は10GBの保存容量と, Blogを書くだけなら事実上無制限の書き込み操作を提供
3. **エグレス料金なし**: R2はエグレス料金が無料なため, 画像配信が多いブログに最適
4. **シームレスな連携**: Obsidianの「Remotely Save」プラグインを使用することで, 直接R2へのデータ同期が可能

この構成により, 一般的なヘッドレスCMSのような複雑なセットアップや管理画面への切り替えなしに, すべてをローカル環境で完結させることができます.

#### ディレクトリ構成

```
content
├─ .obsidian // obsidianの設定ファイル
├─ assets
│  ├─ xxx.webp
│  └─ yyy.webm
├─ about
│  ├─ experiences.md
│  ├─ organization.md
│  ├─ skills.md
│  └─ 自己紹介.md
├─ posts
│  └─ 初投稿.md
├─ products
│  ├─ fookeys.md
│  ├─ wakaba.md
│  └─ nasubi.dev.md
└─ templates
    └─ テンプレート用
```

#### Obsidianプラグインで開発フローを最適化

- **Remotely Save**: R2バケットとの自動同期によるクラウドバックアップ
- **Image Converter**: アップロード時に画像は`.webp`, 動画は`.webm`に自動変換し最適化
- **Templater**: 記事テンプレートをプログラマブルに生成
- **Shell Commands**: Git操作をObsidian内から実行可能に

#### ワークフロー

実際のコンテンツ制作からデプロイまでのワークフローは以下の通りです: 

1. Obsidianで記事を執筆またはコンテンツを編集
2. 画像・動画を必要に応じてドラッグ＆ドロップ（自動で最適化）
3. 保存すると自動的にR2へ同期
4. Obsidian上でShell commandによってリポジトリにコミット＆プッシュ
5. CI/CDパイプラインによる自動ビルドとデプロイ

この一連の流れにより, コンテンツの作成からデプロイまでの効率的な運用が可能になっています. エディタからデプロイまでのシームレスなDXを実現し, 大幅に効率化することができました.

### RemarkによるWikiLinkの変換

機能にて紹介したCMSから取得した画像, 動画の最適化表示について

Obsidianの特徴的な機能として, WikiLink記法があります. これは従来のMarkdownにはない独自記法で, ファイルパスを明示的に指定せずにファイル名だけでリンクを生成できる強力な機能です.

Wikiリンクの例:

```
![[test]]
```
　　

この記法はObsidian内では完璧に機能しますが, 標準のMarkdownレンダラーでは解釈できません. この互換性の問題を解決するため, Remarkベースのカスタムプラグインを開発・実装しました.

このプラグインはMarkdownのASTへの変換時に以下の処理を行います:

1. `[[`から始まる文字列パターンを検出
2. パス解決アルゴリズムによってファイル実体を特定
3. ファイル名の正規化処理（スペースをハイフンに変換）
4. ファイルタイプに応じた最適な要素への変換
   1. 画像ファイル → Astroの`Image`コンポーネント
   2. 動画ファイル → `<video>` タグ

現状の実装では画像と動画のみを対象としていて, 他のマークダウンファイルへのリンクは使用しない設計としています. Astroのビルドパイプラインに統合されたこのプラグインは, `![[image with spaces.jpg]]`といった記法を検出し, `https://content.nasubi.dev/assets/image-with-spaces.webp`のようなURLに変換します.

また, 単純な`<img>`タグではなくAstroの`Image`コンポーネントを利用することで, 以下の恩恵を受けています:

- 画像の自動最適化（フォーマット変換, サイズ最適化）
- 遅延読み込み（Lazy Loading）の自動適用
- レスポンシブ画像の生成（srcset属性の自動生成）
- CLS（Cumulative Layout Shift）の防止

このアプローチにより, コンテンツを制作するときに複雑なパスやHTML構文を気にせず, 直感的なObsidian記法で執筆できます. 同時に, ビルド時には最適化されたメディアコンポーネントに変換されるため, パフォーマンスとUXを損なうことなく執筆体験を向上させています.

R2バケットとの連携においては, 現在のワークフローでは単一のデバイスからのみ編集を行うため, 同期の競合問題は発生せず, シンプルな構成を維持できています. 今後マルチデバイスを行う予定がないため, 今回の構成には最適な選択となっています.

### GSAPによるアニメーション

随時制作予定

## 今後の展望

パフォーマンス最適化の継続的な改善とアニメーション実装の拡充を進めながら, コンテンツ自体の充実にフォーカスしていきます. また, 利用技術や実装手法についての技術記事も順次公開予定です.

以下の機能も追加予定です
- ダークモード対応
- OGP対応ページ追加(SlideShare,CodeSandBoxなど)
## 参考資料
[Astro](https://astro.build/)

[Panda CSS - Build modern websites using build time and type-safe CSS-in-JS](https://panda-css.com/)

[Pagefind \| Pagefind — Static low-bandwidth search at scale](https://pagefind.app/)

[vercel/og · Cloudflare Pages docs](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/)

[Pagefindでお手軽！静的HTML検索導入（Astro編） - necco Note｜necco inc.](https://necco.inc/note/38263)

[@vercel/og を使って Astro 製ブログのビルド時に OGP 画像を出力する \| t28.dev](https://t28.dev/blog/output-ogp-image-for-astro-pages)

[Astro + MicroCMSで開発した個人ブログのビルドを高速化するtips](https://zenn.dev/ebifran/articles/5e29ecb3a2cfba)

[remark プラグインを作って Astro で使う](https://zenn.dev/chot/articles/7885c407aab52d)

[Cloudflare R2の画像をCache APIでキャッシュして返すメモ](https://zenn.dev/syumai/scraps/d3468205fee0f0)

[Page not found · GitHub · GitHub](https://github.com/wappon28dev/bokupo25portal/blob/main/src/pages/index.astro#L70-L73)

[GitHub - r4ai/r4ai.dev](https://github.com/r4ai/r4ai.dev)

[AstroでLayoutの外にタグを書くと文字化けする](https://zenn.dev/yutaosawa/articles/fc1d9e64fcf5d8)

[GitHub - azukiazusa1/sapper-blog-app](https://github.com/azukiazusa1/sapper-blog-app)



