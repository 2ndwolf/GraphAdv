<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="robots" content="noimageindex, nofollow">
    <title>Dominic Grenier - Graphiste</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet">
    <link href="style.css" type="text/css" rel="stylesheet">
    
    <script id="tex-vertex-shader" type="x-shader/x-vertex">
    
        attribute vec4 positionLocation;
        attribute vec2 texcoordLocation;
        
        uniform mat4 matrixLocation;
        uniform mat4 textureMatrixLocation;
        
        varying vec2 v_texcoord;
        
        void main(void) {
        gl_Position = matrixLocation * positionLocation;
        v_texcoord = (textureMatrixLocation * vec4(texcoordLocation, 0, 1)).xy;
        }
    </script>
    
    <script id="tex-fragment-shader" type="x-shader/x-fragment">
        precision mediump float;
        
        varying vec2 v_texcoord;
        
        uniform sampler2D textureLocation;
        
        void main(void) {
        gl_FragColor = texture2D(textureLocation, v_texcoord);
        }
    </script>
    
    
    
    
    
    <script id="poly-vertex-shader" type="x-shader/x-vertex">
    
        attribute vec2 a_position;
        
        uniform mat3 u_matrix;
        
        void main() {
        // Multiply the position by the matrix.
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        }
    
    </script>
    
    <!-- fragment shader -->
    <script id="poly-fragment-shader" type="x-shader/x-fragment">
        precision mediump float;
        
        uniform vec4 u_color;
        
        void main() {
        gl_FragColor = u_color;
        }
    </script>
  </head>


  <body>
    <?php
    if(!isset($_GET['lang'])){
        $lang = "FR";
    } else {
        if(empty(htmlspecialchars($_GET["lang"]))){
            $lang = "FR";
        } else {
            $lang = htmlspecialchars($_GET["lang"]);
        }
    }
    ?>
    <script src="basics/webgl-utils.js"></script>
    <script src="basics/m4.js"></script>
    <script src="basics/m3.js"></script>
    <script src="scripts/init.js"></script>

    <script>
        function saveGame(){
            var cookie = ["n", '=', JSON.stringify(ECS.playerEntity.components.isPlayer.playerData), '; expires=', new Date("2038").toUTCString(), '; domain=', window.location.host.toString(), '; path=/;'].join('');

            document.cookie = cookie;
        }
        function retrieveCookie(){
            var result = document.cookie.match(new RegExp("n=([^;]+)"));
            if(result) ECS.playerEntity.components.isPlayer.playerData = JSON.parse(result[1]);
            console.log(document.cookie);

        }
        function deleteCookie(){
            document.cookie = 'n=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'+ '; domain='+ window.location.host.toString() + '; path=/;';
        }
    </script>
    <button onclick="saveGame()">Save Game</button>
    <button onclick="retrieveCookie()">Retrieve Cookie</button>
    <button onclick="deleteCookie()">deleteCookie</button>
  </body>
</html>