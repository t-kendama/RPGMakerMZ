/*
----------------------------------------------------------------------------
 KEN_BattleStateInformation v1.0.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/01/11 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc 戦闘中にステート一覧やバトラーの情報を表示
 * @author KEN
 * @version 1.0.0
 * @url https://github.com/t-kendama/RPGMakerMZ/blob/main/KEN_BattleStateInformation.js
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * 戦闘中に敵味方のステータス情報を表示するウィンドウ機能を提供します。
 * ステートの内容や任意のステータス情報を表示することが可能です。
 * 
 * ステート情報ウィンドウはパーティコマンドもしくは
 * アクターコマンド選択中にショートカットキーを押すことで表示できます。
 * 
 * 【表示内容】
 * 表示する内容は主に上下２つの領域に分かれています。
 * 
 * ・バトラー表示エリア（上）
 * バトラーの情報を表示します。左右キーを押すとバトラーが切り替わります。
 * 
 * 左側はバトラーの画像（アクターの場合は顔グラフィック）を表示し、
 * 右側はバトラーのステータス情報を表示します。
 * 表示する項目はカスタマイズ可能です。
 * 
 * ・ステート一覧（下）
 * バトラーに付与されているステートの一覧を表示します。
 * ※プラグインパラメータに未登録のステートは一覧に表示されません。
 * 
 * -------------------------    使い方    -------------------------
 * 本プラグインはプラグインパラメータ上で設定します。
 * 
 * 【バトラー情報エリア設定】
 * バトラー情報エリアに表示する内容を設定します。
 * 表示する項目や位置（行および列）などを設定します。
 * （設定方法は複雑なので、デフォルト値を参考にカスタマイズください）
 * 
 * 表示パラメータ補足：
 * 表示する値は評価式(スクリプト)で記述します。
 * ※不正な式の場合「error」が表示されます。
 * 記述例．
 * battler.name() … バトラーの名前
 * battler.param(数値) … 最大HPや攻撃力など通常能力値
 * battler.xparam(数値) … 命中率や回避率など追加能力値
 * battler.sparam(数値) … 狙われ率など特殊能力値
 * 
 * 特別な表記法：
 * 以下の値を指定すると表示内容が変わります。
 * hpGauge ... HPゲージ
 * mpGauge ... MPゲージ
 * tpGauge ... TPゲージ
 * Index ... 表示する項目のインデックス（何番目のバトラーか）を描画
 *           (n/m) の形式で表示します
 * 
 * 【ステート一覧設定】
 * ステート一覧の描画に関する設定を行います。
 * ステートの説明は２行目以降に表示されます。
 * ※プラグインパラメータに未登録のステートは表示されません
 * 
 * 
 * 【プラグイン連携機能】
 * 累積ステートプラグイン（KEN_StackState.js）を導入することで
 * スタックの値をアイコン上に描画できます。
 * 
 * またステート説明文に \\stack[ステートID] と記述することで、
 * 表示中のバトラーのスタック数を表記できます。
 * 
 * ！注意！
 * KEN_StackState.jsのバージョンは必ず「v1.0.4」以降を使用ください。

 * 
 * 【データベースのメモ欄設定】
 * <EnemyOffsetX: オフセット値>
 * 記述欄：敵キャラ
 * 敵画像の描画位置X座標を調整します。
 * 値が大きいほど左にずれます。
 * 
 * <EnemyOffsetY: オフセット値>
 * 記述欄：敵キャラ
 * 敵画像の描画位置X座標を調整します。
 * 値が大きいほど下にずれます。
 * 
 * @orderAfter KEN_StackState
 * 
 * @param states
 * @type struct<StateConfig>[]
 * @text ステート一覧
 * @desc ステートの説明を登録します。ステートは重複して設定しないでください。
 * @default []
 * 
 * @param displayKey
 * @type combo
 * @text ショートカットキー
 * @desc ウィンドウ表示のショートカットキーです。空欄にすると無効化します。
 * @default shift
 * @option shift
 * @option control
 * @option tab
 * 
 * @param addPartyCommand
 * @type boolean
 * @text パーティコマンドに追加
 * @desc パーティコマンドにステート情報の表示コマンドを追加します。
 * @default true
 * 
 * @param partyCommandText
 * @type string
 * @text パーティコマンド名
 * @desc パーティコマンドの名称を設定します。
 * @default ステート情報
 * 
 * @param hideDeadEnemy
 * @type boolean
 * @text 戦闘不能エネミー除外
 * @desc 戦闘不能となったエネミーの情報を非表示にします。
 * @default false
 * 
 * @param WindowConfig
 * @text ウィンドウ設定
 * @desc ステート情報ウィンドウ全体の設定です。この項目は使用しません。
 * 
 * @param windowWidth
 * @type number
 * @text ウィンドウ幅
 * @desc ウィンドウの横幅を設定します。
 * @default 800
 * @parent WindowConfig
 * 
 * @param windowX
 * @type combo
 * @text ウィンドウX座標
 * @desc ウィンドウのX座標を設定します(ウィンドウ幅: WindowWidth)
 * @default (Graphics.boxWidth - WindowWidth) / 2
 * @option (Graphics.boxWidth - WindowWidth) / 2
 * @parent WindowConfig
 * 
 * @param windowY
 * @type combo
 * @text ウィンドウY座標
 * @desc ウィンドウのY座標を設定します(ウィンドウ高さ: WindowHeight)
 * @default (Graphics.boxHeight - WindowHeight) / 2
 * @option (Graphics.boxHeight - WindowHeight) / 2
 * @parent WindowConfig
 * 
 * @param BattlerDisplayConfig
 * @text バトラー情報エリア設定
 * @desc ウィンドウ上部に表示するバトラー情報の設定です。この項目は使用しません。
 * 
 * @param battlerGraphicWidth
 * @type number
 * @text バトラー画像横幅
 * @desc バトラー画像を表示する領域の横幅です。横幅が大きいほど右側の領域が狭くなります。
 * @default 240
 * @parent BattlerDisplayConfig
 * 
 * @param battlerAreaRows
 * @type number
 * @text 行数
 * @desc バトラー情報エリアに表示する行数です。
 * @default 3
 * @min 1
 * @parent BattlerDisplayConfig
 * 
 * @param battlerAreaColumn
 * @type number
 * @text 列数
 * @desc バトラー情報エリアに表示する列数です。
 * @default 3
 * @parent BattlerDisplayConfig
 * 
 * @param battlerAreaPadding
 * @type number
 * @text 項目間サイズ
 * @desc 項目間の余白を設定します。大きいほど左右の間隔が大きくなります。
 * @default 16
 * @parent BattlerDisplayConfig
 * 
 * @param battlerAreaConfig
 * @type struct<BattlerAreaConfig>[]
 * @text 表示項目詳細
 * @desc バトラー情報エリアに表示する項目を設定します。
 * @parent BattlerDisplayConfig
 * @default ["{\"itemText\":\"\",\"itemTextColor\":\"0\",\"itemValue\":\"battler.name()\",\"aline\":\"left\",\"row\":\"1\",\"column\":\"1\"}","{\"itemText\":\"\",\"itemTextColor\":\"0\",\"itemValue\":\"hpGauge\",\"aline\":\"center\",\"row\":\"1\",\"column\":\"2\",\"hideEnemy\":\"true\"}","{\"itemText\":\"\",\"itemTextColor\":\"0\",\"itemValue\":\"Index\",\"aline\":\"right\",\"row\":\"1\",\"column\":\"3\",\"hideEnemy\":\"true\"}","{\"itemText\":\"攻撃力\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(2)\",\"aline\":\"right\",\"row\":\"2\",\"column\":\"1\"}","{\"itemText\":\"防御力\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(3)\",\"aline\":\"right\",\"row\":\"2\",\"column\":\"2\"}","{\"itemText\":\"魔力\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(4)\",\"aline\":\"right\",\"row\":\"2\",\"column\":\"3\"}","{\"itemText\":\"精神力\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(5)\",\"aline\":\"right\",\"row\":\"3\",\"column\":\"1\"}","{\"itemText\":\"敏捷性\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(6)\",\"aline\":\"right\",\"row\":\"3\",\"column\":\"2\"}","{\"itemText\":\"運\",\"itemTextColor\":\"16\",\"itemValue\":\"battler.param(7)\",\"aline\":\"right\",\"row\":\"3\",\"column\":\"3\"}"]
 * 
 * @param StateDisplayConfig
 * @text ステート一覧設定
 * @desc ステートの一覧の表示設定です。この項目は使用しません。
 * 
 * @param showTurn
 * @type boolean
 * @text ターン数を表示
 * @desc ステートの残りターン数を描画します
 * @default true
 * @parent StateDisplayConfig
 * 
 * @param turnText
 * @type string
 * @text ターン数描画文字列
 * @desc ステートの残りターン数の表記（%1: ターン数）
 * @default 残り%1ターン
 * @parent StateDisplayConfig
 * 
 * @param stateNothingText
 * @type string
 * @text ステート無しのテキスト
 * @desc ステートが付与されていない場合の表示テキストです。
 * @default \\C[8]ステートはありません
 * @parent StateDisplayConfig
 * 
 * @param maxRows
 * @type number
 * @text ステート表示数
 * @desc 表示するステートの個数を設定します。
 * @default 5
 * @min 1
 * @parent StateDisplayConfig
 * 
 * @param stateLineNum
 * @type number
 * @text ステート説明文行数
 * @desc ステート説明文の行数を設定します。
 * @default 1
 * @min 1
 * @parent StateDisplayConfig
 * 
 * @param StackStateConfig
 * @type string
 * @text 累積ステート設定（要: KEN_StackState.js）
 * @desc 累積ステートの表示設定です。この項目は使用しません。
 * @parent StateDisplayConfig
 * 
 * @param showStackState
 * @type boolean
 * @text 累積ステート表示
 * @desc 累積ステートをステートアイコンに表示します。KEN_StackState.jsの導入が必要です。
 * @default false
 * @parent StackStateConfig
 * 
 * @param stackFontSize
 * @text フォントサイズ
 * @desc スタック数のフォントサイズ
 * @type number
 * @default 20
 * @parent StackStateConfig
 * 
 * @param stackAxisX
 * @text スタックX座標
 * @desc 表示するスタック数のX座標
 * @type number
 * @default 4
 * @parent StackStateConfig
 * 
 * @param stackAxisY
 * @text スタックY座標
 * @desc 表示するスタック数のY座標
 * @type number
 * @default 4
 * @parent StackStateConfig
 * 
 */
