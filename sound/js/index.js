    $.extend($.easing, {
      elastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.6;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else{ s = p/(2*Math.PI) * Math.asin (c/a); }
        return a*Math.pow(2,-15*t) * Math.sin( (t*d-s)*(19*Math.PI)/p ) + c + b;
      }
    });

    Raphael.st.draggable = function(options) {
      options = options || {};

      var me = this,
          lx = 0,
          ly = 0,
          ox = 0,
          oy = 0,
          moveFnc = function(dx, dy) {
              lx = dx + ox;
              ly = dy + oy;
              me.transform('t' + lx + ',' + ly);
              options.onMove(lx, ly);
          },
          startFnc = function() {
            options.onStart();
          },
          endFnc = function() {
              ox = 0;
              oy = 0;
              options.onEnd(me, lx, ly);
          };

      this.drag(moveFnc, startFnc, endFnc);
    };


    $(function() {

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new AudioContext(), currentOsc, isMouseDown, lastY;

      var getFreq = function(x, y){
        if(x === 0){
          return 0;
        }
        if(y === 0){
          return 0;
        }

        return ((Math.abs(x)) + (Math.abs(y))) * 5;
      };
      
      var moveCircles = function(x, y){
        circles.forEach(function(c, i){
          var m = Number('0.'+i);
          c.transform('t' + (x * m) + ',' + (y*m));
        });
      };
      
      var paper = Raphael(document.getElementById('canvas'));
      var mySet = paper.set();

      var h = $('body').height();
      var w = $('body').width();
      var centerX = '50%';
      var centerY = '50%';

      var circles = [
        paper.circle(centerX, centerY, '80%').attr({'fill': '#FA7694', 'stroke': ''}),
        paper.circle(centerX, centerY, '50%').attr({'fill': '#F9F1A3', 'stroke': ''}),
        paper.circle(centerX, centerY, '30%').attr({'fill': '#707C72', 'stroke': ''}),
        paper.circle(centerX, centerY, '25%').attr({'fill': '#505858', 'stroke': ''}),
        paper.circle(centerX, centerY, '20%').attr({'fill': '#707C72', 'stroke': ''}),
        paper.circle(centerX, centerY, '15%').attr({'fill': '#F9F1A3', 'stroke': ''}),
        paper.circle(centerX, centerY, '5%').attr({'fill': '#FA7694', 'stroke': ''}),
      ];

      mySet.push(paper.circle(centerX, centerY, '3%').attr({'fill': '#00FFCD', 'stroke': '#FA7694', 'stroke-width': 4 }));
      var o1, a, o2, o3, o4;
      mySet.draggable({
        onStart: function(){
          if(a){
            a.stop();
          }
          if(o1){
            o1.frequency.value = 0;
          }
          o1 = ctx.createOscillator();
          o1.type = "sine"; // "triangle"; // "sine"; // 'square';
          o1.frequency.value = 300;
          o1.start(0);
          o1.connect(ctx.destination);
          o2 = ctx.createOscillator();
          o2.type = "sine"; // "triangle"; // "sine"; // 'square';
          o2.frequency.value = 600;
          o2.start(0);
          o2.connect(ctx.destination);
          o3 = ctx.createOscillator();
          o3.type = "sine"; // "triangle"; // "sine"; // 'square';
          o3.frequency.value = 2400;
          o3.start(0);
          o3.connect(ctx.destination);
          o4 = ctx.createOscillator();
          o4.type = "sine"; // "triangle"; // "sine"; // 'square';
          o4.frequency.value = 1200;
          o4.start(0);
          o4.connect(ctx.destination);

        },
        onMove: function(x, y){
          o1.frequency.value = (getFreq(x, y));
          o2.frequency.value = (getFreq(x, y)*2);
          o3.frequency.value = (getFreq(x, y)*8);
          o4.frequency.value = (getFreq(x, y)*4);

          moveCircles(x, y);
        },
        onEnd: function(item, x, y){
          a = $({x:x, y:y}).animate({x:0, y:0},{
            duration: 3000,
            easing: 'elastic',
            step: function(now, fx){
              o1.frequency.value = getFreq(fx.elem.x, fx.elem.y);
              o2.frequency.value = (getFreq(fx.elem.x, fx.elem.y)*2);
              o3.frequency.value = (getFreq(fx.elem.x, fx.elem.y)*8);
              o4.frequency.value = (getFreq(fx.elem.x, fx.elem.y)*4);
              item.transform( 't' + fx.elem.x + ',' + fx.elem.y );
              moveCircles(fx.elem.x, fx.elem.y);
            },
            done: function(){
              o1.frequency.value = 0;
              o1.stop(0);
              o2.frequency.value = 0;
              o2.stop(0);
              o3.frequency.value = 0;
              o3.stop(0);
              o4.frequency.value = 0;
              o4.stop(0);
            }
          });
        }
      });
    });