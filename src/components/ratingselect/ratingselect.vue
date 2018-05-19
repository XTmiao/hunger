<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="changeType(2, $event)" class="block positive" :class="{'active': selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="changeType(0, $event)" class="block positive" :class="{'active': selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="changeType(1, $event)" class="block negative" :class="{'active': selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on': onlyContent}" @click="toggleContent($event)">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const ALL = 2;
    const POSOTIVE = 0;
    const NEGATIVE = 1;
    export default{
        props: {
            ratings: {
                type: Array,
                default() {
                    return []
                }
            },
            selectType: {
                type: Number,
                default: ALL
            },
            onlyContent: {
                type: Boolean,
                default: true
            },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    }
                }
            }
        },
        computed: {
            positives() {
                return this.ratings.filter( (rating) => {
                    return rating.rateType === POSOTIVE
                } )
            },
            negatives() {
                return this.ratings.filter( (rating) => {
                    return rating.rateType === NEGATIVE
                } )
            }
        },
        methods: {
            changeType( type, event ){
                this.list = []
                if( !event._constructed ){
                    return;
                }
                this.$emit( 'change-type', type );   //把点击的rating.rateType发送出去

            },
            toggleContent(event) {
                if( !event._constructed ){
                    return;
                }
                this.$emit( 'toggle-content' );
            },
        }
    }
</script>

<style scoped>
    .ratingselect .rating-type{position: relative; padding: 18px 0; margin: 0 18px; font-size: 0;}
    .ratingselect .rating-type::after{position: absolute; width: 100%; left: 0; bottom: 0; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
    .ratingselect .rating-type .block{display: inline-block; padding: 8px 12px; margin-right: 8px; line-height: 16px; border-radius: 1px; font-size: 8px; color: rgb(77,85,93);}
    .ratingselect .rating-type .block.active{color: #fff;}
    .ratingselect .rating-type .block .count{margin-left: 2px; font-size: 8px;}
    .ratingselect .rating-type .positive{background: rgba(0,160,220,0.2);}
    .ratingselect .rating-type .positive.active{background: rgb(0,160,220);}
    .ratingselect .rating-type .negative{background: rgba(77,85,93,0.2);}
    .ratingselect .rating-type .negative.active{background: rgb(77,85,93);}
    .ratingselect .switch{padding: 12px 18px; line-height: 24px; border-bottom: 1px solid rgba(7,17,27,0.1); color: rgb(147,153,159); font-size: 0;}
    .ratingselect .switch.on .icon-check_circle{color: #00c850;}
    .ratingselect .switch .icon-check_circle{display: inline-block; vertical-align: top; margin-right: 4px; font-size: 24px;}
    .ratingselect .switch .text{display: inline-block; vertical-align: top; font-size: 12px;}
</style>