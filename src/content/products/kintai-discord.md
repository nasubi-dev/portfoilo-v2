---
id: TLRMUNMfQfp8ny7qQwKyk
slug: kintai-discord
title: kintai-discord
author: nasubi
description: Discordのスラッシュコマンドで勤怠記録ができるボット。各サーバー専用のGoogleスプレッドシートに自動記録し、労働時間も自動計算。友人との時間管理ニーズから開発され、簡単・安全・高速・無料で利用可能。
tags:
  - discord
  - Cloudflare
  - bot
createdAt: 2025-08-02T19:25+09:00
updatedAt: 2025-08-02T19:25+09:00
thumbnail: "![[kintai-discord-1754150793421.webp]]"
carousel:
---
## 概要
Discord のスラッシュコマンドで簡単に勤怠記録ができるボットです。各サーバー専用の Google スプレッドシートに自動でデータを記録し、労働時間も自動計算します。

 ✨ 主な特徴
 
- **🚀 簡単**: `/start` と `/end` だけで勤怠記録完了
- **🔒 安全**: 各サーバーのデータは完全に分離され、管理者の Google アカウントに保存
- **📊 自動**: 労働時間の計算、月別シート作成、データフォーマットすべて自動化
- **⚡ 高速**: 即座にレスポンス、通信環境が悪くても安定動作
- **💰 無料**: 無料で利用可能（Google スプレッドシート使用）

## 背景･目的

友人とのチームでの仕事にて｢そのプロジェクトでなににどれくらいの時間をかけたか指標が知りたい｣というニーズがあったので､一つ返事で打刻システムの作成を作ることを決めて､β版を2日で作成しました｡

連絡はDiscord､データ管理はGoogle Driveを使用していたため､Discord bot + スプレッドシートという構成になっています｡

当初はGASを使った構成にしていたのですが､一般公開に向けてSheetAPIを使う構成に変更しました｡

最終的にあまりにニッチなサービスになったなと感じてはいます｡

## 技術構成

- **Runtime:** Cloudflare Workers
- **Framework:** Hono (TypeScript)
- **Package Manager:** Bun
- **Authentication:** Discord 署名検証 + OAuth 2.0（直接 OAuth 方式）
- **Database:** Google Spreadsheet（サーバーごとに独立）
- **Cache/State:** Cloudflare KV（重複チェック・暗号化トークン管理）
- **API:** Google Sheets API（直接連携）+ Discord API
- **Security:** 暗号化トークン管理、署名検証、管理者権限制御
## 機能



## 技術的ハイライト


## リンク
GitHub: [GitHub - nasubi-dev/kintai-discord-v2](https://github.com/nasubi-dev/kintai-discord-v2/tree/main)

公式サイト: [kintai-discord](https://kintai-discord.nasubi.dev/)