<template>
    <div class="seller">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc">
                    <StarView :size="36" :score="seller.score"></StarView>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价元</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}元</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="ifFavorite($event)">
                    <i class="icon-favorite" :class="{'active': favorite}"></i>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <SplitView></SplitView>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul class="supports" v-if="seller.supports">
                    <li v-for="support in seller.supports" class="support-item border-1px">
                        <span class="icon" :class="classMap[support.type]"></span><span class="text">{{support.description}}</span>
                    </li>
                </ul>
            </div>
            <SplitView></SplitView>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper">
                    <ul class="pic-list">
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" height="90" width="120">
                        </li>
                    </ul>
                </div>
            </div>
            <SplitView></SplitView>
            <div class="info">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import StarView from '../stars/stars'
    import SplitView from '../split/split'
    import {saveLocal, fetchLocal} from '../../assets/js/store'
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                favorite: ( () => {
                    let favorite = fetchLocal( this.seller.id, 'favorite', false );
                    return favorite;
                } )()
            }
        },
        computed: {
            favoriteText() {
                return this.favorite ? '未收藏' : '收藏';
            }
        },
        created() {   //此时seller为空对象，还没有拿到数据，所以BScroll不能计算DOM的高度，因为DOM的高度是被数据撑起来的
            this.classMap = [ 'decrease', 'discount', 'special', 'invoice', 'guarantee' ];
            /*this.$nextTick( () => {
                this.scroll = new BScroll( '.seller' );
                this._picScroll()
            } )*/
        },
        ready() {   //此时seller也为空，可以通过watch来检测seller数据的变化
            //this._initScroll()
            //this._picScroll()
        },
        watch: {    //切换页面的时候watch方法是不会被执行的，只有数据发生变化或者刷新重新获取数据的时候才会被触发，所以切换页面之后_initScroll函数不会被调用，内容不能滑动
            /*'seller' () {
                this._initScroll()
            }
            'picWrapper' () {
                this._picScroll()
            }*/
        },
        mounted(){
            this._initScroll();
            //this._picScroll();
        },
        updated () {
            this._picScroll()     //组建更新之后才能计算出wid
        },
        methods: {
            _initScroll () {
                if (!this.scroll) {
                    this.scroll = new BScroll( '.seller', {
                        click: true
                    } )
                }else {
                    this.scroll.refresh();
                }
            },
            //横向滚动要在updated中调用，否则wid计算不出来，就不能滚动
            _picScroll() {          //横向滚动   需要设置scrollY.scrollX,如果不想影响外层的纵向滚动需要加上eventPassthrough,还要注意，横向滚动的时候需要在js中计算设置滚动元素的子元素我宽度并设置其宽度
                let width = 120;
                let margin = 6;
                let len = document.getElementsByClassName('pic-item').length;
                let wid = (width + margin) * len - margin;
                document.getElementsByClassName('pic-list')[0].style.width = wid + 'px';
                //console.log( wid )
                this.$nextTick( () => {
                    if (!this.picScroll){
                        this.picScroll = new BScroll( '.pic-wrapper', {
                            scrollX: true,
                            scrollY: false,
                            eventPassthrough: 'vertical'
                        } );
                    }else{
                        this.picScroll.refresh();
                    }

                    //console.log(this.picScroll)
                } );
            },
            ifFavorite (event) {
                if (!event._constructed){
                    return;
                }
                this.favorite = !this.favorite;
                saveLocal( this.seller.id, 'favorite', this.favorite )
            }
        },
        components: {
            StarView,
            SplitView
        }
    }
</script>

