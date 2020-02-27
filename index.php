<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>BallAlignSimulator</title>
    <meta name="viewport" data-content="width=device-width,initial-scale=0.7,minimum-scale=0.7,maximum-scale=0.7,user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" href="css/lib/bootstrap.min.css" />
    <link rel="stylesheet" href="css/lib/jquery.minicolors.css" />
    <link rel="stylesheet" href="css/style.css" />
    <script type="text/javascript" src="./js/lib/jquery.min.js"></script>
    <script type="text/javascript" src="./js/lib/popper.min.js"></script>
    <script type="text/javascript" src="./js/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="./js/lib/jquery.minicolors.min.js"></script>
    <script type="text/javascript" src="./js/align.js"></script>
</head>

<body>
    <div id="svg">
        <svg id="main" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>

    <div id="form">
        <form>
            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">canvas</span>
                </div>
                <input type="number" id="width" class="form-control" value="1000" step="1" min="10" max="10000" placeholder="width" title="キャンバスの横幅サイズ[px]">
                <input type="number" id="height" class="form-control" value="1000" step="1" min="10" max="10000" placeholder="height" title="キャンバスの縦幅サイズ[px]">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">line</span>
                </div>
                <input type="number" id="line-width" class="form-control" value="1" step="0.01" placeholder="width" title="線の太さ[px]">
                <input type="text" id="line-color" class="form-control colorpicker" data-control="hue" value="#000000" data-opacity="1" size="7" placeholder="color" title="線の色">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">ball</span>
                </div>
                <input type="number" id="ball-size" class="form-control" value="10" step="0.1" placeholder="size" title="ボールのサイズ[px]">
                <input type="text" id="ball-color" class="form-control colorpicker" data-control="hue" value="#FF0000" data-opacity="1" size="7" placeholder="color" title="ボールの色">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">poly</span>
                </div>
                <input type="number" id="poly-side" class="form-control" value="6" step="1" min="3" max="20" placeholder="side" title="多角形の辺の数">
                <input type="number" id="poly-num" class="form-control" value="8" step="1" min="1" max="20" placeholder="num" title="多角形の数">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">length</span>
                </div>
                <input type="number" id="length-initial" class="form-control" value="30" step="1" placeholder="initial" title="中心から最初の六角形のボールの距離[px]">
                <input type="number" id="length-rate" class="form-control" value="1.2" step="0.01" placeholder="rate" title="次の六角形までの距離が大きくなる割合">
                <input type="number" id="length-equidistant-num" class="form-control" value="1" step="1" min="1" max="20" placeholder="num" title="多角形がこの数までは、距離が大きくならない">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">angle</span>
                </div>
                <input type="number" id="angle-threshold" class="form-control" value="10" step="1" min="10" max="120" placeholder="threshold" title="許容する角度のしきい値[度]">
            </div>

            <p style="text-align:center;">
                <button id="copy" class="btn btn-success">copy</button>
            </p>
        </form>
    </div>

    <div class="hidden"><textarea id="for-copy"></textarea></div>
</body>

</html>