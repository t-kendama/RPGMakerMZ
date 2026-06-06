/*
----------------------------------------------------------------------------
 (C)2026 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2026/06/07 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc ステート中のバトラーに画像エフェクトを表示 v1.0.0
 * @url https://raw.githubusercontent.com/t-kendama/RPGMakerMZ/refs/heads/master/KEN_StateEffectPicture.js
 * @author KEN
 *
 * @param ShowOnStatusWindow
 * @text ステータスウィンドウに表示
 * @desc アクターのステータスウィンドウ上にもエフェクト画像を表示します。
 * @type boolean
 * @default true
 *
 * @param StateEffects
 * @text ステートエフェクト設定
 * @desc ステートごとの画像・表示位置・演出設定です。
 * @type struct<StateEffect>[]
 * @default []
 *
 * @help
 * 
 * -------------------------    概要    -------------------------
 * 
 * 指定ステートが付与されているバトラーに画像エフェクトを表示します。
 * 複数の画像を並べることで擬似的にアニメーションのような描画も可能です。
 *
 * 表示先は以下の2種類です。
 *
 * 1. バトラースプライト
 *    敵画像、またはアクター画像の上に表示します。
 *
 * 2. 戦闘ステータスウィンドウ
 *    アクターの顔グラフィック付近に表示します。
 *    プラグインパラメータでON／OFFが可能です。
 * 
 * 表示モード:
 * 以下２つの表示モードがあります。表示モードは併用できません。
 *   effect:
 *     回転、拡大縮小、揺れ、点滅、色調変化を行います。
 *
 *   animation:
 *     画像を行・列で分割し、コマ送りで表示します。
 *     最後のコマまで再生すると、先頭に戻ってループします。
 *
 *
 * -------------------------    使い方    -------------------------
 * 
 * 本プラグインはプラグインパラメータ上で設定します。
 * 設定項目の説明はプラグインのヘルプを参照下さい。
 * 
 * -------------------------    細かい仕様    -------------------------
 * 
 * 複数ステートが該当する場合:
 *   1. レイヤーごとに1つずつ表示します。
 *   2. レイヤー数値が大きいほど前面に表示します。
 *   3. 同じレイヤーに複数該当する場合、ステートIDが若い方のみ表示します。
 */

