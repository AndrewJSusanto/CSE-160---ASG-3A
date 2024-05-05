function renderAllShapes() {
    // Clear <canvas>
    var startTime = performance.now();

    // Pass rotation matrices
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    var globalRotMatY = new Matrix4().rotate(g_globalAngleY, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrixY, false, globalRotMatY.elements);
    
    // Pass view matrix and projection matrix
    var projMat = new Matrix4();
    // Setting perspective as 90deg wide, near 0.1, far 100
    // could be cool to set keybind to optical zoom w/ setPerspective
    projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
    var viewMat = new Matrix4();
    // (eye, pointing to, where is up)
    viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], 
                      g_at[0],  g_at[1],  g_at[2], 
                      g_up[0],  g_up[1],  g_up[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // Clear depth buffer bit to prevent depth being leftover from prev. frames
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Body
        // Torso
        var torso = new Cube();
        torso.color = [172/255, 213/255, 238/255, 1.0];
        torso.matrix.translate(-0.25, -0.5, 0);
        torso.matrix.rotate(1, 1, 0, 0);
        var torsoCoordMatFLS = new Matrix4(torso.matrix);
        var torsoCoordMatFRS = new Matrix4(torso.matrix);
        var torsoCoordMatHead = new Matrix4(torso.matrix);
        torso.matrix.scale(0.45, 0.45, 0.6);
        var torsoCoordMatBackend = new Matrix4(torso.matrix);
        // right multiply leads to order: scale then translate
        torso.render();

        // Backend
        var backend = new Cube();
        backend.color = [156/255, 189/255, 238/255, 1.0];
        backend.matrix = torsoCoordMatBackend;
        backend.matrix.translate(0.01, 0, 0.7);
        // Make torso come up rather than backend
        //backend.matrix.rotate(g_testAngle, 1, 0, 0);
        backend.matrix.scale(0.98, 0.95, 0.5);
        var backendCoordMatBLS = new Matrix4(backend.matrix);
        var backendCoordMatBRS = new Matrix4(backend.matrix);
        var backendCoordMatTC = new Matrix4(backend.matrix);
        backend.matrix.rotate(3, 1, 0, 0);
        //backend.render();
        // Tailend
        var tailcap = new Cube();
        tailcap.color = [156/255, 189/255, 238/255, 1.0];
        tailcap.matrix = backendCoordMatTC;
        tailcap.matrix.translate(0.06, 0.1, 0.7);
        tailcap.matrix.rotate(-5, 1, 0, 0);
        var tailcapCoordMat = new Matrix4(tailcap.matrix);
        tailcap.matrix.scale(0.9, 0.8, 0.5);
        //tailcap.render();

        // Head
            // Skull
        var head = new Cube();
        head.color = [172/255, 213/255, 238/255, 1.0];
        head.matrix = torsoCoordMatHead;
        head.matrix.translate(0.225, 0.3, 0.1);
        head.matrix.rotate(g_headAngle, 1, 0, 0);
        var headCoordMat_earL = new Matrix4(head.matrix);
        var headCoordMat_earR = new Matrix4(head.matrix);
        var headCoordMat_eyeL = new Matrix4(head.matrix);
        var headCoordMat_eyeR = new Matrix4(head.matrix);
        var headCoordMat_trunk = new Matrix4(head.matrix);
        head.matrix.scale(0.5, 0.5, 0.5);
        head.matrix.translate(-0.5, 0, -0.6);
        //head.render();


            // Ears
        var earL = new Cube();
        earL.color = [172/255, 213/255, 225/255, 1];
        earL.matrix = headCoordMat_earL;
        earL.matrix.translate(0.25, 0.5, 0);
        earL.matrix.rotate(-g_earAngle, 0, 0, 1);
        var earLCoordMat = new Matrix4(earL.matrix);
        earL.matrix.scale(0.2, 0.1, 0.6);
        earL.matrix.translate(-0.1, -0.5, -0.55);
        //earL.render();

        var earLF = new Cube();
        earLF.color = [172/255, 213/255, 225/255, 1];
        earLF.matrix = earLCoordMat;
        earLF.matrix.translate(0.05, -0.01, 0);
        earLF.matrix.rotate(-g_earAngle * 0.8, 0, 0, 1);
        earLF.matrix.rotate(-5, 0, 0, 1);
        var earLFCoordMat = new Matrix4(earLF.matrix);
        earLF.matrix.scale(0.5, 0.125, 0.8);
        earLF.matrix.translate(0.1, -0.25, -0.55);
        //earLF.render();

        var earLF2 = new Cube();
        earLF2.color = [200/255, 106/255, 82/255, 1];
        earLF2.matrix = earLFCoordMat;
        earLF2.matrix.translate(0.4, 0, 0);
        earLF2.matrix.rotate(-g_earAngle * 0.2, 0, 0, 1);
        earLF2.matrix.scale(0.3, 0.08, 0.70);
        earLF2.matrix.translate(0.1, -0.3, -0.55);
        //earLF2.render();

        var earR = new Cube();
        earR.color = [172/255, 213/255, 225/255, 1];
        earR.matrix = headCoordMat_earR;
        earR.matrix.translate(-0.21, 0.5, 0);
        earR.matrix.rotate(g_earAngle, 0, 0, 1);
        var earRCoordMat = new Matrix4(earR.matrix);
        earR.matrix.scale(0.2, 0.1, 0.6);
        earR.matrix.translate(-1.1, -0.5, -0.55);
        //earR.render();

        var earRF = new Cube();
        earRF.color = [172/255, 213/255, 225/255, 1];
        earRF.matrix = earRCoordMat;
        earRF.matrix.translate(-0.085, -0.01, 0);
        earRF.matrix.rotate(g_earAngle * 0.8, 0, 0, 1);
        earRF.matrix.rotate(5, 0, 0, 1);
        var earRFCoordMat = new Matrix4(earRF.matrix);
        earRF.matrix.scale(0.5, 0.125, 0.8);
        earRF.matrix.translate(-1.1, -0.25, -0.55);
        //earRF.render();
        

        var earRF2 = new Cube();
        earRF2.color = [200/255, 106/255, 82/255, 1];
        earRF2.matrix = earRFCoordMat;
        earRF2.matrix.translate(-0.4, 0, 0);
        earRF2.matrix.rotate(g_earAngle * 0.2, 0, 0, 1);
        earRF2.matrix.scale(0.3, 0.08, 0.7);
        earRF2.matrix.translate(-1.1, -0.3, -0.55);
        // earRF2.render();

            // Eyes
        var eyeL = new Cube();
        eyeL.color = [0, 0, 0, 1];
        eyeL.matrix = headCoordMat_eyeL;
        eyeL.matrix.translate(-0.125, 0.205, 0.01);
        eyeL.matrix.scale(0.05, 0.09, 0.3);
        eyeL.matrix.translate(-0.5, 0, -1.1);
        var eyeLCoordMat_glint = new Matrix4(eyeL.matrix);
        // eyeL.render();

        var eyeLG = new Cube();
        eyeLG.color = [1, 1, 1, 1];
        eyeLG.matrix = eyeLCoordMat_glint;
        eyeLG.matrix.translate(0.7, 0.5, 0.03);
        eyeLG.matrix.scale(0.3, 0.3, 0.1);
        eyeLG.matrix.translate(-0.5, 0, -0.5);
        // eyeLG.render();

        var eyeR = new Cube();
        eyeR.color = [0, 0, 0, 1];
        eyeR.matrix = headCoordMat_eyeR;
        eyeR.matrix.translate(0.125, 0.205, 0.01);
        eyeR.matrix.scale(0.05, 0.09, 0.3);
        eyeR.matrix.translate(-0.5, 0, -1.1);
        var eyeRCoordMat_glint = new Matrix4(eyeR.matrix);
        // eyeR.render();

        var eyeRG = new Cube();
        eyeRG.color = [1, 1, 1, 1];
        eyeRG.matrix = eyeRCoordMat_glint;
        eyeRG.matrix.translate(0.7, 0.5, 0.03);
        eyeRG.matrix.scale(0.3, 0.3, 0.1);
        eyeRG.matrix.translate(-0.5, 0, -0.5)
        // eyeRG.render();

            // Trunk: animate trunk
        var trunk = new Cube();
        trunk.color = [172/255, 213/255, 238/255, 1.0];
        trunk.matrix = headCoordMat_trunk;
        trunk.matrix.translate(0, 0.12, -0.3);
        trunk.matrix.rotate(g_trunkAngle * 0.5, 1, 0, 0);
        trunk.matrix.rotate(g_trunk1Angle, 1, 0, 0); 
        trunk.matrix.rotate(-3, 1, 0, 0);
        var trunk1CoordMat = new Matrix4(trunk.matrix);
        trunk.matrix.scale(0.4, 0.2, 0.2);
        trunk.matrix.translate(-0.5, -0.5, -0.5);
        // trunk.render();

        var trunk2 = new Cube();
        trunk2.color = [172/255, 213/255, 238/255, 1.0];
        trunk2.matrix = trunk1CoordMat;
        trunk2.matrix.rotate(g_trunkAngle, 1, 0, 0);
        trunk2.matrix.rotate(g_trunk2Angle, 1, 0, 0);
        trunk2.matrix.rotate(-3, 1, 0, 0);
        var trunk2CoordMat = new Matrix4(trunk2.matrix);
        var trunk2CoordMat_tint = new Matrix4(trunk2.matrix);
        trunk2.matrix.translate(0, 0, 0);
        trunk2.matrix.scale(0.35, 0.18, 0.4);
        trunk2.matrix.translate(-0.5, -0.5, -0.85);
        // trunk2.render();

        var trunkTint = new Cube();
        trunkTint.color = [246/255, 106/255, 82/255, 1];
        trunkTint.matrix = trunk2CoordMat_tint;
        trunkTint.matrix.translate(0, 0.09, -0.2);
        trunkTint.matrix.scale(0.36, 0.05, 0.1);
        trunkTint.matrix.translate(-0.5, -0.5, -0.5);
        // trunkTint.render();

        var trunk3 = new Cube();
        trunk3.color = [90/255, 100/255, 100/255, 1.0];
        trunk3.matrix = trunk2CoordMat;
        trunk3.matrix.translate(0, -0.01, -0.3);
        trunk3.matrix.rotate(g_trunkAngle * 0.9, 1, 0, 0);
        trunk3.matrix.rotate(g_trunk3Angle, 1, 0, 0);
        trunk3.matrix.scale(0.3, 0.12, 0.15);
        trunk3.matrix.translate(-0.5, -0.5, -0.85);
        // trunk3.render();

        // Front legs
            // Front left - shoulder
        var legFLS = new Cube();
        legFLS.color = [172/255, 213/255, 238/255, 1.0];
        legFLS.matrix = torsoCoordMatFLS;
        legFLS.matrix.translate(0.45, 0.06, -0.02);
        legFLS.matrix.rotate(-g_legAngle, 0, 0, 1);
        legFLS.matrix.rotate(180, 0, 0, 1);
        legFLS.matrix.rotate(-5, 1, 0, 1);
        legFLS.matrix.rotate(5, 0, 0, 1);
        var legFLS_CoordMat = new Matrix4(legFLS.matrix);
        legFLS.matrix.translate(-0.05, -0.1, 0);
        legFLS.matrix.scale(0.15, 0.35, 0.3);
        // legFLS.render();
            // Front left - middle
        var legFLM = new Cube();
        legFLM.color = [156/255, 189/255, 238/255, 1.0];
        legFLM.matrix = legFLS_CoordMat;
        legFLM.matrix.translate(-0.06, 0.1, -0.04);
        legFLM.matrix.rotate(2, 1, 0, 0);
        legFLM.matrix.scale(0.175, 0.2, 0.35);
        var legFLM_CoordMat = new Matrix4(legFLM.matrix);
        // legFLM.render();
            // Front left - toe
        var legFLT = new Cube();
        legFLT.color = [106/255, 115/255, 115/255, 1];
        legFLT.matrix = legFLM_CoordMat;
        legFLT.matrix.translate(-0.1, 1, -0.1);
        legFLT.matrix.scale(1.25, 0.5, 1.1);
        // legFLT.render();

            // Front right - shoulder
        var legFRS = new Cube();
        legFRS.color = [172/255, 213/255, 238/255, 1.0];
        legFRS.matrix = torsoCoordMatFRS;
        legFRS.matrix.translate(0.05, 0.06, -0.02);
        legFRS.matrix.rotate(g_legAngle, 0, 0, 1);
        legFRS.matrix.rotate(180, 0, 0, 1);
        legFRS.matrix.rotate(-5, 1, 0, 0);
        legFRS.matrix.rotate(-1, 0, 0, 1);
        legFRS_CoordMat = new Matrix4(legFRS.matrix);
        legFRS.matrix.translate(-0.05, -0.1, 0);
        legFRS.matrix.scale(0.15, 0.35, 0.3);
        // legFRS.render();
            // Front right - middle
        var legFRM = new Cube();
        legFRM.color = [156/255, 189/255, 238/255, 1.0];
        legFRM.matrix = legFRS_CoordMat;
        legFRM.matrix.translate(-0.065, 0.1, -0.04);
        legFRM.matrix.rotate(2, 1, 0, 0);
        legFRM.matrix.scale(0.175, 0.2, 0.35);
        var legFRM_CoordMat = new Matrix4(legFRM.matrix);
        // legFRM.render();
            // Front right - toe
        var legFRT = new Cube();
        legFRT.color = [106/255, 115/255, 115/255, 1];
        legFRT.matrix = legFRM_CoordMat;
        legFRT.matrix.translate(-0.1, 1, -0.1);
        legFRT.matrix.scale(1.25, 0.5, 1.1);
        // legFRT.render();

        // Back legs
            // Back left - shoulder (?)
        var legBLS = new Cube();
        legBLS.color = [172/255, 213/255, 238/255, 1.0];
        legBLS.matrix = backendCoordMatBLS;
        legBLS.matrix.translate(1.0, 0.4, 0.3);
        var legBLSCoordMat = new Matrix4(legBLS.matrix);
        legBLS.matrix.rotate(-g_legAngle, 0, 0, 1);
        legBLS.matrix.rotate(180, 0, 0, 1);
        legBLS.matrix.translate(-0.1, 0, 0);
        legBLS.matrix.scale(0.4, 0.7, 0.9);
        // legBLS.render();
            // Back left - middle
        var legBLM = new Cube();
        legBLM.color = [156/255, 189/255, 238/255, 1.0];
        legBLM.matrix = legBLSCoordMat;
        legBLM.matrix.rotate(-g_legAngle, 0, 0, 1);
        var legBLMCoordMat = new Matrix4(legBLM.matrix);
        legBLM.matrix.scale(0.5, 0.8, 1.1);
        legBLM.matrix.translate(-0.7, -1.2, -0.1);
        // legBLM.render();
            // Back left - toe
        var legBLT = new Cube();
        legBLT.color = [106/255, 115/255, 115/255, 1];
        legBLT.matrix = legBLMCoordMat;
        legBLT.matrix.translate(-0.4, -1.2, -0.15);
        legBLT.matrix.scale(0.6, 0.5, 1.2);
        // legBLT.render();

            // Back right - shoulder (?)
        var legBRS = new Cube();
        legBRS.color = [172/255, 213/255, 238/255, 1.0];
        legBRS.matrix = backendCoordMatBRS;
        legBRS.matrix.translate(0, 0.4, 0.3);
        var legBRSCoordMat = new Matrix4(legBRS.matrix);
        legBRS.matrix.rotate(g_legAngle, 0, 0, 1);
        legBRS.matrix.rotate(180, 0, 0, 1);
        legBRS.matrix.translate(-0.3, 0, 0);
        legBRS.matrix.scale(0.4, 0.7, 0.9);
        // legBRS.render();
            // Back right - middle
        var legBRM = new Cube();
        legBRM.color = [156/255, 189/255, 238/255, 1.0];
        legBRM.matrix = legBRSCoordMat;
        legBRM.matrix.rotate(g_legAngle, 0, 0, 1);
        var legBRMCoordMat = new Matrix4(legBRM.matrix);
        legBRM.matrix.scale(0.5, 0.8, 1.1);
        legBRM.matrix.translate(-0.3, -1.2, -0.1);
        // legBRM.render();
            // Back right - toe
        var legBRT = new Cube();
        legBRT.color = [106/255, 115/255, 115/255, 1];
        legBRT.matrix = legBRMCoordMat;
        legBRT.matrix.translate(-0.2, -1.2, -0.15);
        legBRT.matrix.scale(0.6, 0.5, 1.2);
        // legBRT.render();



        // Tail: animate tail as propeller? idk
        
        var tail = new Cube();
        tail.color = [106/255, 115/255, 115/255, 1];
        tail.matrix = tailcapCoordMat;
        tail.matrix.translate(0.4, 0.5, -0.05);
        tail.matrix.rotate(-20, 1, 0, 0);
        tail.matrix.rotate(-g_tailAngle, 0, 0, 1);
        var tailCoordMat = new Matrix4(tail.matrix);
        tail.matrix.scale(0.06, -1.0, 0.1);
        tail.matrix.translate(-0.5, 0, 5);
        // tail.render();

        var tailEnd = new Cube();
        tailEnd.color = [246/255, 106/255, 82/255, 1];
        tailEnd.matrix = tailCoordMat;
        tailEnd.matrix.translate(0, -1, 0.55);
        tailEnd.matrix.scale(0.15, 0.15, 0.15);
        tailEnd.matrix.translate(-0.5, -0.5, -0.5);
        // tailEnd.render();



    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) +
                    " fps: " + Math.floor(10000/duration),
                    "numdot");
}