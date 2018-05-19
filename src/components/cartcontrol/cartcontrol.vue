<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease icon-remove_circle_outline" v-show="food.count" @click.stop.prevent='decreaseCount($event)'></div>
        </transition>
        <div class="cart-count" v-show="food.count">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCount($event)"></div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default{
        props:{
            food: {
                type: Object
            }
        },
        created(){
            //console.log(this.food);
        },
        methods: {
            addCount(event){
                if( !event._constructed ){  //防止pc端点击问题
                    return;
                }
                if( !this.food.count ){
                    Vue.set( this.food, 'count', 1 );  //当观测对象新增或者删除字段时，检测不到属性变化，需要用Vue.set方法
                }else{
                    this.food.count ++;
                }
                this.$emit( 'cart-add', event.target );   // 通过自定义事件把点击的元素传给父组件
            },
            decreaseCount(event){
                if( !event._constructed ){
                    return;
                }
                if( this.food.count ){
                    this.food.count --;
                }
            }
        }
    }
</script>

<style scoped>
    .cartcontrol{font-size: 0;}
    .cartcontrol .cart-decrease,.cartcontrol .cart-add{display: inline-block; padding: 6px; line-height: 24px; font-size: 24px; color: rgb(0,160,220);}
    .cartcontrol .cart-count{display: inline-block; vertical-align: top; width: 12px; padding-top: 6px; line-height: 24px; text-align: center; font-size: 10px; color: rgb(147,153,159);}

    .move-enter-active,.move-leave-active{transition: all .5s; opacity: 1; transform: rotate(0deg) translate3d(0, 0, 0);}
    .move-enter,.move-leave-to{opacity: 0; transform: rotate(180deg) translate3d(24px 0 0);}

</style>