/*~struct~StateEffect:
 *
 * @param General
 * @text 基本設定
 *
 * @param StateId
 * @text ステートID
 * @desc 画像描画対象のステートIDを指定します。
 * @type state
 * @default 1
 * @parent General
 *
 * @param Target
 * @text 表示対象
 * @desc エフェクトを表示する対象を指定します。
 * @type select
 * @option 敵味方両方
 * @value both
 * @option 敵のみ
 * @value enemy
 * @option 味方のみ
 * @value actor
 * @default both
 * @parent General
 *
 * @param Image
 * @text 表示画像
 * @desc 表示する画像ファイルを指定します。
 * @type file
 * @dir img/pictures
 * @parent General
 *
 * @param Drawing
 * @text 描画設定
 * 
 * @param Layer
 * @text レイヤー
 * @desc 数値が大きいほど前面に表示します。同じレイヤーの場合、ステートIDが若い方のみ表示します。
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 * @parent Drawing
 *
 * @param Mode
 * @text 表示モード
 * @desc エフェクトモード、またはアニメーションモードを選択します。
 * @type select
 * @option エフェクト
 * @value effect
 * @option アニメーション
 * @value animation
 * @default effect
 * @parent Drawing
 *
 * @param DisplayCondition
 * @text 表示条件
 * @desc エフェクトを表示する条件です。
 * @type select
 * @option 常に表示
 * @value always
 * @option ターゲット選択中のみ表示
 * @value target
 * @default always
 * @parent Drawing
 *
 * @param Origin
 * @text 座標の原点
 * @desc X座標は中央固定です。
 * @type select
 * @option 上
 * @value top
 * @option 中央
 * @value center
 * @option 下
 * @value bottom
 * @default top
 * @parent Drawing
 *
 * @param OffsetX
 * @text オフセットX
 * @desc 画像の描画X座標を調整します。値を大きくすると右にずれます。
 * @type number
 * @min -9999
 * @default 0
 * @parent Drawing
 *
 * @param OffsetY
 * @text オフセットY
 * @desc 画像の描画Y座標を調整します。値を大きくすると下にずれます。
 * @type number
 * @min -9999
 * @default 0
 * @parent Drawing
 * 
 * @param FlipForEnemy
 * @text 敵の場合に左右反転
 * @desc ONにすると、エネミーに表示する際に画像を左右反転します。
 * @type boolean
 * @default false
 * @parent Drawing
 *
 * @param BlendMode
 * @text 合成方法
 * @desc 画像を描画するときの合成方法を指定します。
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @default 0
 * @parent Drawing
 *
 * @param Effect
 * @text エフェクトモード設定
 * 
 * @param Rotation
 * @text 回転
 * @desc 回転エフェクトに関する設定
 * @type struct<RotationEffect>
 * @default {"Enabled":"false","Speed":"0.01"}
 * @parent Effect
 *
 * @param Scale
 * @text 拡大縮小
 * @desc 拡大・縮小エフェクトに関する設定
 * @type struct<ScaleEffect>
 * @default {"Enabled":"false","Min":"0.9","Max":"1.1","Speed":"0.05"}
 * @parent Effect
 *
 * @param FloatY
 * @text 上下揺れ
 * @desc 上下揺れエフェクトに関する設定
 * @type struct<FloatEffect>
 * @default {"Enabled":"false","Amplitude":"8","Speed":"0.05"}
 * @parent Effect
 *
 * @param FloatX
 * @text 左右揺れ
 * @desc 左右揺れエフェクトに関する設定
 * @type struct<FloatEffect>
 * @default {"Enabled":"false","Amplitude":"8","Speed":"0.05"}
 * @parent Effect
 *
 * @param Blink
 * @text 点滅
 * @desc 点滅エフェクトに関する設定
 * @type struct<BlinkEffect>
 * @default {"Enabled":"false","MinOpacity":"128","MaxOpacity":"255","Speed":"0.05"}
 * @parent Effect
 *
 * @param Tone
 * @text 色調変化
 * @desc 色調変化エフェクトに関する設定
 * @type struct<ToneEffect>
 * @default {"Enabled":"false","ToneA":"0,0,0,0","ToneB":"0,0,0,0","Speed":"0.05"}
 * @parent Effect
 *
 * @param Animation
 * @text アニメーションモード設定
 *
 * @param AnimationRows
 * @text 画像分割数：行
 * @desc アニメーション画像を縦方向に何分割するか指定します。
 * @type number
 * @min 1
 * @default 1
 * @parent Animation
 *
 * @param AnimationCols
 * @text 画像分割数：列
 * @desc アニメーション画像を横方向に何分割するか指定します。
 * @type number
 * @min 1
 * @default 1
 * @parent Animation
 *
 * @param AnimationFrames
 * @text 総アニメーション数
 * @desc 使用するアニメーションコマ数を指定します。行×列より少ない数を指定できます。
 * @type number
 * @min 1
 * @default 1
 * @parent Animation
 *
 * @param AnimationFrameDuration
 * @text 1コマの表示フレーム数
 * @desc 1つのコマを何フレーム表示するか指定します。
 * @type number
 * @min 1
 * @default 4
 * @parent Animation
 * 
 * @param AnimationStartOffsetX
 * @text 開始オフセットX
 * @desc アニメーション開始時のX座標補正です。
 * @type number
 * @min -9999
 * @default 0
 * @parent Animation
 *
 * @param AnimationEndOffsetX
 * @text 終了オフセットX
 * @desc アニメーション終了時のX座標補正です。
 * @type number
 * @min -9999
 * @default 0
 * @parent Animation
 *
 * @param AnimationStartOffsetY
 * @text 開始オフセットY
 * @desc アニメーション開始時のY座標補正です。
 * @type number
 * @min -9999
 * @default 0
 * @parent Animation
 *
 * @param AnimationEndOffsetY
 * @text 終了オフセットY
 * @desc アニメーション終了時のY座標補正です。
 * @type number
 * @min -9999
 * @default 0
 * @parent Animation
 *
 * @param AnimationStartRotation
 * @text 開始回転角度
 * @desc アニメーション開始時の角度です。度数で指定します。
 * @type number
 * @min -3600
 * @max 3600
 * @default 0
 * @parent Animation
 *
 * @param AnimationEndRotation
 * @text 終了回転角度
 * @desc アニメーション終了時の角度です。度数で指定します。
 * @type number
 * @min -3600
 * @max 3600
 * @default 0
 * @parent Animation
 *
 * @param AnimationStartScale
 * @text 開始拡大率
 * @desc アニメーション開始時の拡大率です。1.00で等倍です。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1.00
 * @parent Animation
 *
 * @param AnimationEndScale
 * @text 終了拡大率
 * @desc アニメーション終了時の拡大率です。1.00で等倍です。
 * @type number
 * @decimals 2
 * @min 0
 * @default 1.00
 * @parent Animation
 *
 * @param AnimationStartOpacity
 * @text 開始不透明度
 * @desc アニメーション開始時の不透明度です。
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @parent Animation
 *
 * @param AnimationEndOpacity
 * @text 終了不透明度
 * @desc アニメーション終了時の不透明度です。
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @parent Animation
 *
 * @param AnimationStartTone
 * @text 開始色調
 * @desc R,G,B,Gray の形式で指定します。例: 0,0,0,0
 * @type string
 * @default 0,0,0,0
 * @parent Animation
 *
 * @param AnimationEndTone
 * @text 終了色調
 * @desc R,G,B,Gray の形式で指定します。例: 68,-34,-34,0
 * @type string
 * @default 0,0,0,0
 * @parent Animation
 * 
 */

