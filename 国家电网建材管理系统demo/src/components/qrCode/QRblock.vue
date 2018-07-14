<template>
    <div class="QrWrapper">
        <div class="button" @click="generateQR">
            生成二维码
        </div>
        <div id="qrCode" @click="gotoQR"></div>
        <transition name="fade">
            <div v-show="isBigCode" class="cover">
                <div id="bigCode"></div>
                <img class="close" src="./close.png" @click="closeCover">
            </div>
        </transition>  
    </div>
</template>
<script src="./src/qrcode.min"></script>
<script>
    export default {
        data() {
            return {
                isBigCode: false
            }
        },
        methods: {
            generateQR() {
                if(document.getElementById('qrCode').children.length != 0) {
                    return;
                }
                const value = document.location.href;
                new QRCode(document.getElementById('qrCode'), {
                    text: value,
                    width: 90,
                    height: 90,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                    });
            },
            gotoQR() {
                if(document.getElementById('bigCode').children.length != 0) {
                    this.isBigCode = true;
                    return;
                }
                this.isBigCode = true;
                const value = document.location.href;
                new QRCode(document.getElementById('bigCode'), {
                    text: value,
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                    });
            },
            closeCover() {
                this.isBigCode = false;
            }
        }
    }
</script>
<style lang="sass">
    .QrWrapper
        display: flex
        flex-direction: row
        align-items: center
        width: 21.445125rem
        height: 6.25rem
        border-radius: .375rem
        .button
            display: flex
            margin-left: 1.25rem
            background-color: #1E9FFF
            width: 6.5rem
            height: 2.375rem
            border-radius: .25rem
            text-align: center
            align-items: center
            justify-content: center
            line-height: 1.875rem
            font-size: .875rem
            color: #fff
        #qrCode
            margin-left: 5.625rem
            width: 5.625rem
            height: 5.625rem
            img
                width: 100% 
        .fade-enter-active, .fade-leave-active
            transition: all 0.8s
        .fade-enter, .fade-leave-to
            opacity: 0
        .cover
            display: flex
            flex-direction: column
            justify-content: flex-end
            align-items: center
            box-sizing: border-box
            padding: 2.5rem 0
            position: fixed
            top: 0
            left: 0
            height: 100%
            width: 100%
            background-color: rgba(7,17,27,0.9)
            #bigCode
                width: 12.5rem
                height: 12.5rem
            .close
                width: 2.5rem
                height: 2.5rem
                border-radius: 50%
                margin-top: 14.125rem
</style>

