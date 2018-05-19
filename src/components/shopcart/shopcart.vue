<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'heighLight': totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'heighLight': totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'heighLight': totalCount>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{minPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>  <!-- 阻止默认事件 -->
            </div>
        </div>
        <div class="ball-container">
            <transition v-for="(ball, index) in balls" :key="index" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div v-show="ball.show" class="ball">
                    <div class="inner inner-hook"></div>
                </div>
            </transition>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content">
                    <ul>
                        <li v-for="food in selectFood" class="food border-1px">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <CartControl :food="food" @cart-add="drop"></CartControl>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>

        <transition name="mask">
            <div class="mask" v-show="listShow" @click="hiddenList"></div>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import CartControl from '../cartcontrol/cartcontrol'
    export default{
        props:{
            selectFood: {
                type: Array
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        computed:{
            totalPrice(){
                let totalPrice = 0;
                this.selectFood.forEach( (food) => {
                    totalPrice += food.price*food.count;
                } );
                return totalPrice;
            },
            totalCount(){
                let totalCount = 0;
                this.selectFood.forEach( (food) => {
                    totalCount += food.count;
                } );
                return totalCount;
            },
            payDesc(){
                if( this.totalPrice === 0 ){
                    this.payClass = '';
                    return `￥${this.minPrice}元起送`
                }else if( this.totalPrice < this.minPrice ){
                    this.payClass = 'not-enough';
                    return `还差${this.minPrice-this.totalPrice}元起送`
                }else{
                    this.payClass = 'enough'
                    return '去结算'
                }
            },
            listShow(){
                if( !this.totalCount ){
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if (show) {
                    if( !this.scroll ){
                        this.scroll = new BScroll( '.list-content', {
                            click: true
                        } )
                    }else{
                        this.scroll.refresh();   //刷新this.scroll
                    }

                }
                return show;
            }
        },
        data(){
            return {
                payClass: '',
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [],
                fold: true    //折叠
            }
        },
        methods:{
            drop(el){
                for( let i=0; i<this.balls.length; i++ ){
                    let ball = this.balls[i];
                    if( !ball.show ){
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter(el){
                let count = this.dropBalls.length;
                while( count-- ){
                    let ball = this.dropBalls[count];
                    if( ball.show ){
                        let rect = ball.el.getBoundingClientRect();
                        let y = -( window.innerHeight - rect.top - 22 );
                        let x = rect.left - 32;
                        el.style.display = '';
                        el.style.transform = `translate3d( 0, ${y}px, 0 )`;
                        el.style.webkitTransform = `translate3d( 0, ${y}px, 0 )`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.transform = `translate3d( ${x}px, 0, 0 )`;
                        inner.style.webkitTransform = `translate3d( ${x}px, 0, 0 )`;
                    }
                }
            },
            enter(el,done){
                let rf = el.offsetHeight;   　//重绘页面
                this.$nextTick( () => {   //提高性能
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0]
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                } );
            },
           afterEnter(el){
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList(){
                if( !this.totalCount ){
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.selectFood.forEach( (food) => {
                    food.count = 0;
                } )
            },
            hiddenList() {
                this.fold = true;
            },
            pay() {
                if (this.payClass != 'enough'){
                    return;
                }
                window.alert( `支付${this.totalPrice}元` );
            }
        },
        components: {
            CartControl
        }
    }
</script>

<style>

    .shopcart{position: fixed; bottom: 0; left: 0; width: 100%; height: 48px; z-index: 50;}
    .shopcart .content{display: flex; background: #141d27; font-size: 0;}
    .shopcart .content .content-left{flex: 1;}
    .shopcart .content .content-left .logo-wrapper{display: inline-block; vertical-align: top; position: relative; top: -10px; margin: 0 12px; padding: 6px; width: 56px; height: 56px; box-sizing: border-box; background: #141d27; border-radius: 50%;}
    .shopcart .content .content-left .logo-wrapper .logo{width: 100%; height: 100%; text-align: center; border-radius: 50%; background: #2b343c;}
    .shopcart .content .content-left .logo-wrapper .heighLight{background: rgb(0,160,220);}
    .shopcart .content .content-left .logo-wrapper .logo.heighLight .heighLight{color: rgb(255,255,255);}
    .shopcart .content .content-left .logo-wrapper .logo .icon-shopping_cart{line-height: 44px; font-size: 24px; color: #80858a; }
    .shopcart .content .content-left .logo-wrapper .num{position: absolute; top: 0; right: 0; height: 16px; width: 24px; line-height: 16px; text-align: center; background: rgb(240,20,20); color: rgb(255,255,255); font-size: 9px; font-weight: 700; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4); border-radius: 16px;}
    .shopcart .content .content-left .price{display: inline-block; vertical-align: top; margin-top: 12px; line-height: 24px; padding-right: 12px; box-sizing: border-box; border-right: 1px solid rgba(225,225,225,0.1); font-size: 16px; font-weight: 700; color: rgba(225,225,225,0.4);}
    .shopcart .content .content-left .heighLight{color: #fff;}
    .shopcart .content .content-left .desc{display: inline-block; vertical-align: top; margin: 12px 0 0 12px; line-height: 24px; color: rgba(225,225,225,0.4); font-size: 10px;}
    .shopcart .content .content-right{flex: 0 0 105px; width: 105px;}
    .shopcart .content .content-right .pay{ font-size: 12px; font-weight: 700; height: 48px; line-height: 48px; text-align: center; color: rgba(225,225,225,0.4);}
    .shopcart .content .content-right .pay.not-enough{background: #2b333b;}
    .shopcart .content .content-right .pay.enough{background: #00b43c; color: #fff;}
    .shopcart .ball-container .ball{position: fixed; left: 32px; bottom: 22px; z-index: 200; transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);}
    .shopcart .ball-container .ball .inner{width: 16px; height: 16px; border-radius: 50%; background: rgb(0,160,220); transition: all 0.5s linear;}

    .shopcart .shopcart-list{position: absolute; top: 0; left: 0; width: 100%; z-index: -1;}
    .shopcart-list{ transform: translate3d(0,-100%,0);}
    .fold-enter-active,.fold-leave-active{transition: all .5s;}
    .fold-enter,.fold-leave-to{transform: translate3d(0,0,0);}

    .shopcart .shopcart-list .list-header{height: 40px; line-height: 40px; padding: 0 18px; background: #f3f5f7; border-bottom: 1px solid rgba(7,17,27,0.1);}
    .shopcart .shopcart-list .list-header .title{float: left; font-size: 14px; color: rgb(7,17,27);}
    .shopcart .shopcart-list .list-header .empty{float: right; font-size: 12px; color: rgb(0,160,220);}
    .shopcart .shopcart-list .list-content{padding: 0 18px; max-height: 217px; overflow: hidden; background: #fff;}
    .shopcart .shopcart-list .list-content .food{position: relative; padding: 12px 0; box-sizing: border-box;}
    .shopcart .shopcart-list .list-content .food::after{position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: 1px solid rgba(7,17,27,0.1); content: '';}
    .shopcart .shopcart-list .list-content .food .name{line-height: 24px; font-size: 14px; color: rgb(7,17,27);}
    .shopcart .shopcart-list .list-content .food .price{position: absolute; right: 90px; bottom: 12px; line-height: 24px; font-size: 14px; font-weight: 700; color: rgb(240,20,20);}
    .shopcart .shopcart-list .list-content .food .cartcontrol-wrapper{position: absolute; right: 0; bottom: 6px;}

    .mask{position: fixed; top: 0; left: 0; width: 100%; height: 100%;  background: rgba(7,17,27,0.6); z-index: -2; backdrop-filter: blur(10px); transition: all .5s;}
    .mask-enter-active,.mask-leave-active{opacity: 1; background: rgba(7,17,27,0.6);}
    .mask-enter,.mask-leave-to{opacity: 0;}
</style>