/*~struct~RotationEffect:
 *
 * @param Enabled
 * @text 有効
 * @desc 回転エフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param Speed
 * @text 回転速度
 * @desc 回転速度を指定します。マイナスにすると逆回転になります。
 * @type number
 * @decimals 3
 * @default 0.01
 * @max 1
 * @min -1
 */

/*~struct~ScaleEffect:
 *
 * @param Enabled
 * @text 有効
 * @desc 拡大・縮小エフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param Min
 * @text 最小倍率
 * @desc 縮小時の最小倍率を指定します。
 * @type number
 * @decimals 2
 * @default 0.90
 *
 * @param Max
 * @text 最大倍率
 * @desc 拡大時の最大倍率を指定します。
 * @type number
 * @decimals 2
 * @default 1.10
 *
 * @param Speed
 * @text 速度
 * @desc 大きさの変化速度を指定します。
 * @type number
 * @decimals 3
 * @default 0.05
 * @max 1
 * @min -1
 */

/*~struct~FloatEffect:
 *
 * @param Enabled
 * @text 有効
 * @desc 揺れエフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param Amplitude
 * @text 振れ幅
 * @desc 揺れの振れ幅（px単位）を指定します。
 * @type number
 * @default 8
 *
 * @param Speed
 * @text 速度
 * @desc 揺れの速度を指定します。
 * @type number
 * @decimals 3
 * @default 0.05
 * @max 1
 * @min -1
 */

/*~struct~BlinkEffect:
 *
 * @param Enabled
 * @text 有効
 * @desc 点滅エフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param MinOpacity
 * @text 最小透明度
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param MaxOpacity
 * @text 最大透明度
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param Speed
 * @text 速度
 * @type number
 * @decimals 3
 * @default 0.05
 * @max 0.1
 * @min -0.1
 */

