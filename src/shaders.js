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
        'uniform vec3 u_viewWorldPosition;',
        'varying vec3 v_surfaceToLight;',
        'varying vec3 v_surfaceToView;',
        'uniform float blinnBool;',
        'uniform float gouraudShadingBool;',
        'uniform float lambertBool;',
        'uniform float u_shininess;',
        'uniform float u_lightPower;',
        'uniform float Ka;',  // Ambient reflection coefficient
        'uniform float Kd;', // Diffuse reflection coefficient
        'uniform float Ks;',   // Specular reflection coefficient
        'uniform vec3 u_lightColor;',
        'uniform vec3 ambientColor;',
        'uniform vec3 specularColor;',
        '',
        'void main()',
        '{',
        '   fragColor = uColors;',
        '   vec3 surfaceWorldPosition = (mWorld * vec4(vertPositions, 1.0)).xyz;',
        '   v_surfaceToLight = normalize(u_lightWorldPosition - surfaceWorldPosition);',
        '   v_normal = vec3(mWorld * vec4(a_normal, 0.0));',
        '   v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);',
        '   gl_Position = mProj * mView * mWorld * vec4(vertPositions, 1.0);',

        '   if (gouraudShadingBool < 0.0)',
        '       return;',
        '       vec3 halfVector = normalize(v_surfaceToLight + v_surfaceToView);',
        '       vec3 reflectDir = reflect(-v_surfaceToLight, v_normal);',
        '       float specular = 0.0;',
        '       float lambertian = max(dot(v_normal, v_surfaceToLight), 0.0);',
        '       if (lambertian > 0.0) {',
        '              if(blinnBool > 0.0)',
        '                   specular = pow( max(dot(v_normal, halfVector), 0.0), u_shininess);',
        '               else ',
        '                   specular = pow(max(dot(v_surfaceToView, reflectDir), 0.0), u_shininess);',
        '}',

        'fragColor = Ka * ambientColor + Kd * lambertian * uColors +Ks * specular * specularColor;',
        'if (lambertBool > 0.0)',
        '   fragColor = Kd * lambertian * uColors;',
        '}',
    ].join('\n');

let fsSource =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'varying vec3 v_normal;',
        'varying vec3 v_surfaceToLight;',
        'varying vec3 v_surfaceToView;',
        '',
        'uniform float blinnBool;',
        'uniform float gouraudShadingBool;',
        'uniform float lambertBool;',
        'uniform float u_shininess;',
        'uniform float u_lightPower;',
        'uniform float Ka;',  // Ambient reflection coefficient
        'uniform float Kd;', // Diffuse reflection coefficient
        'uniform float Ks;',   // Specular reflection coefficient
        'uniform vec3 u_lightColor;',

        'uniform vec3 ambientColor;',
        'uniform vec3 specularColor;',
        '',
        'void main()',
        '{',
        'if (gouraudShadingBool > 0.0)',
        '   gl_FragColor = vec4(fragColor, 1.0);',
        ' else {',
        'vec3 normal = normalize(v_normal);',
        'vec3 surfaceToLightDirection = normalize(v_surfaceToLight);',
        'vec3 surfaceToViewDirection = normalize(v_surfaceToView);',
        'vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);',
        'vec3 reflectDir = reflect(-surfaceToLightDirection, normal);',
        'float specular = 0.0;',
        'float lambertian = max(dot(normal, surfaceToLightDirection), 0.0);',
        'if (lambertian > 0.0) {',
        'if(blinnBool > 0.0)',
        '       specular = pow( max(dot(normal, halfVector), 0.0), u_shininess);',
        ' else ',
        '       specular = pow(max(dot(surfaceToViewDirection, reflectDir), 0.0), u_shininess);',
        '}',

        'gl_FragColor = vec4(Ka * ambientColor + Kd * lambertian * fragColor +Ks * specular * specularColor, 1.0);',
        'if (lambertBool > 0.0)',
        '   gl_FragColor = vec4(Kd * lambertian * fragColor, 1.0);',

            '    //float nSteps = 4.0;',
            '    //float step = sqrt(lambertian) * nSteps;',
            '   //step = (floor(step) + smoothstep(0.48, 0.52, fract(step))) / nSteps;',
            '   //gl_FragColor = vec4(step * fragColor, 1.0);',
        '}',
        'gl_FragColor.rgb *=u_lightPower; ',

        '',
        '}',
    ].join('\n');