/*~struct~StateConfig:
 * @param stateId
 * @type state
 * @text ステートID
 * @desc ステートIDを指定します。ステートIDは重複して設定しないでください。
 *
 * @param description
 * @type note
 * @text 説明
 * @desc ステートの説明テキスト。この項目はツクールの書式が使用可能です。
 */
/*~struct~BattlerAreaConfig:
 * @param itemText
 * @type string
 * @text 項目名
 * @desc 項目名を設定します。
 * 
 * @param itemTextColor
 * @type color
 * @text 項目名カラー
 * @desc 項目名の色を設定します。
 * @default 16
 * 
 * @param itemValue
 * @type combo
 * @text 表示パラメータ
 * @desc 表示する値を設定します(詳細はヘルプ参照)。
 * @option battler.name()
 * @option battler.param(0)
 * @option battler.sparam(0)
 * @option battler.xparam(0)
 * @option hpGauge
 * @option mpGauge
 * @option tpGauge
 * @option Index
 * 
 * @param aline
 * @type select
 * @text 表示位置
 * @desc 値の表示位置。
 * @option 右
 * @value right
 * @option 中央
 * @value center
 * @option 左
 * @value left
 * @default right
 *
 * @param row
 * @type number
 * @text 表示行
 * @desc 表示する位置（行）を設定します。存在しない行を指定しても反映されません。
 * @default 1
 * @min 1
 *
 * @param column
 * @type number
 * @text 表示列
 * @desc 表示する位置（列）を設定します。存在しない列を指定しても反映されません。
 * @default 1
 * @min 1
 * 
 * @param hideEnemy
 * @type boolean
 * @text エネミー非表示
 * @desc エネミーの場合項目を非表示にします。
 * @default false
 */


