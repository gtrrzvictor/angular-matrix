angular.module('angular-matrix', [])
    .directive('ngMatrix', ['$interval', '$compile', function($interval, $compile) {

        return {
            link: function(scope, element, attrs) {
                var config = scope.config;
                var html = '<canvas id="{{config.id}}"></canvas>';
                var canvasArray = $compile(html)(scope);
                element.append(canvasArray);
                var c = canvasArray[0];
                var ctx = c.getContext("2d");

                //making the canvas full screen
                c.height = jQuery(element).parents('.panel-body')[0].offsetWidth * 9 / 16;
                c.width = jQuery(element).parents('.panel-body')[0].offsetWidth;

                //chinese characters - taken from the unicode charset

                //converting the string into an array of single characters
                var font_size = config.fontSize;
                var columns = c.width / font_size; //number of columns for the rain
                //an array of drops - one per column
                var drops = [];
                //x below is the x coordinate
                //1 = y co-ordinate of the drop(same for every drop initially)
                for (var x = 0; x < columns; x++)
                    drops[x] = 1;
                scope.config.columns = drops.length;
                //drawing the characters
                function draw() {
                    //Black BG for the canvas
                    //translucent BG to show trail
                    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                    ctx.fillRect(0, 0, c.width, c.height);
                    ctx.fillStyle = "#0F0"; //green text
                    ctx.font = font_size + "px arial";
                    //looping over drops
                    var arrayText;
                    for (var i = 0; i < drops.length; i++) {
                        arrayText = config.texts[i % config.texts.length].split("");
                        arrayText.push(" ");
                        //a random text character to print
                        var text = arrayText[drops[i] % arrayText.length];
                        //x = i*font_size, y = value of drops[i]*font_size
                        ctx.fillText(text, i * font_size, drops[i] * font_size);

                        //sending the drop back to the top randomly after it has crossed the screen
                        //adding a randomness to the reset to make the drops scattered on the Y axis
                        if (drops[i] * font_size > c.height && Math.random() > 0.975)
                            drops[i] = 0;

                        //incrementing Y coordinate
                        drops[i]++;
                    }
                }
                $interval(draw, config.speed);
            },
            restrict: 'E',
            scope: {
                config: '=config'
            }
        };
    }]);