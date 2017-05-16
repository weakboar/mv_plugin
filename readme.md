# RPG Maker MV Plugins
RPGツクールMV向けのプラグインをまとめるリポジトリです。

# Filter関連

Filters
* **BloomFilter**
  * 輝度が高いピクセルをぼかすフィルター
  * 光を強く感じられるようになる
  * 輝度の高いピクセルを抽出する`BloomThresholdFilter`が含まれる
  * 画像に対して色を乗算する`BloomIntensityFilter`が含まれる
* **TiltShiftFilter**
  * 画面の上下をぼかす
  * 奥行き感が増す
  * ジオラマのようになる
* **GrayScaleFilter**
  * グレースケール化します
* **SepiaFilter**
  * セピア調に変換します

Filter管理
* **MapFilterManager**
  * Mapの背景に対し適用するフィルターを管理
  * セーブ時にフィルターの情報を保持
  * ロード時にフィルターの状態を復元
* **FilterExample**
  * 要MapFilterManagerプラグイン
  * MapFitlerManagerをコマンドスクリプトから利用出来るようにします。

Filter管理系のプラグインについては取り敢えず使える用にはなったという段階です。