Element.prototype.appendTo = function (parent) {
    if (parent instanceof Element) {
        parent.appendChild(this);
    }
    return this;
};

$(document).ready(function () {
    var $svg = $('svg#main');
    var svg = $('svg#main')[0];

    function create(tagName, attributes) {
        var object = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        for (var keys = Object.keys(attributes), i = 0, l = keys.length; i < l; i++) {
            object.setAttribute(keys[i].replace(/([A-Z])/g, s => '-' + s.charAt(0).toLowerCase()), attributes[keys[i]]);
        }
        return object;
    }

    function createGroup(name) {
        return create('g', {
            id: name
        });
    }

    function createLine(x1, y1, x2, y2) {
        return create('line', {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: $('#line-color').val() || '#000000',
            strokeOpacity: parseFloat($('#line-color').minicolors('opacity')) || 1,
            strokeWidth: parseFloat($('#line-width').val()) || 1,
        });
    }

    function createPolyline(points) {
        return create('polyline', {
            points: points.map(p => p.join(',')).join(' '),
            fill: 'none',
            stroke: $('#line-color').val() || '#000000',
            strokeOpacity: parseFloat($('#line-color').minicolors('opacity')) || 1,
            strokeWidth: parseFloat($('#line-width').val()) || 1,
        });
    }

    function createPath(points) {
        return create('path', {
            d: points.flatMap((p, i) => [i == 0 ? 'M' : 'L', p[0], p[1]]).join(' ') + ' z',
            fill: 'none',
            stroke: $('#line-color').val() || '#000000',
            strokeOpacity: parseFloat($('#line-color').minicolors('opacity')) || 1,
            strokeWidth: parseFloat($('#line-width').val()) || 1,
        });
    }

    var $form = $('#form');
    function draw() {
        var validation = $('form').is(':valid');
        if (!validation) {
            if (!$form.hasClass('invalid')) {
                $form.addClass('invalid');
            }
            $svg.empty();
            return;
        } else if ($form.hasClass('invalid')) {
            $form.removeClass('invalid');
        }

        var mmPerPx = parseFloat($('#mm-per-px').val()) || 20;
        var ballRadius = ((parseFloat($('#ball-size').val()) / 2) || 500) / mmPerPx;
        var polySide = parseInt($('#poly-side').val()) || 6;
        var polyNum = parseInt($('#poly-num').val()) || 8;
        var startLength = (parseFloat($('#length-initial').val()) || 30) / mmPerPx;
        var lengthRate = parseFloat($('#length-rate').val()) || 1.2;
        var lengthEquidistantNum = parseInt($('#length-equidistant-num').val()) || 1;
        var thresholdAngle = parseFloat($('#angle-threshold').val()) || 10;

        var centerLineRadius = getR(polyNum) * 1.1;
        var width = Math.ceil(centerLineRadius * 2);
        var height = Math.ceil(centerLineRadius * 2);

        svg.setAttribute('viewBox', [0, 0, width, height].join(' '));
        $svg.attr({
            width: width,
            height: height,
        }).empty();

        var lineGroup = createGroup('線').appendTo(svg);
        var centerLineGroup = createGroup('中心線').appendTo(lineGroup);
        var polygonLineGroup = createGroup('多角形線').appendTo(lineGroup);
        var assistPointGroup = createGroup('アシストポイント').appendTo(lineGroup);
        var pointGroup = createGroup('ポイント').appendTo(svg);

        function getR(hexagonIndex) {
            if (lengthRate == 1 || hexagonIndex <= lengthEquidistantNum) {
                return startLength * hexagonIndex;
            }
            return startLength * (1 - Math.pow(lengthRate, hexagonIndex - lengthEquidistantNum + 1)) / (1 - lengthRate) + startLength * (lengthEquidistantNum - 1);
        }

        function splitPoint(startPoint, endPoint, num) {
            return Array.from(Array(num)).map((v, i) => {
                return [(endPoint[0] - startPoint[0]) * i / num + startPoint[0], (endPoint[1] - startPoint[1]) * i / num + startPoint[1]];
            });
        }

        function appendPathPoint(x, y) {
            create('path', {
                d: 'M' + x + ',' + y,
            }).appendTo(assistPointGroup);
        }

        function appendPoint(x, y) {
            create('circle', {
                cx: x,
                cy: y,
                stroke: 'none',
                fill: $('#ball-color').val() || '#FF0000',
                fillOpacity: parseFloat($('#ball-color').minicolors('opacity')) || 1,
                r: ballRadius,
            }).appendTo(pointGroup);
        }

        // Main draw
        (function () {
            var cx = width / 2, cy = height / 2;

            // Poly
            for (var i = 1; i < polyNum + 1; i++) {
                var r = getR(i);

                createPath(Array.from(Array(polySide)).map((v, j) => {
                    return [cx + r * Math.cos(j / polySide * 2 * Math.PI), cy + r * Math.sin(j / polySide * 2 * Math.PI)];
                })).appendTo(polygonLineGroup);
            }

            // Center Line
            var r = getR(polyNum) * 1.1;
            for (var j = 0; j < polySide; j++) {
                createLine(cx, cy, cx + centerLineRadius * Math.cos(j / polySide * 2 * Math.PI), cy + centerLineRadius * Math.sin(j / polySide * 2 * Math.PI)).appendTo(centerLineGroup);
            }

            // Point
            for (var i = 0; i < polyNum + 1; i++) {
                if (i == 0) {
                    appendPoint(cx, cy);
                } else {
                    var n = i - 1;
                    (function () {
                        var r0 = getR(i - 1);
                        var r = getR(i);
                        var beforePoint = [cx + r0, cy];
                        var startPoint = [cx + r, cy];
                        var endPoint = [cx + r * Math.cos(1 / polySide * 2 * Math.PI), cy + r * Math.sin(1 / polySide * 2 * Math.PI)];

                        for (; n >= 0; n--) {
                            var points = splitPoint(startPoint, endPoint, n + 1);
                            if (points.length > 1) {
                                var theta = Math.acos((points[1][0] - beforePoint[0]) / Math.sqrt(Math.pow(points[1][0] - beforePoint[0], 2) + Math.pow(points[1][1] - beforePoint[1], 2)));
                                var theta360 = theta * 180 / Math.PI;

                                if (theta360 > thresholdAngle) {
                                    break;
                                }
                            }
                        }
                    })();

                    for (var j = 0; j < polySide; j++) {
                        var r = getR(i);

                        var startPoint = [cx + r * Math.cos(j / polySide * 2 * Math.PI), cy + r * Math.sin(j / polySide * 2 * Math.PI)];
                        var endPoint = [cx + r * Math.cos((j + 1) / polySide * 2 * Math.PI), cy + r * Math.sin((j + 1) / polySide * 2 * Math.PI)];

                        appendPoint(startPoint[0], startPoint[1]);
                        if (n > 0) {
                            var points = splitPoint(startPoint, endPoint, n + 1);
                            points.filter((v, k) => k > 0).forEach(p => {
                                appendPoint(p[0], p[1]);
                                appendPathPoint(p[0], p[1]);
                            });
                        }
                    }
                }
            }
        })();
    }
    draw();

    $('#form form').submit(function () {
        draw();
        return false;
    });

    var keyDownTimeout = -1
    $('#form form input').keydown(function () {
        clearTimeout(keyDownTimeout);
        keyDownTimeout = setTimeout(() => draw(), 100);
    });

    $('.colorpicker').change(function () {
        draw();
    })

    $('#copy').click(function () {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(svg.outerHTML);
        }
        return false;
    });

    $('#export').click(function () {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify($.makeArray($('input')).reduce((a, v) => {
                a[$(v).attr('id')] = $(v).val();
                return a;
            }, {})));
        }
        return false;
    });

    $('#import').click(function () {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(text => {
                var obj = JSON.parse(text);
                $('input').each(function () {
                    var key = $(this).attr('id');
                    if (key in obj) {
                        $(this).val(obj[key]);
                    }
                });
            })
        }
        return false;
    });

    $('.colorpicker').each(function () {
        $(this).minicolors({
            format: $(this).attr('data-format') || 'hex',
            theme: 'bootstrap',
            opacity: $(this).data('opacity')
        });
    });

    $('.input-slider').inputSliderRange({
        delay: 50,
        onChanged: function (e) {
            draw()
        }
    });

    $('#form [title]').tooltip({
        placement: 'bottom',
        html: true
    });
});