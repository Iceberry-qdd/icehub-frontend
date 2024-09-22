<template>
    <div id="setting-display-and-theme">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder">
        </Header>
        <div>
            <div class="pointer-events-none px-4 py-4">
                <RepostCard :post="state.post"></RepostCard>
            </div>
            <BaseCollapse
                open
                :title="'主题颜色'"
                :value="state.setting.themeOptions[state.setting.theme]['zh']">
                <ThemeSelector
                    class="p-4 text-[0.85rem]"
                    :theme="state.setting.theme"
                    @select="(theme) => state.setting.theme = theme">
                </ThemeSelector>
            </BaseCollapse>
            <BaseCollapse
                open
                :title="'强调色'"
                :value="state.setting.accentOptions[state.setting.accent]['zh']">
                <AccentColorSelector
                    class="p-4 text-[0.85rem]"
                    :accent="state.setting.accent"
                    :accent-options="state.setting.accentOptions"
                    @select="(accent) => state.setting.accent = accent">
                </AccentColorSelector>
            </BaseCollapse>
            <BaseCollapse
                open
                :title="'表情系列'"
                :value="state.setting.emojiOptions[state.setting.emoji]">
                <EmojiSelector
                    class="p-4 text-[0.85rem]"
                    :emoji="state.setting.emoji"
                    :emoji-options="state.setting.emojiOptions"
                    @select="(emoji) => state.setting.emoji = emoji">
                </EmojiSelector>
            </BaseCollapse>
            <BaseCollapse
                open
                :title="'头像风格'"
                :value="state.setting.avatarOptions[state.setting.avatar]['zh']">
                <AvatarSelector
                    class="p-4 text-[0.85rem]"
                    :avatar="state.setting.avatar"
                    :avatar-options="state.setting.avatarOptions"
                    @select="(avatar) => state.setting.avatar = avatar">
                </AvatarSelector>
            </BaseCollapse>
            <BaseCollapse
                open
                :title="'代码高亮主题'"
                :value="state.setting.highlightOptions[state.setting.highlight]['zh']">
                <HighlightSelector
                    class="p-4 text-[0.85rem]"
                    :highlight="state.setting.highlight"
                    :highlight-options="state.setting.highlightOptions"
                    @select="(highlight) => state.setting.highlight = highlight">
                </HighlightSelector>
            </BaseCollapse>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import BaseCollapse from '@/indexApp/components/setting/BaseCollapse.vue'
import RepostCard from '@/indexApp/components/postDetail/RepostCard.vue'
import ThemeSelector from '@/indexApp/components/setting/displayTheme/ThemeSelector.vue'
import AccentColorSelector from '@/indexApp/components/setting/displayTheme/AccentColorSelector.vue'
import EmojiSelector from '@/indexApp/components/setting/displayTheme/EmojiSelector.vue'
import AvatarSelector from '@/indexApp/components/setting/displayTheme/AvatarSelector.vue'
import HighlightSelector from '@/indexApp/components/setting/displayTheme/HighlightSelector.vue'

const state = reactive({
    headerConfig: {
        title: '界面个性化设置',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        noBorder: false
    },
    post: {
        id: "123456789",
        user: JSON.parse(localStorage.getItem("CUR_USER")),
        createdTime: Date.now(),
        content: `
你好！欢迎来到Icehub. 😀🖐🖐🏻🖐🏼🖐🏽🖐🏾🖐🏿
$$ \\frac{\\partial{J}}{\\partial{\\textbf{W}^{(1)}}} = \\frac{\\partial{J}}{\\partial{\\textbf{z}}}\\textbf{x}^{\\top} + \\lambda\\textbf{W}^{(1)} $$
\`\`\`python
# For loop on a list
numbers = [2, 4, 6, 8]
product = 1
for number in numbers:
    product = product * number
print('The product is:', product)
\`\`\`
`
    },
    setting:{
        theme: 'light',
        themeOptions: {
            'light': { icon: 'light_mode', zh: '浅色模式' },
            'dark': { icon: 'dark_mode', zh: '深色模式' },
            'followSys': { icon: 'contrast', zh: '跟随系统' }
        },
        accent: 'blue',
        accentOptions: {
            'blue': {light: '#3b82f6', dark:'#93c5fd', zh: '天空蓝'},
            'rose': {light: '#f43f5e', dark:'#fda4af', zh: '玫瑰红'},
            'amber': {light: '#f59e0b', dark:'#fcd34d', zh: '琥珀黄'},
            'lime': {light: '#84cc16', dark:'#bef264', zh: '酸橙青'},
            'emerald': {light: '#10b981', dark:'#6ee7b7', zh: '祖母绿'},
            'teal': {light: '#14b8a6', dark:'#5eead4', zh: '水鸭蓝'},
            'violet': {light: '#8b5cf6', dark:'#c4b5fd', zh: '罗兰紫'},
            'neutral': {light: '#737373', dark:'#d4d4d4', zh: '素净灰'}
        },
        emoji: 'notoColorEmoji',
        emojiOptions: {
            'notoColorEmoji': 'Noto Color Emoji',
            'default': '系统默认',
            'appleColorEmoji': 'Apple Color Emoji'
        },
        avatar: 'rounded',
        avatarOptions: {
            'square': {class : 'rounded-0', zh: '方形'},
            'rounded': {class : 'rounded-[8px]', zh: '圆角'},
            'circle': {class : 'rounded-full', zh: '圆形'}
        },
        highlight: 'light',
        highlightOptions: {
            'light': {preview: '/highlight_prism_light.webp', zh: '浅色模式'},
            'dark': {preview: '/highlight_prism_dark.webp', zh: '深色模式'},
            'followTheme': {preview: '/highlight_prism_all.png', zh: '跟随主题'}
        }
    }
})
</script>