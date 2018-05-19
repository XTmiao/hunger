<template>
    <transition name="move">
        <div class="food" v-show="showFlag">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back">
                        <i class="icon-arrow_lift" @click="hidden"></i>
                    </div>
                </div>
                <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <div class="detail">
                        <span class="count">月售{{food.sellCount}}</span><span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol">
                        <CartControl :food="food"></CartControl>
                    </div>
                    <div class="buy" v-show="!food.count || food.count===0" @click="addCount($event)">加入购物车</div>
                </div>

                <SplitView v-show="food.info"></SplitView>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>

                <SplitView></SplitView>
                <div class="ratings">
                    <h1 class="title">商品评价</h1>
                    <RatingSelect :only-content="onlyContent" :selectType="selectType" :desc="desc" :ratings="food.ratings" @toggle-content="toggle" @change-type="changeType"></RatingSelect>
                    <div class="rating-wrapper border-1px">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-for="rating in food.ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img height="12" width="12" :src="rating.avatar" alt="" class="avatar" />
                                </div>
                                <div class="time">{{rateTime(rating.rateTime)}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show=" !food.ratings || !food.ratings.length ">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll'
    import Vue from 'vue'
    import CartControl from '../cartcontrol/cartcontrol'
    import SplitView from '../split/split'
    import RatingSelect from '../ratingselect/ratingselect'

    const ALL = 2;
    const POSOTIVE = 0;
    const NEGATIVE = 1;
    export default{
        props: {
            food: {
                type: Object
            }
        },
        data(){
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            }
        },
        methods: {
            show(){
                this.showFlag = true;
                this.$nextTick( () => {
                    if (!this.scroll) {
                        this.scroll = new BScroll( '.food', {
                            click: true
                        } )
                    }else{
                        this.scroll.refresh();
                    }
                } )
            },
            hidden(){
                this.showFlag = false;
            },
            addCount(event){
                if( !event._constructed ){
                    return;
                }
                this.$emit( 'cart-count', event.target  );
                //console.log(event.target);
                if( !this.food.count || this.food.count===0 ){
                    Vue.set( this.food, 'count', 1 );
                }else{
                    this.food.count ++;
                    console.log(1)
                }
            },
            changeType(type){
                this.selectType = type;
            },
            toggle(toggle) {
                this.onlyContent = !this.onlyContent;
            },
            needShow(type, text){
                if ( this.onlyContent && !text ) {   //如果按钮为true并且评价没有内容
                    return false;
                }
                if (this.selectType === ALL) {      //商品评价为ALL时返回true
                    return true;
                }else{
                    return type === this.selectType;   //
                }
            },
            rateTime(time) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();
                let str = [year,month,day].join('-');
                let hour = date.getHours();
                let min = date.getMinutes();
                let sec = date.getSeconds();
                let str1 = [hour,min,sec].join(':');
                return `${str} ${str1}`;
            }
        },
        components: {

        },
        components: {
            CartControl,
            SplitView,
            RatingSelect
        }
    }
</script>

<style scoped>
    .food{position: fixed; top: 0; left: 0; bottom: 48px; z-index: 40; width: 100%; background: #fff;}
    .move-enter-active,.move-leave-active{transition: all .5s; transform: translate3d(0,0,0);}
    .move-enter,.move-leave-to{transform: translate3d(100%,0,0);}
    .food .image-header{position: relative; width: 100%; height: 0; padding-top: 100%;/*设置width100%再设置padding-top会把高度撑开，避免图片没加载出来时改变下边的布局*/}
    .food .image-header img{position: absolute; top: 0; left: 0; width: 100%; height: 100%;}
    .food .image-header .back{position: absolute; top: 10px; left: 0;}
    .food .image-header .back .icon-arrow_lift{display: block; padding: 10px; font-size: 20px; color: #fff;}
    .food .content{padding: 18px; position: relative;}
    .food .content .name{margin-bottom: 8px; height: 14px; line-height: 14px; font-size: 14px; color: rgb(7,17,27); font-weight: 700;}
    .food .content .detail{margin-bottom: 10px; line-height: 10px; height: 10px; font-size: 0px;}
    .food .content .detail .count,.food .content .detail .rating{font-size: 10px; color: rgb(147,153,159);}
    .food .content .detail .count{margin-right: 12px;}
    .food .content .price{line-height: 24px; font-size: 10px/14px; color: rgb(147,153,159); font-weight: normal/700;}
    .food .content .price .now{margin-right: 8px; color: rgb(240,20,20);}
    .food .content .price .old{text-decoration: line-through; font-size: 10px;}
    .food .cartcontrol{position: absolute; right: 10px; bottom: 12px; width: 88px; height: 24px;}
    .food .buy{position: absolute; right: 18px; bottom: 18px; z-index: 10; height: 24px; line-height: 24px; padding: 0 12px; box-sizing: border-box; border-radius: 12px; font-size: 10px; color: #fff; background: rgb(0,160,220);}
    .food .info{padding: 18px;}
    .food .info .title{line-height: 14px; margin-bottom: 6px; font-size: 14px; color: rgb(7,17,27);}
    .food .info .text{line-height: 24px; padding: 0 8px; font-size:12px; color: rgb(77,85,93);}

    .food .ratings{padding-top: 18px;}
    .food .ratings .title{line-height: 14px; margin-left: 18px; font-size: 14px; color: rgb(7,17,27);}
    .food .ratings .rating-wrapper{position: relative; padding: 0 18px;}
    .food .ratings .rating-wrapper::after{position: absolute; bottom: 0; left: 0; width: 100%; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
    .food .ratings .rating-wrapper .rating-item{position: relative; padding: 16px 0;}
    .food .ratings .rating-wrapper .rating-item .user{position: absolute; right: 0; top: 16px; line-height: 12px; font-size: 0;}
    .food .ratings .rating-wrapper .rating-item .user .name{display: inline-block; margin-left: 6px; vertical-align: top; font-size: 10px; color: rgb(147,153,159);}
    .food .ratings .rating-wrapper .rating-item .user .avatar{border-radius: 50%;}
    .food .ratings .rating-wrapper .rating-item .time{margin-bottom: 6px; line-height: 12px; font-size: 10px; color: rgb(147,153,159);}
    .food .ratings .rating-wrapper .rating-item .text{line-height: 16px; font-size: 12px; color: rgb(7,17,27);}
    .food .ratings .rating-wrapper .rating-item .text .icon-thumb_up,.food .ratings .rating-wrapper .rating-item .text .icon-thumb_down{margin-right: 4px; line-height: 16px; font-size: 12px;}
    .food .ratings .rating-wrapper .rating-item .text .icon-thumb_up{color: rgb(0,160,220);}
    .food .ratings .rating-wrapper .no-rating{padding: 16px 0; font-size: 12px; color: rgb(147,153,159);}
</style>