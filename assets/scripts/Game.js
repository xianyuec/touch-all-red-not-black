cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var data = {
            reds: [],
            blacks: []
        };
        var redNum = Math.floor(Math.random() * 10 + 1);
        for (var i = 0; i < redNum; i ++) {
            var x = -0.4 + 0.8 * Math.random();
            var y = -0.4 + 0.8 * Math.random();
            data.reds.push({x: x, y: y});
        }
        var blackNum = Math.floor(Math.random() * 5 + 1);
        for (var i = 0; i < blackNum; i ++) {
            var x = -0.4 + 0.8 * Math.random();
            var y = -0.4 + 0.8 * Math.random();
            data.blacks.push({x: x, y: y});
        }
        this.initPanel(data);


        this.node.on('touchend', this.onTouchEnd, this);
    },

    onDestroy: function () {
        this.node.off('touchend', this.onTouchEnd, this);
    },

    initPanel: function (data) {
        this.reds = data.reds;
        this.blacks = data.blacks;
        this.points = [];
        this.reds.forEach((p)=>{
            cc.loader.loadRes('Red', (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    this.node.addChild(node);
                    node.setPosition(cc.p(p.x * this.node.width, p.y * this.node.height));
                }
            });
        });
        this.blacks.forEach((p)=>{
            cc.loader.loadRes('Black', (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    this.node.addChild(node);
                    node.setPosition(cc.p(p.x * this.node.width, p.y * this.node.height));
                }
            });
        });
    },

    onTouchEnd: function (event) {
        var x = this.node.convertTouchToNodeSpaceAR(event).x;
        var y = this.node.convertTouchToNodeSpaceAR(event).y;
        cc.loader.loadRes('Blue', (err, prefab)=>{
            if (!err) {
                var node = cc.instantiate(prefab);
                this.node.addChild(node);
                node.setPosition(cc.p(x, y));
                this.points.push(node);
            }
        });
    },

    judge: function () {
        var reds = this.reds.map((p)=>{return {x: p.x * this.node.width, y: p.y * this.node.height}});
        var blacks = this.blacks.map((p)=>{return {x: p.x * this.node.width, y: p.y * this.node.height}});
        var blues = this.points.map((p)=>{return {x: p.x, y: p.y, scale: p.scale}});
        // 先检查是否碰到黑点了
        for (var i = 0; i < blues.length; i ++) {
            var blue_x = blues[i].x;
            var blue_y = blues[i].y;
            var blue_width = 25 * blues[i].scale;
            for (var j = 0; j < blacks.length; j ++) {
                var x = blacks[j].x;
                var y = blacks[j].y;
                var dis = Math.sqrt((blue_x - x) * (blue_x - x) + (blue_y - y) * (blue_y - y));
                if (dis < blue_width - 25) {
                    this.stopUpdate = true;
                    this.lose();
                    return;
                }
            }
        }

        // 再检查是否红点都碰到了
        if (blues.length == 0) {
            return;
        }
        var redTouchList = [];
        for (var i = 0; i < reds.length; i ++) {
            redTouchList.push(false);
        }
        for (var i = 0; i < blues.length; i ++) {
            var blue_x = blues[i].x;
            var blue_y = blues[i].y;
            var blue_width = 25 * blues[i].scale;
            for (var j = 0; j < reds.length; j ++) {
                var x = reds[j].x;
                var y = reds[j].y;
                var dis = Math.sqrt((blue_x - x) * (blue_x - x) + (blue_y - y) * (blue_y - y));
                if (dis < blue_width - 25) {
                    redTouchList[j] = true;
                }
            }
        }
        var allRedTouch = true;
        for (var i = 0; i < redTouchList.length; i ++) {
            if (redTouchList[i] == false) {
                allRedTouch = false;
                break;
            }
        }
        if (allRedTouch == true) {
            this.stopUpdate = true;
            this.win();
        }
    },

    win: function () {
        if (this.main) {
            this.main.win(this.timer);
        }
        this.node.destroy();
    },

    lose: function () {
        if (this.main) {
            this.main.lose();
        }
        this.node.destroy();
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.stopUpdate == true) {
            return;
        }
        if (this.timer == null) this.timer = 0;
        this.timer += dt;

        this.points.forEach((node)=>{
            var scale = node.scale;
            node.setScale(scale + dt);
        });

        this.judge();
    },
});
