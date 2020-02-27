$(document).ready(function () {
    var $svg = $('svg#main');
    var svg = $('svg#main')[0];

    function append(tagName, attributes) {
        var object = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        for (var keys = Object.keys(attributes), i = 0, l = keys.length; i < l; i++) {
            object.setAttribute(keys[i].replace(/([A-Z])/g, s => '-' + s.charAt(0).toLowerCase()), attributes[keys[i]]);
        }
        svg.appendChild(object);
        return object;
    }

    function appendLine(x1, y1, x2, y2) {
        return append('line', {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: $('#line-color').val(),
            strokeOpacity: $('#line-color').minicolors('opacity'),
            strokeWidth: $('#line-width').val(),
        });
    }

    function appendPolyline(points) {
        return append('polyline', {
            points: points.map(p => p.join(',')).join(' '),
            fill: 'none',
            stroke: $('#line-color').val(),
            strokeOpacity: $('#line-color').minicolors('opacity'),
            strokeWidth: $('#line-width').val(),
        });
    }

    function appendPath(points) {
        return append('path', {
            d: points.flatMap((p, i) => [i == 0 ? 'M' : 'L', p[0], p[1]]).join(' ') + ' z',
            fill: 'none',
            stroke: $('#line-color').val(),
            strokeOpacity: $('#line-color').minicolors('opacity'),
            strokeWidth: $('#line-width').val(),
        });
    }

    function appendCircle(x, y) {
        return append('circle', {
            cx: x,
            cy: y,
            stroke: 'none',
            fill: $('#ball-color').val(),
            fillOpacity: $('#ball-color').minicolors('opacity'),
            r: $('#ball-size').val(),
        });
    }

    function draw() {
        var width = $('#width').val();
        var height = $('#height').val();

        svg.setAttribute('viewBox', [0, 0, width, height].join(' '));
        $svg.attr({
            width: width,
            height: height,
        }).empty();


        var polySide = parseInt($('#poly-side').val());
        var polyNum = parseInt($('#poly-num').val());
        var startLength = parseFloat($('#length-initial').val());
        var lengthRate = parseFloat($('#length-rate').val());
        var thresholdAngle = parseFloat($('#angle-threshold').val());

        function getR(hexagonIndex) {
            return lengthRate == 1 ? startLength * hexagonIndex : startLength * (1 - Math.pow(lengthRate, hexagonIndex)) / (1 - lengthRate);
        }

        function splitPoint(startPoint, endPoint, num) {
            return Array.from(Array(num)).map((v, i) => {
                return [(endPoint[0] - startPoint[0]) * i / num + startPoint[0], (endPoint[1] - startPoint[1]) * i / num + startPoint[1]];
            });
        }

        // Main draw
        (function () {
            var cx = width / 2, cy = height / 2;

            // Poly
            for (var i = 1; i < polyNum; i++) {
                var r = getR(i);

                appendPath(Array.from(Array(polySide)).map((v, j) => {
                    return [cx + r * Math.cos(j / polySide * 2 * Math.PI), cy + r * Math.sin(j / polySide * 2 * Math.PI)];
                }));
            }

            // Center Line
            var r = getR(polyNum - 1) * 1.1;
            for (var j = 0; j < polySide; j++) {
                appendLine(cx, cy, cx + r * Math.cos(j / polySide * 2 * Math.PI), cy + r * Math.sin(j / polySide * 2 * Math.PI));
            }

            // Point
            for (var i = 0; i < polyNum; i++) {
                if (i == 0) {
                    appendCircle(cx, cy);
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

                        appendCircle(startPoint[0], startPoint[1]);
                        if (n > 0) {
                            var points = splitPoint(startPoint, endPoint, n + 1);
                            points.filter((v, k) => k > 0).forEach(p => appendCircle(p[0], p[1]));
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
        keyDownTimeout = setTimeout(() => draw(), 10);
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

    $('.colorpicker').each(function () {
        $(this).minicolors({
            format: $(this).attr('data-format') || 'hex',
            theme: 'bootstrap',
            opacity: $(this).data('opacity')
        });
    });
});