(() => {
"use strict";

const PLUGIN_NAME = "KEN_BattleStateInformation";
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

const WindowWidth = param.windowWidth || 800;
const WindowX = param.windowX || "(Graphics.boxWidth - WindowWidth) / 2";
const WindowY = param.windowY || "(Graphics.boxWidth - WindowHeight) / 2";
const TurnText = param.turnText || "残り%1ターン";
const DisplayKey = param.displayKey || 'shift';

const BattlerAreaRows = param.battlerAreaRows || 3;
const BattlerGraphicWidth = param.battlerGraphicWidth || 0;
const StateLineNum = param.stateLineNum || 1;
const StateMaxRows = param.maxRows || 4;

const StateNothingText = param.stateNothingText || "";


// ----------------------------------------------------------------------------
// static function
//

// 座標計算メソッド
const evalAxis = function(formula, wh) {
    try {
        const WindowHeight = wh;
        const result = Math.floor(eval(formula));
        return !isNaN(result) ? result : 0;
    } catch (e) {
        console.log(e);
        return 0;
    } 
}

function evaluateExpression(expression, battler) {
    try {
        // 評価式を`eval`で実行
        return eval(expression);
    } catch (e) {
        console.error(`Error evaluating expression: ${expression}`, e);
        return "error"; // エラー時は"text"を返す
    }
}

// プラグイン判定
function isStackStateEnabled() {
    return typeof KEN !== "undefined" && typeof KEN.StackState !== "undefined";
}

//-----------------------------------------------------------------------------
// Scene_Boot
//-----------------------------------------------------------------------------
const _Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    if (param.states && Array.isArray(param.states)) {
        this.createCustomStates(param.states);
    }
};

// カスタムステート情報を作成
Scene_Boot.prototype.createCustomStates = function(stateConfigs) {
    window.$customStates = {}; // カスタム情報を保持するオブジェクトを作成

    // id:0のデフォルト値を定義
    $customStates[0] = {
        id: 0,
        name: StateNothingText,
        iconIndex: 0,
        exDescription: "",
    };

    for (const config of stateConfigs) {
        const stateId = config.stateId;
        if (stateId > 0 && $dataStates[stateId]) {
            const baseState = $dataStates[stateId];

            // 元データを引き継ぎつつカスタム情報を追加
            $customStates[stateId] = {
                id: stateId,
                name: baseState.name,
                iconIndex: baseState.iconIndex,
                note: baseState.note,
                exDescription: config.description || "",
                showStateTurn: config.showStateTurn || false,
                showStateStack: config.showStateStack || false
            };
        }
    }
};

//-----------------------------------------------------------------------------
// データ参照のヘルパー関数
//-----------------------------------------------------------------------------
const getStateInfo = function(stateId) {
    if ($customStates && $customStates[stateId]) {
        return $customStates[stateId];
    }
    return $dataStates[stateId]; // カスタム情報がない場合は元データを返す
};

//-----------------------------------------------------------------------------
// Scene_Battle
//-----------------------------------------------------------------------------

const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this._stateInfoWindowWithActorCommand = false;
    this.createBattleStateInfoWindow();
};