/*~struct~ToneEffect:
 *
 * @param Enabled
 * @text 有効
 * @desc 色調変更エフェクトを有効にします。
 * @type boolean
 * @default false
 *
 * @param ToneA
 * @text 色調A
 * @desc R,G,B,Gray の形式で指定します。例: 0,0,0,0
 * @type string
 * @default 0,0,0,0
 *
 * @param ToneB
 * @text 色調B
 * @desc R,G,B,Gray の形式で指定します。例: 68,-34,-34,0
 * @type string
 * @default 0,0,0,0
 *
 * @param Speed
 * @text 速度
 * @type number
 * @decimals 3
 * @default 0.05
 * @max 0.1
 * @min -0.1
 */

(() => {
"use strict";

const pluginName = "KEN_StateEffectPicture";
const parameters = PluginManager.parameters(pluginName);

const showOnStatusWindow = parameters.ShowOnStatusWindow !== "false";

function parseJson(value, defaultValue) {
    if (value === undefined || value === null || value === "") return defaultValue;
    try { return JSON.parse(value); } catch (e) { return defaultValue; }
}

function parseStruct(value) {
    if (typeof value === "string") return parseJson(value, {});
    return value || {};
}

function toBool(value) {
    return value === true || value === "true";
}

function toNumber(value, defaultValue = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : defaultValue;
}

function toTone(value) {
    return String(value || "0,0,0,0")
        .split(",")
        .map(v => toNumber(v.trim(), 0))
        .slice(0, 4)
        .concat([0, 0, 0, 0])
        .slice(0, 4);
}

function parseRotation(value) {
    const data = parseStruct(value);
    return { enabled: toBool(data.Enabled), speed: toNumber(data.Speed, 0.01) };
}

function parseScale(value) {
    const data = parseStruct(value);
    return {
        enabled: toBool(data.Enabled),
        min: toNumber(data.Min, 0.9),
        max: toNumber(data.Max, 1.1),
        speed: toNumber(data.Speed, 0.05)
    };
}

function parseFloat(value) {
    const data = parseStruct(value);
    return {
        enabled: toBool(data.Enabled),
        amplitude: toNumber(data.Amplitude, 8),
        speed: toNumber(data.Speed, 0.05)
    };
}

function parseBlink(value) {
    const data = parseStruct(value);
    return {
        enabled: toBool(data.Enabled),
        minOpacity: toNumber(data.MinOpacity, 128),
        maxOpacity: toNumber(data.MaxOpacity, 255),
        speed: toNumber(data.Speed, 0.05)
    };
}

function parseTone(value) {
    const data = parseStruct(value);
    return {
        enabled: toBool(data.Enabled),
        toneA: toTone(data.ToneA),
        toneB: toTone(data.ToneB),
        speed: toNumber(data.Speed, 0.05)
    };
}

function parseAnimation(data) {
    const rows = Math.max(1, toNumber(data.AnimationRows, 1));
    const cols = Math.max(1, toNumber(data.AnimationCols, 1));
    const maxFrames = rows * cols;

    return {
        rows: rows,
        cols: cols,
        frames: Math.min(Math.max(1, toNumber(data.AnimationFrames, 1)), maxFrames),
        frameDuration: Math.max(1, toNumber(data.AnimationFrameDuration, 4)),

        startOffsetX: toNumber(data.AnimationStartOffsetX, 0),
        endOffsetX: toNumber(data.AnimationEndOffsetX, 0),
        startOffsetY: toNumber(data.AnimationStartOffsetY, 0),
        endOffsetY: toNumber(data.AnimationEndOffsetY, 0),

        startRotation: toNumber(data.AnimationStartRotation, 0),
        endRotation: toNumber(data.AnimationEndRotation, 0),

        startScale: toNumber(data.AnimationStartScale, 1),
        endScale: toNumber(data.AnimationEndScale, 1),

        startOpacity: toNumber(data.AnimationStartOpacity, 255),
        endOpacity: toNumber(data.AnimationEndOpacity, 255),

        startTone: toTone(data.AnimationStartTone),
        endTone: toTone(data.AnimationEndTone)
    };
}

function parseStateEffect(value) {
    const data = parseStruct(value);
    return {
        stateId: toNumber(data.StateId, 0),
        target: String(data.Target || "both"),
        image: String(data.Image || ""),
        flipForEnemy: toBool(data.FlipForEnemy),
        layer: toNumber(data.Layer !== undefined ? data.Layer : data.Priority, 0),
        mode: String(data.Mode || "effect"),
        displayCondition: String(data.DisplayCondition || "always"),
        origin: String(data.Origin || "top"),
        offsetX: toNumber(data.OffsetX, 0),
        offsetY: toNumber(data.OffsetY, 0),
        blendMode: toNumber(data.BlendMode, 0),
        rotation: parseRotation(data.Rotation),
        scale: parseScale(data.Scale),
        floatY: parseFloat(data.FloatY),
        floatX: parseFloat(data.FloatX),
        blink: parseBlink(data.Blink),
        tone: parseTone(data.Tone),
        animation: parseAnimation(data)
    };
}

const rawStateEffects = parseJson(parameters.StateEffects, []);
const stateEffects = rawStateEffects
    .map(parseStateEffect)
    .filter(setting => setting.stateId > 0 && setting.image);

function BattleStateEffectManager() {
    throw new Error("This is a static class");
}

BattleStateEffectManager.findSettings = function(battler) {
    if (!battler) return [];

    const matched = stateEffects.filter(setting => {
        if (!this.isTargetMatched(setting, battler)) return false;
        return battler.isStateAffected(setting.stateId);
    });

    const layerMap = new Map();

    for (const setting of matched) {
        const current = layerMap.get(setting.layer);

        if (!current || setting.stateId < current.stateId) {
            layerMap.set(setting.layer, setting);
        }
    }

    return Array.from(layerMap.values()).sort((a, b) => {
        if (a.layer !== b.layer) return a.layer - b.layer;
        return a.stateId - b.stateId;
    });
};

BattleStateEffectManager.isTargetMatched = function(setting, battler) {
    if (setting.target === "both") return true;
    if (setting.target === "actor") return battler.isActor && battler.isActor();
    if (setting.target === "enemy") return battler.isEnemy && battler.isEnemy();
    return true;
};

//-----------------------------------------------------------------------------
// Sprite_BattleStateEffect
//-----------------------------------------------------------------------------

function Sprite_BattleStateEffect() {
    this.initialize(...arguments);
}

Sprite_BattleStateEffect.prototype = Object.create(Sprite.prototype);
Sprite_BattleStateEffect.prototype.constructor = Sprite_BattleStateEffect;

Sprite_BattleStateEffect.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._battler = null;
    this._setting = null;
    this._image = "";
    this._count = 0;
    this._baseRect = null;
    this._baseWidth = 0;
    this._baseHeight = 0;
    this.visible = false;
};

Sprite_BattleStateEffect.prototype.setBattler = function(battler) {
    this._battler = battler || null;
};

Sprite_BattleStateEffect.prototype.setSetting = function(setting) {
    if (this._setting !== setting) {
        this._setting = setting;
        this._count = 0;
        this.refreshBitmap();
    }
};

Sprite_BattleStateEffect.prototype.setBaseRect = function(rect) {
    this._baseRect = rect;
};

Sprite_BattleStateEffect.prototype.setBaseSize = function(width, height) {
    this._baseRect = null;
    this._baseWidth = width || 0;
    this._baseHeight = height || 0;
};

Sprite_BattleStateEffect.prototype.clearEffect = function() {
    this.setBattler(null);
    this.setSetting(null);
    this.visible = false;
};

Sprite_BattleStateEffect.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateEffect();
};

