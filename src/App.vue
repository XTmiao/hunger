<template>
  <div id="app">
    <HeaderView :seller="seller"></HeaderView>
    <ul class="border-1px">
      <router-link to="/goods" tag="li" active-class="active">商品</router-link>
      <router-link to="/ratings" tag="li" active-class="active">评价</router-link>
      <router-link to="/seller" tag="li" active-class="active">商家</router-link>
    </ul>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import HeaderView from './components/header/header'
import {urlParse} from './assets/js/util'
  export default {
    name: 'App',
    components:{
      HeaderView
    },
    data(){
      return{
        seller: {
          id: ( () => {
            let seller = urlParse();
            return seller.id;
          } )()
        }
      }
    },
    created(){
      this.axios.get('api/seller?id='+this.seller.id).then( (response) => {
        //this.seller = response.data.data;    //直接赋值会覆盖data中的seller
        this.seller = Object.assign( {}, this.seller, response.data.data )          //参数一： 返回的格式   参数二：需要赋值的对象   参数三：赋值的内容
        //console.log(this.seller.id);
      } )
    }
  }
</script>

<style scoped>

.active{color: red;}
ul{display: flex; width: 100%; height: 40px; line-height: 40px; text-align: center; position: relative;}
ul::after{position: absolute; width: 100%; left: 0; bottom: 0; border-top: 1px solid rgba(7,17,27,0.1); content: '';}
ul li{flex: 1; }
</style>
