/*
----------------------------------------------------------------------------
 KEN_CustomizeGauge v1.0.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/11/16 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc アクターごとのパラメータ描画をカスタマイズ
 * @author KEN
 * @version 1.0.0
 * @url 
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * アクターごとのパラメータ描画形式をカスタマイズします。
 * 従来のゲージ形式のほか、パラメータを図形や画像形式で描画することも可能です。
 * 
 * 上記機能に加え、TPの最大値を変更する機能も提供します。
 * 
 * -------------------------    使い方    -------------------------
 * プラグインパラメータから設定します。
 * 描画設定はアクター毎に行います。
 *
 * 【基本設定】 
 * ・アクター設定
 * アクターのゲージ描画設定やTP設定を行います。
 * 未設定の場合、ゲージの描画はツクールのデフォルトの仕様となります。
 * 
 * ・最大TP上限値
 * TPの上限の最大値を設定します。
 * この値はアクターすべてに適用されます。
 * 
 * 【用語/略称（ラベル）設定】
 * 基本ステータスの用語を設定します。
 * この設定はツクールのデータベースより優先されます。
 * 空欄にすると表示されなくなるため、必ず設定ください。
 *  
 * 【HP/MP/TPゲージ描画設定】
 * ゲージに関する描画の詳細設定です。以下の描画方式に対応しています。
 * 画像・図形はパラメータの値の数だけ描画するため、最大値にはご注意ください。
 * ・ゲージ
 * ・画像（※1）
 * ・円(図形)
 * ・ひし形(図形)
 * ・平行四辺形(図形)
 * ※1: 画像はpicturesフォルダに格納ください (画像サイズは24x24推奨)
 * 
 * 【色設定】
 * ゲージ・図形の色を設定します。
 * rgba(red, green, blue, alpha)　で表記します。
 * RGB値は 0 - 255, alpha値は 0 - 1の間で設定します。
 * 例．rgba(128, 255, 128, 1)
 * 空欄の場合、ツクールのデフォルト色を使用します。
 * 
 * 
 * @param actorConfig
 * @text アクター設定
 * @desc アクターの設定リストです。未設定の場合、ツクールデフォルトの設定が適用されます。
 * @default []
 * @type struct<ActorConfig>[]
 * 
 * @param gameMaxTp
 * @text 最大TP上限値
 * @desc キャラクター共通に適用する最大TPの上限値です。
 * @type number
 * @default 100
 * @min 0
 * 
 */
/*~struct~ActorConfig:
 *
 * @param actorId
 * @text アクターID
 * @desc アクターの詳細設定です　設定のないアクターはデフォルトの描画方式になります
 * @default 1
 * @type actor
 * 
 * @param hpConfig
 * @text HPゲージ描画設定
 * @desc HPゲージの描画方法を設定します 
 * @default {"General":"","displayGauge":"true","hideOutBattle":"false","term":"ＨＰ","label":"HP","labelBitmap":"","DisplayGeneral":"","displayType":"0","itemPadding":"1","displayValue":"true","valueFontSize":"20","Gauge":"","gaugeHeight":"12","Shape":"","iconWidth":"16","Bitmap":"","bitmapFill":"","bitmapFrame":"","bitmapBack":"","Color":"","gaugeColor1":"","gaugeColor2":"","gaugeBackColor":""}
 * @type struct<ParameterConfig>
 * 
 * @param mpConfig
 * @text MPゲージ描画設定
 * @desc MPゲージの描画方法を設定します
 * @default {"General":"","displayGauge":"true","hideOutBattle":"false","term":"ＭＰ","label":"MP","labelBitmap":"","DisplayGeneral":"","displayType":"0","itemPadding":"1","displayValue":"true","valueFontSize":"20","Gauge":"","gaugeHeight":"12","Shape":"","iconWidth":"16","Bitmap":"","bitmapFill":"","bitmapFrame":"","bitmapBack":"","Color":"","gaugeColor1":"","gaugeColor2":"","gaugeBackColor":""}
 * @type struct<ParameterConfig>
 * 
 * @param tpConfig
 * @text TPゲージ描画方法を設定します
 * @desc TPゲージの描画設定です
 * @default {"General":"","displayGauge":"true","hideOutBattle":"false","term":"ＴＰ","label":"TP","labelBitmap":"","DisplayGeneral":"","displayType":"0","itemPadding":"1","displayValue":"true","valueFontSize":"20","Gauge":"","gaugeHeight":"12","Shape":"","iconWidth":"16","Bitmap":"","bitmapFill":"","bitmapFrame":"","bitmapBack":"","Color":"","gaugeColor1":"","gaugeColor2":"","gaugeBackColor":""}
 * @type struct<ParameterConfig>
 * 
 * @param TPConfig
 * @text TP詳細設定
 * @desc TPに関する設定です　この項目は使用しません
 * 
 * @param defaultMaxTp
 * @text デフォルト最大TP
 * @desc TPのデフォルト最大値です
 * @type number
 * @default 100
 * @min 0
 * @parent TPConfig
 * 
 * @param onInitTp
 * @text 戦闘開始時にTPを初期化
 * @desc 戦闘開始時にTPを初期化します（デフォルト: true）
 * @type boolean
 * @default true
 * @parent TPConfig
 * 
 */
