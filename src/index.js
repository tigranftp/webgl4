let currentAngle = 0;
let currentAngleY = 0;

let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

const norm = 1;
const defaultX = 0.5;
const defaultY = -1;
const defaultZ = -1;


glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [defaultX, norm + defaultY, defaultZ]);

glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [defaultX, defaultY, defaultZ]);

glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm + defaultX, defaultY, defaultZ]);

glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-norm + defaultX, defaultY, defaultZ]);

let canvas = document.getElementById("pedestal");
canvas.width = 1000;
canvas.height = 1000;

initWebGl(canvas);

let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);


initBuffersCube()

let positionAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertPositions",
    3, 6, 0);
gl.enableVertexAttribArray(positionAttribLocationCube);


let normalLocation = enableVertexAttrib(
    shaderProgram,
    "a_normal",
    3, 6, 3);
// Включаем атрибут нормалей
gl.enableVertexAttribArray(normalLocation);

let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");
let vecColors = gl.getUniformLocation(shaderProgram, "uColors");
var lightWorldPositionLocation = gl.getUniformLocation(shaderProgram, "u_lightWorldPosition");
var viewWorldPositionLocation = gl.getUniformLocation(shaderProgram, "u_viewWorldPosition");
var shininessLocation = gl.getUniformLocation(shaderProgram, "u_shininess");
var gouraudShadingLocation = gl.getUniformLocation(shaderProgram, "gouraudShadingBool");
var powerLocation = gl.getUniformLocation(shaderProgram, "u_lightPower");
var lambertLocation = gl.getUniformLocation(shaderProgram, "lambertBool");
var blinnLocation = gl.getUniformLocation(shaderProgram, "blinnBool");
let currGouraud = -1
gl.uniform1f(gouraudShadingLocation, currGouraud);
let currBlinn = -1
gl.uniform1f(blinnLocation, currBlinn);
let currLambert = -1
gl.uniform1f(lambertLocation, currLambert);


var KALocation = gl.getUniformLocation(shaderProgram, "Ka");
var KDLocation = gl.getUniformLocation(shaderProgram, "Kd");
var KSLocation = gl.getUniformLocation(shaderProgram, "Ks");
var ambientColorLocation = gl.getUniformLocation(shaderProgram, "ambientColor");
var specularColorLocation = gl.getUniformLocation(shaderProgram, "specularColor");
var lightColorLocation =
    gl.getUniformLocation(shaderProgram, "u_lightColor");

let worldMatrixCube = new Float32Array(16);
let viewMatrixCube = new Float32Array(16);
let projMatrixCube = new Float32Array(16);
let uColorsCube = [0.0, 0.0, 0.0]

glMatrix.mat4.identity(worldMatrixCube)
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, angle(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniform3fv(viewWorldPositionLocation, [0, -1, 0]);
gl.uniform1f(shininessLocation, 100);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);
gl.uniform3fv(vecColors, uColorsCube)
gl.uniform3fv(lightColorLocation, [1 / 2.2, 0.6 / 2.2, 0.6 / 2.2]);  // красный свет
// заадаём цвет бликов
gl.uniform3fv(specularColorLocation, [1 / 1.4, 0.2 / 1.4, 0.2 / 1.4]);


gl.uniform3fv(ambientColorLocation, [0, 0, 0]);

gl.uniform1f(KALocation, 1);
gl.uniform1f(KDLocation, 1);
gl.uniform1f(KSLocation, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

document.addEventListener('keydown', (event) => {
    let key = event.key;
    let angleRot = 3
    let step = 0.1
    let tmpVec3 = glMatrix.vec3.create()
    let axisOfBotCube = glMatrix.vec3.create()
    switch (key) {
        case "z":
            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, leftCubeWMatx)
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(-angleRot), [0, 1, 0]);
            axisOfBotCube = glMatrix.vec3.transformMat4(glMatrix.vec3.create(), glMatrix.vec3.create(), botCubeWMatx)
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(-angleRot))
            changeCoordsOfMatrix(leftCubeWMatx, tmpVec3)

            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, rightCubeWMatx)
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(-angleRot))
            changeCoordsOfMatrix(rightCubeWMatx, tmpVec3)

            break;
        case "c":
            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, leftCubeWMatx)
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(angleRot), [0, 1, 0]);
            axisOfBotCube = glMatrix.vec3.transformMat4(glMatrix.vec3.create(), glMatrix.vec3.create(), botCubeWMatx)
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(angleRot))
            changeCoordsOfMatrix(leftCubeWMatx, tmpVec3)

            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, rightCubeWMatx)
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(angleRot))
            changeCoordsOfMatrix(rightCubeWMatx, tmpVec3)
            break
        case "a":
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(-angleRot), [0, 1, 0]);
            break
        case "d":
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(angleRot), [0, 1, 0]);
            break
        case "q":
            glMatrix.mat4.rotate(viewMatrixCube, viewMatrixCube, angle(-angleRot), [0, 1, 0]);
            break
        case "e":

            glMatrix.mat4.rotate(viewMatrixCube, viewMatrixCube, angle(angleRot), [0, 1, 0]);
            break
        case "w":
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, 0, step]);
            break
        case "s":
            step = -0.1
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, 0, step]);
            break
        case "b":
            currBlinn *= -1
            gl.uniform1f(blinnLocation, currBlinn);
            break
        case "l":
            currLambert *= -1
            gl.uniform1f(lambertLocation, currLambert);
            break
        case "g":
            currGouraud *= -1
            gl.uniform1f(gouraudShadingLocation, currGouraud);
            break
    }
}, false);

initBuffersCube()
// setNormals()
gl.uniform3fv(lightWorldPositionLocation, [20, 30, 50]);


let shininessElement = document.getElementById('shininess')
gl.uniform1f(shininessLocation, shininessElement.value);

shininessElement.addEventListener("input", () => {
    gl.uniform1f(shininessLocation, shininessElement.value);
});


let powerElement = document.getElementById('power')
gl.uniform1f(powerLocation, powerElement.value / 100);

powerElement.addEventListener("input", () => {
    gl.uniform1f(powerLocation, powerElement.value / 100);
});

function loop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);

    gl.uniform3fv(vecColors, [1, 0.84, 0])
    glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);

    gl.drawArrays(gl.TRIANGLES, 0, 40);


    glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);


    gl.uniform3fv(vecColors, [0.66, 0.66, 0.66])
    glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);


    gl.uniform3fv(vecColors, [0.66, 0.57, 0.33])
    glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);


    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