Sprite_BattleStateEffect.prototype.refreshBitmap = function() {
    if (!this._setting) {
        this.bitmap = null;
        this._image = "";
        this.visible = false;
        return;
    }

    if (this._image !== this._setting.image) {
        this._image = this._setting.image;
        this.visible = false;
        this.bitmap = ImageManager.loadPicture(this._image);
        this.bitmap.addLoadListener(() => {
            this.refreshFrame();
        });
    } else {
        this.refreshFrame();
    }

    this.blendMode = this._setting.blendMode;
};

Sprite_BattleStateEffect.prototype.refreshFrame = function() {
    if (!this.bitmap || !this.bitmap.isReady() || !this._setting) return;

    if (this.isAnimationMode()) {
        this.updateAnimationFrame();
    } else {
        this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }
};

Sprite_BattleStateEffect.prototype.updateEffect = function() {
    if (!this._setting || !this.isDisplayConditionMatched()) {
        this.visible = false;
        return;
    }

    if (!this.bitmap || !this.bitmap.isReady()) {
        this.visible = false;
        return;
    }

    this.visible = true;

    const setting = this._setting;
    const base = this.basePosition(setting);

    if (this.isAnimationMode()) {
        const transform = this.animationTransform();

        this.x = base.x + setting.offsetX + transform.offsetX;
        this.y = base.y + setting.offsetY + transform.offsetY;

        this.updateAnimationMode(transform);
    } else {
        this.x = base.x + setting.offsetX + this.floatValue(setting.floatX);
        this.y = base.y + setting.offsetY + this.floatValue(setting.floatY);

        this.updateEffectMode();
    }

    this.applyFlip(setting);

    this._count++;
};

