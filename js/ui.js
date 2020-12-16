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
//幻灯片部分
$.fn.UiSlider = function () {
    var ui = $(this);

    var wrap = $('.ui-slider-wrap')

    var btn_prev = $('.ui-slider-arrow .left', ui);
    var btn_next = $('.ui-slider-arrow .right', ui);

    var items = $('.ui-slider-wrap .item', ui);
    var tips = $('.ui-slider-process .item', ui)

    // 预定义
    var current = 0;
    //size相当于成员数量
    var size = items.size();
    var width = items.eq(0).width();

    //是否自动滚动
    var enableAuto = true;

    // 当鼠标在wrap中时 停止自动滚动  mouseover 定义好的事件
    ui
        .on('mouseover', function () {
            enableAuto = false
        })
        .on('mouseout', function () {
            enableAuto = true
        })
    // 具体操作
    wrap
        .on('move_prev', function () {
            if (current <= 0) {
                current = size;
            }
            current = current - 1

            wrap.triggerHandler('move_to', current)
        })
        .on('move_next', function () {
            if (current >= size) {
                current = 0;
            }
            //例子是把curent 等于-1  先进行+1  再执行跳转
            wrap.triggerHandler('move_to', current)
            current = current + 1
        })
        //移动变化
        .on('move_to', function (evt, index) {
            wrap.css('left', index * width * -1)
            tips.removeClass('item_focus').eq(index).addClass('item_focus')
        })
        //定义的名字为auto_move 的事件
        .on('auto_move', function () {
            setInterval(function () {
                enableAuto && wrap.triggerHandler('move_next')
            }, 2000)
        })
        .triggerHandler('auto_move')


    // 事件
    btn_prev.on('click', function () {
        // 触发选中的事件
        wrap.triggerHandler('move_prev')
    })

    btn_next.on('click', function () {
        wrap.triggerHandler('move_next')
    })

    tips.on('click', function () {
        var index = $(this).index();
        wrap.triggerHandler('move_to', index)
    })
}

//	从远程获得数据（一般在后台处理）
var getData = function (k, v) {

    //	初始化获取所有城区
    if (k === undefined) {
        return [{id: 1, name: '东城区'}, {id: 2, name: '西城区'}];
    }
    //	根据城区获得下面的等级（不同城区相同等级的 id 不一样）
    if (k === 'area') {
        var levelData = {
            1: [{id: 11, name: '一级医院'}, {id: 12, name: '二级医院'}],
            2: [{id: 22, name: '二级医院'}]
        }
        return levelData[v] || [];
    }
    //	根据等级获取医院
    if (k === 'level') {
        var hospital = {
            11: [{id: 1, name: 'A1医院'}, {id: 2, name: 'A2医院'}],
            12: [{id: 3, name: 'B1医院'}],
            22: [{id: 4, name: 'C1医院'}, {id: 5, name: 'C2医院'}]

        }

        return hospital[v] || [];

    }
    //	根据名称获取科室（科室都是依附在医院下面的）
    if (k === 'name') {
        var department = {
            1: [{id: 1, name: '骨科'}, {id: 2, name: '内科'}],
            2: [{id: 3, name: '儿科'}],
            3: [{id: 4, name: '骨科'}, {id: 5, name: '内科'}],
            4: [{id: 6, name: '儿科'}],
            5: [{id: 7, name: '骨科'}, {id: 8, name: '内科'}]

        }

        return department[v] || [];
    }
    return [];
}
//级联选择器   this指的是调用uiCascading的那个类
$.fn.uiCascading = function () {
    var ui = $(this)
    var listSelect = $('select', ui)

    listSelect
        //表示要触发的事件
        .on('change', function () {
            var changeIndex = listSelect.index(this)
            var k = $(this).attr('name')
            var v = $(this).val()

            var data = getData(k, v)
            listSelect.eq(changeIndex + 1).triggerHandler('updateOptions', {data: data})
            ui.find('select:gt(' + (changeIndex + 1) + ')').each(function () {
                $(this).triggerHandler('updateOptions', {data: []})
            })
        })
        .on('updateOptions', function (evt, ajax) {
            var select = $(this)
            select.find('option[value!=-1]').remove()
            if (ajax.data.length < 1) {
                return true
            }
            for (var i = 0, j = ajax.data.length; i < j; i++) {
                var k = ajax.data[i].id
                var v = ajax.data[i].name
                select.append($('<option>').attr('value', k).text(v))
            }
            return true
        })
    listSelect.find('option:first').attr('value', '-1')
    listSelect.eq(0).triggerHandler('updateOptions', {data: getData()})
}

// 页面脚本逻辑
$(function () {
    $('.ui-search').UiSearch();
    // >表示具体某一个下面的   ''空格表示下面所有的
    $('.content-tab').UiTab('.caption > .item', '.block > .item');
    $('.content-tab .block .item').UiTab('.block-caption > a', '.block-content > .block-wrap', 'block-caption-');
    $('body').UiBackTop();
    $('.ui-slider').UiSlider();
    $('.ui-cascading').uiCascading();
})