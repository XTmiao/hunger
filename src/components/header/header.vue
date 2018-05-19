<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="Showdetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="Showdetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>

        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <StarView :size="48" :score="seller.score" class="star-wrapper"></StarView>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li v-for="support in seller.supports" class="supports-item">
                                <span class="icon" :class="classMap[support.type]"></span>
                                <span class="text">{{support.description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="Hiddendetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

    import StarView from '../stars/stars'
    export default{
        props:{
            seller: {
                type: Object
            }
        },
        created(){
            this.classMap = [ 'decrease', 'discount', 'special', 'invoice', 'guarantee' ];
        },
        data(){
            return{
                detailShow: false
            }
        },
        methods: {
            Showdetail(){
                this.detailShow = true
            },
            Hiddendetail(){
                this.detailShow = false
            }
        },
        components: {
            StarView
        }
    }
</script>

<style scoped>


    .header{color: #fff; background:#999; position: relative; background: rgba(7, 17, 27, 0.5); overflow: hidden;}
    .content-wrapper{padding: 24px 12px 18px 24px; font-size: 0; position: relative;}
    .content-wrapper .avatar{display: inline-block; width: 64px; height: 64px; }
    .content-wrapper .avatar img{border-radius: 2px; }
    .content-wrapper .content{display: inline-block; margin-left: 16px; font-size:14px;}
    .content-wrapper .content .title{margin: 2px 0 8px 0;}
    .content-wrapper .content .title .brand{margin-right: 6px; display: inline-block; width: 30px; height: 18px; background-image:url('brand@2x.png'); background-size: 30px 18px; background-repeat: no-repeat; vertical-align: top;

    }

    @media (min-device-pixel-ratio: 3),(-Webkit-min-device-pixel-ratio: 3){
        .content-wrapper .content .title .brand{
           background-image:url('brand@3x.png');
        }

        .content-wrapper .content .support .decrease{background-image: url('decrease_1@3x.png');}
        .content-wrapper .content .support .discount{background-image: url('discount_1@3x.png');}
        .content-wrapper .content .support .guarantee{background-image: url('guarantee_1@3x.png');}
        .content-wrapper .content .support .invoice{background-image: url('invoice_1@3x.png');}
        .content-wrapper .content .support .special{background-image: url('special_1@3x.png');}

        .detail .detail-wrapper .detail-main .supports .decrease{background-image: url('decrease_2@3x.png');}
        .detail .detail-wrapper .detail-main .supports .discount{background-image: url('discount_2@3x.png');}
        .detail .detail-wrapper .detail-main .supports .guarantee{background-image: url('guarantee_2@3x.png');}
        .detail .detail-wrapper .detail-main .supports .invoice{background-image: url('invoice_2@3x.png');}
        .detail .detail-wrapper .detail-main .supports .special{background-image: url('special_2@3x.png');}

        .bulletin-wrapper .bulletin-title{background-image: url('bulletin@3x.png');}

    }
    .content-wrapper .content .title .name{font-size: 16px; line-height: 18px; font-weight: bold;}
    .content-wrapper .content .description{margin-bottom: 10px; font-size: 12px; line-height: 12px;}
    .content-wrapper .content .support{font-size: 10px; font-weight: 200; line-height: 12px;}
    .content-wrapper .content .support .icon{display: inline-block; width: 12px; height: 12px; margin-right: 4px; background-size: 12px 12px; background-repeat: no-repeat; vertical-align: top;}
    .content-wrapper .content .support .decrease{background-image: url('decrease_1@2x.png');}
    .content-wrapper .content .support .discount{background-image: url('discount_1@2x.png');}
    .content-wrapper .content .support .guarantee{background-image: url('guarantee_1@2x.png');}
    .content-wrapper .content .support .invoice{background-image: url('invoice_1@2x.png');}
    .content-wrapper .content .support .special{background-image: url('special_1@2x.png');}

    .content-wrapper .support-count{position: absolute; right: 12px; bottom: 14px; padding: 0 8px; height: 24px; line-height: 24px; border-radius: 14px; background-color: rgba(0,0,0,0.2); font-size:10px;}
     .content-wrapper .support-count .icon-keyboard_arrow_right{margin-left:2px;}

    .bulletin-wrapper{position: relative; height: 28px; line-height: 28px; padding: 0 22px 0 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: rgba(7, 17, 27, 0.2);}
    .bulletin-wrapper .bulletin-title{display: inline-block; vertical-align: top; margin-top: 8px; width: 22px; height: 12px; background-image: url('bulletin@2x.png'); background-size: 22px 12px; background-repeat: no-repeat;}
    .bulletin-wrapper .bulletin-text{margin: 0 4px; vertical-align: top; font-size: 10px;}
    .bulletin-wrapper .icon-keyboard_arrow_right{position: absolute; top: 8px; right: 12px; font-size: 10px;}

     .background{position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: -1; filter: blur(10px);}




    .detail{z-index: 100; width: 100%; height: 100%; position: fixed; top: 0; left: 0; overflow: auto;background: rgba(7,17,27,0.8);  background: rgba(7,17,27,0.8); backdrop-filter: blur(10px);/*iphone写会有模糊的效果*/}
    .fade-enter-active,.fade-leave-active{transition: opacity 0.5s;}
    .fade-enter,.fade-leave-to{opacity: 0;}





    .detail .detail-wrapper{min-height: 100%; width: 100%; }
    .detail .detail-wrapper .detail-main{ margin-top: 64px; padding-bottom: 64px;}
    .detail .detail-wrapper .detail-main .name{text-align: center; line-height: 16px; font-size: 16px; font-weight: 700;}
    .detail .detail-wrapper .detail-main .star-wrapper{margin-top: 18px; padding: 2px 0; text-align:center;}

    .detail .detail-wrapper .detail-main .title{display: flex; width: 80%; margin: 28px auto 24px auto;}
    .detail .detail-wrapper .detail-main .line{flex: 1; position: relative; top: -6px; border-bottom: 1px solid rgba(255,255,255,0.2);}
    .detail .detail-wrapper .detail-main .text{padding: 0 12px; font-weight: 700; font-size: 14px;}
    .detail .detail-wrapper .detail-main .supports{width: 80%; margin: 0 auto;}
    .detail .detail-wrapper .detail-main .supports .supports-item{padding: 0 12px; margin-bottom: 12px; font-size: 0;}
    .detail .detail-wrapper .detail-main .supports:last-child{margin-bottom: 0;}
    .detail .detail-wrapper .detail-main .supports .icon{display: inline-block; width: 16px; height: 16px; margin-right: 6px; vertical-align: top; background-size: 16px 16px; background-repeat: no-repeat;}
    .detail .detail-wrapper .detail-main .supports .decrease{background-image: url('decrease_2@2x.png');}
    .detail .detail-wrapper .detail-main .supports .discount{background-image: url('discount_2@2x.png');}
    .detail .detail-wrapper .detail-main .supports .guarantee{background-image: url('guarantee_2@2x.png');}
    .detail .detail-wrapper .detail-main .supports .invoice{background-image: url('invoice_2@2x.png');}
    .detail .detail-wrapper .detail-main .supports .special{background-image: url('special_2@2x.png');}

    .detail .detail-wrapper .detail-main .supports .text{line-height: 16px;font-size: 12px; font-weight: 200; color: rgba(255,255,255); padding: 0;}
    .detail .detail-wrapper .detail-main .bulletin{width: 80%; margin: 0 auto;}
    .detail .detail-wrapper .detail-main .bulletin .content{margin: 24px 12px auto 12px; font-size: 12px; font-weight: 200; color: rgba(255,255,255); line-height: 24px;}


    .detail .detail-close{position: relative; width: 32px; height: 32px; margin: -64px auto 0 auto; font-size: 32px; clear: both;}
</style>