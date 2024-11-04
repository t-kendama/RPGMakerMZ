/*
----------------------------------------------------------------------------
 KEN_ExtraDamagePlus v0.8.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 0.8.0 2024/11/04 β版実装
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc 追加ダメージプラグイン
 * @author KEN
 * @version 0.8.0
 * @url 
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * 
 * 追加ダメージバフを得る装備・ステートを実装します。
 * この追加ダメージはダメージ計算式と独立して扱われ、バトラーのステータスの
 * 影響を受けません。
 * 
 * 
 * -------------------------    使い方    -------------------------
 * 
 * <ExtraDamageBuff:数値>
 * 記述欄： 武器・防具・ステート
 * 追加ダメージバフを得ます。数値は0より大きい値を指定してください。
 * 
 * <ExtraDamageDebuff:数値 or 数式>
 * 記述欄： 武器・防具・ステート
 * 被ダメージ時に追加ダメージを受けるようになります。数値は0より大きい値を指定してください。
 * 
 * <InvalidExtraDamage>
 * 記述欄： アイテム・スキル
 * このタグが設定されたアイテム・スキルは追加ダメージが適用されなくなります。
 * 
 * 
 * @param displayExtraDamage
 * @text ポップアップ表示
 * @desc 追加ダメージを通常ダメージと独立して表示させます。
 * @type boolean
 * @default true
 * 
 * @param fontSize
 * @text フォントサイズ
 * @desc 追加ダメージのフォントサイズ（デフォルト: 26）
 * @type number
 * @default 26
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

  const POPUP_FontSize = param.fontSize || 26;
  const POPUP_DisplayExtraDamage = param.displayExtraDamage;
  const POPUP_ColorExtraDamage = param.fontColor || "rgba(255, 255, 128, 1)";

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

  Game_Battler.prototype.extraDamageBuff = function() {
    let buff = 0;
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item) {
          buff += Number(item.meta.ExtraDamageBuff) || 0;
        }
      }
    }
    for (const state of this.states()) {
      buff += Number(state.meta.ExtraDamageBuff) || 0;
    }
    return Math.max(buff, 0);
  };

  Game_Battler.prototype.extraDamageDebuff = function() {
    let buff = 0;
    if (this.isActor()) {
      for (const item of this.equips()) {
        if (item) {
          buff += Number(item.meta.ExtraDamageDebuff) || 0;
        }
      }
    }
    for (const state of this.states()) {
      buff += Number(state.meta.ExtraDamageDebuff) || 0;
    }
    return Math.max(buff, 0);
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
    if( !item.meta.InvalidExtraDamage ) {
      extraDamage += this.subject().extraDamageBuff();
      extraDamage += target.extraDamageDebuff();
      target._result.originHpDamage = originDamage;
      target._result.extraHpDamage = extraDamage;
    }

    return originDamage + extraDamage;
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
    const string = Math.abs(value).toString();
    const h = this.extraDamageFontSize();
    const w = Math.floor(h * 0.75 * string.length);
    const offsetX = Math.floor(w);
    const label = "+";
    const sprite = this.createChildSprite(w, h);
    sprite.bitmap.fontSize = this.extraDamageFontSize();
    sprite.bitmap.textColor = this.extraDamageFontColor();
    sprite.bitmap.drawText(label + string, 0, 0, w, h, "center");
    sprite.anchor.x = 0.5;
    sprite.x = sprite.x + offsetX;
    sprite.y = this.extraDamageFontSize();
    sprite.dy = 0;
    sprite.isExtraDamageSprite = true;
  };

  const _Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild;
  Sprite_Damage.prototype.updateChild = function(sprite) {
    _Sprite_Damage_updateChild.call(this, sprite);
    if(sprite.isExtraDamageSprite) {
      sprite.y -= this.extraDamageFontSize();
    }    
  };

  Sprite_Damage.prototype.extraDamageFontSize = function() {
    return POPUP_FontSize;
  };

  Sprite_Damage.prototype.extraDamageFontColor = function() {
    return POPUP_ColorExtraDamage;
  };
  
})();