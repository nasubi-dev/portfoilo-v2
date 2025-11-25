---
id: CodO0iV2bFVcKOycYxGmV
slug: video-autoplay-loop
title: video-autoplay-loop
author: nasubi
description: 表示範囲内にある動画をすべて再生する拡張機能
tags:
  - extension
createdAt: 2025-11-25T00:42+09:00
updatedAt: 2025-11-25T00:42+09:00
thumbnail: "![[video-autoplay-loop-1763999366993.webp]]"
carousel:
---
## 概要
60 fps という海外の素晴らしいUIをまとめたサイトがあって､デザインとかモーションが思いつかないときに参考にしていました｡

でも､いちいち再生ボタンを押さないといけないのが玉にキズ｡

動画を自動再生する拡張機能を作りました｡

[60fps - UI/UX animation inspiration for mobile & web apps](https://60fps.design/)

## 技術構成
js

## 機能
実装は意外とうまくいかなくて､全動画を再生しようとすると処理が重すぎて厳しそう｡


そこでスクロールを検知して表示の20%に入ったら再生､画面外に出たら停止するようにしました｡まあまあいい感じにはなった｡

しかし､動画要素が一つしかないサイトでも動作してしまい､勝手に動画が停止してしまう問題が起きてしまった｡

気が向いたら修正しようかな

## 技術的ハイライト
なし