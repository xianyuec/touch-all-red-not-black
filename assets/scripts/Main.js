cc.Class({
    extends: cc.Component,

    properties: {
        winNode: cc.Node,
        loseNode: cc.Node,
        winTimeLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickBegin: function () {
        cc.loader.loadRes('Game', (err, prefab)=>{
            var node = cc.instantiate(prefab);
            node.getComponent('Game').main = this;
            this.node.addChild(node);
        });
    },

    win: function (time) {
        this.winNode.active = true;
        this.winTimeLabel.string = Math.floor(time) + '.' + (Math.floor(time*100) % 100) + '秒';
    },

    lose: function () {
        this.loseNode.active = true;
    },

    onClickCloseResult: function () {
        this.winNode.active = this.loseNode.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
