<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-0.7 3 28 28"
        class="btn-no-select m-icon">
        <path
            d="m 7.7668893,17.379732 v 3.472664 H 6.6382735 V 23.98744 H 2.7218801 v -8.372979 q 0,-2.430865 1.3215416,-3.771699 1.3311879,-1.35048 3.7331139,-1.35048 2.3151094,0 3.4244324,1.225078 1.109323,1.215433 1.109323,3.762053 V 23.98744 H 8.3938981 v -8.247577 q 0,-0.771703 -0.1832795,-1.070738 -0.1832795,-0.299035 -0.6559477,-0.299035 -0.9163974,0 -0.9163974,1.369773 v 1.639869 z"
            :style="`fill:${props.fillColor};fill-opacity:${props.fillOpacity};stroke-width:0.264583`" />
        <path
            d="M 18.020895,10.820256 V 23.98744 H 14.413182 V 10.820256 Z"
            :style="`fill:${props.fillColor};fill-opacity:${props.fillOpacity};stroke-width:0.264583`" />
        <path
            d="m 23.345647,10.820256 v 3.684882 h 1.620576 v 3.810284 h -1.620576 q 0,1.147909 0.356912,1.581992 0.366559,0.434083 1.331188,0.434083 v 3.790991 q -0.279742,0.0096 -0.41479,0.0096 -1.225079,0 -2.315109,-0.569131 -1.080385,-0.569131 -1.736332,-1.543406 -0.829581,-1.244371 -0.829581,-3.299031 v -7.90031 z"
            :style="`fill:${props.fillColor};fill-opacity:${props.fillOpacity};stroke-width:0.264583`" />
    </svg>
</template>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
 const props = defineProps({
    /** 线条填充颜色，HEX格式 */
    fillColor: {
        type: String,
        required: false,
        default: 'currentColor'
    },
    /** 线条填充颜色透明度， 0-1范围内数字 */
    fillOpacity: {
        type: Number,
        required: false,
        default: 1
    }
 })
</script>