<template>
    <div class="ratings">
        <div class="ratings-wrapper">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <StarView :size="36" :score="seller.serviceScore"></StarView>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <StarView :size="36" :score="seller.foodScore"></StarView>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <SplitView></SplitView>
            <RatingSelect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" @toggle-content="toggle" @change-type="changeType"></RatingSelect>
            <div class="rating-wrapper border-1px">
                <ul v-show="ratings && ratings.length">
                    <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
                        <div class="avatar">
                            <img height="28" width="28" :src="rating.avatar" />
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <StarView :size="24" :score="rating.score"></StarView>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span class="item" v-for="item in rating.recommend">{{item}}</span>
                            </div>
                            <div class="time">{{rateTime(rating.rateTime)}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script>
    import BScroll from 'better-scroll'
    import StarView from '../stars/stars'
    import SplitView from '../split/split'
    import RatingSelect from '../ratingselect/ratingselect'

    const ALL = 2;
    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data(){
            return{
                ratings: [],
                selectType: ALL,
                onlyContent: true
            }
        },
        created() {
            this.axios.get( 'api/ratings' ).then( (response) => {
                this.ratings = response.data.data;
                this.$nextTick( () => {
                    this.ratingScroll = new BScroll( '.ratings', {
                        probeType: 3,
                        click: true
                    } );
                } );
            } ).catch( (err) => {
                console.log( err );
            } )
        },
        methods: {
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
            },
            toggle(btn) {
                this.onlyContent = !this.onlyContent;
            },
            changeType (type) {
                this.selectType = type;
            }
        },
        components: {
            StarView,
            SplitView,
            RatingSelect
        }
    }
</script>

<style scoped>
    .ratings{position: absolute; top: 174px; bottom: 0; left: 0; width: 100%; height: auto; overflow: hidden;}
    .ratings .overview{display: flex; padding: 18px 0;}
    .ratings .overview .overview-left{flex: 0 0 137px; padding: 6px 0; width: 137px; border-right: 1px solid rgba(7,17,27,0.1); text-align: center;}
    @media only screen and (max-width: 320px) {
        .ratings .overview .overview-left{flex: 0 0 120px; width: 120px;}
    }
    .ratings .overview .overview-left .score{margin-bottom: 6px; line-height: 28px; font-size: 24px; color: rgb(255,153,0);}
    .ratings .overview .overview-left .title{margin-bottom: 8px; line-height: 12px; font-size: 12px; color: rgb(7,17,27);}
    .ratings .overview .overview-left .rank{padding-bottom: 6px; line-height: 10px; font-size: 10px; color: rgb(147,153,159);}
    .ratings .overview .overview-right{flex: 1; padding: 6px 0 6px 24px;}
    @media only screen and (max-width: 320px) {
        .ratings .overview .overview-right{padding-left: 6px;}
    }
    .ratings .overview .overview-right .score-wrapper{margin-bottom: 8px; line-height: 18px; font-size: 0;}
    .ratings .overview .overview-right .score-wrapper .title{display: inline-block; vertical-align: top; line-height: 16px; font-size: 12px; color: rgb(7,17,27);}
    .ratings .overview .overview-right .score-wrapper .stars{display: inline-block; vertical-align: top; margin: 0 10px;}
    .ratings .overview .overview-right .score-wrapper .score{display: inline-block; line-height: 18px; vertical-align: top; font-size: 12px; color: rgb(255,153,0);}
    .ratings .overview .overview-right .delivery-wrapper{font-size: 0;}
    .ratings .overview .overview-right .delivery-wrapper .title{line-height: 18px; font-size: 12px;}
    .ratings .overview .overview-right .delivery-wrapper .delivery{margin-left: 12px; font-size: 12px; color: rgb(147,153,159);}
    .ratings .rating-wrapper{position: relative; padding: 0 18px;}
    .ratings .rating-wrapper::after{position: absolute; bottom: 0; left: 0; width: 100%; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
    .ratings .rating-wrapper .rating-item{display: flex; padding: 18px 0;}
    .ratings .rating-wrapper .rating-item .avatar{flex: 0 0 28px; width: 28px; margin-right: 12px;}
    .ratings .rating-wrapper .rating-item .avatar img{border-radius: 50%;}
    .ratings .rating-wrapper .rating-item .content{position: relative; flex: 1;}
    .ratings .rating-wrapper .rating-item .content .name{margin-bottom: 4px; line-height: 12px; font-size: 10px; color: rgb(7,17,27);}
    .ratings .rating-wrapper .rating-item .content .star-wrapper{margin-bottom: 6px; font-size: 0;}
    .ratings .rating-wrapper .rating-item .content .star-wrapper .star{display: inline-block; margin-right: 6px; vertical-align: top;}
    .ratings .rating-wrapper .rating-item .content .star-wrapper .delivery{display: inline-block; vertical-align: top; line-height: 12px; font-size: 0; color: rgb(147,153,159);}
    .ratings .rating-wrapper .rating-item .content .text{margin-bottom: 8px; line-height: 18px; color: rgb(7,17,27); font-size: 12px;}
    .ratings .rating-wrapper .rating-item .content .recommend{line-height: 16px; font-size: 0;}
    .ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up,.ratings .rating-wrapper .rating-item .content .recommend .item{display: inline-block; margin: 0 8px 4px 0; font-size: 9px;}
    .ratings .rating-wrapper .rating-item .content .icon-thumb_up{color: rgb(0,160,220);}
    .ratings .rating-wrapper .rating-item .content .item{padding: 0 6px; border: 1px solid rgba(7, 17, 27, 0.1); border-radius: 1px; color: rgb(147,153,159); background: #fff;}
    .ratings .rating-wrapper .rating-item .content .time{position: absolute; top: 0; right: 0; line-height: 12px; font-size: 10px; color: rgb(147,153,159);}
</style>