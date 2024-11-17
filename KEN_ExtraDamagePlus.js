/*
----------------------------------------------------------------------------
 KEN_ExtraDamagePlus v1.0.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/11/17 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc 追加ダメージプラグイン
 * @author KEN
 * @version 1.0.0
 * @url https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ExtraDamagePlus.js
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * 
 * 追加ダメージバフを得る装備・ステートを実装します。
 * この追加ダメージはダメージ計算式と独立して扱われます。
 *
 * 数式を記述することで使用者の攻撃力や攻撃対象の防御力を参照して
 * 追加ダメージを発生させることも可能です。
 * 
 * 【追加ダメージの仕様】
 * この追加ダメージはアイテム・スキルのダメージ設定を
 * 「HPダメージ」または「HP吸収」に設定したとき発生します。
 * 
 * 【ダメージポップアップの表示位置】
 * デフォルト設定では通常のダメージの右側に表示されます。
 * 表示位置はプラグインパラメータで調整可能です。
 * 
 * -------------------------    使い方    -------------------------
 * 
 * <ExtraDamageBuff:数値 or 数式>
 * 記述欄： 武器・防具・ステート
 * 追加ダメージバフを得ます。数値は0より大きい値を指定してください。
 * 数式の結果は0以上に丸め込まれます。
 * 例．
 * <ExtraDamageBuff:10> 攻撃時10の追加ダメージが発生します
 * <ExtraDamageBuff:a.atk * 0.2> スキル使用者の攻撃力20%の追加ダメージが発生します
 * <ExtraDamageBuff:100 - b.def * 0.5> 100から攻撃対象の防御力の半分を引いた値の
 * 追加ダメージが発生します
 * 
 * <ExtraDamageDebuff:数値 or 数式>
 * 記述欄： 武器・防具・ステート
 * 被ダメージ時に追加ダメージを受けるようになります。数値は0より大きい値を指定してください。
 * 数式で用いられる計算式はExtraDamageBuffと同じです。
 * （a:スキル使用者, b:ターゲット であることに注意ください）
 * 
 * <InvalidExtraDamage>
 * 記述欄： アイテム・スキル
 * このタグが設定されたアイテム・スキルは追加ダメージが適用されなくなります。
 * 
 * 
 * @param displayExtraDamage
 * @text ポップアップを表示する
 * @desc 追加ダメージを通常ダメージと独立して表示させます
 * @type boolean
 * @default true
 * 
 * @param popUpText
 * @text ポップアップテキスト
 * @desc 追加ダメージのポップアップ表記を設定します（%1が追加ダメージの値です）
 * @type string
 * @default +%1
 * 
 * @param popUpOffsetX
 * @text ポップアップX座標
 * @desc ポップアップ表示のX座標
 * @type number
 * @default 0
 * @max 1000
 * @min -1000
 * 
 * @param popUpOffsetY
 * @text ポップアップY座標
 * @desc ポップアップ表示のY座標
 * @type number
 * @default 0
 * @max 1000
 * @min -1000
 * 
 * @param fontSize
 * @text フォントサイズ
 * @desc 追加ダメージのフォントサイズ
 * @type number
 * @default 20
 * 
 * @param fontColor
 * @text フォントカラー
 * @desc シールドのゲージ色2（デフォルト: rgba(255, 255, 128, 1)）
 * @type string
 * @default rgba(255, 255, 128, 1)
 * 
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_ExtraDamagePlus";
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

  const POPUP_FontSize = param.fontSize || 20;
  const POPUP_OffsetX = param.popUpOffsetX;
  const POPUP_OffsetY = param.popUpOffsetY;
  const POPUP_DisplayExtraDamage = param.displayExtraDamage;
  const POPUP_ColorExtraDamage = param.fontColor || "rgba(255, 255, 128, 1)";
  const POPUP_Text = param.popUpText;

  //====================================================================
  // ●Window_BattleLog
  //====================================================================
  const _KEN_Window_BattleLog = Window_BattleLog.prototype.popupDamage;
  Window_BattleLog.prototype.popupDamage = function(target) {
    _KEN_Window_BattleLog.call(this, target)
    this.popupExtraDamage(target);
  };

  Window_BattleLog.prototype.popupExtraDamage = function(target) {
    if (POPUP_DisplayExtraDamage && target.shouldPopupExtraDamage()) {
      target.startExtraDamagePopup();
    }
  };

  //====================================================================
  // ●Game_Battler
  //====================================================================
  const Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    Game_Battler_initMembers.call(this);
    this._extraDamagePopup = false;
  };

  Game_Battler.prototype.startExtraDamagePopup = function() {
    this._extraDamagePopup = true;
  };

  Game_Battler.prototype.clearExtraDamagePopup = function() {
    this._extraDamagePopup = false;
  };

  Game_Battler.prototype.getExtraDamageBuffFormula = function() {
    let formulaList = [];
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item && item.meta.ExtraDamageBuff) {
          formulaList.push(item.meta.ExtraDamageBuff);
        }
      }
    }
    for (const state of this.states()) {
      if(state.meta.ExtraDamageBuff) {
        formulaList.push(state.meta.ExtraDamageBuff);
      }      
    }
    return formulaList;
  };

  Game_Battler.prototype.getExtraDamageDebuffFormula = function() {
    let formulaList = [];
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item && item.meta.ExtraDamageDebuff) {
          formulaList.push(item.meta.ExtraDamageDebuff);
        }
      }
    }
    for (const state of this.states()) {
      if(state.meta.ExtraDamageDebuff) {
        formulaList.push(state.meta.ExtraDamageDebuff);
      }      
    }
    return formulaList;
  };

  Game_Battler.prototype.shouldPopupExtraDamage = function() {
    const result = this._result;
    return Math.abs(result.extraHpDamage) > 0;
  };

  Game_Battler.prototype.isExtraDamagePopupRequested = function() {
    return this._extraDamagePopup;
  };  

  //====================================================================
  // ●Game_Action
  //====================================================================
  const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
  Game_Action.prototype.makeDamageValue = function(target, critical) {
    const originDamage = _Game_Action_makeDamageValue.call(this, target, critical);
    const item = this.item();
    let extraDamage = 0;

    // HPダメージの処理
    if( !item.meta.InvalidExtraDamage && this.isHpDamageOrDrain() ) {
      extraDamage = this.makeExtraDamageValue(target);
      target._result.originHpDamage = originDamage;
      target._result.extraHpDamage = extraDamage;
    }

    return originDamage + extraDamage;
  };

  Game_Action.prototype.isHpDamageOrDrain = function() {
    return this.checkDamageType([1, 5]);
  };

  Game_Action.prototype.isMpDamageOrDrain = function() {
    return this.checkDamageType([2, 6]);
  };

  Game_Action.prototype.makeExtraDamageValue = function(target) {    
    const subject = this.subject();
    let result = 0;

    for(const formula of subject.getExtraDamageBuffFormula()) {
      result += this.evalExtraDamage(formula, target);
    }
    for(const formula of target.getExtraDamageDebuffFormula()) {
      result += this.evalExtraDamage(formula, target);
    }

    return result;
  };

  Game_Action.prototype.evalExtraDamage = function(formula, target) {
    try {
      const a = this.subject();
      const b = target;
      const value = Math.floor(eval(formula));
      return isNaN(value) ? 0 : Math.max(0, value);
    } catch (e) {
      return 0;
    } 
  };

  //====================================================================
  // ●Game_ActionResult
  //====================================================================
  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);
    this.clearExtraDamage();
  };

  Game_ActionResult.prototype.clearExtraDamage = function() {
    this.originHpDamage = 0;
    this.extraHpDamage = 0;
  };

  //====================================================================
  // ●Sprite_Damage
  //====================================================================
  const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
  Sprite_Damage.prototype.initialize = function() {
    _Sprite_Damage_initialize.call(this);
  };

  const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
  Sprite_Damage.prototype.setup = function(target) {    
    const ehpDamage = target.result().extraHpDamage;
    if(POPUP_DisplayExtraDamage && ehpDamage > 0) {
      const result = target.result();
      if (result.missed || result.evaded) {
          this._colorType = 0;
          this.createMiss();
      } else if (result.hpAffected) {
          this._colorType = result.hpDamage >= 0 ? 0 : 1;
          this.createDigits(result.originHpDamage);
      } else if (target.isAlive() && result.mpDamage !== 0) {
          this._colorType = result.mpDamage >= 0 ? 2 : 3;
          this.createDigits(result.mpDamage);
      }
      if (result.critical) {
          this.setupCriticalEffect();
      }
      this.createExtraDamageString(ehpDamage);
    } else {
      _Sprite_Damage_setup.call(this, target);
    }
  };

  Sprite_Damage.prototype.createExtraDamageString = function(value) {
    const text = this.createExtraPopUpDamageText(value);
    const height = this.extraDamageFontSize();
    const width = Math.floor(height * 0.75 * (text.length+1));
    const valueText = value.toString();
    const valueTextWidth = Math.floor(height * 0.75 * (valueText.length));    
    const sprite = this.createChildSprite(width, height);
    const offsetX = Math.floor(valueTextWidth/2) + Math.floor(width/2) + this.extraDamageOffsetX();
    console.log(offsetX);

    sprite.bitmap.fontSize = this.extraDamageFontSize();
    sprite.bitmap.textColor = this.extraDamageFontColor();
    sprite.bitmap.drawText(text, 0, 0, width, height, "center");
    sprite.x = offsetX;
    sprite.dy = 0;
    sprite.isExtraDamageSprite = true;
  };

  Sprite_Damage.prototype.createExtraPopUpDamageText = function(value) {
    return POPUP_Text.replace("%1", value).toString();
  };

  const _Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild;
  Sprite_Damage.prototype.updateChild = function(sprite) {
    _Sprite_Damage_updateChild.call(this, sprite);
    if(sprite.isExtraDamageSprite) {      
      sprite.y += this.extraDamageOffsetY();
    }    
  };

  Sprite_Damage.prototype.extraDamageOffsetX = function() {
    return POPUP_OffsetX;
  };

  Sprite_Damage.prototype.extraDamageOffsetY = function() {
    return POPUP_OffsetY;
  };

  Sprite_Damage.prototype.extraDamageFontSize = function() {
    return POPUP_FontSize;
  };

  Sprite_Damage.prototype.extraDamageFontColor = function() {
    return POPUP_ColorExtraDamage;
  };
  
})();