<style scoped>
    .seller{position: absolute; top: 174px; left: 0; bottom: 0; width: 100%; overflow: hidden;}
    .seller .overview{position: relative; padding: 18px;}
    .seller .overview .title{margin-bottom: 8px; line-height: 14px; color: rgb(7,17,27); font-size: 14px;}
    .seller .overview .desc{position: relative; padding-bottom: 18px; font-size: 0;}
    .seller .overview .desc::after{position: absolute; left: 0; bottom: 0; border-bottom: 1px solid rgba(7,17,27,0.1); width: 100%; content: '';}
    .seller .overview .desc .stars{display: inline-block; margin-right: 8px; vertical-align: top;}
    .seller .overview .desc .text{margin-right: 12px; display: inline-block; vertical-align: top; line-height: 18px; font-size: 10px; color: rgb(77,85,93);}
    .seller .overview .remark{display: flex; padding-top: 18px;}
    .seller .overview .remark .block{flex: 1; text-align: center; border-right: 1px solid rgba(7,17,27,0.1);}
    .seller .overview .remark .block:last-child{border: none;}
    .seller .overview .remark .block h2{margin-bottom: 4px; line-height: 10px; font-size: 10px; color: rgb(147,153,159);}
    .seller .overview .remark .block .content{line-height: 24px; font-size: 10px; color: rgb(7,17,27);}
    .seller .overview .remark .block .content .stress{font-size: 24px;}
    .seller .overview .favorite{position: absolute; right: 11px; top: 18px; width: 50px; text-align: center;}
    .seller .overview .favorite .icon-favorite{display: block; margin-bottom: 4px; line-height: 24px; font-size: 24px; color: #d4d6d9;}
    .seller .overview .favorite .active{color: rgb(240,20,20);}
    .seller .overview .favorite .text{line-height: 10px; font-size: 10px;color: rgb(77,85,93); }
    .seller .bulletin{padding: 18px 18px 0 18px;}
    .seller .bulletin .title{margin-bottom: 8px; line-height: 14px; color: rgb(7,17,27); font-size: 14px;}
    .seller .bulletin .content-wrapper{position: relative; padding: 0 12px 16px 12px;}
    .seller .bulletin .content-wrapper::after{position: absolute; left: 0; bottom: 0; width: 100%; border-bottom: 1px solid rgba(7,17,27,0.1); content: '';}
    .seller .bulletin .content-wrapper .content{line-height: 24px; font-size: 12px; color: rgb(240,20,20);}

    .seller .bulletin .supports .support-item{position: relative; padding: 16px 12px; font-size: 0;}
    .seller .bulletin .supports .support-item::after{position: absolute; bottom: 0; left: 0; width: 100%; border-bottom: 1px solid rgba(7,17,27,0.1); content: '';}
    .seller .bulletin .supports .support-item:last-child::after{border: none;}
    .seller .bulletin .supports .support-item .icon{display: inline-block; width: 16px; height: 16px; margin-right: 6px; background-size: 16px 16px; background-repeat: no-repeat; vertical-align: top;}
    .seller .bulletin .supports .support-item .decrease{background-image: url('decrease_4@2x.png');}
    .seller .bulletin .supports .support-item .discount{background-image: url('discount_4@2x.png');}
    .seller .bulletin .supports .support-item .guarantee{background-image: url('guarantee_4@2x.png');}
    .seller .bulletin .supports .support-item .invoice{background-image: url('invoice_4@2x.png');}
    .seller .bulletin .supports .support-item .special{background-image: url('special_4@2x.png');}
    @media (min-device-pixel-ratio: 3),(-Webkit-min-device-pixel-ratio: 3){
        .seller .bulletin .supports .support-item .decrease{background-image: url('decrease_4@3x.png');}
        .seller .bulletin .supports .support-item .discount{background-image: url('discount_4@3x.png');}
        .seller .bulletin .supports .support-item .guarantee{background-image: url('guarantee_4@3x.png');}
        .seller .bulletin .supports .support-item .invoice{background-image: url('invoice_4@3x.png');}
        .seller .bulletin .supports .support-item .special{background-image: url('special_4@3x.png');}
    }
    .seller .bulletin .supports .support-item .text{line-height: 16px; font-size: 12px; color: rgb(7,17,27);}
    .seller .pics{padding: 18px;}
    .seller .pics .title{margin-bottom: 12px; line-height: 14px; color: rgb(7,17,27); font-size: 14px;}
    .seller .pics .pic-wrapper{width: 100%; overflow: hidden; white-space: nowrap;}
    .seller .pics .pic-wrapper .pic-list{font-size: 0;}
    .seller .pics .pic-wrapper .pic-list .pic-item{display: inline-block; margin-right: 6px; width: 120px; height: 90px;}
    .seller .pics .pic-wrapper .pic-list .pic-item:last-child{margin: 0;}
    .seller .info{padding: 18px 18px 0 18px; color: rgb(7,17,27);}
    .seller .info .title{position: relative; padding-bottom: 12px; line-height: 14px; font-size: 14px;}
    .seller .info .title::after{position: absolute; bottom: 0; left: 0; width: 100%; border-bottom: 1px solid rgba(7,17,27,0.1); content: '';}
    .seller .info .info-item{position: relative; padding: 16px 12px; line-height: 16px; font-size: 12px;}
    .seller .info .info-item::after{position: absolute; bottom: 0; left: 0; width: 100%; border-bottom: 1px solid rgba(7,17,27,0.1); content: '';}
    .seller .info .info-item:last-child::after{border: none;}
</style>