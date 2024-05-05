class Cube{
    constructor(){
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.sides = 3.0;
        this.matrix = new Matrix4();
    }

    render(){
        //var xy = this.position;                                       // set xy to the ith point's pos field
        var rgba = this.color;                                          // set rgba to the ith point's color field
        //var size = this.size;                                           // set size to the ith point's size field
 
        // Pass the color of a point to a u_FragColor uniform
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  // Pass the color of point to u_FragColor
        //gl.uniform1f(u_Size, size);                                     // Pass the size of point to u_Size

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of the cube
        drawTriangle3DUV( [0, 0, 0,   1, 1, 0,   1, 0, 0], [1, 0, 0, 1, 1, 1] );
        //drawTriangle3D( [0, 0, 0,   1, 1, 0,    1, 0, 0] );
        drawTriangle3D( [0, 0, 0,   0, 1, 0,    1, 1, 0] );


        // Top of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        drawTriangle3D( [0, 1, 0,   0, 1, 1,    1, 1, 1] );
        drawTriangle3D( [0, 1, 0,   1, 1, 1,    1, 1, 0] );
        // Left of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        drawTriangle3D( [0, 0, 0,   0, 0, 1,    0, 1, 0] );
        drawTriangle3D( [0, 1, 1,   0, 0, 1,    0, 1, 0] );
        // Right of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.7, rgba[3]);
        drawTriangle3D( [1, 0, 1,   1, 1, 1,    1, 1, 0] );
        drawTriangle3D( [1, 0, 1,   1, 0, 0,    1, 1, 0] );
        // Back of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
        drawTriangle3D( [0, 0, 1,   1, 0, 1,    1, 1, 1] );
        drawTriangle3D( [0, 0, 1,   0, 1, 1,    1, 1, 1] );
        // Bottom of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        drawTriangle3D( [0, 0, 0,   1, 0, 1,    0, 0, 1] );
        drawTriangle3D( [0, 0, 0,   1, 0, 0,    1, 0, 1] );

    }
}
