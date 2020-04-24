ECS.Texture = function Texture(url, loadQueue){
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var textureInfo = {
        width: 1,   // we don't know the size until it loads
        height: 1,
        loaded: false,
        texture: tex,
        name: url
    };

    var img = new Image();
    img.addEventListener('load', function () {
        textureInfo.loaded = true;
        textureInfo.width = img.width;
        textureInfo.height = img.height;

        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        texsLoaded++;
        if(consoleOn) console.log(texsLoaded + ", " + loadQueue)

        if (texsLoaded == loadQueue) {
            ECS.Game.texturesReady();
        }


    });
    img.src = url;

    return textureInfo;
}

ECS.TextureHlp.getTextureByName = function getTextureByName(name){
    for (var i = 0; i < ECS.textures.length; i++) {
        if (ECS.textures[i].name == name)
          return ECS.textures[i];
    }
    if (consoleOn) console.log("Texture lookup failed: " + name);
}

ECS.TextureHlp.deleteTextureByName = function deleteTextureByName(name){
    for (var i = 0; i < ECS.textures.length; i++) {
        if (ECS.textures[i].name == name)
          ECS.textures.splice(i,1);
    }
    if (consoleOn) console.log("Texture lookup failed: " + name);
}

ECS.TextureHlp.loadTextures = function loadTextures(texList){
    for (var i = 0; i < texList.length; i++) {
        try {
            ECS.textures.push(new ECS.Texture(texList[i], texList.length));
          } catch (error) {
            console.log("Texture " + texList[i] + " could not be loaded.");
          }
    }
}