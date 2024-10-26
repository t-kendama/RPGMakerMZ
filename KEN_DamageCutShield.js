/*
----------------------------------------------------------------------------
 KEN_DamageCutState v0.9.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 0.9.0 2024/10/26 シールドの外枠に表示する機能の追加
 0.8.4 2024/10/25 バトラーにシールド最大値を設定する機能追加
 0.8.3 2024/10/21 メニュー画面中にシールドが付与できない不具合修正
                  非戦闘時はターン数を表示しない仕様に変更
 0.8.2 2024/10/20 シールド獲得時のバトルログで耐久値が表示されない不具合修正
                  被ダメージ時にシールド減少量を表示する機能追加
 0.8.1 2024/10/20 スリップダメージが少数になる不具合修正
 0.8.0 2024/10/20 ベータ版公開
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc ダメージカットを行うシールドを提供します
 * @author KEN
 * @version 0.9.0
 * @url https://github.com/t-kendama/RPGMakerMZ/blob/main/KEN_DamageCutShield.js
 * 
 * @help
 * ダメージカットを行うシールドを提供します。
 * 
 *    --------------------    概要    --------------------
 * 【シールドの基本的な仕様】
 * シールドが付与されているバトラーがHPダメージの攻撃を受けたとき、
 * シールドを消費してダメージを防ぐことができます。
 * ダメージがシールド値を超えた場合、超過した分だけ
 * ダメージを受けます。
 * 例．ダメージが100、シールド30の場合、70ダメージを受けます。
 * 
 * シールドはダメージを受けない限り解除されませんが、後述のステート設定で
 * 持続ターン数を設定できます。
 * 
 * 【細かい仕様】
 * ・イベントコマンドの「HPの増減」でHPを減らした場合は、シールドの耐久値に
 * 関わらず処理が実行されます。
 * 
 * 【シールドの描画】
 * シールドはHPゲージの上に描画します。
 * またシールドが付与されている間、アイコンおよび持続ターン数を描画できます。
 * 
 *    --------------------    使い方    --------------------
 * 本プラグインは事前にステート設定が必要です。
 * 
 * 【ステート設定】
 * シールドが付与されたとき、プラグインパラメータに設定したIDのステートが
 * 連動して付与されます。
 * ※このステートは必ず設定してください
 * 
 * シールドの持続ターンはステートIDの「自動解除のタイミング」に依存します。
 * 「自動解除のタイミング」を「なし」に設定した場合、シールドは自動解除
 * されなくなります。
 * 
 * 【シールドの付与】
 * アイテムまたはスキル欄のメモ欄に設定します。
 * 
 * <damageCutShield: 数値 or 数式>
 * 記述欄：アイテム・スキル
 * アイテム、スキルの対象者にシールドを付与します。
 * シールド耐久値はスクリプトも指定可能です。
 * 例．
 * <damageCutShield: 100> シールドが100増加します
 * <damageCutShield: -50> シールドが50減少します
 * <damageCutShield: a.mat> スキル使用者の魔力分のシールドが増加します
 * 
 * 【その他の設定】
 * <penetrateShield>
 * 記述欄：アイテム・スキル
 * このタグが記述されたアイテム・スキルはシールドを無視してダメージを与えます。
 * 
 * <GiveShieldRate: 数値>
 * 記述欄：武器・防具・ステート 
 * シールド付与率を指定します。単位は小数で指定します。
 * 複数の装備品をつけていた場合、シールド付与率は装備の合計で算出されます。
 * 
 * 記述例．
 * <GiveShieldRate: 0.5> 1.5倍のシールド値を得るようになります。
 * <GiveShieldRate: -0.2> 0.8倍のシールド値を得るようになります。
 * 
 * <ReceiveShieldRate: 数値>
 * 記述欄：武器、防具、ステート 
 * シールド獲得率を指定します。単位は小数で指定します。
 * 複数の装備品をつけていた場合、シールド獲得率は装備の合計で算出されます。
 * 
 * <InvalidShield>
 * 記述欄：武器、防具、ステート
 * このタグが指定された装備・ステートが付与されている場合、
 * シールドが得られなくなります。
 * 
 * <damageWithShield: 数値>
 * 記述欄：武器、防具、ステート
 * シールド耐久値を減らすダメージを設定します。
 * 継続的にダメージを与える装備やステートを実装するときに使用します。
 * 
 * 記述例．
 * <damageWithShield: 20> ターン経過時、20ダメージを与えます
 * <damageWithShield: a.mhp * 0.1> ターン経過時、バトラーの最大HP10%のダメージを与えます
 * 
 * <damageCutShieldMax: 数値 or 数式>
 * 記述欄：アクター、エネミー
 * バトラー個別にシールド耐久値の最大値を設定します。
 * <damageCutShieldMax: a.mhp> と表記するとシールド耐久値がバトラーの最大HPの値に
 * 制限されます。
 * 
 * 
 * --------------------    スクリプト    --------------------
 * ・シールド耐久値を取得
 * $gameActors.actor(アクターID).damageCutShield()
 * $gameTroop.members()[エネミーのインデックス].damageCutShield()
 * 
 * ・シールドを増加（マイナス指定可）
 * $gameActors.actor(アクターID).gainDamageCutShield(効果量)
 * $gameTroop.members()[エネミーのインデックス].damageCutShield(効果量)
 * 
 * ・シールド状態を解除
 * $gameActors.actor(アクターID).clearDamageCutShield()
 * $gameTroop.members()[エネミーのインデックス].clearDamageCutShield()
 * 
 * 
 * --------------------    上級者向け設定について    --------------------
 * 本プラグインはエネミーのシールドを描画する機能を持ちません。
 * ※内部的にはシールドは適用されます
 * 
 * エネミーのシールドを描画する場合は他プラグインとの併用をご検討ください。
 * シールドの描画に関する細かい挙動については対応しかねます。ご了承ください。
 *  
 * 
 * 
 * @param generalConfig
 * @text 基本設定
 * @desc 基本設定です ※この項目は使用しません
 * 
 * @param stateID
 * @text ステートID
 * @desc シールドを得た場合、このステートがバトラーに付与されます 必ず2以上の値を設定してください
 * @type state
 * @default 2
 * @parent generalConfig
 * 
 * @param maxShieldValue
 * @text シールド最大値
 * @desc シールド耐久値の最大値を設定します ※0にすると制限が無くなります
 * @type number
 * @default 99999
 * @parent generalConfig
 * 
 * @param seBlockDamage
 * @text ダメージブロック効果音
 * @desc シールドでダメージを防いだときの効果音です
 * @type struct<SE>
 * @parent generalConfig
 * 
 * @param battleLogConfig
 * @text バトルログ設定
 * @desc バトルログに関する設定です ※この項目は使用しません
 * 
 * @param msgGetShield
 * @text シールド獲得メッセージ
 * @desc シールドを獲得したときのメッセージ　%1:ターゲット名 %2:シールド獲得量 %3:シールド耐久値
 * @type string
 * @default %1は%2のシールドを得た！(シールド耐久値%3)
 * @parent battleLogConfig
 * 
 * @param msgLossShield
 * @text シールド減少メッセージ
 * @desc シールド減少時のメッセージ　%1:ターゲット名 %2:シールド減少量 %3:シールド耐久値
 * @type string
 * @default %1のシールドが%2減少した！(シールド耐久値%3)
 * @parent battleLogConfig
 * 
 * @param msgBreakShield
 * @text シールド破壊メッセージ
 * @desc シールドが破壊（0になった）されたときのメッセージ 空欄にすると表示しません
 * @type string
 * @default %1のシールドが破壊された！
 * @parent battleLogConfig
 * 
 * @param msgBlockedDamage
 * @text 被ダメージのメッセージ
 * @desc シールドが付与状態でダメージを受けたときのメッセージです　%1:ターゲット名 %2:シールド減少値 %3:シールド耐久値
 * @type string
 * @default %1のシールドが%2減少した！(シールド耐久値%3)
 * @parent battleLogConfig
 * 
 * @param LabelConfig
 * @text アイコン描画設定
 * @desc アイコン関連の設定項目です ※このパラメータは使用しません
 * 
 * @param labelIconIndex
 * @text アイコン画像
 * @desc シールドが付与されたときに描画するアイコン画像です
 * @type icon
 * @default 0
 * @parent LabelConfig
 * 
 * @param labelIconX
 * @text アイコン画像オフセットX
 * @desc アイコン画像の表示座標オフセットX (デフォルト: 0)
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent LabelConfig
 * 
 * @param labelIconY
 * @text アイコン画像オフセットY
 * @desc アイコン画像の表示座標オフセットY (デフォルト: 0)
 * @type number
 * @min -1000
 * @max 1000
 * @default 0
 * @parent LabelConfig
 * 
 * @param TurnConfig
 * @text ターン数描画設定
 * @desc シールドの持続ターン数の描画設定項目です ※このパラメータは使用しません。
 * 
 * @param turnDisplay
 * @text ターン数表示
 * @desc シールドのターン数を表示します（シールドをターン経過で自動解除しない場合 OFFにすることを推奨します）
 * @type boolean
 * @default false
 * @parent TurnConfig
 * 
 * @param turnFontSize
 * @text フォントサイズ
 * @desc シールド値のフォントサイズ(デフォルト: 16)
 * @type number
 * @default 16
 * @parent TurnConfig
 * 
 * @param turnX
 * @text ターン数X座標
 * @desc ターン数のX座標(デフォルト: 16)
 * @type number
 * @default 16
 * @min -1000
 * @max 1000
 * @parent TurnConfig
 * 
 * @param turnY
 * @text ターン数Y座標
 * @desc ターン数のY座標(デフォルト: 16)
 * @type number
 * @min -1000
 * @max 1000
 * @default 16
 * @parent TurnConfig
 * 
 * @param GaugeConfig
 * @text ゲージ設定
 * @desc ゲージ関連の設定項目です ※このパラメータは使用しません
 * 
 * @param displayGauge
 * @text ゲージ表示
 * @desc シールド耐久値を表示するゲージをHPゲージの上に描画します
 * @type boolean
 * @default true
 * @parent GaugeConfig
 * 
 * @param displayType
 * @text 描画方式
 * @desc シールドの描画方式を選びます
 * @type select
 * @option ゲージの上に描画
 * @value 0
 * @option ゲージの外枠に描画
 * @value 1
 * @default 0
 * @parent GaugeConfig
 * 
 * @param gaugeValueFontSize
 * @text フォントサイズ
 * @desc シールド耐久値のフォントサイズ(デフォルト: 12)
 * @type number
 * @default 12
 * @parent GaugeConfig
 * 
 * @param gaugeValueX
 * @text シールド耐久値X座標
 * @desc シールド耐久値を表示するX座標 (デフォルト: 36) 
 * @type number
 * @default 36
 * @min -1000
 * @max 1000
 * @parent GaugeConfig
 * 
 * @param gaugeValueY
 * @text シールド耐久値Y座標
 * @desc シールド耐久値を表示するY座標 (デフォルト: 8)
 * @type number
 * @default 8
 * @min -1000
 * @max 1000
 * @parent GaugeConfig
 * 
 * @param gaugeColor1
 * @text ゲージ色1
 * @desc シールドのゲージ色1（デフォルト: rgba(200, 200, 200, 0.9)）
 * @type string
 * @default rgba(200, 200, 200, 0.9)
 * @parent GaugeConfig
 * 
 * @param gaugeColor2
 * @text ゲージ色2
 * @desc シールドのゲージ色2（デフォルト: rgba(200, 200, 200, 0.9)）
 * @type string
 * @default rgba(200, 200, 200, 0.9)
 * @parent GaugeConfig
 * 
 * @param AdvanceConfig
 * @text 上級者向け設定
 * @desc 上級者向けの設定です ※この項目は使用しません
 * 
 * @param EnemyConfig
 * @text エネミーのシールド描画設定
 * @desc エネミーのシールド描画設定です この項目は他プラグインとの併用を想定しています ※この項目は使用しません。
 * @parent AdvanceConfig
 * 
 * @param enemyIconOffsetX
 * @text アイコンのX座標オフセット値
 * @desc エネミーのシールドアイコンX座標のオフセット値
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent EnemyConfig
 * 
 * @param enemyIconOffsetY
 * @text アイコンのY座標オフセット値
 * @desc エネミーのシールドアイコンY座標のオフセット値
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent EnemyConfig
 * 
 * @param enemyTurnOffsetX
 * @text ターン数のX座標オフセット値
 * @desc エネミーのシールドターン数X座標のオフセット値
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent EnemyConfig
 * 
 * @param enemyTurnOffsetY
 * @text ターン数のY座標オフセット値
 * @desc エネミーのシールドターン数Y座標のオフセット値
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent EnemyConfig
 * 
 * 
 */