Sprite_BattleStateEffect.prototype.applyFlip = function(setting) {
    if (setting.flipForEnemy && this._battler && this._battler.isEnemy && this._battler.isEnemy()) {
        this.scale.x *= -1;
    }
};

Sprite_BattleStateEffect.prototype.isAnimationMode = function() {
    return this._setting && this._setting.mode === "animation";
};

Sprite_BattleStateEffect.prototype.updateEffectMode = function() {
    const setting = this._setting;

    if (this.bitmap && this.bitmap.isReady()) {
        this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }

    this.updateRotationEffect(setting.rotation);
    this.updateScaleEffect(setting.scale);
    this.updateBlinkEffect(setting.blink);
    this.updateToneEffect(setting.tone);
};

Sprite_BattleStateEffect.prototype.updateAnimationMode = function(transform) {
    this.rotation = transform.rotation;
    this.scale.x = transform.scale;
    this.scale.y = transform.scale;
    this.opacity = transform.opacity;
    this.setColorTone(transform.tone);

    this.updateAnimationFrame();
};

Sprite_BattleStateEffect.prototype.updateAnimationFrame = function() {
    if (!this.bitmap || !this.bitmap.isReady() || !this._setting) return;

    const animation = this._setting.animation;
    const rows = animation.rows;
    const cols = animation.cols;
    const frames = animation.frames;
    const duration = animation.frameDuration;

    const frameIndex = Math.floor(this._count / duration) % frames;
    const col = frameIndex % cols;
    const row = Math.floor(frameIndex / cols);

    const frameWidth = Math.floor(this.bitmap.width / cols);
    const frameHeight = Math.floor(this.bitmap.height / rows);

    const sx = col * frameWidth;
    const sy = row * frameHeight;

    this.setFrame(sx, sy, frameWidth, frameHeight);
};

Sprite_BattleStateEffect.prototype.animationTransform = function() {
    const animation = this._setting.animation;
    const rate = this.animationProgress();

    return {
        offsetX: this.lerp(animation.startOffsetX, animation.endOffsetX, rate),
        offsetY: this.lerp(animation.startOffsetY, animation.endOffsetY, rate),
        rotation: this.degreesToRadians(
            this.lerp(animation.startRotation, animation.endRotation, rate)
        ),
        scale: this.lerp(animation.startScale, animation.endScale, rate),
        opacity: this.lerp(animation.startOpacity, animation.endOpacity, rate),
        tone: animation.startTone.map((value, index) => {
            return this.lerp(value, animation.endTone[index], rate);
        })
    };
};

