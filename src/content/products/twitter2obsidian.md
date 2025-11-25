---
id: PSHoCJY8A6w2OtMGflytf
slug: twitter2obsidian
title: twitter2obsidian
author: nasubi
description: twitterのブックマークをObsidian Baseに移行することができる拡張機能
tags:
  - Obsidian
  - Twitter
createdAt: 2025-11-25T01:03+09:00
updatedAt: 2025-11-25T01:03+09:00
thumbnail: "![[twitter2obsidian-1764028417056.webp]]"
carousel:
  - "![[twitter2obsidian-1764028266917.webp]]"
  - "![[画面収録 2025-11-25 9.01.24.webm]]"
---
## 概要
かねてよりTwitterのブックマークが使いづらいと感じていた｡遡ろうとすると､激長ローディングが発生して見る意欲が下がる｡

そんな身近で､個人的なペインを解決するために､Obsidian Baseに気に入ったツイートを保存する拡張機能を作成した｡

## 背景･目的


## 技術構成
- js
- LOCAL REST API (obsidianの拡張機能)

## 機能
大きく分けて2つ機能があり､

1.ツイート一個を保存する
ページ上部のツールバー?(urlの部分の名称毎回忘れる)にアイコンが表示され､クリックをする｡すると､Obsidianの方に新規mdが作成されbase上でCard表示ができる

![[twitter2obsidian-1764028266917.webp]]
![[twitter2obsidian-1764028417056.webp|700x588]]

2.ブックマークを一括で移行
これがお気に入り

![[画面収録 2025-11-25 9.01.24.webm]]
## 技術的ハイライト
やりたいことやれたから大満足

文章は全文取得してmd保存しているが､画像や動画は容量が多すぎるので､DLせず`?format=jpg&name=large`のがURLを保存するだけにしている｡動画は決まったurlがなかったので仕方なくiframeで対応｡動画にもサムネイルがあるとAIくんが教えてくれたので､動画もサムネイル対応できた｡

Obsidian Base結構夢があって楽しい｡300件くらいブックマーク移行したけど､全然動作が重くなったりしない｡これからもどうやって使っていくか試行錯誤したい｡

これでイーロンがいいねは非公開だけど､ブックマークは公開しますとか言い出しても安心