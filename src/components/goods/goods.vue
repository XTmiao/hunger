<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper">
                <ul>
                    <li v-for="(good, index) in goods" class="menu-item" :class="{'current':currentIndex===index}">
                        <span class="text border-1px" @click="selectMenu(index, $event)"><span v-if="good.type>0" class="icon" :class="classMap[good.type]"></span>{{good.name}}</span>
                    </li>
                </ul>
            </div>
            <div class="food-wrapper" ref="food-wrapper">
                <ul class='box'>
                    <li v-for="item in goods" class="food-list food-list-hook" ref="foodListHook">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li v-for="food in item.foods" class="food-item border-1px" @click="selectedFood(food,$event)">
                                <div class="icon">
                                    <img :src="food.icon" width="57" height="57">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc" v-if="food.description">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}</span>
                                        <span>好评率{{food.rating}}</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <CartControl :food="food" @cart-add="drop"></CartControl>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <ShopCart :selectFood="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></ShopCart>
        </div>
        <FoodView :food="selectFood" ref="food" @cart-count="drop"></FoodView>
    </div>

</template>

<script>

    import BScroll from 'better-scroll'    //滚动插件  github上有api
    import ShopCart from '../shopcart/shopcart'
    import CartControl from '../cartcontrol/cartcontrol'
    import FoodView from '../food/food'
    export default{
        props:{
            seller: {
                type: Object
            }
        },
        created(){
            this.classMap = [ 'decrease', 'discount', 'special', 'invoice', 'guarantee' ];
            this.axios.get('api/goods').then( (response) => {
                this.goods = response.data.data;
                this.$nextTick( () => {   //在DOM渲染完成后调用
                    this._initScroll();
                    this._calculateHeight();
                } )
            } );
        },
        data(){
            return{
                goods: [],
                listHeight: [],
                scrollY : 0,
                selectFood: {}
            }
        },
        computed:{
            currentIndex(){
                for( let i=0; i<this.listHeight.length-1; i++ ){
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];
                    if( this.scrollY > height1 && this.scrollY < height2 ){
                        return i
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach( (good) => {
                    good.foods.forEach( (food) => {
                        if( food.count )
                            foods.push( food )
                    } )
                } );
                return foods;
            }
        },
        updated(){
            //this._initScroll();  //第一次打开页面不能滚动，在updated中调用能解决这个问题
        },
        methods:{
            _initScroll(){   //滚动功能
                this.menuScroll = new BScroll( '.menu-wrapper', {
                    click: true
                } );
                this.foodScroll = new BScroll( '.food-wrapper', {
                    click: true,
                    probeType: 3  //插件中方法的参数，表示可以实时派发 scroll 事件
                } );
                this.foodScroll.on( 'scroll', (pos) => {
                    //console.log( pos ) //返回滚动的位置
                    this.scrollY = Math.abs(Math.round(pos.y));   //pos.y是一个负数
                } );
                console.log(this.menuScroll);
            },
            _calculateHeight(){ // 计算food每个模块的高度放在数组中
                let list = this.$refs.foodListHook;
                let height = 0;
                this.listHeight.push(height);
                for( let i=0; i<list.length; i++ ){
                    height += list[i].clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu( index, event ){ // 菜单单击
                if( !event._constructed ){   //event._constructed是better-scroll插件中特有的一个属性，避免点击事件在pc端会触发两次的问题
                    return;
                }
                let foodList = this.$refs.foodListHook;
                this.foodScroll.scrollToElement( foodList[index], 300 );   //滚动到目标元素
            },
            drop(el){
                //体验优化，异步执行下落动画
                this.$nextTick( () => {
                    this.$refs.shopcart.drop( el );  //调用子组件方法
                } )
            },
            selectedFood(food, event){
                if( !event._constructed ){
                    return;
                }
                this.selectFood = food;
                this.$refs.food.show();   //父组件调用子组件方法，需要加上ref属性
            }
        },
        components: {
            ShopCart,
            CartControl,
            FoodView
        }
    }
</script>

<style>
    .goods{display: flex; position: absolute; top: 174px; bottom: 46px; overflow: hidden;}
    .goods .menu-wrapper{flex: 0 0 80px; width: 80px; background: #f3f5f7;}
    .goods .menu-wrapper .menu-item{display: table; height: 54px; width: 56px; padding: 0 12px;}
    .goods .menu-wrapper .menu-item .text{position: relative; display: table-cell; line-height: 14px; font-weight: 200; font-size: 12px; vertical-align: middle;}
    .goods .menu-wrapper .menu-item .text::after{position: absolute; width: 100%; left: 0; bottom: 0; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
    .goods .menu-wrapper .menu-item .icon{display: inline-block; width: 12px; vertical-align: top; height: 12px; margin-right: 2px; background-size: 12px 12px; background-repeat: no-repeat;}
    .goods .menu-wrapper .current{position: relative; z-index: 10; margin-top: -1px; font-weight: 700; background: #fff;}
    .goods .menu-wrapper .current .text::after{border: none;}

    .goods .food-wrapper{flex: 1;}
    .goods .food-wrapper .title{padding-left: 14px; height: 26px; line-height: 26px; border-left: 2px solid #d9dde1; font-size: 12px; color: rgb(147,153,159); background: #f3f5f7;}
    .goods .food-wrapper .food-item{position: relative; display: flex; margin: 18px; padding-bottom: 18px;}
    .goods .food-wrapper .food-item::after{position: absolute; width: 100%; left: 0; bottom: 0; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
    .goods .food-wrapper .food-item:last-of-type{padding-bottom: 0;}
    .goods .food-wrapper .food-item:last-of-type::after{display: none;}
    .goods .food-wrapper .food-item .icon{flex: 0 0 57px; margin-left: 10px;}
    .goods .food-wrapper .food-item .content{flex: 1; margin-left: 10px;}
    .goods .food-wrapper .food-item .content .name{margin: 2px 0 8px 0; height: 14px; line-height: 14px; font-size: 14px; color: rgb(7,17,27);}
    .goods .food-wrapper .food-item .content .desc{margin: 8px auto 8px 0; line-height: 12px; font-size: 10px; color: rgb(147,153,159);}
    .goods .food-wrapper .food-item .content .extra{height: 10px; line-height: 10px; font-size: 10px; color: rgb(147,153,159);}
    .goods .food-wrapper .food-item .content .extra .count{margin-right: 12px;}
    .goods .food-wrapper .food-item .content .price{line-height: 24px; font-size: 10px/14px; color: rgb(147,153,159); font-weight: normal/700;}
    .goods .food-wrapper .food-item .content .price .now{margin-right: 8px; color: rgb(240,20,20);}
    .goods .food-wrapper .food-item .content .price .old{text-decoration: line-through; font-size: 10px;}
    .goods .food-wrapper .food-item .content .cartcontrol-wrapper{position: absolute; bottom: 12px; right: 0;}

    .decrease{background-image: url('decrease_3@3x.png');}
    .discount{background-image: url('discount_3@3x.png');}
    .guarantee{background-image: url('guarantee_3@3x.png');}
    .invoice{background-image: url('invoice_3@3x.png');}
    .special{background-image: url('special_3@3x.png');}
</style>