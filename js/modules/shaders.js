function globeVertexShader(){
    return `
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    uniform sampler2D globeBump;
    void main (){
        vertexUV = uv;
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 0.25*texture2D(globeBump, uv).xyz, 1.0);
    }
    `
}

function globeFragmentShader(){
    return `
    uniform sampler2D globeTexture;
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    void main(){
        float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
        gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 0.9);
    }
    `
}

function cloudVertexShader(){
    return `
    uniform sampler2D clouds;
    varying vec2 vertexUV;
    void main(){
        vertexUV = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position +  0.1*texture2D(clouds, uv).xyz, 1.0);
    }
    `
}

function cloudFragmentShader(){
    return `
    uniform sampler2D clouds;
    varying vec2 vertexUV;
    void main(){
        gl_FragColor = vec4(texture2D(clouds, vertexUV).rgb * 1.5, 0.85);
        if (gl_FragColor.r < 0.25){
            discard;
        }
    }
    `
}

function atmosVertexShader(){
    return `
    varying vec3 vertexNormal;
    void main (){
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position + 1.1 * normal), 1.0);
    }
    `
}

function atmosFragmentShader(){
    return `
    varying vec3 vertexNormal;
    void main(){
        float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
    `
}


export default { globeVertexShader, globeFragmentShader, cloudVertexShader, cloudFragmentShader, atmosVertexShader, atmosFragmentShader };