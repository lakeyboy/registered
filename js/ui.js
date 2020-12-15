// ui-search 定义
$.fn.UiSearch = function () {
    var ui = $(this);


    $('.ui-search-selected', ui).on('click', function () {
        $('.ui-search-select-list').show();
        return false;
    });

    $('.ui-search-select-list a', ui).on('click', function () {
        // 表示点击时ui-search-selected中的文本会被替换为 点击的a标签的文本
        $('.ui-search-selected').text($(this).text());
        $('.ui-search-select-list').hide();

        return false;
    })

    $('body').on('click', function () {
        $('.ui-search-select-list').hide()
    })
}
// ui-tab 规定
// {string} header tab 组件 的所有选项卡item
// {string} content tab组件 内容区域所有item
// {string} focus_prefix  选项卡高亮样式前缀

$.fn.UiTab = function (header, content, focus_prefix) {
    var ui = $(this);
    var tabs = $(header, ui);
    var cons = $(content, ui);
    var focus_prefix = focus_prefix || '';

    tabs.on('click', function () {
        var index = $(this).index();

        tabs.removeClass(focus_prefix + 'item_focus').eq(index).addClass(focus_prefix + 'item_focus');
        cons.hide().eq(index).show();
        return false;
    })
}
// ui-backTop
$.fn.UiBackTop = function () {
    var ui = $(this);
    var el = $('<a class="ui-backTop" href="0">');
    ui.append(el);

    var windowHeight = $(window).height();
    // console.log(windowHeight)

    $(window).on('scroll', function () {
        var top = $('html').scrollTop();

        if (top > windowHeight / 2) {
            el.show()
        } else {
            el.hide()
        }
    });
    el.on('click', function () {
        // $(window).scrollTop(0);
    })
}
// 页面脚本逻辑
$(function () {
    $('.ui-search').UiSearch();
    // >表示具体某一个下面的   ''空格表示下面所有的
    $('.content-tab').UiTab('.caption > .item', '.block > .item');
    $('.content-tab .block .item').UiTab('.block-caption > a', '.block-content > .block-wrap', 'block-caption-');
    $('body').UiBackTop()
})