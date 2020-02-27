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
                <input type="number" id="width" class="form-control" value="1000" step="1" min="10" max="10000" placeholder="width">
                <input type="number" id="height" class="form-control" value="1000" step="1" min="10" max="10000" placeholder="height">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">line</span>
                </div>
                <input type="number" id="line-width" class="form-control" value="1" step="0.01" placeholder="width">
                <input type="text" id="line-color" class="form-control colorpicker" data-control="hue" value="#000000" data-opacity="1" size="7" placeholder="color">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">ball</span>
                </div>
                <input type="number" id="ball-size" class="form-control" value="10" step="0.1" placeholder="size">
                <input type="text" id="ball-color" class="form-control colorpicker" data-control="hue" value="#FF0000" data-opacity="1" size="7" placeholder="color">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">length</span>
                </div>
                <input type="number" id="length-initial" class="form-control" value="30" step="1" placeholder="initial">
                <input type="number" id="length-rate" class="form-control" value="1.2" step="0.01" placeholder="rate">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">poly</span>
                </div>
                <input type="number" id="poly-side" class="form-control" value="6" step="1" min="3" max="20" placeholder="side">
                <input type="number" id="poly-num" class="form-control" value="8" step="1" min="1" max="20" placeholder="num">
            </div>

            <div class="form-group input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">angle</span>
                </div>
                <input type="number" id="angle-threshold" class="form-control" value="10" step="1" min="10" max="120" placeholder="threshold">
            </div>

            <p style="text-align:center;">
                <button id="copy" class="btn btn-success">copy</button>
            </p>
        </form>
    </div>

    <div class="hidden"><textarea id="for-copy"></textarea></div>
</body>

</html>