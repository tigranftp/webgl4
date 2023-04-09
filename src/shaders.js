let vsSource =
    [
        'precision mediump float;',
        'attribute vec3 vertPositions;',
        'attribute vec3 vertColor;',
        'attribute vec3 a_normal;',
        'varying vec3 fragColor;',
        'varying vec3 v_normal;',
        '',
        'uniform vec3 uColors;',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        'uniform vec3 u_lightWorldPosition;',
        'varying vec3 v_surfaceToLight;',
        '',
        'void main()',
        '{',
        '   fragColor = uColors;',
        '   vec3 surfaceWorldPosition = (mWorld * vec4(vertPositions, 1.0)).xyz;',
        '   v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;',
        '   v_normal = mat3(mWorld) * a_normal;',
        '   gl_Position = mProj * mView * mWorld * vec4(vertPositions, 1.0);',
        '}',
    ].join('\n');

let fsSource =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'varying vec3 v_normal;',
        'varying vec3 v_surfaceToLight;',
        'void main()',
        '{',
        'vec3 normal = normalize(v_normal);',
        'vec3 surfaceToLightDirection = normalize(v_surfaceToLight);',
        'float light = dot(normal, surfaceToLightDirection);',
        'gl_FragColor = vec4(fragColor, 1.0);',
        'gl_FragColor.rgb *= light;',
        '',
        '}',
    ].join('\n');