Sprite_BattleStateEffect.prototype.animationProgress = function() {
    const animation = this._setting.animation;
    const totalDuration = Math.max(1, animation.frames * animation.frameDuration);
    const frame = this._count % totalDuration;

    if (totalDuration <= 1) {
        return 1;
    }

    return frame / (totalDuration - 1);
};

Sprite_BattleStateEffect.prototype.lerp = function(start, end, rate) {
    return start + (end - start) * rate;
};

Sprite_BattleStateEffect.prototype.degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
};

Sprite_BattleStateEffect.prototype.isDisplayConditionMatched = function() {
    if (!this._setting) return false;

    switch (this._setting.displayCondition) {
        case "target":
            return this._battler && this._battler.isSelected();
        case "always":
        default:
            return true;
    }
};

Sprite_BattleStateEffect.prototype.basePosition = function(setting) {
    if (this._baseRect) {
        const rect = this._baseRect;
        return {
            x: rect.x + rect.width / 2,
            y: this.originY(rect.y, rect.height, setting.origin)
        };
    } else {
        return {
            x: 0,
            y: this.originY(-this._baseHeight, this._baseHeight, setting.origin)
        };
    }
};

Sprite_BattleStateEffect.prototype.originY = function(y, height, origin) {
    switch (origin) {
        case "top": return y;
        case "center": return y + height / 2;
        case "bottom": return y + height;
        default: return y;
    }
};

Sprite_BattleStateEffect.prototype.floatValue = function(effect) {
    if (!effect.enabled) return 0;
    return Math.sin(this._count * effect.speed) * effect.amplitude;
};

Sprite_BattleStateEffect.prototype.updateRotationEffect = function(effect) {
    this.rotation = effect.enabled ? this.rotation + effect.speed : 0;
};

Sprite_BattleStateEffect.prototype.updateScaleEffect = function(effect) {
    if (effect.enabled) {
        const rate = this.sinRate(effect.speed);
        const value = effect.min + (effect.max - effect.min) * rate;
        this.scale.x = value;
        this.scale.y = value;
    } else {
        this.scale.x = 1;
        this.scale.y = 1;
    }
};

Sprite_BattleStateEffect.prototype.updateBlinkEffect = function(effect) {
    if (effect.enabled) {
        const rate = this.sinRate(effect.speed);
        this.opacity = effect.minOpacity + (effect.maxOpacity - effect.minOpacity) * rate;
    } else {
        this.opacity = 255;
    }
};

Sprite_BattleStateEffect.prototype.updateToneEffect = function(effect) {
    if (effect.enabled) {
        const rate = this.sinRate(effect.speed);
        const tone = effect.toneA.map((value, index) => {
            return value + (effect.toneB[index] - value) * rate;
        });
        this.setColorTone(tone);
    } else {
        this.setColorTone([0, 0, 0, 0]);
    }
};

Sprite_BattleStateEffect.prototype.sinRate = function(speed) {
    return Math.sin(this._count * speed) * 0.5 + 0.5;
};

window.Sprite_BattleStateEffect = Sprite_BattleStateEffect;

//-----------------------------------------------------------------------------
// 共通: 複数エフェクトスプライト更新
//-----------------------------------------------------------------------------

function updateStateEffectSpriteList(parent, sprites, battler, baseRect, baseWidth, baseHeight) {
    const settings = BattleStateEffectManager.findSettings(battler);

    while (sprites.length < settings.length) {
        const sprite = new Sprite_BattleStateEffect();
        sprite.visible = false;
        parent.addChild(sprite);
        sprites.push(sprite);
    }

    for (let i = 0; i < sprites.length; i++) {
        const sprite = sprites[i];
        const setting = settings[i];

        if (!setting) {
            sprite.clearEffect();
            continue;
        }

        sprite.setBattler(battler);
        sprite.setSetting(setting);

        if (baseRect) {
            sprite.setBaseRect(baseRect);
        } else {
            sprite.setBaseSize(baseWidth, baseHeight);
        }

        sprite.z = setting.layer;
    }

    sprites.sort((a, b) => {
        const la = a._setting ? a._setting.layer : -Infinity;
        const lb = b._setting ? b._setting.layer : -Infinity;
        return la - lb;
    });

    for (const sprite of sprites) {
        if (sprite.parent === parent) {
            parent.addChild(sprite);
        }
    }
}

