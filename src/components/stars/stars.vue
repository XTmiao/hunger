<template>
    <div class="stars" :class="sizeType">
        <span v-for="star in stars" class="star-item" :class="star"></span>
    </div>
</template>

<script>
    const LEN = 5;
    const STAR_ON = 'on';
    const STAR_HALF = 'half';
    const STAR_OFF = 'off';
    export default{
        props: {
            score: {      //星星的分数
                Number
            },
            size: {      //星星的大小
                Number
            }
        },
        data(){
            return {
                stars: []
            }
        },
        computed: {
            sizeType(){
                return `star-${this.size}`
            },
            /*Start(){
                for( let i=1; i<6; i++ ){
                    i<this.score ? this.stars.push( STAR_ON ) : this.stars.push( STAR_OFF );
                }
            }*/
            Start(){
                let score = Math.floor(this.score*2)/2;
                let ifHalf = score % 1 !== 0;
                let integer = Math.floor(score);
                for( let i=0; i<integer; i++ ){
                    this.stars.push( STAR_ON )
                }
                if(ifHalf)
                    this.stars.push( STAR_HALF )
                while( this.stars.length < 5 )
                    this.stars.push( STAR_OFF );
            }
        }
    }
</script>

<style scoped>
    .star{font-size: 0;}
    .star .star-item{display: inline-block; background-repeat: no-repeat;}
    .star-48 .star-item{ display: inline-block; width: 20px; height: 20px; margin-right: 22px; background-size: 20px 20px;}
    .star-48:last-child{margin-right: 0;}
    .star-48 .on{width: 20px; height: 20px; background-image: url('star48_on@2x.png');}
    .star-48 .half{background-image: url('star48_half@2x.png');}
    .star-48 .off{background-image: url('star48_off@2x.png');}

    .star-36 .star-item{ display: inline-block; width: 15px; height: 15px; margin-right: 6px; background-size: 15px 15px;}
    .star-36:last-child{margin-right: 0;}
    .star-36 .on{background-image: url('star36_on@2x.png');}
    .star-36 .half{background-image: url('star36_half@2x.png');}
    .star-36 .off{background-image: url('star36_off@2x.png');}

    .star-24 .star-item{ display: inline-block; width: 10px; height: 10px; margin-right: 3px; background-size: 10px 10px;}
    .star-24:last-child{margin-right: 0;}
    .star-24 .on{background-image: url('star24_on@2x.png');}
    .star-24 .half{background-image: url('star24_half@2x.png');}
    .star-24 .off{background-image: url('star24_off@2x.png');}

    @media (min-device-pixel-ratio: 3),(-Webkit-min-device-pixel-ratio: 3){
        .star-48 .on{background-image: url('star48_on@3x.png');}
        .star-48 .half{background-image: url('star48_half@3x.png');}
        .star-48 .off{background-image: url('star48_off@3x.png');}

        .star-36 .on{background-image: url('star36_on@3x.png');}
        .star-36 .half{background-image: url('star36_half@3x.png');}
        .star-36 .off{background-image: url('star36_off@3x.png');}

        .star-24 .on{background-image: url('star24_on@3x.png');}
        .star-24 .half{background-image: url('star24_half@3x.png');}
        .star-24 .off{background-image: url('star24_off@3x.png');}
    }
</style>