/*~struct~ParameterConfig:
 * @param General
 * @text 描画共通設定
 * @desc 描画に関する共通の設定です　この項目は使用しません
 *
 * @param displayGauge
 * @text ゲージ/図形を表示
 * @desc ゲージ/図形を表示します
 * @type boolean
 * @default true
 * @parent General
 * 
 * @param hideOutBattle
 * @text 非戦闘時ゲージを隠す
 * @desc 非戦闘時（メニュー画面など）ゲージを非表示にします
 * @type boolean
 * @default false
 * @parent General
 * 
 * @param term
 * @text 用語
 * @desc 用語を設定します
 * @type string
 * @parent General
 * 
 * @param label
 * @text 略称（ラベル）
 * @desc 用語の略称（ラベル）を設定します
 * @type string
 * @parent General
 * 
 * @param labelBitmap
 * @text ラベル画像
 * @desc 略称を画像に置き換えます　空欄にすると略称が使用されます
 * @type file
 * @dir img/pictures
 * @parent General
 *
 * @param DisplayGeneral
 * @text 描画共通設定
 * @desc 描画に関する共通設定です　この項目は使用しません
 * 
 * @param displayType
 * @text 描画方式
 * @desc 描画方法を変更します
 * @type select
 * @option ゲージ
 * @value 0
 * @option 画像
 * @value 1
 * @option 円（図形）
 * @value 2
 * @option ひし型（図形）
 * @value 3
 * @option 平行四辺形（図形）
 * @value 4
 * @default 0
 * @parent DisplayGeneral
 * 
 * @param itemPadding
 * @text 描画間隔
 * @desc 画像・図形の表示間隔を設定します（ゲージ描画では使用しません）
 * @type number
 * @default 1
 * @parent DisplayGeneral
 * 
 * @param displayValue
 * @text 値を表示
 * @desc 値を表示します
 * @type boolean
 * @default true
 * @parent DisplayGeneral
 * 
 * @param valueFontSize
 * @text 値のフォントサイズ
 * @desc 値のフォントサイズを指定します
 * @type number
 * @default 20
 * @parent DisplayGeneral
 * 
 * @param Gauge
 * @text ゲージ設定
 * @desc ゲージを描画する時の設定です　この項目は使用しません
 * 
 * @param gaugeHeight
 * @text ゲージの高さ
 * @desc ゲージの高さを設定します(デフォルト：12)
 * @type number
 * @default 12
 * @parent Gauge
 * 
 * @param Shape
 * @text 図形設定
 * @desc 図形を描画するときの設定です　この項目は使用しまぜん
 * 
 * @param iconWidth
 * @text 図形幅
 * @desc 図形の幅を設定します
 * @type number
 * @default 16
 * @parent Shape
 * 
 * @param Bitmap
 * @text 画像設定
 * @desc 画像を描画するときの設定です　この項目は使用しまぜん
 * 
 * @param bitmapFill
 * @text メイン画像（必須）
 * @desc 値があるときに使用する画像です　画像を描画する時は必ず設定してください
 * @type file
 * @dir img/pictures
 * @parent Bitmap
 * 
 * @param bitmapFrame
 * @text 枠画像
 * @desc 枠に使用する画像です　この画像はメイン画像より前に表示します
 * @type file
 * @dir img/pictures
 * @parent Bitmap
 * 
 * @param bitmapBack
 * @text 背景画像
 * @desc ゲージ背景に使用する画像です　この画像はメイン画像の後ろに表示します
 * @type file
 * @dir img/pictures
 * @parent Bitmap
 * 
 * @param Color
 * @text 色設定
 * @desc 図形・ゲージを描画する時の色を設定します　この項目は使用しません
 * 
 * @param gaugeColor1
 * @text 図形・ゲージ色1
 * @desc ゲージ色1を設定します。空欄にすると標準のゲージ色になります
 * @type string
 * @parent Color
 * 
 * @param gaugeColor2
 * @text 図形・ゲージ色2
 * @desc ゲージ色2を設定します　空欄にすると標準のゲージ色になります
 * @type string
 * @parent Color
 * 
 * @param gaugeBackColor
 * @text 図形・ゲージ背景色
 * @desc 図形・ゲージの背景色を設定します　空欄にすると標準の背景色になります
 * @type string
 * @parent Color
 * 
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_CustomizeGauge";
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

  function isPluginLoaded(pluginName) {
    return $plugins.some(plugin => plugin.name === pluginName && plugin.status);
  }

  const CONFIG_LimitMaxTp = param.gameMaxTp || 100;


  //-----------------------------------------------------------------------------
  // Bitmap
  //-----------------------------------------------------------------------------

  Bitmap.prototype.drawDiamond = function(x, y, width, height, color) {
    const context = this.context;
    context.beginPath();
    context.moveTo(x, y - height / 2); // 上の頂点
    context.lineTo(x + width / 2, y);  // 右の頂点
    context.lineTo(x, y + height / 2); // 下の頂点
    context.lineTo(x - width / 2, y);  // 左の頂点
    context.closePath();
    context.fillStyle = color;
    context.fill();
    this._baseTexture.update() // 描画を更新
  };

  Bitmap.prototype.drawGradientDiamond = function(x, y, width, height, color1, color2) {
    const context = this.context;
    const gradient = context.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2);

    // グラデーションの色を設定
    gradient.addColorStop(0, color1); // 始点の色
    gradient.addColorStop(1, color2); // 終点の色

    context.beginPath();
    context.moveTo(x, y - height / 2); // 上の頂点
    context.lineTo(x + width / 2, y);  // 右の頂点
    context.lineTo(x, y + height / 2); // 下の頂点
    context.lineTo(x - width / 2, y);  // 左の頂点
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    this._baseTexture.update(); // 描画を更新
  };

  /**
 * Draws a bitmap in the shape of a circle with a gradient.
 *
 * @param {number} x - The x coordinate based on the circle center.
 * @param {number} y - The y coordinate based on the circle center.
 * @param {number} radius - The radius of the circle.
 * @param {string} color1 - The start color of the gradient in CSS format.
 * @param {string} color2 - The end color of the gradient in CSS format.
 */
  Bitmap.prototype.drawGradientCircle = function(x, y, radius, color1, color2) {
    const context = this.context;
    context.save();

    // グラデーションを作成（放射状グラデーション）
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color1); // 始点の色
    gradient.addColorStop(1, color2); // 終点の色

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();

    context.restore();
    this._baseTexture.update(); // 描画を更新
  };

  // 平行四辺形の描画
  Bitmap.prototype.drawParallelogram = function(x, y, width, height, offsetX, color) {
    const context = this.context;
    context.save();
    context.beginPath();

    // 各頂点の座標を指定
    context.moveTo(x, y); // 左上
    context.lineTo(x + width, y); // 右上
    context.lineTo(x + width - offsetX, y + height); // 右下（Xをオフセット）
    context.lineTo(x - offsetX, y + height); // 左下（Xをオフセット）
    
    context.closePath();
    context.fillStyle = color;
    context.fill();
    context.restore();

    // 描画を更新
    this._baseTexture.update();
  };

  Bitmap.prototype.drawGradientParallelogram = function(x, y, width, height, offsetX, color1, color2) {
    const context = this.context;
    context.save();

    // グラデーションの作成
    const gradient = context.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, color1); // 始点の色
    gradient.addColorStop(1, color2); // 終点の色

    context.beginPath();
    context.moveTo(x, y); // 左上
    context.lineTo(x + width, y); // 右上
    context.lineTo(x + width - offsetX, y + height); // 右下（Xをオフセット）
    context.lineTo(x - offsetX, y + height); // 左下（Xをオフセット）
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    context.restore();

    // 描画を更新
    this._baseTexture.update();
  };

  Bitmap.prototype.clearRegion = function(x, y, width, height) {
    const context = this.context;    
    // 指定された領域を透明にする
    context.clearRect(x, y, width, height);    
    // 描画を更新
    this._baseTexture.update();
  };

  Bitmap.prototype.clearTopRegion = function(height) {
    const width = this.width;
    const clearHeight = Math.min(height, this.height); 
    this.clearRegion(0, 0, width, clearHeight);
  };

  Bitmap.prototype.clearRightRegion = function(width) {
    const clearWidth = Math.min(width, this.width); // 幅がビットマップの幅を超えないように制限
    this.clearRegion(this.width - clearWidth, 0, clearWidth, this.height);
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase
  //-----------------------------------------------------------------------------

  // TP最大値を定義
  Object.defineProperty(Game_BattlerBase.prototype, "mtp", {
    get: function() {
      let value = this._mtp + this.mtpPlus();
      value = Math.min(value ,CONFIG_LimitMaxTp);
      value = Math.max(value, 0);
      return this._mtp;
    },
    set: function(value) {
      this._mtp = Math.max(0, value); // 0未満にならないよう制限
    },
    configurable: true
  });

  // 仮定義
  Game_BattlerBase.prototype.mtpPlus = function() {
    return 0;
  };

  Game_BattlerBase.prototype.customParamConfig = function() {
    if(param.actorConfig) {
      const config = param.actorConfig.find(config => config.actorId == this._actorId);
      return config;
    }
    return null;
  };

  Game_BattlerBase.prototype.hpConfig = function() {    
    return this.customParamConfig() ? this.customParamConfig().hpConfig : null;
  };

  Game_BattlerBase.prototype.mpConfig = function() {
    return this.customParamConfig() ? this.customParamConfig().mpConfig : null;
  };

  Game_BattlerBase.prototype.tpConfig = function() {
    return this.customParamConfig() ? this.customParamConfig().tpConfig : null;
  };  
  
  Game_BattlerBase.prototype.isCustomizeParamConfig = function() {
    return this.customParamConfig() != undefined;
  };

  const _Game_BattleBase_maxTp = Game_BattlerBase.prototype.maxTp;
  Game_BattlerBase.prototype.maxTp = function() {
    if( this.isCustomizeParamConfig() && !isNaN(this.mtp)) {
      return this.mtp;
    }
    return _Game_BattleBase_maxTp.call(this);
  };

  Game_BattlerBase.prototype.gainMtp = function(value) {
    this.mtp = Math.max(0, this.mtp + value);
  };  

  Game_BattlerBase.prototype.onInitTp = function() {
    // アクターIDが1の場合、TPを非表示にする    
    if ( this.isCustomizeParamConfig() ) {      
      return this.customParamConfig().onInitTp;
    }
    return true;
  };

  Game_BattlerBase.prototype.isDisplayGauge = function(type) {    
    if ( this.isCustomizeParamConfig() ) {
      let config = null;
      switch (type) {
        case "hp":
          config = this.hpConfig();
          break;
        case "mp":
          config = this.mpConfig();
          break;
        case "tp":
          config = this.tpConfig();
          break;
      }
      if( $gameParty.inBattle() ) {
        return config.displayGauge;
      } else {
        return config.displayGauge && !config.hideOutBattle;
      }
    }
    return true;
  };

  //-----------------------------------------------------------------------------
  // Game_Actor
  //-----------------------------------------------------------------------------
  const _Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_setup.call(this, actorId);
    if ( this.isCustomizeParamConfig() ) {
      const config = this.customParamConfig();      
      this.mtp = config.defaultMaxTp > 0 ? config.defaultMaxTp : 100;
    } else {
      this.mtp = 100;
    }
  };

  const _Game_Battler_initTp = Game_Battler.prototype.initTp;
  Game_Actor.prototype.initTp = function() {
    if( this.onInitTp() ) {
      _Game_Battler_initTp.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_BattleLog
  //-----------------------------------------------------------------------------
  const _Window_BattleLog_makeTpDamageText = Window_BattleLog.prototype.makeTpDamageText;
  Window_BattleLog.prototype.makeTpDamageText = function(target) {
    if( target.isCustomizeParamConfig() ) {
      const result = target.result();
      const damage = result.tpDamage;
      const isActor = target.isActor();
      const tpText = target.tpConfig().term;
      let fmt;
      if (damage > 0) {
          fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
          return fmt.format(target.name(), tpText, damage);
      } else if (damage < 0) {
          fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
          return fmt.format(target.name(), tpText, -damage);
      } else {
          return "";
      }
    } else {
      _Window_BattleLog_makeTpDamageText.call(this, target);
    }    
  };
  
  //-----------------------------------------------------------------------------
  // Window_StatusBase
  //-----------------------------------------------------------------------------
  const _Window_StatusBase_placeBasicGauges = Window_StatusBase.prototype.placeBasicGauges;
  Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
    if(actor.isCustomizeParamConfig()) {
      if( actor.isDisplayGauge("hp") ) {
        this.placeCustomGauge(actor, "hp", x, y);
      }
      if( actor.isDisplayGauge("mp") ) {
        this.placeCustomGauge(actor, "mp", x, y + this.gaugeLineHeight());
      }      
      if ($dataSystem.optDisplayTp && actor.isDisplayGauge("tp")) {
        this.placeCustomGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
      }
    } else {
      _Window_StatusBase_placeBasicGauges.call(this, actor, x, y);
    }    
  };

  Window_StatusBase.prototype.placeCustomGauge = function(actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_CustomGauge);
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();
  };

  // ゲージの基本クラス
  class Sprite_CustomGauge extends Sprite_Gauge {
    initMembers() {
      super.initMembers();
      this._iconSprites = [];
      this._fillBitmap = null;
      this._valueSprite = null; //アイコンスプライトと被るので別定義
      this._labelBitmap = null;
      this._labelSprite = null;
      this._oldValue = NaN;
      this._oldMaxValue = NaN;
    }

    setup(battler, statusType) {
      this._battler = battler;
      this._statusType = statusType;
      this._value = this.currentValue();
      this._maxValue = this.currentMaxValue();
      this.loadLabelBitmap();
      this.updateBitmap();
    }    

    config() {
      switch (this._statusType) {
        case "hp":
            return this._battler.hpConfig();
        case "mp":
            return this._battler.mpConfig();
        case "tp":
            return this._battler.tpConfig();
        default:
            return null;
      }
    }

    loadLabelBitmap() {
      const config = this.config();
      if(config.labelBitmap) {
        const bitmap = ImageManager.loadPicture(config.labelBitmap);
        bitmap.addLoadListener(() => {
          this._labelBitmap = bitmap;
        });
      }
    }

    gaugeHeight() {
      const config = this.config();  
      if( config ) {
        if(config.gaugeHeight > 0) {
          return config.gaugeHeight;
        }
      }
      return super.gaugeHeight();
    }

    displayType() {
      if(this.config()) {
        return this.config().displayType ? this.config().displayType : 0;
      }
      return 0;
    }

    label() {
      if(this.config()) {
        return this.config().label ? this.config().label : "";
      }
      return "";
    }

    isShowValue() {      
      if(this.config()) {
        return this.config().displayValue;
      }
      return true;
    }

    setupIconSprites() {
      if(!this._battler) return;
      const maxValue = Math.max(this.currentMaxValue(), this._iconSprites.length);
      for(let i = 0 ; i < maxValue; i++) {
        if (this._iconSprites[i] !== undefined) {
          if(this.displayType() == 1) {
            //ここに更新処理
          } else {
            this._iconSprites[i].bitmap.clear();
          }
        } else {  
          let sprite;        
          if(this.displayType() == 1) {
            this.loadFillBitmap();
            sprite = new Sprite_ValueIcon();
            sprite.setup(this._battler, this._statusType, i);            
          } else {
            sprite = new Sprite();
            sprite.bitmap = this.createIconBitmap();   
          }
          this._iconSprites.push(sprite);
          this.addChild(sprite);
        }
      }
    }

    loadFillBitmap() {
      const config = this.config();
      if(config) {
        this._fillBitmap = ImageManager.loadPicture(config.bitmapFill);
      }
    }

    setupValueSprite() {
      if(!this.isShowValue()) return;
      if(this._valueSprite) {
        this.drawValueSprite();
      } else {
        const sprite = new Sprite();
        sprite.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
        this._valueSprite = sprite;
        this.addChild(sprite);
        this.drawValueSprite();
      }
    }

    drawLabel() {
      if( this._labelBitmap ) {
        if(this._labelSprite) {
          this.updateLabelSprite();
        } else {
          this.setupLabelSprite();
        }        
      } else {
        super.drawLabel();
      }
    }

    setupLabelSprite() {
      const sprite = new Sprite();
      sprite.bitmap = this._labelBitmap;
      sprite.x = this.labelOutlineWidth() / 2;
      sprite.y = this.textHeight() - sprite.bitmap.height + 2;
      this.addChild(sprite);
      this._labelSprite = sprite;
    }

    measureLabelWidth() {      
      const config = this.config();
      if(config) {
        if(this._labelBitmap) {
          return this._labelBitmap.width;
        } else {
          this.setupLabelFont();
          const text = config.label ? config.label : "";
          const width = this.bitmap.measureTextWidth(text);
          return Math.ceil(width);
        }        
      }
      return super.measureLabelWidth();
    }

    iconWidth() {
      const config = this.config();
      if(this._battler && config) {
        if(this.displayType() == 1) {
          if (this._fillBitmap) {
            return this._fillBitmap.width;
          }          
        } else {
          return config.iconWidth;
        }        
      }
      return 16;
    }

    iconHeight() {
      const config = this.config();
      if(this._battler && config) {
        switch (this.displayType()) {
          case 0:
            return config.gaugeHeight;
          case 1:            
            return this._fillBitmap ? this._fillBitmap.height : 16;             
          case 2:
          case 3:
            return config.iconWidth;
          case 4:
            return config.gaugeHeight;
          default:
            return 16;
        }
      }      
    }

    frameWidth() {
      return 2;
    }

    itemPadding() {
      const config = this.config();
      if(config) {
        return config.itemPadding;
      }
      return 0;
    }

    valueFontSize() {
      const config = this.config();
      if(config) {
        return config.valueFontSize;
      }
      return super.valueFontSize();
    }

    gaugeColor1() {
      const config = this.config();
      let defaultColor;
      switch (this._statusType) {
        case "hp":
          defaultColor = ColorManager.hpGaugeColor1();
          break;
        case "mp":
          defaultColor = ColorManager.mpGaugeColor1();
          break;
        case "tp":
          defaultColor = ColorManager.tpGaugeColor1();
          break;
        case "time":
          defaultColor = ColorManager.ctGaugeColor1();
          break;
        default:
          defaultColor = ColorManager.normalColor();
      }
      if(this._battler && config) {
        return config.gaugeColor1 ? config.gaugeColor1 : defaultColor;
      }
      return defaultColor;
    }

    gaugeColor2() {
      const config = this.config();
      let defaultColor;
      switch (this._statusType) {
        case "hp":
          defaultColor = ColorManager.hpGaugeColor2();
          break;
        case "mp":
          defaultColor = ColorManager.mpGaugeColor2();
          break;
        case "tp":
          defaultColor = ColorManager.tpGaugeColor2();
          break;
        case "time":
          defaultColor = ColorManager.ctGaugeColor2();
          break;
        default:
          defaultColor = ColorManager.normalColor();
          break;
      }
      if(this._battler && config) {        
        return config.gaugeColor2 ? config.gaugeColor2 : defaultColor;
      }
      return defaultColor;
    }

    gaugeBackColor() {
      const config = this.config();
      if(config) {
        return config.gaugeBackColor;
      }
      return super.gaugeBackColor();
    }

    updateTargetValue(value, maxValue) {
      if(this.displayType() > 0) {
        this._oldValue = this._targetValue;
        this._oldMaxValue = this._targetMaxValue;
      }
      super.updateTargetValue(value, maxValue);
    }

    updateGaugeAnimation() {
      if(this.displayType() > 0) {
        if (this._duration > 0) {
          this._duration--;
          this.redraw();
        }        
      } else {
        super.updateGaugeAnimation();
      }
    }

    redraw() {      
      if(isPluginLoaded("KEN_DamageCutShield") && this.displayType() == 0 && this._statusType === "hp") {
        // シールドプラグイン併用時の処理
        super.redraw();
      } else {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
          if(this.displayType() == 0) {
            this.drawGauge();
          } else {
            this.setupIconSprites();
            this.drawIcons();   
          }        
          this.drawLabel();
          if (this.isValid()) {
            //this.drawValue();
            this.setupValueSprite();
          }
        }
      }      
    }

    drawValueSprite() {
      const sprite = this._valueSprite;
      const currentValue = this.currentValue();
      const width = this.bitmapWidth();
      const height = this.textHeight();
      sprite.bitmap.clear();
      sprite.bitmap.fontFace = this.valueFontFace();
      sprite.bitmap.fontSize = this.valueFontSize();
      sprite.bitmap.textColor = this.valueColor();
      sprite.bitmap.outlineColor = this.valueOutlineColor();
      sprite.bitmap.outlineWidth = this.valueOutlineWidth();
      sprite.bitmap.drawText(currentValue, 0, 0, width, height, "right");
    }

    createIconBitmap() {
      const w = this.iconWidth();
      const h = this.iconHeight();
      return new Bitmap(w, h);
    }

    drawIcons() {
      for(let i = 0; i < this._iconSprites.length; i++) {
        this.updateIconBitmap(this._iconSprites[i], i);
      }
    }

    updateIconBitmap(sprite, value) {
      switch (this.displayType()) {
        case 1:
          // 画像の場合子クラスで処理するためここでは定義しない
          break;
        case 2:
          this.updateCircleIcon(sprite, value);       
          break;
        case 3:
          this.updateDiamondIcon(sprite, value);
          break;
        case 4:
          this.updateParallelogram(sprite, value);
          break;
        default:
          break;
      }
      sprite.x = this.iconCalcX(value);
      sprite.y = this.iconCalcY(value);
    }

    updateCircleIcon(sprite, value) {
      const radius = Math.floor(this.iconWidth()/2 * this.calcMaxRate(value));
      const innerRadius = Math.floor((radius - this.frameWidth()/2) * this.calcRate(value) );
      const centerX = Math.floor(this.iconWidth()/2);
      const centerY = Math.floor(this.iconWidth()/2);
      sprite.bitmap.drawCircle(centerX, centerY , radius, this.gaugeBackColor());        
      if(innerRadius > 0) {
        sprite.bitmap.drawGradientCircle(centerX, centerY , innerRadius, this.gaugeColor2(), this.gaugeColor1());
      }   
    }

    updateDiamondIcon(sprite, value) {     
      const width = this.iconWidth() * this.calcMaxRate(value);
      const height = this.iconHeight() * this.calcMaxRate(value);
      const innerWidth = (this.iconWidth() - this.frameWidth()) * this.calcRate(value);
      const innerHeight = (this.iconHeight() - this.frameWidth()) * this.calcRate(value);
      const centerX = Math.floor(this.iconWidth()/2);
      const centerY = Math.floor(this.iconWidth()/2);
      sprite.bitmap.drawDiamond(centerX, centerY, width, height, this.gaugeBackColor() );    
      if(innerWidth > 0 ) {
        sprite.bitmap.drawGradientDiamond(centerX, centerY , innerWidth, innerHeight,  this.gaugeColor2(), this.gaugeColor1());
      }
    }

    updateParallelogram(sprite, value) {
      const padding = 6;
      const width = (this.iconWidth() - padding) * this.calcMaxRate(value);
      const height = this.iconHeight();
      const innerWidth = width * this.calcRate(value);
      sprite.bitmap.drawParallelogram(padding, 0 , width, height, padding, this.gaugeBackColor() );
      if(innerWidth > 0) {
        sprite.bitmap.drawGradientParallelogram(padding, 0 , innerWidth, height, padding, this.gaugeColor1(), this.gaugeColor2() );
      }
    }

    iconCalcX(value) {
      switch (this.displayType()) {
        case 1:
        case 2:
        case 3:
          return value * (this.iconWidth() + this.itemPadding()) + this.measureLabelWidth() + 6;
        case 4:
          return value * (this.iconWidth() + this.itemPadding() - 6) + this.measureLabelWidth() + 6;
        default:
          return value * (this.iconWidth() + this.itemPadding()) + this.measureLabelWidth() + 6;
      }      
    }

    iconCalcY(value) {
      switch (this.displayType()) {
        case 1:
        case 2:
        case 3:
        case 4:
          return (this.textHeight() / 2) - (this.iconHeight() / 2) + 2;
        default:
          return 0;
      }
    }

    calcMaxRate(index) {
      const d = this._duration;
      const s = this.smoothness();
      const oldMaxValue = isNaN(this._oldMaxValue) ? this._maxValue : this._oldMaxValue;
      let rate = 1;      
      if( this._targetMaxValue > oldMaxValue ) {
        rate = Math.max(((this._targetMaxValue - oldMaxValue) / s * (s - d) + oldMaxValue) - index, 0);
      } else {
        rate = Math.max(((oldMaxValue - this._targetMaxValue) / s * d + this._targetMaxValue) - index, 0);
      }      
      const result = isNaN(rate) ? 0 : Math.min(1, rate);
      return result;
    }

    calcRate(index) {
      const d = this._duration;
      const s = this.smoothness();
      const oldValue = isNaN(this._oldValue) ? this._value : this._oldValue;
      let rate = 1;      
      if( this._targetValue > oldValue ) {
        rate = Math.max(((this._targetValue - oldValue) / s * (s - d) + oldValue) - index, 0);
      } else {
        rate = Math.max(((oldValue - this._targetValue) / s * d + this._targetValue) - index, 0);
      }      
      const result = isNaN(rate) ? 0 : Math.min(1, rate);
      return result;
    }

    updateLabelSprite() {
      // 仮定義
    }

  }

  class Sprite_ValueIcon extends Sprite {
    initialize() {
      super.initialize();
      this._battler = null;
      this._index = NaN;
      this._value = NaN;
      this._maxValue = NaN;
      this._targetValue = NaN;
      this._targetMaxValue = NaN;
      this._oldValue = NaN;
      this._oldMaxValue = NaN;
      this._duration = 0;
    }

    setup(battler, type, index) {
      this._battler = battler;
      this._statusType = type;
      this._index = index;      
      this.createChildSprite();
    }

    config() {
      switch (this._statusType) {
        case "hp":
            return this._battler.hpConfig();
        case "mp":
            return this._battler.mpConfig();
        case "tp":
            return this._battler.tpConfig();
        default:
            return null;
      }
    }

    currentValue() {
      if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.hp;
            case "mp":
                return this._battler.mp;
            case "tp":
                return this._battler.tp;
            case "time":
                return this._battler.tpbChargeTime();
        }
      }
      return NaN;
    }

    currentMaxValue() {
      if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.mhp;
            case "mp":
                return this._battler.mmp;
            case "tp":
                return this._battler.maxTp();
            case "time":
                return 1;
        }
      }
      return NaN;
    }

    smoothness() {
      return 20;
    }

    createChildSprite() {
      this._iconSprites = {};
      const config = this.config();
      if(config.bitmapBack) {
        const backSprite = new Sprite();
        backSprite.bitmap = this.loadBitmap("back");
        this._iconSprites.back = backSprite;
        this.addChild(backSprite);
      }
      if(config.bitmapFill) {
        const fillSprite = new Sprite();
        fillSprite.bitmap = this.loadBitmap("fill");
        this._iconSprites.fill = fillSprite;
        this.addChild(fillSprite);
      }
      if(config.bitmapFrame) {
        const frameSprite = new Sprite();
        frameSprite.bitmap = this.loadBitmap("frame");
        this._iconSprites.frame = frameSprite;
        this.addChild(frameSprite);
      }
    }

    iconSprite(type) {
      return this._iconSprites[type] ? this._iconSprites[type] : null;
    }

    iconWidth(type){
      const sprite = this.iconSprite(type);
      return sprite ? sprite.bitmap.width : 0;
    }

    iconHeight(type){
      const sprite = this.iconSprite(type);
      return sprite ? sprite.bitmap.height : 0;
    }

    loadBitmap(type) {
      const config = this.config();
      switch (type) {
        case "fill":          
          return ImageManager.loadPicture(config.bitmapFill);
        case "frame":
          return ImageManager.loadPicture(config.bitmapFrame);          
        case "back":
          return ImageManager.loadPicture(config.bitmapBack);
        default:
          break;
      }
    }

    update() {
      super.update();
      this.updateBitmap();
    }

    updateBitmap() {
      const value = this.currentValue();
      const maxValue = this.currentMaxValue();
      if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
        this.updateTargetValue(value, maxValue);
      }
      this.updateIconAnimation();
    }

    updateTargetValue(value, maxValue) {
      this._oldValue = this._value;
      this._oldMaxValue = this._maxValue;
      this._targetValue = value;
      this._targetMaxValue = maxValue;
      if (isNaN(this._value)) {
        this._value = value;
        this._maxValue = maxValue;
        this.redraw();
      } else {
        this._duration = this.smoothness();
      }
    }

    // 機能は変わらないが名称だけ変更（元updateGaugeAnimation）
    updateIconAnimation() {
      if (this._duration > 0) {
        this._value = this.currentValue();
        this._maxValue = this.currentMaxValue();
        this._duration--;
        this.redraw();
      }
    }    

    redraw() {
      const currentValue = this.currentValue();
      if (!isNaN(currentValue)) {
        this.refreshIcons();
      }
    }

    flashingColor() {
      const rate = this._duration / this.smoothness();
      const r = Math.floor(255 * rate);
      const g = Math.floor(255 * rate);
      const b = Math.floor(255 * rate);
      const a = Math.floor(200 * rate);
      return [r, g, b, a];
    }

    refreshIcons() {
      if(this._iconSprites) {
        const d = this._duration;
        const s = this.smoothness();
        let backOpacity = this.currentMaxValue() > this._index ? 255 : 0;
        let fillOpacity = this.currentValue() > this._index ? 255 : 0;
        let blendTone = [0, 0, 0, 0];
        if(this._targetMaxValue > this._oldMaxValue) {
          if(this._oldMaxValue <= this._index && this._index < this._targetMaxValue) {
            backOpacity = 255 * (s - d) / s;
          }
        } else {
          if(this._targetMaxValue <= this._index && this._index < this._oldMaxValue) {
            backOpacity = 255 * d / s;
            blendTone = this.flashingColor();
          }          
        }        
        if(this._targetValue > this._oldValue) {
          if(this._oldValue <= this._index && this._index < this._targetValue) {
            fillOpacity = 255 * (s - d) / s;
          }
        } else {
          if (this._targetValue <= this._index && this._index < this._oldValue) {
            fillOpacity = 255 * d / s;
            blendTone = this.flashingColor();
          }          
        }        
        if(this._iconSprites.back) {
          this._iconSprites.back.opacity = backOpacity;
          this._iconSprites.back.setBlendColor(blendTone);
        }
        if(this._iconSprites.fill) {
          this._iconSprites.fill.opacity = fillOpacity;
          this._iconSprites.fill.setBlendColor(blendTone);
        }        
      }
    }
  }
  
})();