const _createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function() {    
    _createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler('stateInfo', this.partyCommandStateInfo.bind(this));
};

const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('stateInfo', this.actorCommandStateInfo.bind(this));
};

Scene_Battle.prototype.createBattleStateInfoWindow = function() {
    const rect = this.battleStateInfoWindowRect();
    const stateWindow = new Window_BattleStateInfo(rect);
    stateWindow.setHandler("cancel", this.closeStateInfoWindow.bind(this));
    this.addWindow(stateWindow);
    this._windowBattleStateInfo = stateWindow;
};

Scene_Battle.prototype.battleStateInfoWindowRect = function() {
    const ww = WindowWidth;
    const wh = this.calcStateWindowHeight();
    const wx = evalAxis(WindowX);
    const wy = evalAxis(WindowY, wh);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.calcStateWindowHeight = function() {
    const battlerAreaHeight = Window_Selectable.prototype.lineHeight() * BattlerAreaRows;
    const stateItemHeight = (Window_Selectable.prototype.lineHeight()) * (StateLineNum + 1) + Window_Selectable.prototype.rowSpacing() * 2;
    const stateAreaHeight = (stateItemHeight * StateMaxRows);

    return battlerAreaHeight + stateAreaHeight + $gameSystem.windowPadding() * 2;
};

Scene_Battle.prototype.closeStateInfoWindow = function() {
    this._windowBattleStateInfo.hideGaugeSprite();
    this._windowBattleStateInfo.close();
    this._windowBattleStateInfo._stateListWindow.hide();
    this._windowBattleStateInfo.deactivate();
    if(this._stateInfoWindowWithActorCommand) {
        this._actorCommandWindow.activate();
        this._stateInfoWindowWithActorCommand = false;
    } else {
        this._partyCommandWindow.activate();
    }
};

Scene_Battle.prototype.partyCommandStateInfo = function() {
    this.openStateInfoWindow();
};

Scene_Battle.prototype.actorCommandStateInfo = function() {
    this._stateInfoWindowWithActorCommand = true;
    this.openStateInfoWindow();
};

Scene_Battle.prototype.openStateInfoWindow = function() {
    this._windowBattleStateInfo._stateListWindow.smoothSelect(0);
    this._windowBattleStateInfo._stateListWindow.show();
    this._windowBattleStateInfo.open();
    this._windowBattleStateInfo.activate();
    this._windowBattleStateInfo.refresh();
};

const _Scene_Battle_prototype_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function() {
    if (_Scene_Battle_prototype_isAnyInputWindowActive.call(this)) return true;
    return this._actorCommandWindow.active;
};

const _Window_Battle_needsInputWindowChange = Scene_Battle.prototype.needsInputWindowChange;
Scene_Battle.prototype.needsInputWindowChange = function() {
    return _Window_Battle_needsInputWindowChange.call(this) && !this._windowBattleStateInfo.active;
};

// ウィンドウ表示中にstatusWindowが中央に移動することを防止する
const _Scene_Battle_statusWindowX = Scene_Battle.prototype.statusWindowX;
Scene_Battle.prototype.statusWindowX = function() {
    if (this._stateInfoWindowWithActorCommand) {
        return this.statusWindowRect().x;
    } else {
        return _Scene_Battle_statusWindowX.call(this);
    }
};


//-------------------------------------------------------------------------
// Window_PartyCommand
//-------------------------------------------------------------------------
const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function() {
    _Window_PartyCommand_makeCommandList.apply(this, arguments);
    if (param.addPartyCommand) {
        this.addCommand(param.partyCommandText, 'stateInfo');
    }
};

//-------------------------------------------------------------------------
// Window_ActorCommand
//-------------------------------------------------------------------------

Window_ActorCommand.prototype.processStateInfo = function () {
    if (!$gameParty.inBattle()) return;
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    this.callHandler('stateInfo');
};

const Window_PartyCommand_processHandling = Window_PartyCommand.prototype.processHandling;
Window_ActorCommand.prototype.processHandling = function () {
    Window_PartyCommand_processHandling.apply(this);
    if (this.isOpenAndActive()) {
        if (Input.isTriggered(DisplayKey)) {
            this.processStateInfo();
        }
    }
};

//-----------------------------------------------------------------------------
// Window_BattleStateInfo
//-----------------------------------------------------------------------------
// ステート情報を表示するウィンドウクラス
// ステート一覧は子クラスで表示する
class Window_BattleStateInfo extends Window_HorzCommand {
    initialize(rect){
        super.initialize(rect);
        this.createArrowSprites();
        this.createStateList();
        this.deactivate();
        this.cursorVisible = false;
        this.openness = 0;
    }

    // 矢印スプライトの作成
    createArrowSprites() {
        this._leftArrowSprite = new Sprite();
        this._leftArrowSprite.bitmap = ImageManager.loadSystem($dataSystem.windowImageName);
        this.addChild(this._leftArrowSprite);

        this._rightArrowSprite = new Sprite();
        this._rightArrowSprite.bitmap = ImageManager.loadSystem($dataSystem.windowImageName);
        this.addChild(this._rightArrowSprite);      
}

    // 矢印の更新
    refreshHorizontalArrows() {
        const hasMultipleItems = this._list && this._list.length > 1;
        this._leftArrowSprite.visible = hasMultipleItems;
        this._rightArrowSprite.visible = hasMultipleItems;

        const w = this._width;
        const h = this._height;
        const itemHeight = this.itemRect().height;
        const p = 24;
        const q = p / 2;
        const sx = 96 + p, sy = p;
        const windowPadding = $gameSystem.windowPadding()
    
        this._leftArrowSprite.bitmap = this._windowskin;
        this._leftArrowSprite.anchor.x = 0.5;
        this._leftArrowSprite.anchor.y = 0.5;
        this._leftArrowSprite.setFrame(sx, sy + q, q, p);
        this._leftArrowSprite.move(q, itemHeight / 2 + windowPadding);
    
        this._rightArrowSprite.bitmap = this._windowskin;
        this._rightArrowSprite.anchor.x = 0.5;
        this._rightArrowSprite.anchor.y = 0.5;
        this._rightArrowSprite.setFrame(sx + p + q, sy + q, q, p);
        this._rightArrowSprite.move(w - q, itemHeight / 2 + windowPadding);
    }

    maxItems() {
        return this._list.length;
    }

    maxCols() {
        return 1;
    }

    itemHeight() {
        return this.lineHeight() * BattlerAreaRows;
    }

    maxRows() {
        return 1;
    }

    maxPageRows() {
        return 1;
    }

    itemRect(index) {
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = 0;
        const row = 0;
        const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new Rectangle(x, y, width, height);
    }

    createStateList() {
        const x = 0;
        const y = this.itemHeight();
        const width = this._width;
        const height = this._height - y;
        const rect = new Rectangle(x, y , width, height);
        const stateListWindow = new Window_BattleStateList(rect);
        this._stateListWindow = stateListWindow;
        stateListWindow.show();
        this.addChild(stateListWindow);
    }

    battler(index) {
        if(this._list.length > 0) return this._list[index];
        return null;
    }

    setBattlers(battlers) {
        this._list = battlers;
    }

    makeCommandList() {
        if(this._stateListWindow) {
            let battlers = $gameParty.members();
            const appearEnemies = $gameTroop.members().filter(battler => battler.isAppeared());
            const aliveEnemies = $gameTroop.members().filter(battler => battler.isAlive());
            battlers = battlers.concat( param.hideDeadEnemy ? aliveEnemies : appearEnemies );
            this.setBattlers(battlers);
            this._stateListWindow.setBattler(this.battler(this._index));
        }
    }  

    reselect() {
        this.select(this._index);
        this.ensureCursorVisible(true);
    }

    drawAllItems() {
        this.drawItemBackground(this.index());
        this.drawItem(this.index());
    }

    drawItem(index) {
        const rect = this.itemRect(index);
        const battler = this.battler(index);
        if (battler) {
            this.drawBattlerImage(battler, rect);
            this.drawBattlerArea(battler, rect);
        }
    }

    // バトラーの画像描画
    drawBattlerImage(battler, rect) {
        if (battler.isActor()) {
            this.drawActorImage(battler, rect);
        } else if (battler.isEnemy()) {
            this.drawEnemyImage(battler, rect);
        }
    }

    // アクター画像描画
    drawActorImage(actor, rect) {
        const x = rect.x + this.itemPadding();
        const y = rect.y + this.itemPadding();
        const graphicWidth = BattlerGraphicWidth;
        const faceHeight = rect.height - this.itemPadding() * 2;

        const faceName = actor.faceName();
        const faceIndex = actor.faceIndex();
        if(graphicWidth > 0) {
            this.drawFace(faceName, faceIndex, x, y, graphicWidth, faceHeight);
        }
    }

    // 敵画像描画
    getEnemyOffset(battler) {
        const note = $dataEnemies[battler.enemyId()].note;
        const offsetXMatch = note.match(/<EnemyOffsetX:\s*(-?\d+)>/);
        const offsetYMatch = note.match(/<EnemyOffsetY:\s*(-?\d+)>/);
        const offsetX = offsetXMatch ? parseInt(offsetXMatch[1], 10) : 0;
        const offsetY = offsetYMatch ? parseInt(offsetYMatch[1], 10) : 0;
        return { offsetX, offsetY };
    }

    drawEnemyImage(enemyBattler, rect) {
        const graphicWidth = BattlerGraphicWidth;
        if(graphicWidth <= 0) return;   // 横幅が0の場合描画しない

        const graphicHeight = rect.height - this.itemPadding() * 2;
        const enemy = $dataEnemies[enemyBattler.enemyId()];
        const bitmap = ImageManager.loadEnemy(enemy.battlerName);
        const { offsetX, offsetY } = this.getEnemyOffset(enemyBattler);
    
        if (bitmap.isReady()) {
            const sourceWidth = bitmap.width; // 画像の元の幅
            const sourceHeight = bitmap.height; // 画像の元の高さ
    
            // 中央揃えの計算
            const drawWidth = Math.min(sourceWidth, graphicWidth); // 描画幅の制限
            const drawHeight = Math.min(sourceHeight, graphicHeight); // 描画高さの制限
            const sourceX = Math.max(0, offsetX); // ソース画像の開始位置（横）
            const sourceY = Math.max(0, offsetY); // ソース画像の開始位置（縦）
    
            const x = rect.x + (graphicWidth - drawWidth) / 2 + this.itemPadding();
            const y = rect.y + this.itemPadding();
    
            // 描画処理
            this.contents.blt(
                bitmap,
                sourceX, sourceY, // ソース画像の開始位置（オフセットを適用）
                drawWidth, drawHeight, // ソース画像のサイズ（切り取るサイズ）
                x, y, // 描画先
                drawWidth, drawHeight // 描画サイズ
            );
        } else {
            // 画像がまだロードされていない場合、ロード後に再描画
            bitmap.addLoadListener(() => this.refresh());
        }
    }
    
    // スプライトの作成と管理
    createGaugeSpriteIfNeeded(battler, type) {
        if (!this._gaugeSprites) {
            this._gaugeSprites = { hp: new Map(), mp: new Map(), tp: new Map() };
        }

        if (!this._gaugeSprites[type]) {
            this._gaugeSprites[type] = new Map();
        }

        if (!this._gaugeSprites[type].has(battler)) {
            const gauge = new Sprite_Gauge();
            gauge.setup(battler, type);
            this._gaugeSprites[type].set(battler, gauge);
            this.addChild(gauge);
        }

        return this._gaugeSprites[type].get(battler);
    }

    // バトラーエリアの描画
    refreshGaugeSprites() {
        if (!this._gaugeSprites) return;

        // すべてのスプライトを非表示
        for (const type in this._gaugeSprites) {
            for (const gauge of this._gaugeSprites[type].values()) {
                gauge.visible = false;
            }
        }
    }

    drawBattlerArea(battler, rect) {
        const config = param.battlerAreaConfig;
        const graphicWidth = BattlerGraphicWidth;
        const padding = param.battlerAreaPadding || this.itemPadding(); // プラグインパラメータを使用
        const usableWidth = rect.width - graphicWidth - padding * (param.battlerAreaColumn + 1);
        const columnWidth = usableWidth / param.battlerAreaColumn;
        const lineHeight = this.lineHeight();
    
        for (const item of config) {
            if (battler.isEnemy() && item.hideEnemy) continue; // 敵の場合非表示の項目をスキップ
    
            const col = item.column - 1;
            const row = item.row - 1;
    
            if (col < 0 || row < 0) continue;
    
            const x = rect.x + graphicWidth + padding + (columnWidth + padding) * col;
            const y = rect.y + lineHeight * row;
    
            if (this.isGaugeItem(item.itemValue)) {
                this.drawGaugeItem(battler, x, y, columnWidth, item);
            } else if (item.itemValue === "Index") {
                this.drawIndex(x, y, columnWidth, item);
            } else {
                this.drawTextItem(battler, x, y, columnWidth, item);
            }
        }
    }
    
    drawIndex(x, y, columnWidth, item) {
        const currentIndex = this._index + 1; // 現在のインデックス（1始まり）
        const maxIndex = this._list.length; // 全バトラー数
        const value = `(${currentIndex}/${maxIndex})`;
        const aline = item.aline || 'right';
        this.drawText(value, x, y, columnWidth, aline);
    }
    
    isGaugeItem(itemValue) {
        return ["hpGauge", "mpGauge", "tpGauge"].includes(itemValue);
    }
    
    drawGaugeItem(battler, x, y, columnWidth, item) {
        const gauge = this.createGaugeSpriteIfNeeded(battler, item.itemValue.replace("Gauge", ""));
        const padding = this.itemPadding();
        if (item.aline === "center") {
            gauge.x = Math.floor(x + (columnWidth - gauge.width) / 2);
        } else if (item.aline === "right") {
            gauge.x = x + columnWidth - gauge.width - padding;
        } else {
            gauge.x = x + padding;
        }
        gauge.y = y + (gauge.bitmap.height / 2);
        gauge.visible = true;
    }
    
    drawTextItem(battler, x, y, columnWidth, item) {
        const itemText = item.itemText || "";
        const value = evaluateExpression(item.itemValue || "\"\"", battler);
    
        if (itemText) {
            this.changeTextColor(ColorManager.textColor(item.itemTextColor || 0));
            this.drawText(itemText, x, y, columnWidth / 2, "left");
            this.resetTextColor();
            this.drawText(value, x + columnWidth / 2, y, columnWidth / 2, item.aline || "right");
        } else {
            this.resetTextColor();
            this.drawText(value, x, y, columnWidth, item.aline || "left");
        }
    }

    hideGaugeSprite() {
        for (const sprite of this.children) {
            if (sprite instanceof Sprite_Gauge) {
                sprite.hide();
            }
        }
    }
    
    cursorUp() {
        // 処理しない
    }

    cursorDown() {
        // 処理しない
    }

    processOk(){
        // 処理しない
    }

    cursorRight(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        if (index < maxItems - 1 || wrap) {
            this.smoothSelect((index + 1) % maxItems);
        }
        this.refresh();
    }
    
    cursorLeft(wrap) {
        const index = Math.max(0, this.index());
        const maxCols = this.maxCols();
        const maxItems = this.maxItems();
        if (index > 0 || wrap) {
            this.smoothSelect((index - 1 + maxItems) % maxItems);
        }
        this.refresh();
    }

    activate() {
        super.activate();
        if(this._stateListWindow) this._stateListWindow.activate();
    }

    deactivate() {
        super.deactivate();
        if(this._stateListWindow) this._stateListWindow.deactivate();
    }

    refresh() {
        this.refreshGaugeSprites();
        super.refresh();
        if (this._stateListWindow) {
            this._stateListWindow.refresh();
            this._stateListWindow.smoothSelect(0);
        }
        if(this._leftArrowSprite && this._rightArrowSprite) {
            this.refreshHorizontalArrows();
        }
    }
}

//-----------------------------------------------------------------------------
// Window_BattleStateList
//-----------------------------------------------------------------------------
// ステート一覧を表示するウィンドウクラス
class Window_BattleStateList extends Window_Command {
    initialize(rect){
        super.initialize(rect);
        this.frameVisible = false;
        this._battler = null;
        this.backOpacity = 0;
    }

    itemRectWithPadding(index) {
        const rect = super.itemRectWithPadding(index);
        return rect;
    }

    isShowTurn(stateId) {
        const showTurn = param.showTurn || false;
        const stateInfo = $dataStates[stateId]; // カスタム情報を取得
        return showTurn && stateId > 0 && stateInfo.autoRemovalTiming != 0;
    }

    itemHeight() {
        const lineNum = StateLineNum + 1;
        return this.lineHeight() * lineNum + this.itemPadding();
    }

    battler() {
        return this._battler;
    }

    setBattler(battler) {
        this._battler = battler;
        this.makeCommandList();
    }

    statesWithDescription() {
        const states = this._battler.states(); // バトラーのステート一覧を取得
        const filteredStates = states.map(state => {
            const stateInfo = getStateInfo(state.id); // カスタム情報を取得
            if (stateInfo && stateInfo.exDescription && stateInfo.exDescription !== "") {
                return {
                    id: state.id,
                    name: stateInfo.name || state.name,
                    exDescription: stateInfo.exDescription
                };
            }
            return null;
        }).filter(state => state !== null); // 無効なエントリを除外
    
        // ステートがない場合のデフォルト表示
        if (filteredStates.length === 0) {
            const nothingItem = { 
                id: 0, 
                name: "", 
                exDescription: StateNothingText 
            };
            return [nothingItem];
        }
    
        return filteredStates;
    }

    makeCommandList() {
        const battler = this.battler();
        if (battler) {
            this._list = this.statesWithDescription();
        }
    }

    drawAllItems() {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemBackground(index);
                this.drawItem(index);
            }
        }
    }

    drawItem(index) {
        if(!this._list[index]) return;
        const stateId = this._list[index].id;
        const rect = this.itemRectWithPadding(index);
        this.drawStateName(stateId, rect);
        if(this.isShowTurn(stateId)) {
            this.drawStateTurn(stateId, rect);
        }
        this.drawDescription(stateId, rect);
    }

    drawStateName(stateId, rect) {
        const stateName = $customStates[stateId].name;
        const iconIndex = $customStates[stateId].iconIndex;
        const iconOffset = ImageManager.iconWidth;
        this.drawIcon(iconIndex, rect.x, rect.y + 2);
        this.drawTextEx(stateName, rect.x + iconOffset, rect.y, this.itemWidth());
        this.drawStack(stateId, rect.x, rect.y + 2) // 要 KEN_StackState.js
    }

    drawStack(stateId, x, y) {
        // プラグイン有効化チェック
        if (this.isStackStateAvailable(stateId)) {
            const width = ImageManager.iconWidth;
            const stack = this.battler().stateStack(stateId);
            if(stack >= 0) {
                this.contents.fontSize = param.stackFontSize;
                const sx = param.stackAxisX;
                const sy = param.stackAxisY;
                this.drawText(stack, x + sx, y + sy, width);
            }
        }  
    }

    isStackStateAvailable(stateId) {
        return (
            param.showStackState && 
            isStackStateEnabled() && 
            stateId > 0
        )
    }

    drawDescription(stateId, rect) {
        const text = $customStates[stateId].exDescription || "";
        const x = rect.x + this.itemPadding();
        const y = rect.y + this.lineHeight();
        this.resetFontSettings();
        this.drawTextEx(this.replaceStackString(text), x, y, rect.width);
    }

    // テキスト補正
    replaceStackString = function(input) {
        // 正規表現で `\stack[整数]` のパターンを検出
        if(isStackStateEnabled()) {
            const battler = this.battler();
            return input.replace(/\\stack\[(\d+)]/g, (_, number) => {
                return battler.stateStack(Number(number));
            });
        } else {
            return input;
        }
    }

    drawStateTurn(stateId, rect) {
        const battler = this._battler;
        const turns = battler._stateTurns[stateId] !== undefined ? battler._stateTurns[stateId] : -1;
        const text = String(TurnText).format(turns);
        this.resetFontSettings();
        this.drawText(text, rect.x, rect.y, rect.width, "right");
    }

    isOkEnabled() {
        return false;
    }
}

})();