function clearStateEffectSpriteList(sprites) {
    if (!sprites) return;
    for (const sprite of sprites) {
        sprite.clearEffect();
    }
}

window.KEN_StateEffectPicture = window.KEN_StateEffectPicture || {};
window.KEN_StateEffectPicture.BattleStateEffectManager = BattleStateEffectManager;
window.KEN_StateEffectPicture.updateStateEffectSpriteList = updateStateEffectSpriteList;
window.KEN_StateEffectPicture.clearStateEffectSpriteList = clearStateEffectSpriteList;

//-----------------------------------------------------------------------------
// Sprite_Battler
//-----------------------------------------------------------------------------

const _Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
Sprite_Battler.prototype.setBattler = function(battler) {
    _Sprite_Battler_setBattler.call(this, battler);
    this.createBattleStateEffectSprites();
};

Sprite_Battler.prototype.createBattleStateEffectSprites = function() {
    if (this._battleStateEffectSprites) return;
    this._battleStateEffectSprites = [];
};

const _Sprite_Battler_update = Sprite_Battler.prototype.update;
Sprite_Battler.prototype.update = function() {
    _Sprite_Battler_update.call(this);
    this.updateBattleStateEffectSprites();
};

Sprite_Battler.prototype.updateBattleStateEffectSprites = function() {
    this.createBattleStateEffectSprites();

    const sprites = this._battleStateEffectSprites;
    if (!sprites) return;

    const target = this.mainSprite ? this.mainSprite() : this;
    const width = target.width || this.width || 0;
    const height = target.height || this.height || 0;

    updateStateEffectSpriteList(this, sprites, this._battler, null, width, height);
};

//-----------------------------------------------------------------------------
// Window_BattleStatus
//-----------------------------------------------------------------------------

const _Window_BattleStatus_initialize = Window_BattleStatus.prototype.initialize;
Window_BattleStatus.prototype.initialize = function(rect) {
    _Window_BattleStatus_initialize.call(this, rect);
    this.createBattleStateEffectSprites();
};

Window_BattleStatus.prototype.createBattleStateEffectSprites = function() {
    if (this._battleStateEffectSprites) return;

    this._battleStateEffectSprites = [];

    const max = $gameParty.maxBattleMembers();
    for (let i = 0; i < max; i++) {
        this._battleStateEffectSprites[i] = [];
    }
};

const _Window_BattleStatus_update = Window_BattleStatus.prototype.update;
Window_BattleStatus.prototype.update = function() {
    _Window_BattleStatus_update.call(this);
    this.updateBattleStateEffectSprites();
};

Window_BattleStatus.prototype.updateBattleStateEffectSprites = function() {
    if (!this._battleStateEffectSprites) return;

    for (let i = 0; i < this._battleStateEffectSprites.length; i++) {
        const sprites = this._battleStateEffectSprites[i];

        if (!showOnStatusWindow) {
            clearStateEffectSpriteList(sprites);
            continue;
        }

        const actor = this.actor(i);
        if (!actor) {
            clearStateEffectSpriteList(sprites);
            continue;
        }

        const rect = this.stateEffectFaceRect(i);
        updateStateEffectSpriteList(this, sprites, actor, rect, 0, 0);
    }
};

Window_BattleStatus.prototype.stateEffectFaceRect = function(index) {
    const rect = this.faceRect(index);
    return new Rectangle(
        this.padding + rect.x,
        this.padding + rect.y,
        rect.width,
        rect.height
    );
};

})();