/*~struct~SE:
 *
 * @param name
 * @text ファイル名
 * @desc ファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 定位
 * @desc 定位(左右バランス)です。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_DamageCutShield";
  var pluginParams = PluginManager.parameters(PLUGIN_NAME);
  var param = JSON.parse(JSON.stringify(pluginParams, function(key, value) {
    try {
        return JSON.parse(value);
    } catch (e) {
        try {
            return eval(value);
        } catch (e) {
            return value;
        }
    }
  }));

  const STATEID_Shield = param.stateID || 2;
  const MSG_GetShield = param.msgGetShield || "";
  const MSG_LossShield = param.msgLossShield || "";
  const MSG_BreakShield = param.msgBreakShield || "";
  const MSG_BlockedDamage = param.msgBlockedDamage || "";
  const SE_BlockedDamage = param.seBlockDamage || null;
  const MAX_Shield = param.maxShieldValue || 99999;
  const LABEL_IconIndex = param.labelIconIndex || 0;
  const LABEL_IconX = param.labelIconX || 0;
  const LABEL_IconY = param.labelIconY || 0;
  const TURN_Display = param.turnDisplay;
  const TURN_FontSize = param.turnFontSize || 8;
  const TURN_TurnX = param.turnX || 8;
  const TURN_TurnY = param.turnY || 8;
  const GAUGE_DisplayType = param.displayType || 0;
  const GAUGE_Display = param.displayGauge;
  const GAUGE_ValueFontSize = param.gaugeValueFontSize || 16;
  const GAUGE_ValueOffsetX = param.gaugeValueX || 0;
  const GAUGE_ValueOffsetY = param.gaugeValueY || 0;
  const GAUGE_Color1 = param.gaugeColor1 || "rgba(200, 200, 200, 0.9)";
  const GAUGE_Color2 = param.gaugeColor2 || "rgba(200, 200, 200, 0.0)";
  //const ENEMY_DisplayEnemyShield = param.displayEnemyShield;
  const ENEMY_IconOffsetX = param.enemyIconOffsetX || 0;
  const ENEMY_IconOffsetY = param.enemyIconOffsetY || 0;
  const ENEMY_TurnOffsetX = param.enemyTurnOffsetX || 0;
  const ENEMY_TurnOffsetY = param.enemyTurnOffsetY || 0;

  //====================================================================
  // ●Window_BattleLog
  //====================================================================
  const _KEN_Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    if( target.result().isShieldEffect() ){
      if (target.result().used) {
        this.push("pushBaseLine");
        this.displayCritical(target);
        this.push("popupDamage", target);
        this.push("popupDamage", subject);
        this.displayGainDamageCutShield(target);  // 処理追加
        this.displayBlockedDamage(target);        // 処理追加
        this.displayDamage(target);
        this.displayAffectedStatus(target);
        this.displayBreakDamageCutShield(target)  // 処理追加
        this.displayFailure(target);
        this.push("waitForNewLine");
        this.push("popBaseLine");
      }
    } else {
      // シールド処理ではない場合、従来の処理を行う
      _KEN_Window_BattleLog_displayActionResults.call(this, subject, target);
    }
    
  };

  // シールド値が増減したときのメッセージ
  Window_BattleLog.prototype.displayGainDamageCutShield = function(target) {
    if (target.result().gainShield || target.result().lossShield) {
      const text = this.makeGetShieldText(target);
      if(text) this.push("addText", text);
    }
  };

  // シールド獲得時のメッセージ
  Window_BattleLog.prototype.makeGetShieldText = function(target) {
    const gainValue = target.result().gainShieldValue;
    const afterValue = target.damageCutShield();
    console.log(afterValue);
    const text = String(MSG_GetShield).format(target.name(), gainValue, afterValue);
    return text;
  };

  // シールド減少時のメッセージ
  Window_BattleLog.prototype.makeLossShieldText = function(target) {
    const value = -target.result().gainShieldValue;
    const currentValue = target.result().afterShield;
    const text = String(MSG_LossShield).format(target.name(), value, currentValue);
    return text;
  };

  // シールドが破壊されたときのメッセージ
  Window_BattleLog.prototype.displayBreakDamageCutShield = function(target) {
    if (target.result().breakShield) {
      const text = String(MSG_BreakShield).format(target.name());
      if(text) this.push("addText", text);
    }
  };

  // シールドでダメージを防いだときのメッセージ
  Window_BattleLog.prototype.displayBlockedDamage = function(target) {
    if (target.result().blockDamageWithShield) {
      const text = this.makeBlockedDamageWithShield(target);
      if(text !== "") this.push("addText", text);
      if (SE_BlockedDamage) {
        AudioManager.playSe(SE_BlockedDamage);
      }
    }
  };
  
  Window_BattleLog.prototype.makeBlockedDamageWithShield = function(target) {
    const value = target.result().afterShield;
    const lossShieldValue = target.result().lossShieldValue;
    const text = String(MSG_BlockedDamage).format(target.name(), lossShieldValue, value);
    return text;
  };

  //====================================================================
  // ●Game_BattlerBase
  //====================================================================
  const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    _Game_BattlerBase_initMembers.call(this);
    this.clearDamageCutShield();
  };

  Game_BattlerBase.prototype.damageCutShield = function() {
    return this._damageCutShield;
  };

  Game_BattlerBase.prototype.isShieldState = function() {
    return this.isStateAffected(STATEID_Shield);
  };

  Game_BattlerBase.prototype.addDamageCutShieldState = function() {
    this.addState(STATEID_Shield);
  };

  // シールド値を増加
  Game_BattlerBase.prototype.gainDamageCutShield = function(value) {
    this._damageCutShield += value;
    this._damageCutShield = this.clampMaxShieldValue(this._damageCutShield);
    this._damageCutShield = Math.max(this._damageCutShield, 0);   
    if(value > 0) {
      this.addDamageCutShieldState();
    }
    if(this._damageCutShield <= 0) {
      this.eraseState(STATEID_Shield);
    }
  };

  // シールド最大値の適用
  Game_BattlerBase.prototype.clampMaxShieldValue = function(value) {
    let maxValue = Math.min(MAX_Shield, this.damageCutShieldMax());
    if(maxValue <= 0) return value; // 設定値が0の場合は値をそのまま返す
    return Math.min(value, maxValue);
  };

  // バトラー個別のシールド最大値
  Game_BattlerBase.prototype.damageCutShieldMax = function() {
    let formula;
    if(this.isActor()) {
      formula = $dataActors[this.actorId()].meta.damageCutShieldMax;
    } else if (this.isEnemy()) {
      formula = $dataEnemies[this.enemyId()].meta.damageCutShieldMax;
    }
    try {
      const a = this;
      const value = Math.floor(eval(formula));
      return isNaN(value) ? 0 : value;
    } catch (e) {
      return 0;
    } 
  };

  // シールド値を代入
  Game_BattlerBase.prototype.setDamageCutShield = function(value) {
    this._damageCutShield = value;
  };

  // シールド値をクリア
  Game_BattlerBase.prototype.clearDamageCutShield = function() {
    this._damageCutShield = 0;
    this.eraseState(STATEID_Shield);
  };

  //====================================================================
  // ●Game_Battler
  //====================================================================
  
  // 与えるシールド増加量バフの値
  Game_Battler.prototype.giveDamageCutShieldRate = function() {
    let rate = 1.0;
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item) {
          rate += Number(item.meta.GiveShieldRate) || 0;
        }
      }
    }
    for (const state of this.states()) {
      rate += Number(state.meta.GiveShieldRate) || 0;
    }
    return Math.max(rate, 0);
  };

  // 受けるシールド増加量バフの値
  Game_Battler.prototype.receiveDamageCutShieldRate = function() {
    if(this.isInvalidShieldState()) return 0;  // シールド無効状態の場合は0を返す
    let rate = 1.0;
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item) {
          rate += Number(item.meta.ReceiveShieldRate) || 0;
        }
      }
    }    
    for (const state of this.states()) {
      rate += Number(state.meta.ReceiveShieldRate) || 0;
    }
    return Math.max(rate, 0);
  };  

  const _KEN_Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
  Game_Battler.prototype.onTurnEnd = function(){
    _KEN_Game_Battler_onTurnEnd.call(this);
    this.reduceHpWithShield();      // スリップダメージ処理
    if(!this.isStateAffected(STATEID_Shield)) {
      this.setDamageCutShield(0);   // シールドがなくなった場合ステートを解除
    }
  };

  const _KEN_Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function(){
    _KEN_Game_Battler_onBattleEnd.call(this);
    this.clearDamageCutShieldOnBattleEnd();
  };

  Game_Battler.prototype.clearDamageCutShieldOnBattleEnd = function() {
    const state = $dataStates[STATEID_Shield]
    if (state.removeAtBattleEnd) {
      this.clearDamageCutShield();
    }
  };

  Game_Battler.prototype.isInvalidShieldState = function() {
    // エネミーの場合は処理しない
    if( this.isActor() ) {
      for (const item of this.equips()) {
        if (item) {
          if(item.meta.InvalidShield) return true;
        }
      }
    }
    
    for (const state of this.states()) {
      if(state.meta.InvalidShield) return true;
    }

    return false;
  };

  // シールドを適用したHPダメージ
  Game_Battler.prototype.executeHpDamageWithShield = function(value) {
    const actualDamage = Math.max(value - this.damageCutShield(), 0);
    this.gainDamageCutShield(-value);
    this._result.hpDamage = actualDamage;
    if (actualDamage > 0) {
      this._result.hpAffected = true;      
    }
    this.setHp(this.hp - actualDamage);
  };

  // シールド状態を適用したスリップダメージ
  Game_Battler.prototype.reduceHpWithShield = function() {
    this.executeHpDamageWithShield(this.slipDamageWithShield());
  };
  
  // スリップダメージ値の取得
  Game_Battler.prototype.slipDamageWithShield = function() {
    let value = 0;
    // エネミーの場合は処理しない
    if( this.isActor() ) {
      for (const item of this.equips()) {
        if (item) {
          if(item.meta.DamageWithShield) {
            value += this.itemSlipDamage(item.meta.DamageWithShield);
          }
        }
      }
    }    
    for (const state of this.states()) {
      if(state.meta.DamageWithShield) {
        value += this.itemSlipDamage(state.meta.DamageWithShield);
      }      
    }
    return value;
  };

  Game_Battler.prototype.itemSlipDamage = function(formula){
    try {
      const a = this;
      const value = Math.max( Math.floor(eval(formula)), 0);
      return isNaN(value) ? 0 : value;
    } catch (e) {
      return 0;
    }
  };


  //====================================================================
  // ●Game_Action
  //====================================================================

  // HPダメージ処理
  // メソッドを上書き
  const _KEN_Game_Action_ExecuteHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function(target, value) {
    let shieldValue = target.damageCutShield();
    target.result().previousShield = shieldValue;
    let blockedValue = value;
    const item = this.item();
    const penetrateFlag = item.meta.penetrateShield;  // シールド貫通属性

    // HPダメージのときのみシールド発動
    if( value > 0 && !penetrateFlag && target.isShieldState()) {
      blockedValue = Math.max(value - shieldValue, 0);   // シールド適用後のダメージ
      target.gainDamageCutShield( -value );
      target.result().afterShield = target.damageCutShield();   // シールド残量
      target.result().lossShieldValue =  Math.min(value, shieldValue);   // シールド減少値

      // ダメージがシールドより大きい場合はシールド破壊フラグをON
      if (value >= shieldValue) {
        target.result().breakShield = true;
        target.clearDamageCutShield();
      }
      target.result().blockDamageWithShield = true;
    }

    // 従来の処理
    // シールド適用後のダメージが反映される
    _KEN_Game_Action_ExecuteHpDamage.call(this, target, blockedValue);
  };

  Game_Action.prototype.isShieldAction = function() {
    const item = this.item();
    return item && item.meta.damageCutShield;
  };

  const _KEN_Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    this.applyItemDamageCutShield(target);
    _KEN_Game_Action_applyItemUserEffect.call(this);
  };

  Game_Action.prototype.applyItemDamageCutShield = function(target) {
    const item = this.item();
    const value = this.evalMetaFormula(target, item.meta.damageCutShield);
    if(value != 0) {
      target.gainDamageCutShield(value);  // バトラーのシールドを増減
      target.result().gainShieldValue = value;
      this.makeSuccess(target);
    }
    if(value > 0) {
      target.result().gainShield = true;
    }
    if(value < 0) {
      target.result().lossShield = true;
    }
  };

  Game_Action.prototype.evalMetaFormula = function(target, formula){
    try {
      const item = this.item();
      const a = this.subject(); // eslint-disable-line no-unused-vars
      const b = target; // eslint-disable-line no-unused-vars
      const v = $gameVariables._data; // eslint-disable-line no-unused-vars
      const giveRate = a.giveDamageCutShieldRate();
      const receiveRate = b.receiveDamageCutShieldRate();
      const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
      const value = Math.max( Math.floor( eval(formula) * giveRate * receiveRate ), 0) * sign;
      return isNaN(value) ? 0 : value;
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const _KEN_Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
  Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    const item = this.item();
    return _KEN_Game_Action_hasItemAnyValidEffects.call(this, target) || item.meta.damageCutShield;
  };

  //====================================================================
  // ●Game_Result
  //====================================================================
  const _KEN_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _KEN_Game_ActionResult_clear.call(this);
    this.breakShield = false;
    this.gainShield = false;
    this.lossShield = false;
    this.blockDamageWithShield = false;
    this.previousShield = 0;    //前のシールド値
    this.afterShield = 0;       //変化後のシールド値
    this.gainShieldValue = 0;   //増減したシールド値
    this.lossShieldValue = 0;   //ダメージによって減少したシールド値
  };

  Game_ActionResult.prototype.isShieldEffect = function() {
    return this.breakShield || this.gainShield || this.lossShield || this.blockDamageWithShield;
  };

  //====================================================================
  // ●Sprite_Gauge
  //====================================================================
  const _KEN_Sprite_Gauge_initMembers = Sprite_Gauge.prototype.initMembers;
  Sprite_Gauge.prototype.initMembers = function() {
    _KEN_Sprite_Gauge_initMembers.call(this);
    this._shieldValue = NaN;
    this._maxShieldValue = NaN;
    this._targetShieldValue = NaN;
    this._targetMaxShieldValue = NaN;
    this._durationShield = 0;
  };

  const _KEN_Sprite_Gauge_setup = Sprite_Gauge.prototype.setup;
  Sprite_Gauge.prototype.setup = function(battler, statusType) {
    _KEN_Sprite_Gauge_setup.call(this, battler, statusType);
    // HPスプライト作成時にシールド用パラメータも設定
    if(statusType == "hp") {
      this._shieldValue = this.currentShieldValue();
      this._maxShieldValue = this.currentMaxShieldValue();
      this.setupShieldIconSprite();
      this.setupShieldTurnSprite();
    }
  };

  Sprite_Gauge.prototype.setupShieldIconSprite = function() {
    if(this._shieldIconSprite) return;
    const sprite = new Sprite();
    sprite.bitmap = ImageManager.loadSystem("IconSet");
    const iconIndex = LABEL_IconIndex;      
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const iconOffsetX = this.isEnemy() ? ENEMY_IconOffsetX : 0;
    const iconOffsetY = this.isEnemy() ? ENEMY_IconOffsetY : 0;
    sprite.setFrame(sx, sy, pw, ph);
    sprite.x = LABEL_IconX + iconOffsetX;
    sprite.y = LABEL_IconY + iconOffsetY;
    this._shieldIconSprite = sprite;
    this.addChild(sprite);
    this.drawShieldIcon();
  };

  Sprite_Gauge.prototype.setupShieldTurnSprite = function() {
    if(this._shieldTurnSprite) return;
    const sprite = new Sprite();
    sprite.bitmap = new Bitmap(TURN_FontSize, TURN_FontSize);
    sprite.x = TURN_TurnX + (this.isEnemy() ? ENEMY_TurnOffsetX : 0);
    sprite.y = TURN_TurnY + (this.isEnemy() ? ENEMY_TurnOffsetY : 0); 
    this._shieldTurnSprite = sprite;
    this.addChild(sprite);
  };

  Sprite_Gauge.prototype.drawShieldTurn = function() {
    const sprite = this._shieldTurnSprite;    
    if(!this._shieldTurnSprite) return;
    sprite.bitmap.clear();
    if(!this.isShieldStateAffected() || !$gameParty.inBattle()) return;
    const currentValue = this.shieldStateTurn();      
    const width = TURN_FontSize;
    const height = TURN_FontSize;
    sprite.bitmap.drawText(currentValue, 0, 0, width, height, "right");    
  };

  Sprite_Gauge.prototype.drawShieldIcon = function() {
    if(!this._shieldIconSprite) return;
    const sprite = this._shieldIconSprite;
    if( this.isShieldStateAffected() ) {        
      sprite.show();
    } else {
      sprite.hide();
    }
  };

  Sprite_Gauge.prototype.isEnemy = function() {
    if( this._battler ){
      return this._battler.isEnemy();
    }
    return false;
  };

  Sprite_Gauge.prototype.isShieldStateAffected = function() {
    if( this._battler ){
      return this._battler.isShieldState();
    }
    return false;
  };

  Sprite_Gauge.prototype.shieldStateTurn = function() {
    if(this._battler) {
      return this._battler._stateTurns[STATEID_Shield] || -1;
    }
    return -1;
  };

  Sprite_Gauge.prototype.currentShieldValue = function() {
    if (this._battler) {
      return this._battler.damageCutShield();
    }
    return NaN;
  };

  Sprite_Gauge.prototype.currentMaxShieldValue = function() {
    if (this._battler) {
      return this._battler.mhp;
    }
    return NaN;
  };

  Sprite_Gauge.prototype.drawShieldValue = function() {
    if(!this.isShieldStateAffected()) return;
    const currentValue = this.currentShieldValue();
    const width = this.bitmapWidth();
    const height = this.textHeight();
    const offsetX = GAUGE_ValueOffsetX;
    const offsetY = GAUGE_ValueOffsetY;
    this.setupValueFontShield();
    this.bitmap.drawText(currentValue, offsetX, offsetY, width, height, "left");
  };

  Sprite_Gauge.prototype.shieldGaugeColor1 = function() {
    return GAUGE_Color1;
  };

  Sprite_Gauge.prototype.shieldGaugeColor2 = function() {
    return GAUGE_Color2;
  };

  const _KEN_Sprite_Gauge_redraw = Sprite_Gauge.prototype.redraw;
  Sprite_Gauge.prototype.redraw = function() {
    if( this._statusType === "hp") {
      this.bitmap.clear();
      const currentValue = this.currentValue();
      if (!isNaN(currentValue) && !isNaN(this.currentShieldValue())) {
        // HPバー枠に描画
        if(GAUGE_Display && (GAUGE_DisplayType == 1)) {          
          this.drawShieldGauge();     
        }
        this.drawGauge();
        // HPバーの上に描画
        if(GAUGE_Display && (GAUGE_DisplayType == 0)) {
          this.drawShieldGauge();
        }
        this.drawShieldValue();
        this.drawLabel();
        if (this.isValid()) {
          this.drawValue();
        }
      }
    } else {
      _KEN_Sprite_Gauge_redraw.call(this);
    }
  };  

  Sprite_Gauge.prototype.drawShieldGauge = function() {
    const gaugeX = this.gaugeX();
    const gaugeY = this.textHeight() - this.gaugeHeight();
    const gaugeWidth = this.bitmapWidth() - gaugeX;
    const gaugeHeight = this.gaugeHeight();
    const frameWidth = this.shieldGaugeFrameWidth();
    this.drawShieldGaugeRect(gaugeX - frameWidth, gaugeY - frameWidth, gaugeWidth + frameWidth*2, gaugeHeight + frameWidth*2);
  };

  Sprite_Gauge.prototype.shieldGaugeFrameWidth = function() {
    return GAUGE_DisplayType == 0 ? 0 : 3;
  };

  // シールドゲージの描画
  Sprite_Gauge.prototype.drawShieldGaugeRect = function(x, y, width, height) {
    // ゲージ背景色は描画しない
    const rate = this.shieldGaugeRate();
    const fillW = Math.floor((width - 2) * rate);
    const fillH = height - 2;
    const color1 = this.shieldGaugeColor1();
    const color2 = this.shieldGaugeColor2();
    this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
  };

  Sprite_Gauge.prototype.shieldGaugeRate = function() {
    if (this.isShieldStateAffected()) {
      const value = this._shieldValue;
      const maxValue = this._maxShieldValue;
      return maxValue > 0 ? value / maxValue : 0;
    } else {
      return 0;
    }
  };

  const _Sprite_Gauge_update = Sprite_Gauge.prototype.update;
  Sprite_Gauge.prototype.update = function() {
    _Sprite_Gauge_update.call(this);
    this.updateShieldIcons();
  };

  const _Sprite_Gauge_updateBitmap = Sprite_Gauge.prototype.updateBitmap;
  Sprite_Gauge.prototype.updateBitmap = function() {    
    if( this._statusType === "hp") {
      // HP
      const value = this.currentValue();
      const maxValue = this.currentMaxValue();      
      if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
          this.updateTargetValue(value, maxValue);
      }
      // Shield
      const shieldValue = this.currentShieldValue();
      const maxShieldValue = this.currentMaxShieldValue();
      if (shieldValue !== this._targetShieldValue || maxShieldValue !== this._targetMaxShieldValue) {
        this.updateTargetValueShield(shieldValue, maxShieldValue);
      }
      this.updateGaugeAnimation();
      this.updateFlashing();
      this.updateShieldGaugeAnimation();
    } else {
      _Sprite_Gauge_updateBitmap.call(this);
    }
  };

  Sprite_Gauge.prototype.updateTargetValueShield = function(value, maxValue) {
    this._targetShieldValue = value;
    this._targetMaxShieldValue = maxValue;
    if (isNaN(this._shieldValue)) {
        this._shieldValue = value;
        this._maxShieldValue = maxValue;
        this.redraw();
    } else {
        this._durationShield = this.smoothness();
    }
  };

  Sprite_Gauge.prototype.updateShieldGaugeAnimation = function() {
    if (this._durationShield > 0) {
      const d = this._durationShield;
      this._shieldValue = (this._shieldValue * (d - 1) + this._targetShieldValue) / d;
      this._maxShieldValue = (this._maxShieldValue * (d - 1) + this._targetMaxShieldValue) / d;
      this._durationShield--;
      this.redraw();
    }
  };

  Sprite_Gauge.prototype.setupValueFontShield = function() {
    this.bitmap.fontFace = this.valueFontFace();
    this.bitmap.fontSize = this.valueFontSizeShield();
    this.bitmap.textColor = ColorManager.normalColor();
    this.bitmap.outlineColor = this.valueOutlineColor();
    this.bitmap.outlineWidth = this.valueOutlineWidth();
  };

  Sprite_Gauge.prototype.valueFontSizeShield = function() {
    return GAUGE_ValueFontSize;
  };  

  Sprite_Gauge.prototype.updateShieldIcons = function() {
    this.drawShieldIcon();
    if(TURN_Display) this.drawShieldTurn();   
  };

})();
